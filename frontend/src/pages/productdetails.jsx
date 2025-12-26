import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FaStar, FaHeart, FaMinus, FaPlus, FaShoppingCart } from 'react-icons/fa';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [error, setError] = useState(null);
  const [addingToCart, setAddingToCart] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`http://localhost:5000/api/products/${id}`);
        setProduct(data);
        
        // Check wishlist status
        const userInfo = localStorage.getItem('userInfo');
        if (userInfo) {
          const parsedUser = JSON.parse(userInfo);
          const config = { headers: { Authorization: `Bearer ${parsedUser.token}` } };
          const wishlistRes = await axios.get('http://localhost:5000/api/auth/wishlist', config);
          const wishlist = wishlistRes.data || [];
          // Handle wishlist items as objects or strings
          const inWishlist = wishlist.some(item => 
            (typeof item === 'string' ? item : item._id) === id
          );
          setIsInWishlist(inWishlist);
        }
        
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    const userInfo = localStorage.getItem('userInfo');
    if (!userInfo) {
      navigate('/login?redirect=/product/' + id);
      return;
    }

    setAddingToCart(true);
    try {
      const parsedUser = JSON.parse(userInfo);
      const config = {
        headers: {
          Authorization: `Bearer ${parsedUser.token}`,
        },
      };
      await axios.post('http://localhost:5000/api/cart', { productId: id, quantity }, config);
      navigate('/cart');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add to cart');
      setAddingToCart(false);
    }
  };

  const handleWishlist = async () => {
    const userInfo = localStorage.getItem('userInfo');
    if (!userInfo) {
      navigate('/login');
      return;
    }
    
    try {
      const parsedUser = JSON.parse(userInfo);
      const config = { headers: { Authorization: `Bearer ${parsedUser.token}` } };
      
      if (isInWishlist) {
        await axios.delete(`http://localhost:5000/api/auth/wishlist/${id}`, config);
        setIsInWishlist(false);
        alert('Removed from wishlist');
      } else {
        await axios.post('http://localhost:5000/api/auth/wishlist', { productId: id }, config);
        setIsInWishlist(true);
        alert('Added to wishlist');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to update wishlist');
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>;
  if (!product) return null;

  return (
    <div className="container mx-auto px-6 py-24">
      <div className="flex flex-col md:flex-row gap-12">
        {/* Image Gallery */}
        <div className="w-full md:w-1/2">
          <div className="mb-4 aspect-square bg-gray-100 rounded-lg overflow-hidden">
            <motion.img 
              key={selectedImage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              src={product.images && product.images[selectedImage] ? product.images[selectedImage] : 'https://via.placeholder.com/500'} 
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {product.images && product.images.map((img, idx) => (
              <button 
                key={idx} 
                onClick={() => setSelectedImage(idx)}
                className={`w-20 h-20 flex-shrink-0 border-2 rounded overflow-hidden ${selectedImage === idx ? 'border-rose-500' : 'border-transparent'}`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="w-full md:w-1/2">
          <div className="flex justify-between items-start">
            <div>
               <p className="text-rose-500 text-sm font-medium tracking-widest uppercase mb-2">{product.category}</p>
               <h1 className="text-4xl font-serif text-gray-900 mb-4">{product.name}</h1>
            </div>
            <button onClick={handleWishlist} className="text-2xl text-rose-500 hover:scale-110 transition-transform">
               {isInWishlist ? <FaHeart /> : <FaHeart className="text-gray-300 hover:text-rose-500" />}
            </button>
          </div>

          <div className="flex items-center gap-4 mb-6">
            <p className="text-2xl font-light text-gray-900">Rs. {product.price}</p>
            {/* Rating placeholder */}
            <div className="flex text-yellow-400 text-sm">
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} className={i < (product.rating || 5) ? "" : "text-gray-300"} />
              ))}
              <span className="text-gray-400 ml-2 text-xs">({product.numReviews || 0} reviews)</span>
            </div>
          </div>

          <p className="text-gray-600 leading-relaxed mb-8">
            {product.description}
          </p>

          <div className="border-t border-b border-gray-100 py-6 mb-8">
             <div className="flex items-center gap-8">
                <div className="flex items-center border border-gray-300 rounded">
                   <button 
                     onClick={() => setQuantity(Math.max(1, quantity - 1))}
                     className="px-4 py-2 hover:bg-gray-50 transition-colors"
                   >
                     <FaMinus size={12} />
                   </button>
                   <span className="w-12 text-center font-medium">{quantity}</span>
                   <button 
                     onClick={() => setQuantity(quantity + 1)}
                     className="px-4 py-2 hover:bg-gray-50 transition-colors"
                   >
                     <FaPlus size={12} />
                   </button>
                </div>
                <button 
                  onClick={handleAddToCart}
                  disabled={addingToCart}
                  className="flex-1 bg-rose-500 text-white py-3 px-6 rounded uppercase tracking-wider font-medium hover:bg-rose-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {addingToCart ? 'Adding...' : <><FaShoppingCart /> Add to Cart</>}
                </button>
             </div>
          </div>

          <div className="space-y-4">
             <div className="flex gap-4 text-sm text-gray-500">
                <span>SKU: {product._id.substring(0, 6).toUpperCase()}</span>
                <span>Category: {product.category}</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
