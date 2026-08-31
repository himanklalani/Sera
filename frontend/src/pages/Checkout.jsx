import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FloatingCouponDrawer } from './Home';
import { FaLock, FaTruck, FaShieldAlt, FaGift, FaPlus } from 'react-icons/fa';
import { useCart } from '../components/CartContext';


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
  const [showStockModal, setShowStockModal] = useState(false);
  const [outOfStockItems, setOutOfStockItems] = useState([]);
  const [proceedAfterRender, setProceedAfterRender] = useState(false);
  const navigate = useNavigate();
  const { addToCart } = useCart();


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
          navigate('/login');
          return;
        }


        let userInfo;
        try {
          userInfo = JSON.parse(storedUserInfo);
        } catch (error) {
          console.error('Failed to parse userInfo from localStorage:', error);
          localStorage.removeItem('userInfo');
          navigate('/login');
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
                item_id: item.product._id,
                item_name: item.product.name,
                item_category: item.product.category,
                price: Math.round((item.product.price || 0) * 0.5),
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
        setAddons(addonsRes.data.products || []);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching checkout data:', error);
        setLoading(false);
      }
    };
    fetchData();
  }, [navigate]);

  const handleAddonToCart = async (addon) => {
    try {
      await addToCart(addon._id, 1);
      toast.success(`${addon.name} added!`);
      // Refetch cart to update summary
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


  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error('Please enter a coupon code.');
      return;
    }


    try {
      const storedUserInfo = localStorage.getItem('userInfo');
      if (!storedUserInfo) {
        navigate('/login');
        return;
      }


      let userInfo;
      try {
        userInfo = JSON.parse(storedUserInfo);
      } catch (error) {
        console.error('Failed to parse userInfo from localStorage:', error);
        localStorage.removeItem('userInfo');
        navigate('/login');
        return;
      }


      // ✅ FIXED: Calculate cartValue (subtotal) and orderTotal separately
      // Ensure addons are excluded from discountable cartValue
      const discountableCartValue = cartItems
        .filter(item => !item.product.isAddon)
        .reduce((acc, item) => acc + item.quantity * item.product.price, 0);
        
      const cartValue = cartItems.reduce(
        (acc, item) => acc + item.quantity * item.product.price,
        0
      );
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
        navigate('/login');
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
        navigate('/login');
        return;
      }


      let userInfo;
      try {
        userInfo = JSON.parse(storedUserInfo);
      } catch (error) {
        console.error('Failed to parse userInfo from localStorage:', error);
        localStorage.removeItem('userInfo');
        navigate('/login');
        return;
      }


      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      
      // ✅ BUILD ORDER DATA WITH COMPLETE ADDRESS STRUCTURE
      const orderData = {
        orderItems: cartItems.map(item => ({
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
      
      toast.success('Order placed successfully!');
      navigate('/order-success', { 
        state: { 
          transaction_id: res.data._id || `COD-${Date.now()}`,
          value: total,
          shipping: appliedCoupon?.isFreeShipping ? 0 : shipping,
          tax: 0,
          items: cartItems.map(item => ({
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
        navigate('/login');
        return;
      }

      let userInfo;
      try {
        userInfo = JSON.parse(storedUserInfo);
      } catch (error) {
        console.error('Failed to parse userInfo from localStorage:', error);
        localStorage.removeItem('userInfo');
        navigate('/login');
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
          orderItems: cartItems.map(item => ({
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
              orderItems: cartItems.map((item) => ({
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

            toast.success('Payment successful and order placed!');
            navigate('/order-success', { 
              state: { 
                transaction_id: response.razorpay_payment_id,
                value: total,
                shipping: appliedCoupon?.isFreeShipping ? 0 : shipping,
                tax: 0,
                items: cartItems.map(item => ({
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
  const subtotal = cartItems.reduce((acc, item) => acc + item.quantity * item.product.price, 0);
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
      <div className="container mx-auto px-6 py-24 min-h-screen relative">
      <FloatingCouponDrawer shouldShow={true} />
      <h1 className="text-4xl font-serif text-center mb-12">Checkout</h1>
      
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Left Side: Address & Payment */}
        <div className="lg:w-2/3 space-y-8">
          
          {/* Address Section */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h2 className="text-2xl font-serif mb-6">Shipping Address</h2>
            {addresses.length === 0 ? (
              <div className="text-center py-6">
                <p className="mb-4 text-gray-500">No addresses found.</p>
                <button 
                  onClick={() => navigate('/profile?tab=addresses')}
                  className="text-rose-600 hover:underline"
                >
                  Add an address in your profile
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {addresses.map((addr, index) => (
                  <div 
                    key={addr._id || index}
                    onClick={() => setSelectedAddress(addr)}
                    className={`p-4 border rounded cursor-pointer transition-all ${
                      selectedAddress?._id === addr._id || selectedAddress === addr
                        ? 'border-rose-500 bg-rose-50 ring-1 ring-rose-500' 
                        : 'border-gray-200 hover:border-rose-300'
                    }`}
                  >
                    <p className="font-bold">{addr.street}</p>
                    <p className="text-sm text-gray-600">{addr.city}, {addr.state}</p>
                    <p className="text-sm text-gray-600">{addr.postalCode}, {addr.country || 'India'}</p>
                    <p className="text-sm text-gray-600">📞 {addr.phone}</p>
                    {addr.landmark && <p className="text-xs text-gray-500 italic">Near: {addr.landmark}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>


          {/* Payment Section */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h2 className="text-2xl font-serif mb-6">Payment Method</h2>
            <p className="text-gray-700 text-sm">
              All orders are paid online securely via Razorpay. You will be redirected to the
              Razorpay payment gateway after clicking Place Order.
            </p>
          </div>
        </div>


        {/* Right Side: Order Summary */}
        <div className="lg:w-1/3">
           <div className="bg-rose-50 p-8 rounded-lg sticky top-24">
              <h3 className="font-serif text-2xl mb-6">Your Order</h3>
              <div className="space-y-4 mb-8 max-h-60 overflow-y-auto pr-2">
                {cartItems.map(item => (
                  <div key={item.product._id} className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-3">
                       <span className="text-gray-500">{item.quantity}x</span>
                       <span className="truncate max-w-[150px]">{item.product.name} {item.size && <span className="text-gray-400 text-xs ml-1">(Size: {item.size})</span>}</span>
                    </div>
                    <span>INR {item.quantity * item.product.price}</span>
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
                  <div className="space-y-3">
                    {addons.map((addon) => (
                      <div key={addon._id} className="flex items-center bg-white p-2 rounded shadow-sm border border-gray-100">
                        <div className="w-12 h-12 bg-gray-100 rounded overflow-hidden mr-3 flex-shrink-0">
                          <img 
                            src={addon.images?.[0] || 'https://picsum.photos/150/150?grayscale'} 
                            alt={addon.name} 
                            className="w-full h-full object-cover" 
                          />
                        </div>
                        <div className="flex-grow">
                          <h5 className="font-medium text-xs text-gray-800 line-clamp-1">{addon.name}</h5>
                          <p className="text-rose-600 font-semibold text-xs">INR {addon.price}</p>
                        </div>
                        <button 
                          onClick={() => handleAddonToCart(addon)}
                          className="ml-2 w-7 h-7 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center hover:bg-rose-500 hover:text-white transition-colors flex-shrink-0"
                          title="Add to Cart"
                        >
                          <FaPlus size={10} />
                        </button>
                      </div>
                    ))}
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

    </>
  );
};


export default Checkout;
