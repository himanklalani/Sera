import { Helmet } from 'react-helmet-async';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaTrash, FaMinus, FaPlus, FaLock, FaTruck, FaShieldAlt, FaGift, FaTimes, FaEnvelopeOpenText } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../components/CartContext';
import axios from 'axios';
import toast from 'react-hot-toast';

const FALLBACK_IMAGE = 'https://picsum.photos/150/150?grayscale';
const NOTE_MAX_LENGTH = 450;

const Cart = () => {
  const { cartItems, loading, updateQuantity, removeFromCart, fetchCart, addToCart } = useCart();
  const navigate = useNavigate();
  const [addons, setAddons] = useState([]);
  const [greetingCardId, setGreetingCardId] = useState(null);

  // Note popup state
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [cardNote, setCardNote] = useState('');
  const [addingCard, setAddingCard] = useState(false);

  const getUserInfo = () => {
    const stored = localStorage.getItem('userInfo');
    return stored ? JSON.parse(stored) : null;
  };

  useEffect(() => {
    fetchCart();
    
    // Fetch Add-ons
    const fetchAddons = async () => {
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/products?isAddon=true`);
        const all = data.products || [];
        // Find the greeting card separately so it can be shown as a special hardcoded item
        const card = all.find(a => a.name === 'Greeting Card');
        const otherAddons = all.filter(a => a.name !== 'Greeting Card');
        if (card) setGreetingCardId(card._id);
        setAddons(otherAddons);
      } catch (error) {
        console.error('Error fetching addons:', error);
      }
    };
    fetchAddons();
  }, [fetchCart]);

  const handleAddonToCart = async (addon) => {
    try {
      await addToCart(addon._id, 1);
      toast.success(`${addon.name} added to cart!`);
    } catch (error) {
      toast.error('Failed to add item');
    }
  };

  const handleAddGreetingCard = () => {
    if (!getUserInfo()) {
      toast.error('Please log in to add items to your cart.');
      return;
    }
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
      toast.success('Greeting card added to your cart!');
      setShowNoteModal(false);
      setCardNote('');
    } catch (error) {
      toast.error('Failed to add greeting card. Please try again.');
    } finally {
      setAddingCard(false);
    }
  };

  const handleQuantityChange = async (productId, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      await updateQuantity(productId, newQuantity);
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const handleRemoveItem = async (item) => {
    try {
      // Use cart item _id for note-based items (greeting cards) since they share productId
      const idToRemove = item.note ? item._id : (item.product?._id || item._id);
      await removeFromCart(idToRemove);
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  const subtotal = cartItems.reduce(
    (acc, item) => acc + (item.quantity || 0) * (item.product?.price || 0),
    0
  );
  const shipping = subtotal > 999 ? 0 : subtotal > 0 ? 100 : 0;
  const total = subtotal + shipping;

  if (loading) {
    return <div className="text-center py-20">Loading Cart...</div>;
  }

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
                onChange={(e) => setCardNote(e.target.value.slice(0, NOTE_MAX_LENGTH))}
                placeholder="e.g. Happy Birthday! Wishing you all the joy in the world..."
                rows={6}
                className="w-full border border-gray-200 rounded-xl p-4 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-transparent resize-none leading-relaxed"
              />

              <div className="flex justify-between items-center mt-2 mb-6">
                <p className="text-xs text-gray-400 italic">Max {NOTE_MAX_LENGTH} characters</p>
                <p className={`text-xs font-medium ${cardNote.length >= NOTE_MAX_LENGTH ? 'text-red-500' : 'text-gray-400'}`}>
                  {cardNote.length}/{NOTE_MAX_LENGTH}
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowNoteModal(false)}
                  className="flex-1 py-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmGreetingCard}
                  disabled={addingCard || !cardNote.trim()}
                  className="flex-1 py-3 bg-rose-500 text-white rounded-xl text-sm font-semibold hover:bg-rose-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {addingCard ? 'Adding...' : 'Add to Cart — Free'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="container mx-auto px-6 py-24 min-h-screen">
      <h1 className="text-4xl font-serif text-center mb-12">Your Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <div className="text-center">
          <p className="text-xl mb-6 text-gray-600">Your cart is currently empty.</p>
          <Link
            to="/"
            className="inline-block bg-[#c5a666] text-white px-8 py-3 rounded uppercase tracking-wider hover:bg-[#b09458] transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Cart Items */}
          <div className="lg:w-2/3 space-y-6">
            {cartItems.map((item, idx) => (
              <motion.div
                key={item._id || item.product?._id || idx}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col sm:flex-row items-center bg-white p-6 rounded-lg shadow-sm border border-gray-100"
              >
                {/* Clickable Image */}
                {item.product ? (
                  item.product.isAddon ? (
                    <div className="w-24 h-24 flex-shrink-0 bg-rose-50 rounded overflow-hidden mb-4 sm:mb-0 sm:mr-6 flex items-center justify-center">
                      <FaEnvelopeOpenText className="text-rose-400" size={32} />
                    </div>
                  ) : (
                    <Link
                      to={`/product/${item.product._id}`}
                      className="w-24 h-24 flex-shrink-0 bg-gray-100 rounded overflow-hidden mb-4 sm:mb-0 sm:mr-6 hover:opacity-75 transition-opacity"
                    >
                      <img
                        src={item.product.images?.[0] || FALLBACK_IMAGE}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                        onError={(e) => { e.currentTarget.src = FALLBACK_IMAGE; }}
                      />
                    </Link>
                  )
                ) : (
                  <div className="w-24 h-24 flex-shrink-0 bg-gray-100 rounded overflow-hidden mb-4 sm:mb-0 sm:mr-6">
                    <img
                      src={FALLBACK_IMAGE}
                      alt="Product Unavailable"
                      className="w-full h-full object-cover opacity-50"
                    />
                  </div>
                )}

                <div className="flex-grow text-center sm:text-left">
                  {item.product ? (
                    <>
                      {item.product.isAddon ? (
                        <h3 className="font-serif text-xl mb-1">{item.product.name}</h3>
                      ) : (
                        <Link to={`/product/${item.product._id}`} className="hover:text-rose-600 transition-colors">
                          <h3 className="font-serif text-xl mb-1">{item.product.name}</h3>
                        </Link>
                      )}
                      <p className="text-gray-500 mb-2">
                        {item.product.isAddon ? 'Add-on Item' : (item.product.category || 'Uncategorized')}
                        {item.size && (
                          <span className="ml-3 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                            Size: {item.size}
                          </span>
                        )}
                      </p>
                      {/* Show greeting card note */}
                      {item.note && (
                        <div className="mt-1 mb-2 bg-rose-50 border border-rose-100 rounded-lg px-3 py-2 text-xs text-gray-700 italic max-w-xs text-left">
                          <span className="font-semibold text-rose-600 not-italic">Note: </span>
                          &quot;{item.note}&quot;
                        </div>
                      )}
                      <p className="font-medium text-rose-600 flex items-center gap-3">
                        <span>{item.product.price === 0 ? 'Free' : `INR ${item.product.price}`}</span>
                        {item.product.stock === 0 && (
                          <span className="text-xs font-bold text-red-600 bg-red-100 px-2 py-1 rounded">
                            OUT OF STOCK
                          </span>
                        )}
                      </p>
                    </>
                  ) : (
                    <>
                      <h3 className="font-serif text-xl mb-1 text-gray-400">Product Unavailable</h3>
                      <p className="text-xs text-red-400 mb-2 italic">This product has been removed from the catalog.</p>
                    </>
                  )}
                </div>

                <div className="flex items-center gap-4 mt-4 sm:mt-0">
                  {/* Hide quantity controls for greeting cards (note-based items) */}
                  {!item.note && (
                    <div className={`flex items-center border border-gray-300 rounded ${!item.product || item.product.stock === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}>
                      <button
                        onClick={() => item.product && item.product.stock > 0 && handleQuantityChange(item.product._id, item.quantity - 1)}
                        disabled={!item.product || item.product.stock === 0}
                        className="p-2 hover:bg-gray-100 text-gray-600 disabled:cursor-not-allowed"
                      >
                        <FaMinus size={12} />
                      </button>
                      <span className="px-4 font-medium">{item.quantity}</span>
                      <button
                        onClick={() => item.product && item.product.stock > 0 && handleQuantityChange(item.product._id, item.quantity + 1)}
                        disabled={!item.product || item.product.stock === 0}
                        className="p-2 hover:bg-gray-100 text-gray-600 disabled:cursor-not-allowed"
                      >
                        <FaPlus size={12} />
                      </button>
                    </div>
                  )}
                  <button
                    onClick={() => handleRemoveItem(item)}
                    className="text-gray-400 hover:text-red-500 transition-colors p-2"
                  >
                    <FaTrash />
                  </button>
                </div>
              </motion.div>
            ))}

            {/* UPSELL / ADD-ONS SECTION */}
            <div className="mt-12 bg-rose-50/50 p-6 rounded-lg border border-rose-100">
              <div className="flex items-center gap-2 mb-4 text-rose-800">
                <FaGift className="text-xl" />
                <h3 className="font-serif text-2xl">Complete Your Gift</h3>
              </div>
              <p className="text-sm text-gray-600 mb-6">Add premium packaging or a little extra something to make it perfect.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                {/* Hardcoded Greeting Card */}
                <div className="flex items-center bg-white p-3 rounded shadow-sm border border-rose-200 hover:border-rose-400 transition-colors">
                  <div className="w-16 h-16 bg-rose-50 rounded overflow-hidden mr-4 flex-shrink-0 flex items-center justify-center">
                    <FaEnvelopeOpenText className="text-rose-400" size={28} />
                  </div>
                  <div className="flex-grow">
                    <h4 className="font-medium text-sm text-gray-800">Greeting Card</h4>
                    <p className="text-rose-600 font-semibold text-sm">Free</p>
                    <p className="text-xs text-gray-400 mt-0.5">Add a personal note</p>
                  </div>
                  <button
                    onClick={handleAddGreetingCard}
                    className="ml-2 w-8 h-8 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center hover:bg-rose-500 hover:text-white transition-colors"
                    title="Add Greeting Card"
                  >
                    <FaPlus size={12} />
                  </button>
                </div>

                {/* Dynamic addons from DB */}
                {addons.map((addon) => (
                  <div key={addon._id} className="flex items-center bg-white p-3 rounded shadow-sm border border-gray-100 transition-hover hover:border-rose-300">
                    <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden mr-4 flex-shrink-0">
                      <img
                        src={addon.images?.[0] || FALLBACK_IMAGE}
                        alt={addon.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-grow">
                      <h4 className="font-medium text-sm text-gray-800 line-clamp-1">{addon.name}</h4>
                      <p className="text-rose-600 font-semibold text-sm">INR {addon.price}</p>
                    </div>
                    <button
                      onClick={() => handleAddonToCart(addon)}
                      className="ml-2 w-8 h-8 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center hover:bg-rose-500 hover:text-white transition-colors"
                      title="Add to Cart"
                    >
                      <FaPlus size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:w-1/3">
            <div className="bg-rose-50 p-8 rounded-lg sticky top-24">
              <h3 className="font-serif text-2xl mb-6">Order Summary</h3>
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>INR {subtotal}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'Free' : `INR ${shipping}`}</span>
                </div>
                {shipping > 0 && subtotal > 0 && (
                  <p className="text-xs text-rose-500">
                    Add INR {Math.max(0, 1000 - subtotal)} more for free shipping
                  </p>
                )}
                <div className="border-t border-gray-300 pt-4 flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>INR {total}</span>
                </div>
              </div>
              <button
                onClick={() => navigate('/checkout')}
                className="w-full bg-black text-white py-4 rounded uppercase tracking-widest hover:bg-gray-800 transition-colors shadow-lg"
              >
                Proceed to Checkout
              </button>

              {/* Trust Badges */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3 text-gray-600">
                    <FaLock className="text-xl text-gray-400" />
                    <div>
                      <p className="text-sm font-semibold">Secure Checkout</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600">
                    <FaShieldAlt className="text-xl text-gray-400" />
                    <div>
                      <p className="text-sm font-semibold">Verified Payments</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600">
                    <FaTruck className="text-xl text-gray-400" />
                    <div>
                      <p className="text-sm font-semibold">Free Shipping above ₹999</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  
    </>
  );
};

export default Cart;
