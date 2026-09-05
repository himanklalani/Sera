import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const getUserInfo = () => {
    try {
      const stored = localStorage.getItem('userInfo');
      return stored ? JSON.parse(stored) : null;
    } catch (e) {
      console.error('Error parsing userInfo:', e);
      localStorage.removeItem('userInfo');
      return null;
    }
  };

  const getGuestCart = () => {
    try {
      const stored = localStorage.getItem('sera_guest_cart');
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.error('Error parsing guest cart:', e);
      localStorage.removeItem('sera_guest_cart');
      return [];
    }
  };

  const saveGuestCart = (items) => {
    localStorage.setItem('sera_guest_cart', JSON.stringify(items));
    setCartItems(items);
  };

  const syncGuestCart = async () => {
    const userInfo = getUserInfo();
    if (!userInfo) return;
    
    const guestCart = getGuestCart();
    if (!guestCart || guestCart.length === 0) {
      fetchCart();
      return;
    }

    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };

      // Bulk sync - send all items in a single request instead of N+1 loop
      const itemsToSync = guestCart
        .filter(item => item.product && (item.product._id || item.product))
        .map(item => ({
          productId: item.product._id || item.product,
          quantity: item.quantity,
          size: item.size,
          note: item.note
        }));

      if (itemsToSync.length > 0) {
        await axios.post(`${import.meta.env.VITE_API_URL}/api/cart/sync`, { items: itemsToSync }, config);
      }
      
      localStorage.removeItem('sera_guest_cart');
      fetchCart();
    } catch (error) {
      console.error('Error syncing guest cart:', error);
    }
  };

  const fetchCart = useCallback(async () => {
    const userInfo = getUserInfo();
    if (!userInfo) {
      // Guest cart: hydrate with live product data
      const guestCart = getGuestCart();
      if (guestCart.length > 0) {
        const productIds = guestCart
          .map(item => item.product?._id || item.product)
          .filter(Boolean);
        try {
          const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/products/bulk`, { productIds });
          const liveProducts = res.data;
          let updated = false;
          let itemsRemoved = false;
          const hydratedCart = guestCart.map(item => {
            const pId = item.product?._id || item.product;
            const liveProduct = liveProducts.find(p => p._id === pId);
            if (!liveProduct) { itemsRemoved = true; return null; }
            if (item.quantity > liveProduct.stock) { item.quantity = liveProduct.stock; updated = true; }
            return { ...item, product: liveProduct };
          }).filter(Boolean);
          if (itemsRemoved || updated) {
            saveGuestCart(hydratedCart);
            if (itemsRemoved) toast('Some unavailable items were removed from your cart.', { icon: 'ℹ️', duration: 4000 });
            else if (updated) toast('Some quantities were adjusted due to stock changes.', { icon: 'ℹ️', duration: 3000 });
          } else {
            setCartItems(hydratedCart);
          }
        } catch(e) {
          console.error('Failed to hydrate guest cart:', e);
          setCartItems(guestCart);
        }
      } else {
        setCartItems([]);
      }
      return;
    }

    setLoading(true);
    try {
      const config = {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      };
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/cart`, config);
      setCartItems(Array.isArray(data.items) ? data.items : []);
      
      if (data.itemsRemoved) {
        toast('Some unavailable items were removed from your cart.', {
          icon: 'ℹ️',
          duration: 4000
        });
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
      if (error.response && error.response.status === 401) {
        localStorage.removeItem('userInfo');
        setCartItems(getGuestCart());
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const addToCart = async (productId, quantity, size = null, note = null, productObj = null) => {
    const userInfo = getUserInfo();
    if (!userInfo) {
      // Guest cart logic
      const currentCart = getGuestCart();
      const itemIndex = note 
        ? -1 
        : currentCart.findIndex(item => item.product && item.product._id === productId && (item.size || '') === (size || ''));
      
      if (itemIndex > -1) {
        // Increment quantity
        const newQuantity = currentCart[itemIndex].quantity + Number(quantity);
        // check stock if productObj is provided (optional, frontend check)
        if (productObj && newQuantity > productObj.stock) {
           throw new Error(`Cannot add ${quantity} more. Only ${productObj.stock - currentCart[itemIndex].quantity} items left in stock`);
        }
        currentCart[itemIndex].quantity = newQuantity;
      } else {
        // If no productObj passed, we have to fetch it so we can store it in guest cart properly formatted
        let finalProductObj = productObj;
        if (!finalProductObj) {
           try {
             const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/products/${productId}`);
             finalProductObj = res.data;
           } catch(e) {
             throw new Error("Could not fetch product details for guest cart.");
           }
        }
        
        currentCart.push({
          _id: `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          product: finalProductObj,
          quantity: Number(quantity),
          size: size || undefined,
          note: note ? note.substring(0, 450) : undefined
        });
      }
      
      saveGuestCart(currentCart);
      return true;
    }

    try {
      const config = {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      };
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/cart`,
        { productId, quantity, size, note: note || undefined },
        config
      );
      setCartItems(Array.isArray(data.items) ? data.items : []);
      if (data.itemsRemoved) {
        toast('Some unavailable items were removed from your cart.', { icon: 'ℹ️' });
      }
      return true;
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    }
  };

  const updateQuantity = async (productId, quantity) => {
    if (quantity < 1) return;
    const userInfo = getUserInfo();
    if (!userInfo) {
       const currentCart = getGuestCart();
       const itemIndex = currentCart.findIndex(item => (item.product && item.product._id === productId) || item._id === productId);
       if (itemIndex > -1) {
           currentCart[itemIndex].quantity = quantity;
           saveGuestCart(currentCart);
       }
       return;
    }

    try {
      const config = {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      };
      const { data } = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/cart/${productId}`,
        { quantity },
        config
      );
      setCartItems(Array.isArray(data.items) ? data.items : []);
      if (data.itemsRemoved) {
        toast('Some unavailable items were removed from your cart.', { icon: 'ℹ️' });
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
      throw error;
    }
  };

  const removeFromCart = async (productId) => {
    const userInfo = getUserInfo();
    if (!userInfo) {
       let currentCart = getGuestCart();
       currentCart = currentCart.filter(item => {
          const pId = item.product ? item.product._id : null;
          return pId !== productId && item._id !== productId;
       });
       saveGuestCart(currentCart);
       return;
    }

    try {
      const config = {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      };
      const { data } = await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/cart/${productId}`,
        config
      );
      setCartItems(Array.isArray(data.items) ? data.items : []);
      if (data.itemsRemoved) {
        toast('Some unavailable items were removed from your cart.', { icon: 'ℹ️' });
      }
    } catch (error) {
      console.error('Error removing item:', error);
      throw error;
    }
  };

  const clearCart = () => {
    const userInfo = getUserInfo();
    if (!userInfo) {
       saveGuestCart([]);
       return;
    }
    // Only local state clears, no api to clear cart entirely currently, but assuming standard behaviour
    setCartItems([]);
  };

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // Listen for login/logout (userInfo changes in localStorage)
  useEffect(() => {
    const handleStorageChange = () => {
      fetchCart();
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [fetchCart]);

  const cartCount = cartItems.reduce((acc, item) => acc + (item.quantity || 0), 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        loading,
        cartCount,
        fetchCart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        syncGuestCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
