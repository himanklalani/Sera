import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { FaTrash, FaMinus, FaPlus } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchCart = async () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      if (!userInfo) {
        navigate('/login');
        return;
      }
      const config = {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      };
      const { data } = await axios.get('http://localhost:5000/api/cart', config);
      setCartItems(data.items || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching cart:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleQuantityChange = async (productId, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      const { data } = await axios.put(`http://localhost:5000/api/cart/${productId}`, { quantity: newQuantity }, config);
      setCartItems(data.items);
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const handleRemoveItem = async (productId) => {
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      const { data } = await axios.delete(`http://localhost:5000/api/cart/${productId}`, config);
      setCartItems(data.items);
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  const subtotal = cartItems.reduce((acc, item) => acc + item.quantity * item.product.price, 0);
  const shipping = subtotal > 999 ? 0 : 100;
  const total = subtotal + shipping;

  if (loading) return <div className="text-center py-20">Loading Cart...</div>;

  return (
    <div className="container mx-auto px-6 py-24 min-h-screen">
      <h1 className="text-4xl font-serif text-center mb-12">Your Shopping Cart</h1>
      
      {cartItems.length === 0 ? (
        <div className="text-center">
          <p className="text-xl mb-6 text-gray-600">Your cart is currently empty.</p>
          <Link to="/" className="inline-block bg-[#c5a666] text-white px-8 py-3 rounded uppercase tracking-wider hover:bg-[#b09458] transition-colors">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Cart Items */}
          <div className="lg:w-2/3 space-y-6">
            {cartItems.map((item) => (
              <motion.div 
                key={item.product._id} 
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col sm:flex-row items-center bg-white p-6 rounded-lg shadow-sm border border-gray-100"
              >
                <div className="w-24 h-24 flex-shrink-0 bg-gray-100 rounded overflow-hidden mb-4 sm:mb-0 sm:mr-6">
                  <img src={item.product.images[0] || 'https://via.placeholder.com/150'} alt={item.product.name} className="w-full h-full object-cover" />
                </div>
                
                <div className="flex-grow text-center sm:text-left">
                  <h3 className="font-serif text-xl mb-1">{item.product.name}</h3>
                  <p className="text-gray-500 mb-2">{item.product.category}</p>
                  <p className="font-medium text-rose-600">Rs. {item.product.price}</p>
                </div>

                <div className="flex items-center gap-4 mt-4 sm:mt-0">
                  <div className="flex items-center border border-gray-300 rounded">
                    <button 
                      onClick={() => handleQuantityChange(item.product._id, item.quantity - 1)}
                      className="p-2 hover:bg-gray-100 text-gray-600"
                    >
                      <FaMinus size={12} />
                    </button>
                    <span className="px-4 font-medium">{item.quantity}</span>
                    <button 
                      onClick={() => handleQuantityChange(item.product._id, item.quantity + 1)}
                      className="p-2 hover:bg-gray-100 text-gray-600"
                    >
                      <FaPlus size={12} />
                    </button>
                  </div>
                  <button 
                    onClick={() => handleRemoveItem(item.product._id)}
                    className="text-gray-400 hover:text-red-500 transition-colors p-2"
                  >
                    <FaTrash />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:w-1/3">
            <div className="bg-rose-50 p-8 rounded-lg sticky top-24">
              <h3 className="font-serif text-2xl mb-6">Order Summary</h3>
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>Rs. {subtotal}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'Free' : `Rs. ${shipping}`}</span>
                </div>
                {shipping > 0 && (
                  <p className="text-xs text-rose-500">Add Rs. {1000 - subtotal} more for free shipping</p>
                )}
                <div className="border-t border-gray-300 pt-4 flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>Rs. {total}</span>
                </div>
              </div>
              <button 
                onClick={() => navigate('/checkout')}
                className="w-full bg-black text-white py-4 rounded uppercase tracking-widest hover:bg-gray-800 transition-colors shadow-lg"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;