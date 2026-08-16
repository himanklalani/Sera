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
    const stored = localStorage.getItem('userInfo');
    return stored ? JSON.parse(stored) : null;
  };

  const fetchCart = useCallback(async () => {
    const userInfo = getUserInfo();
    if (!userInfo) {
      setCartItems([]);
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
        setCartItems([]);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const addToCart = async (productId, quantity, size = null) => {
    const userInfo = getUserInfo();
    if (!userInfo) return false;

    try {
      const config = {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      };
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/cart`,
        { productId, quantity, size },
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
    const userInfo = getUserInfo();
    if (!userInfo) return;

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
    if (!userInfo) return;

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
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
