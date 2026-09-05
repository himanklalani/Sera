import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FloatingCouponDrawer } from './Home';
import { FaLock, FaTruck, FaShieldAlt, FaGift, FaPlus, FaEdit, FaTrash, FaTimes, FaMapMarkerAlt, FaCheckCircle, FaRegCircle, FaEnvelopeOpenText } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../components/CartContext';
import FreeShippingBar from '../components/FreeShippingBar';


const Checkout = () => {
  const [cartItems, setCartItems] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [loading, setLoading] = useState(true);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState('');
  const [razorpayLoading, setRazorpayLoading] = useState(false);
  const [addons, setAddons] = useState([]);
  const [greetingCard, setGreetingCard] = useState(null);
  const [greetingCardId, setGreetingCardId] = useState(null);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [cardNote, setCardNote] = useState('');
  const [addingCard, setAddingCard] = useState(false);
  const [showStockModal, setShowStockModal] = useState(false);
  const [outOfStockItems, setOutOfStockItems] = useState([]);
  const [proceedAfterRender, setProceedAfterRender] = useState(false);
  const navigate = useNavigate();
  const { addToCart, removeFromCart, clearCart } = useCart();

  // Address Management & Modal State
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [addressForm, setAddressForm] = useState({
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
    phone: '',
    landmark: '',
    addressType: 'Home'
  });
  const [addressSaving, setAddressSaving] = useState(false);

  const handleOpenAddAddress = () => {
    const storedUserInfo = localStorage.getItem('userInfo');
    let defaultPhone = '';
    if (storedUserInfo) {
      try {
        const parsed = JSON.parse(storedUserInfo);
        defaultPhone = parsed.phone || '';
      } catch (e) {
        console.error(e);
      }
    }
    setAddressForm({
      street: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'India',
      phone: defaultPhone,
      landmark: '',
      addressType: 'Home'
    });
    setEditingAddressId(null);
    setShowAddressModal(true);
  };

  const handleOpenEditAddress = (addr, e) => {
    if (e) e.stopPropagation();
    setAddressForm({
      street: addr.street || '',
      city: addr.city || '',
      state: addr.state || '',
      postalCode: addr.postalCode || '',
      country: addr.country || 'India',
      phone: addr.phone || '',
      landmark: addr.landmark || '',
      addressType: addr.addressType || 'Home'
    });
    setEditingAddressId(addr._id || addr.id);
    setShowAddressModal(true);
  };

  const handleSaveAddress = async (e) => {
    e.preventDefault();
    if (!addressForm.street.trim() || !addressForm.city.trim() || !addressForm.state.trim() || 
        !addressForm.postalCode.trim() || !addressForm.phone.trim()) {
      toast.error('Please fill in all required fields (Street, City, State, PIN, Phone)');
      return;
    }

    setAddressSaving(true);
    try {
      const storedUserInfo = localStorage.getItem('userInfo');
      if (!storedUserInfo) {
        navigate('/login?redirect=/checkout');
        return;
      }
      const userInfo = JSON.parse(storedUserInfo);
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };

      let updatedAddresses;
      if (editingAddressId) {
        updatedAddresses = addresses.map(addr =>
          (addr._id === editingAddressId || addr.id === editingAddressId)
            ? { ...addressForm, _id: editingAddressId }
            : addr
        );
      } else {
        updatedAddresses = [
          ...addresses,
          { ...addressForm, isDefault: addresses.length === 0 }
        ];
      }

      const { data } = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/auth/profile`,
        { addresses: updatedAddresses },
        config
      );

      const newAddressList = data.addresses || updatedAddresses;
      setAddresses(newAddressList);

      // Automatically select the saved address
      if (editingAddressId) {
        const found = newAddressList.find(a => (a._id === editingAddressId || a.id === editingAddressId));
        setSelectedAddress(found || addressForm);
      } else {
        const newlyAdded = newAddressList[newAddressList.length - 1];
        setSelectedAddress(newlyAdded || addressForm);
      }

      toast.success(editingAddressId ? 'Address updated successfully!' : 'Address added & selected!');
      setShowAddressModal(false);
      setEditingAddressId(null);
    } catch (error) {
      console.error('Error saving address:', error);
      toast.error(error.response?.data?.message || 'Failed to save address');
    } finally {
      setAddressSaving(false);
    }
  };

  const handlePincodeChange = async (e) => {
    const pin = e.target.value.replace(/\D/g, '').substring(0, 6);
    setAddressForm({ ...addressForm, postalCode: pin });
    
    if (pin.length === 6) {
      try {
        const res = await axios.get(`https://api.postalpincode.in/pincode/${pin}`);
        if (res.data && res.data[0].Status === 'Success') {
          const details = res.data[0].PostOffice[0];
          setAddressForm(prev => ({
            ...prev,
            postalCode: pin,
            city: details.District || details.Block || prev.city,
            state: details.State || prev.state
          }));
          toast.success("City & State auto-filled!");
        }
      } catch (err) {
        console.error("Error fetching pincode:", err);
      }
    }
  };

  const handleDeleteAddress = async (id, e) => {
    if (e) e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this address?')) return;

    try {
      const storedUserInfo = localStorage.getItem('userInfo');
      if (!storedUserInfo) return;
      const userInfo = JSON.parse(storedUserInfo);
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };

      const updatedAddresses = addresses.filter(a => (a._id || a.id) !== id);
      const { data } = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/auth/profile`,
        { addresses: updatedAddresses },
        config
      );

      const newAddressList = data.addresses || updatedAddresses;
      setAddresses(newAddressList);

      if (selectedAddress && (selectedAddress._id === id || selectedAddress.id === id)) {
        setSelectedAddress(newAddressList.length > 0 ? newAddressList[0] : null);
      }

      toast.success('Address deleted');
    } catch (error) {
      console.error('Error deleting address:', error);
      toast.error('Failed to delete address');
    }
  };


  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const existingScript = document.querySelector(
        'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
      );
      if (existingScript) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  useEffect(() => {
    if (proceedAfterRender && !showStockModal) {
      setProceedAfterRender(false);
      handleRazorpayPayment();
    }
  }, [cartItems, proceedAfterRender, paymentMethod, showStockModal]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedUserInfo = localStorage.getItem('userInfo');
        if (!storedUserInfo) {
          navigate('/login?redirect=/checkout');
          return;
        }


        let userInfo;
        try {
          userInfo = JSON.parse(storedUserInfo);
        } catch (error) {
          console.error('Failed to parse userInfo from localStorage:', error);
          localStorage.removeItem('userInfo');
          navigate('/login?redirect=/checkout');
          return;
        }


        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        
        // Fetch Cart
        const cartRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/cart`, config);
        const fetchedCart = cartRes.data.items || [];
        setCartItems(fetchedCart);

        // GA4 begin_checkout event
        if (window.dataLayer && fetchedCart.length > 0) {
          window.dataLayer.push({
            event: 'begin_checkout',
            ecommerce: {
              currency: 'INR',
              value: fetchedCart.reduce((acc, item) => acc + (Math.round((item.product.price || 0) * 0.5) * item.quantity), 0),
              items: fetchedCart.map(item => ({
                item_id: item.product?._id,
                item_name: item.product?.name,
                item_category: item.product?.category,
                price: Math.round((item.product?.price || 0) * 0.5),
                quantity: item.quantity
              }))
            }
          });
        }


        // Fetch Addresses (Profile)
        const profileRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/profile`, config);
        setAddresses(profileRes.data.addresses || []);
        
        if (profileRes.data.addresses && profileRes.data.addresses.length > 0) {
          setSelectedAddress(profileRes.data.addresses[0]);
        }
        
        // Fetch Add-ons
        const addonsRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/products?isAddon=true`);
        const allAddons = addonsRes.data.products || [];
        const card = allAddons.find(a => a.name === 'Greeting Card');
        const otherAddons = allAddons.filter(a => a.name !== 'Greeting Card');
        if (card) {
          setGreetingCardId(card._id);
          setGreetingCard(card);
        }
        setAddons(otherAddons);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching checkout data:', error);
        setLoading(false);
      }
    };
    fetchData();
  }, [navigate]);

  const handleAddGreetingCard = () => {
    setCardNote('');
    setShowNoteModal(true);
  };

  const handleConfirmGreetingCard = async () => {
    if (!greetingCardId) {
      toast.error('Greeting card not available. Please try again later.');
      return;
    }
    if (!cardNote.trim()) {
      toast.error('Please write a message for the card.');
      return;
    }
    setAddingCard(true);
    try {
      await addToCart(greetingCardId, 1, null, cardNote.trim());
      toast.success('Greeting card added!');
      setShowNoteModal(false);
      setCardNote('');
      // Refetch cart to update summary
      const storedUserInfo = localStorage.getItem('userInfo');
      if (storedUserInfo) {
        const userInfo = JSON.parse(storedUserInfo);
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        const cartRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/cart`, config);
        setCartItems(cartRes.data.items || []);
      }
    } catch (error) {
      toast.error('Failed to add greeting card.');
    } finally {
      setAddingCard(false);
    }
  };

  const handleAddonToCart = async (addon) => {
    try {
      await addToCart(addon._id, 1);
      toast.success(`${addon.name} added!`);
      // Refetch cart to update summary and free shipping bar
      const storedUserInfo = localStorage.getItem('userInfo');
      if (storedUserInfo) {
        const userInfo = JSON.parse(storedUserInfo);
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        const cartRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/cart`, config);
        setCartItems(cartRes.data.items || []);
      }
    } catch (error) {
      toast.error('Failed to add item');
    }
  };

  const handleRemoveItem = async (item) => {
    try {
      const idToRemove = item.note ? item._id : (item.product?._id || item._id);
      await removeFromCart(idToRemove);
      toast.success(`${item.product?.name || 'Item'} removed.`);
      // Refetch cart to update summary and free shipping bar
      const storedUserInfo = localStorage.getItem('userInfo');
      if (storedUserInfo) {
        const userInfo = JSON.parse(storedUserInfo);
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        const cartRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/cart`, config);
        setCartItems(cartRes.data.items || []);
      }
    } catch (error) {
      console.error('Error removing item:', error);
      toast.error('Failed to remove item');
    }
  };


  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error('Please enter a coupon code.');
      return;
    }


    try {
      const storedUserInfo = localStorage.getItem('userInfo');
      if (!storedUserInfo) {
        navigate('/login?redirect=/checkout');
        return;
      }


      let userInfo;
      try {
        userInfo = JSON.parse(storedUserInfo);
      } catch (error) {
        console.error('Failed to parse userInfo from localStorage:', error);
        localStorage.removeItem('userInfo');
        navigate('/login?redirect=/checkout');
        return;
      }


      // ✅ FIXED: Calculate cartValue (subtotal) and orderTotal separately
      // Ensure addons are excluded from discountable cartValue
      const discountableCartValue = cartItems
        .filter(item => item?.product && !item.product.isAddon)
        .reduce((acc, item) => acc + item.quantity * (item.product.price || 0), 0);
        
      const cartValue = cartItems
        .filter(item => item?.product)
        .reduce((acc, item) => acc + item.quantity * (item.product.price || 0), 0);
      const shippingValue = cartValue > 999 ? 0 : 100;
      const orderTotal = cartValue + shippingValue;


      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };


      setCouponLoading(true);
      setCouponError('');


      // ✅ FIXED: Send discountableCartValue so addons don't get discounted
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/coupons/validate`,
        {
          code: couponCode,
          cartValue: discountableCartValue, // ✅ Subtotal only (without shipping and addons)
          orderTotal, // ✅ Subtotal + shipping + addons
        },
        config
      );


      setAppliedCoupon(data);
      toast.success(
        `Coupon applied! You saved INR ${data.discountAmount.toFixed(0)}`
      );
    } catch (error) {
      console.error('Error validating coupon:', error);
      setAppliedCoupon(null);
      const message =
        error.response?.data?.message || 'Invalid or expired coupon.';
      setCouponError(message);
      toast.error(message);
    } finally {
      setCouponLoading(false);
    }
  };


  const handleCheckoutClick = async () => {
    setRazorpayLoading(true);
    try {
      const storedUserInfo = localStorage.getItem('userInfo');
      if (!storedUserInfo) {
        navigate('/login?redirect=/checkout');
        return;
      }
      const userInfo = JSON.parse(storedUserInfo);
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      
      const cartRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/cart`, config);
      const liveItems = cartRes.data.items || [];
      
      const unavailable = [];
      const available = [];

      cartItems.forEach(cartItem => {
        const liveItem = liveItems.find(li => li.product._id === cartItem.product._id && (li.size === cartItem.size || !li.size));
        if (!liveItem || liveItem.product.stock < cartItem.quantity) {
          unavailable.push(cartItem);
        } else {
          available.push(cartItem);
        }
      });

      if (unavailable.length > 0) {
        if (available.length === 0) {
          toast.error("All items in your cart are currently out of stock.");
          setRazorpayLoading(false);
          return;
        }
        setOutOfStockItems(unavailable);
        setShowStockModal(true);
        setRazorpayLoading(false);
        return;
      }
      
      // All items in stock
      handleRazorpayPayment();
    } catch (e) {
       console.error('Error validating stock:', e);
       toast.error("Error validating stock before checkout.");
       setRazorpayLoading(false);
    }
  };

  const handleProceedWithAvailable = () => {
    setShowStockModal(false);
    const available = cartItems.filter(ci => !outOfStockItems.some(osi => osi.product._id === ci.product._id && osi.size === ci.size));
    setCartItems(available);
    setProceedAfterRender(true);
  };


  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      toast.error('Please select or add a shipping address.');
      return;
    }


    // ✅ VALIDATE ADDRESS HAS ALL REQUIRED FIELDS
    if (!selectedAddress.street || !selectedAddress.city || !selectedAddress.state || 
        !selectedAddress.postalCode || !selectedAddress.phone) {
      toast.error('Shipping address is incomplete. Please update your address.');
      console.error('Invalid address:', selectedAddress);
      return;
    }


    try {
      const storedUserInfo = localStorage.getItem('userInfo');
      if (!storedUserInfo) {
        navigate('/login?redirect=/checkout');
        return;
      }


      let userInfo;
      try {
        userInfo = JSON.parse(storedUserInfo);
      } catch (error) {
        console.error('Failed to parse userInfo from localStorage:', error);
        localStorage.removeItem('userInfo');
        navigate('/login?redirect=/checkout');
        return;
      }


      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      
      // ✅ BUILD ORDER DATA WITH COMPLETE ADDRESS STRUCTURE
      const orderData = {
        orderItems: cartItems.filter(item => item?.product).map(item => ({
          product: item.product._id,
          quantity: item.quantity,
          price: item.product.price,
          size: item.size,
          note: item.note || undefined
        })),
        shippingAddress: {
          street: selectedAddress.street,
          city: selectedAddress.city,
          state: selectedAddress.state,
          postalCode: selectedAddress.postalCode,
          country: selectedAddress.country || 'India',
          phone: selectedAddress.phone,
          landmark: selectedAddress.landmark || ''
        },
        paymentMethod,
        totalPrice: total,
        couponCode: appliedCoupon?.code || undefined
      };


      console.log('Sending order data:', orderData); // ✅ DEBUG LOG


      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/orders`, orderData, config);
      
      clearCart();
      toast.success('Order placed successfully!');
      navigate('/order-success', { 
        state: { 
          transaction_id: res.data._id || `COD-${Date.now()}`,
          value: total,
          shipping: appliedCoupon?.isFreeShipping ? 0 : shipping,
          tax: 0,
          items: cartItems.filter(item => item?.product).map(item => ({
            item_id: item.product._id,
            item_name: item.product.name,
            item_category: item.product.category,
            price: Math.round(item.product.price * 0.5),
            quantity: item.quantity,
            size: item.size
          }))
        } 
      });
    } catch (error) {
      console.error('Error placing order:', error);
      const errorMsg = error.response?.data?.message || 'Failed to place order.';
      toast.error(errorMsg);
      
      // Auto-sync cart if stock error
      if (errorMsg.toLowerCase().includes('stock') || errorMsg.toLowerCase().includes('left')) {
        const storedUserInfo = localStorage.getItem('userInfo');
        if (storedUserInfo) {
          try {
            const userInfo = JSON.parse(storedUserInfo);
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
            const cartRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/cart`, config);
            setCartItems(cartRes.data.items || []);
          } catch (e) {
            console.error('Failed to auto-sync cart:', e);
          }
        }
      }
    }
  };

  const handleRazorpayPayment = async () => {
    if (!selectedAddress) {
      toast.error('Please select or add a shipping address.');
      return;
    }

    if (
      !selectedAddress.street ||
      !selectedAddress.city ||
      !selectedAddress.state ||
      !selectedAddress.postalCode ||
      !selectedAddress.phone
    ) {
      toast.error('Shipping address is incomplete. Please update your address.');
      console.error('Invalid address:', selectedAddress);
      return;
    }

    try {
      setRazorpayLoading(true);

      const storedUserInfo = localStorage.getItem('userInfo');
      if (!storedUserInfo) {
        navigate('/login?redirect=/checkout');
        return;
      }

      let userInfo;
      try {
        userInfo = JSON.parse(storedUserInfo);
      } catch (error) {
        console.error('Failed to parse userInfo from localStorage:', error);
        localStorage.removeItem('userInfo');
        navigate('/login?redirect=/checkout');
        return;
      }

      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        toast.error('Failed to load Razorpay. Please try again.');
        return;
      }

      const config = {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      };

      const amountInPaise = Math.round(total * 100);

      const createOrderResponse = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/payment/create-order`,
        {
          amount: amountInPaise,
          currency: 'INR',
          orderItems: cartItems.filter(item => item?.product).map(item => ({
            product: item.product._id,
            quantity: item.quantity,
            note: item.note || undefined
          }))
        },
        config
      );

      const orderData = createOrderResponse.data;

      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Sera Jewelry',
        description: 'Order payment',
        order_id: orderData.id,
        prefill: {
          name: userInfo.name,
          email: userInfo.email,
          contact: userInfo.phone,
        },
        theme: {
          color: '#fb7185',
        },
        handler: async function (response) {
          try {
            const verificationPayload = {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderItems: cartItems.filter(item => item?.product).map((item) => ({
                product: item.product._id,
                quantity: item.quantity,
                price: item.product.price,
                size: item.size,
                note: item.note || undefined,
              })),
              shippingAddress: {
                street: selectedAddress.street,
                city: selectedAddress.city,
                state: selectedAddress.state,
                postalCode: selectedAddress.postalCode,
                country: selectedAddress.country || 'India',
                phone: selectedAddress.phone,
                landmark: selectedAddress.landmark || '',
              },
              totalAmount: total,
              couponCode: appliedCoupon?.code || null,
              discountAmount: appliedCoupon?.discountAmount || 0,
              shippingPrice: appliedCoupon?.isFreeShipping ? 0 : shipping,
            };

            await axios.post(
              `${import.meta.env.VITE_API_URL}/api/payment/verify-payment`,
              verificationPayload,
              config
            );

            clearCart();
            toast.success('Payment successful and order placed!');
            navigate('/order-success', { 
              state: { 
                transaction_id: response.razorpay_payment_id,
                value: total,
                shipping: appliedCoupon?.isFreeShipping ? 0 : shipping,
                tax: 0,
                items: cartItems.filter(item => item?.product).map(item => ({
                  item_id: item.product._id,
                  item_name: item.product.name,
                  item_category: item.product.category,
                  price: item.product.price,
                  quantity: item.quantity,
                  size: item.size
                }))
              } 
            });
          } catch (error) {
            console.error('Error verifying payment:', error);
            const message =
              error.response?.data?.message ||
              'Payment succeeded but verification failed. Please contact support.';
            toast.error(message);
          } finally {
            setRazorpayLoading(false);
          }
        },
        modal: {
          ondismiss: function () {
            setRazorpayLoading(false);
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error('Error initiating Razorpay payment:', error);
      const message =
        error.response?.data?.message ||
        'Failed to initiate payment. Please try again.';
      toast.error(message);
      setRazorpayLoading(false);

      // Auto-sync cart if stock error
      if (message.toLowerCase().includes('stock') || message.toLowerCase().includes('left')) {
        const storedUserInfo = localStorage.getItem('userInfo');
        if (storedUserInfo) {
          try {
            const userInfo = JSON.parse(storedUserInfo);
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
            const cartRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/cart`, config);
            setCartItems(cartRes.data.items || []);
          } catch (e) {
            console.error('Failed to auto-sync cart:', e);
          }
        }
      }
    }
  };


  // ✅ FIXED: Calculate values correctly
  const subtotal = cartItems.filter(item => item?.product).reduce((acc, item) => acc + item.quantity * (item.product.price || 0), 0);
  const shipping = subtotal > 999 ? 0 : 100;
  const displayShipping = appliedCoupon?.isFreeShipping ? 0 : shipping;
  const originalTotal = subtotal + shipping;
  const total = appliedCoupon?.finalTotal || originalTotal;
  const discount = Math.max(0, appliedCoupon ? appliedCoupon.discountAmount : 0);


  if (loading) return <div className="text-center py-20">Loading Checkout...</div>;


  return (
    <>
      <Helmet>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      {/* Greeting Card Note Modal */}
      <AnimatePresence>
        {showNoteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
            onClick={(e) => { if (e.target === e.currentTarget) setShowNoteModal(false); }}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 relative"
            >
              <button
                type="button"
                onClick={() => setShowNoteModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors"
              >
                <FaTimes size={18} />
              </button>

              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center">
                  <FaEnvelopeOpenText className="text-rose-500" size={18} />
                </div>
                <h2 className="font-serif text-2xl text-gray-900">Write Your Message</h2>
              </div>
              <p className="text-sm text-gray-500 mb-6">
                Your personal note will be handwritten on the greeting card and included with the order.
              </p>

              <textarea
                value={cardNote}
                onChange={(e) => setCardNote(e.target.value.slice(0, 450))}
                placeholder="e.g. Happy Birthday! Wishing you all the joy in the world..."
                rows={6}
                className="w-full border border-gray-200 rounded-xl p-4 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-transparent resize-none leading-relaxed"
              />

              <div className="flex justify-between items-center mt-2 mb-6">
                <p className="text-xs text-gray-400 italic">Max 450 characters</p>
                <p className={`text-xs font-medium ${cardNote.length >= 450 ? 'text-red-500' : 'text-gray-400'}`}>
                  {cardNote.length}/450
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowNoteModal(false)}
                  className="flex-1 py-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmGreetingCard}
                  disabled={addingCard || !cardNote.trim()}
                  className="flex-1 py-3 bg-rose-500 text-white rounded-xl text-sm font-semibold hover:bg-rose-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {addingCard ? 'Adding...' : `Add to Cart — ${greetingCard ? (greetingCard.price === 0 ? 'Free' : `INR ${greetingCard.price}`) : ''}`}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="container mx-auto px-6 py-24 min-h-screen relative">
      <FloatingCouponDrawer shouldShow={true} className="fixed left-4 top-24 z-40" />
      <h1 className="text-4xl font-serif text-center mb-12">Checkout</h1>
      
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Left Side: Address & Payment */}
        <div className="lg:w-2/3 space-y-8">
          
          {/* Address Section */}
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
            <div className="mb-6">
              <h2 className="text-2xl font-serif text-gray-900">Shipping Address</h2>
              <p className="text-xs text-gray-500 mt-1">Select an existing address or add another address below.</p>
            </div>

            {showAddressModal ? (
              <div className="bg-white border border-gray-200 rounded-xl p-5 md:p-6 shadow-sm animate-fade-in mt-4">
                <div className="flex items-center justify-between mb-5 border-b border-gray-100 pb-4">
                  <h3 className="text-lg font-serif text-gray-900">
                    {editingAddressId ? 'Edit Shipping Address' : 'Add New Shipping Address'}
                  </h3>
                  <button
                    type="button"
                    onClick={() => setShowAddressModal(false)}
                    className="text-gray-400 hover:text-gray-700 p-1.5 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <FaTimes />
                  </button>
                </div>
                <form onSubmit={handleSaveAddress} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                      Address Type
                    </label>
                    <div className="flex gap-2">
                      {['Home', 'Work', 'Other'].map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setAddressForm({ ...addressForm, addressType: type })}
                          className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                            addressForm.addressType === type
                              ? 'bg-rose-500 text-white shadow-sm'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      House/Flat No., Building, Street, Area <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      rows="2"
                      placeholder="e.g. Flat 402, Sunshine Apts, 5th Cross, MG Road"
                      value={addressForm.street}
                      onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })}
                      required
                      className="w-full border border-gray-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none resize-none transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        PIN Code <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="6-digit PIN"
                        maxLength={6}
                        value={addressForm.postalCode}
                        onChange={handlePincodeChange}
                        required
                        className="w-full border border-gray-300 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Phone Number <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="tel"
                        placeholder="10-digit mobile number"
                        maxLength={15}
                        value={addressForm.phone}
                        onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value.replace(/\D/g, '') })}
                        required
                        className="w-full border border-gray-300 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        City <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Mumbai"
                        value={addressForm.city}
                        onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                        required
                        className="w-full border border-gray-300 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        State <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Maharashtra"
                        value={addressForm.state}
                        onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                        required
                        className="w-full border border-gray-300 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Landmark <span className="text-gray-400 font-normal">(Optional)</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Near City Mall"
                        value={addressForm.landmark}
                        onChange={(e) => setAddressForm({ ...addressForm, landmark: e.target.value })}
                        className="w-full border border-gray-300 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Country
                      </label>
                      <input
                        type="text"
                        value={addressForm.country}
                        onChange={(e) => setAddressForm({ ...addressForm, country: e.target.value })}
                        required
                        className="w-full border border-gray-300 rounded-xl p-2.5 text-sm bg-gray-50 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                    <button
                      type="button"
                      onClick={() => setShowAddressModal(false)}
                      disabled={addressSaving}
                      className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 rounded-xl hover:bg-gray-100 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={addressSaving}
                      className="bg-rose-500 hover:bg-rose-600 text-white text-sm font-semibold px-6 py-2.5 rounded-xl shadow-md hover:shadow-lg transition-all disabled:opacity-50"
                    >
                      {addressSaving ? 'Saving...' : (editingAddressId ? 'Save Changes' : 'Save & Deliver Here')}
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {addresses.map((addr, index) => {
                  const isSelected = selectedAddress?._id 
                    ? selectedAddress._id === addr._id 
                    : (selectedAddress === addr || (selectedAddress?.street === addr.street && selectedAddress?.postalCode === addr.postalCode));
                  
                  return (
                    <div
                      key={addr._id || index}
                      onClick={() => setSelectedAddress(addr)}
                      className={`relative p-5 rounded-2xl cursor-pointer transition-all duration-200 border text-left flex flex-col justify-between group ${
                        isSelected
                          ? 'border-rose-500 bg-rose-50/40 ring-2 ring-rose-500 shadow-md'
                          : 'border-gray-200 bg-white hover:border-rose-300 hover:shadow-sm'
                      }`}
                    >
                      {/* Top Header: Badge & Radio indicator */}
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-700 tracking-wide uppercase">
                            {addr.addressType || 'Home'}
                          </span>
                          <div className="flex items-center gap-1.5 text-xs font-medium">
                            {isSelected ? (
                              <span className="text-rose-600 flex items-center gap-1 font-semibold">
                                <FaCheckCircle className="text-rose-500 text-base" /> Deliver Here
                              </span>
                            ) : (
                              <span className="text-gray-400 group-hover:text-rose-500 flex items-center gap-1">
                                <FaRegCircle className="text-base" /> Choose
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Address Details */}
                        <p className="font-semibold text-gray-900 text-base mb-1.5 leading-snug">
                          {addr.street}
                        </p>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          {addr.city}, {addr.state} - <span className="font-medium text-gray-800">{addr.postalCode}</span>
                        </p>
                        <p className="text-sm text-gray-600">
                          {addr.country || 'India'}
                        </p>
                        {addr.landmark && (
                          <p className="text-xs text-gray-500 italic mt-1">
                            Near: {addr.landmark}
                          </p>
                        )}
                        <p className="text-xs text-gray-700 font-medium mt-2 flex items-center gap-1.5">
                          <span>📞</span> {addr.phone}
                        </p>
                      </div>

                      {/* Card Action Buttons (Edit / Delete) */}
                      <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          onClick={(e) => handleOpenEditAddress(addr, e)}
                          className="text-xs font-medium text-gray-600 hover:text-rose-600 px-2.5 py-1 rounded-lg hover:bg-rose-50 transition-colors flex items-center gap-1.5"
                          title="Edit this address"
                        >
                          <FaEdit /> Edit
                        </button>
                        {addresses.length > 1 && (
                          <button
                            type="button"
                            onClick={(e) => handleDeleteAddress(addr._id || addr.id, e)}
                            className="text-xs font-medium text-gray-400 hover:text-red-600 px-2 py-1 rounded-lg hover:bg-red-50 transition-colors flex items-center gap-1"
                            title="Delete this address"
                          >
                            <FaTrash />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}

                {/* Dashed "+ Add Another Address" card inside grid */}
                <button
                  type="button"
                  onClick={handleOpenAddAddress}
                  className="min-h-[160px] p-6 rounded-2xl border-2 border-dashed border-rose-200 hover:border-rose-400 bg-rose-50/10 hover:bg-rose-50/40 text-gray-600 hover:text-rose-600 transition-all duration-200 flex flex-col items-center justify-center gap-2.5 group cursor-pointer"
                >
                  <div className="w-11 h-11 rounded-full bg-rose-100/70 group-hover:bg-rose-200/80 flex items-center justify-center transition-colors shadow-xs">
                    <FaPlus className="text-rose-500 group-hover:text-rose-600 text-sm transition-transform group-hover:scale-110" />
                  </div>
                  <span className="text-sm font-semibold text-gray-700 group-hover:text-rose-600">Add Another Address</span>
                </button>
              </div>
            )}
          </div>


          {/* Payment Section */}
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-serif text-gray-900">Payment Method</h2>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 uppercase tracking-wider">Prepaid Only</span>
            </div>
            <div className="p-4 border border-blue-100 bg-blue-50/30 rounded-xl flex items-start gap-3">
              <FaShieldAlt className="text-blue-500 mt-0.5 text-lg flex-shrink-0" />
              <div>
                <p className="font-medium text-gray-900 text-sm">Secure Online Payment</p>
                <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                  Pay securely via Razorpay (UPI, Cards, NetBanking). You will be redirected to the payment gateway after clicking Place Order. Cash on Delivery is currently unavailable.
                </p>
              </div>
            </div>
          </div>
        </div>


        {/* Right Side: Order Summary */}
        <div className="lg:w-1/3">
           <div className="bg-rose-50 p-8 rounded-lg sticky top-24">
              <h3 className="font-serif text-2xl mb-4">Your Order</h3>

              {/* Free Shipping Progress Bar */}
              <FreeShippingBar 
                subtotal={subtotal} 
                isCouponFreeShipping={appliedCoupon?.isFreeShipping} 
                threshold={999} 
              />

              <div className="space-y-3 mb-4 max-h-60 overflow-y-auto pr-2">
                {cartItems.map(item => (
                  <div key={item.product?._id || item._id} className="flex justify-between items-center text-sm py-1.5 border-b border-rose-100/50 last:border-0 group">
                    <div className="flex items-center gap-2.5 min-w-0 pr-2">
                       <span className="text-gray-400 font-medium text-xs flex-shrink-0">{item.quantity}x</span>
                       <span className="truncate text-xs sm:text-sm text-gray-800 font-medium">
                         {item.product?.name} {item.size && <span className="text-gray-400 text-xs ml-1">({item.size})</span>}
                       </span>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="font-semibold text-xs sm:text-sm text-gray-900">
                        INR {(item.quantity || 1) * (item.product?.price || 0)}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(item)}
                        className="text-gray-300 hover:text-rose-500 p-1 rounded hover:bg-rose-100/50 transition-colors"
                        title="Remove from order"
                        aria-label="Remove item"
                      >
                        <FaTrash size={11} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* CHECKOUT UPSELL / ADD-ONS SECTION */}
              {addons.length > 0 && (
                <div className="mt-6 border-t border-rose-100 pt-6">
                  <div className="flex items-center gap-2 mb-3 text-rose-800">
                    <FaGift className="text-lg" />
                    <h4 className="font-serif text-lg">Add a Finishing Touch</h4>
                  </div>
                  <div className="flex overflow-x-auto gap-3 pb-4 snap-x [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    {/* Greeting Card UI */}
                    {greetingCard && (
                      <div className="relative flex-shrink-0 w-28 bg-white p-2.5 rounded-xl shadow-sm border border-gray-100 hover:border-rose-200 transition-all flex flex-col items-center snap-start">
                        <div className="w-full aspect-square bg-rose-50 rounded-lg overflow-hidden mb-2 relative group/img">
                          <img
                            src={greetingCard?.images?.[0] || 'https://res.cloudinary.com/dhby5v7rw/image/upload/f_auto/q_auto/v1788173333/bdaycard_yl0wq5.avif'}
                            alt="Greeting Card"
                            className="w-full h-full object-cover transition-transform group-hover/img:scale-105"
                          />
                          {/* Action Button overlaid on image */}
                          {cartItems.some(ci => (ci.product?._id || ci.product) === greetingCardId) ? (
                            <button
                              type="button"
                              onClick={() => {
                                const cardItem = cartItems.find(ci => (ci.product?._id || ci.product) === greetingCardId);
                                if (cardItem) handleRemoveItem(cardItem);
                              }}
                              className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-white/95 shadow-sm text-rose-500 hover:bg-rose-50 hover:text-rose-600 flex items-center justify-center transition-all group/rem"
                              title="Remove from order"
                            >
                              <FaTimes size={10} className="hidden group-hover/rem:block" />
                              <FaCheckCircle size={11} className="block group-hover/rem:hidden text-emerald-500" />
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={handleAddGreetingCard}
                              className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-white/95 shadow-sm text-rose-500 hover:bg-rose-500 hover:text-white flex items-center justify-center transition-all"
                              title="Add Greeting Card"
                            >
                              <FaPlus size={10} />
                            </button>
                          )}
                        </div>
                        <div className="text-center w-full px-0.5">
                          <h5 className="font-medium text-xs text-gray-800 truncate" title="Greeting Card">Greeting Card</h5>
                          <p className="text-rose-600 font-semibold text-[11px] mt-0.5">
                            {greetingCard.price === 0 ? 'Free' : `INR ${greetingCard.price}`}
                          </p>
                        </div>
                      </div>
                    )}

                    {addons.map((addon) => {
                      const existingItem = cartItems.find(
                        (ci) => (ci.product?._id || ci.product) === addon._id
                      );
                      const isAdded = Boolean(existingItem);

                      return (
                        <div key={addon._id} className="relative flex-shrink-0 w-28 bg-white p-2.5 rounded-xl shadow-sm border border-gray-100 hover:border-rose-200 transition-all flex flex-col items-center snap-start">
                          <div className="w-full aspect-square bg-gray-50 rounded-lg overflow-hidden mb-2 relative group/img">
                            <img 
                              src={addon.images?.[0] || 'https://picsum.photos/150/150?grayscale'} 
                              alt={addon.name} 
                              className="w-full h-full object-cover transition-transform group-hover/img:scale-105" 
                            />
                            {isAdded ? (
                              <button 
                                type="button"
                                onClick={() => handleRemoveItem(existingItem)}
                                className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-white/95 shadow-sm text-rose-500 hover:bg-rose-50 hover:text-rose-600 flex items-center justify-center transition-all group/btn"
                                title="Remove from order"
                              >
                                <FaTimes size={10} className="hidden group-hover/btn:block" />
                                <FaCheckCircle size={11} className="block group-hover/btn:hidden text-emerald-500" />
                              </button>
                            ) : (
                              <button 
                                type="button"
                                onClick={() => handleAddonToCart(addon)}
                                className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-white/95 shadow-sm text-rose-500 hover:bg-rose-500 hover:text-white flex items-center justify-center transition-all"
                                title="Add to Cart"
                              >
                                <FaPlus size={10} />
                              </button>
                            )}
                          </div>
                          <div className="text-center w-full px-0.5">
                            <h5 className="font-medium text-xs text-gray-800 truncate" title={addon.name}>{addon.name}</h5>
                            <p className="text-rose-600 font-semibold text-[11px] mt-0.5">INR {addon.price}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="mt-6">
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Have a coupon?
                </h4>
                <div className="flex gap-2">
                  <input
                    type="text"
                    disabled={couponLoading || appliedCoupon}
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    placeholder="Enter coupon code"
                    className={`flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:ring-rose-500 focus:border-rose-500 ${appliedCoupon ? 'opacity-50' : ''}`}
                  />
                  {appliedCoupon ? (
                    <button
                      type="button"
                      onClick={() => {
                        setAppliedCoupon(null);
                        setCouponCode('');
                        toast.success('Coupon removed.');
                      }}
                      className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors text-sm"
                    >
                      Remove
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleApplyCoupon}
                      disabled={couponLoading || !couponCode.trim()}
                      className="px-4 py-2 bg-rose-500 text-white rounded hover:bg-rose-600 transition-colors text-sm disabled:bg-gray-400"
                    >
                      Apply
                    </button>
                  )}
                </div>
                {appliedCoupon && (
                  <p className="mt-2 text-xs text-green-700">
                    Coupon {appliedCoupon.code} applied. You save INR{' '}
                    {discount.toFixed(0)}.
                  </p>
                )}
                {couponError && (
                  <p className="mt-2 text-xs text-red-600">{couponError}</p>
                )}
              </div>


              <div className="border-t border-gray-300 pt-4 space-y-2 mt-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>INR {subtotal}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>- INR {discount.toFixed(0)}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>{displayShipping === 0 ? 'Free' : `INR ${displayShipping}`}</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-2">
                  <span>Total</span>
                  <span>INR {total}</span>
                </div>
              </div>


              <button 
                onClick={handleCheckoutClick}
                disabled={cartItems.length === 0 || !selectedAddress || razorpayLoading}
                className="w-full mt-8 bg-black text-white py-4 rounded uppercase tracking-widest hover:bg-gray-800 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {razorpayLoading ? 'Processing payment...' : 'Place Order'}
              </button>

              {/* Trust Badges */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3 text-gray-600">
                    <FaLock className="text-xl text-gray-400" />
                    <div>
                      <p className="text-sm font-semibold">Secure Checkout</p>
                      <p className="text-xs text-gray-500">256-bit SSL encryption</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600">
                    <FaShieldAlt className="text-xl text-gray-400" />
                    <div>
                      <p className="text-sm font-semibold">Verified Payments</p>
                      <p className="text-xs text-gray-500">100% safe & trusted transactions</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600">
                    <FaTruck className="text-xl text-gray-400" />
                    <div>
                      <p className="text-sm font-semibold">Free Shipping</p>
                      <p className="text-xs text-gray-500">On all orders above ₹999</p>
                    </div>
                  </div>
                </div>
              </div>
           </div>
        </div>
      </div>
    </div>

      {showStockModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm transition-opacity duration-300">
          <div className="bg-white rounded-xl shadow-2xl p-8 max-w-lg w-full transform transition-all duration-300">
            <h3 className="text-2xl font-serif text-gray-900 mb-4">Stock Update</h3>
            <p className="text-gray-600 mb-6">
              The following items are currently out of stock or have limited availability:
            </p>
            <div className="bg-gray-50 rounded-lg p-4 mb-6 max-h-48 overflow-y-auto">
              <ul className="space-y-3">
                {outOfStockItems.map((item, index) => (
                  <li key={index} className="flex justify-between items-center text-sm border-b border-gray-200 pb-2 last:border-0 last:pb-0">
                    <span className="font-medium text-gray-800">
                      {item.product.name} {item.size && `(Size: ${item.size})`}
                    </span>
                    <span className="text-red-500 font-medium">Out of Stock</span>
                  </li>
                ))}
              </ul>
            </div>
            <p className="text-gray-700 font-medium mb-8">
              Do you want to continue checking out with only the available items?
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-end">
              <button
                onClick={() => setShowStockModal(false)}
                className="px-6 py-3 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-md font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleProceedWithAvailable}
                className="px-6 py-3 bg-black text-white rounded-md font-medium hover:bg-gray-800 transition-colors shadow-lg"
              >
                Continue Checkout
              </button>
            </div>
          </div>
        </div>
      )}

    {/* Mobile Sticky Checkout Bar */}
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 lg:hidden z-40 shadow-[0_-8px_16px_-1px_rgba(0,0,0,0.05)]" style={{ paddingBottom: 'max(env(safe-area-inset-bottom), 1rem)' }}>
      <div className="flex items-center justify-between max-w-lg mx-auto">
        <div>
          <p className="text-[11px] text-gray-500 uppercase font-semibold tracking-wider">Total Amount</p>
          <p className="font-bold text-lg text-gray-900">INR {total}</p>
        </div>
        <button 
          onClick={handleCheckoutClick}
          disabled={cartItems.length === 0 || !selectedAddress || razorpayLoading}
          className="bg-black text-white px-8 py-3.5 rounded-xl text-sm font-semibold tracking-wide shadow-md disabled:opacity-50 transition-colors"
        >
          {razorpayLoading ? 'Processing...' : 'Place Order'}
        </button>
      </div>
    </div>

    </>
  );
};


export default Checkout;
