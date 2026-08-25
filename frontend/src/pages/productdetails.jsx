import toast from 'react-hot-toast';
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import SEO from '../components/SEO';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FaStar, FaHeart, FaMinus, FaPlus, FaShoppingCart, FaShareAlt, FaInstagram, FaTint, FaGem, FaTruck, FaLink, FaWhatsapp, FaEnvelope, FaShareSquare } from 'react-icons/fa';
import { useCart } from '../components/CartContext';
import { copyToClipboard, nativeShare } from '../utils/shareUtils';

const FALLBACK_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='500' height='500' viewBox='0 0 500 500'%3E%3Crect fill='%23f3f4f6' width='500' height='500'/%3E%3Ctext fill='%239ca3af' font-family='sans-serif' font-size='32' dy='10.5' font-weight='bold' x='50%25' y='50%25' text-anchor='middle'%3ENo Image%3C/text%3E%3C/svg%3E";


const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart: addToCartContext } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [error, setError] = useState(null);
  const [addingToCart, setAddingToCart] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [recentProducts, setRecentProducts] = useState([]);
  const [selectedSize, setSelectedSize] = useState('');
  const [activeTab, setActiveTab] = useState('details');


  // review states
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [canReview, setCanReview] = useState(false);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [reviewComment, setReviewComment] = useState('');
  const [showSizeChart, setShowSizeChart] = useState(false);


  const getUserInfo = () => {
    const stored = localStorage.getItem('userInfo');
    if (!stored) return null;


    try {
      return JSON.parse(stored);
    } catch (error) {
      console.error('Failed to parse userInfo from localStorage:', error);
      localStorage.removeItem('userInfo');
      return null;
    }
  };


  useEffect(() => {
    if (product) {
      document.title = `${product.name} | Sera`;
    }
  }, [product, id]);


  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/products/${id}`);
        setProduct(data);

        // GA4 view_item event
        if (window.dataLayer) {
          window.dataLayer.push({
            event: 'view_item',
            ecommerce: {
              currency: 'INR',
              value: data.price || 0,
              items: [{
                item_id: data._id,
                item_name: data.name,
                item_category: data.category,
                price: data.price || 0
              }]
            }
          });
        }

        // Update Recently Viewed
        try {
          let recent = JSON.parse(localStorage.getItem('recentProducts') || '[]');
          const otherRecents = recent.filter(p => p._id !== data._id);
          setRecentProducts(otherRecents.slice(0, 4));

          recent = recent.filter(p => p._id !== data._id);
          recent.unshift({
            _id: data._id,
            name: data.name,
            images: data.images,
            price: data.price,
            category: data.category
          });
          if (recent.length > 4) recent = recent.slice(0, 4);
          localStorage.setItem('recentProducts', JSON.stringify(recent));
        } catch(e) {}

        const ui = getUserInfo();


        // wishlist status
        if (ui) {
          const config = { headers: { Authorization: `Bearer ${ui.token}` } };
          try {
            const wishlistRes = await axios.get(
              `${import.meta.env.VITE_API_URL}/api/auth/wishlist`,
              config
            );
            const wishlist = wishlistRes.data || [];
            const inWishlist = wishlist.some((item) =>
              typeof item === 'string' ? item === id : item._id === id
            );
            setIsInWishlist(inWishlist);
          } catch (wishlistErr) {
            console.error('Wishlist check failed:', wishlistErr);
          }
        }


        // review eligibility
        if (ui && data._id) {
          checkReviewEligibility(data._id, ui.token);
        }


        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
        setLoading(false);
      }
    };


    fetchProduct();
  }, [id]);


  const checkReviewEligibility = async (productId, token) => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/products/${productId}/review-eligibility`,
        config
      );
      setCanReview(data.canReview);
    } catch (err) {
      console.error('Review eligibility check failed:', err);
      setCanReview(false);
    }
  };


  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!userRating || userRating < 1) return;


    const ui = getUserInfo();
    if (!ui) {
      navigate(`/login?redirect=/product/${id}`);
      return;
    }


    setReviewLoading(true);
    try {
      const config = { headers: { Authorization: `Bearer ${ui.token}` } };


      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/products/${id}/reviews`,
        {
          rating: userRating,
          comment: reviewComment.trim(),
        },
        config
      );


      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/products/${id}`);
      setProduct(data);


      setShowReviewForm(false);
      setUserRating(0);
      setReviewComment('');
      setCanReview(false);
      toast.success('Review submitted successfully!');
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to submit review';
      alert(errorMsg);
    } finally {
      setReviewLoading(false);
    }
  };


  const handleAddToCart = async (productToAdd = null) => {
    if (productToAdd && productToAdd.preventDefault) {
      productToAdd = null;
    }


    const ui = getUserInfo();
    const itemToAdd = productToAdd || product;


    if (!ui) {
      navigate(`/login?redirect=/product/${itemToAdd._id}`);
      return;
    }


    const isApparel = itemToAdd.category?.toLowerCase().includes('apparel');
    if (isApparel && !selectedSize && !productToAdd) {
      toast.error('Please select a size first');
      return;
    }

    if (!productToAdd) {
      setAddingToCart(true);
    }

    try {
      const qty = productToAdd ? 1 : quantity;
      await addToCartContext(itemToAdd._id, qty, selectedSize);
      
      // GA4 add_to_cart event
      if (window.dataLayer) {
        window.dataLayer.push({
          event: 'add_to_cart',
          ecommerce: {
            currency: 'INR',
            value: Math.round((itemToAdd.price || 0) * 0.5) * qty,
            items: [{
              item_id: itemToAdd._id,
              item_name: itemToAdd.name,
              item_category: itemToAdd.category,
              price: Math.round((itemToAdd.price || 0) * 0.5),
              quantity: qty
            }]
          }
        });
      }

      toast.success(`${itemToAdd.name} added to cart!`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add to cart');
    } finally {
      if (!productToAdd) {
        setAddingToCart(false);
      }
    }
  };


  const handleWishlist = async () => {
    const ui = getUserInfo();
    if (!ui) {
      navigate('/login');
      return;
    }


    try {
      const config = { headers: { Authorization: `Bearer ${ui.token}` } };


      if (isInWishlist) {
        await axios.delete(
          `${import.meta.env.VITE_API_URL}/api/auth/wishlist/${id}`,
          config
        );
        setIsInWishlist(false);
        toast.success('Removed from wishlist');
      } else {
        await axios.post(
          `${import.meta.env.VITE_API_URL}/api/auth/wishlist`,
          { productId: id },
          config
        );
        setIsInWishlist(true);
        toast.success('Added to wishlist');
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to update wishlist');
    }
  };


  const handleShare = async (platform) => {
    const productUrl = `${window.location.origin}/product/${id}`;
    
    const productName = product.name;
    const shareText = `Hey checkout: ${productName}! This might just be made for you!!`;
    const fullShareContent = `${shareText}\n\n${productUrl}`;
    const imageUrl = product.images?.[0];

    try {
      // For all non-native platforms, attempt to copy rich content to clipboard first
      if (platform !== 'native') {
        const result = await copyToClipboard(fullShareContent, imageUrl);
        if (result.success) {
          if (platform === 'copy') {
            toast.success(result.type === 'rich' ? 'Product details and image copied!' : 'Product link and text copied!');
            setShowShareMenu(false);
            return;
          }
          // For other platforms, show a brief notification that content is copied for pasting
          toast.success(result.type === 'rich' ? 'Image and link copied! Paste it in the app.' : 'Link copied! Paste it in the app.', { duration: 2000 });
        }
      }

      if (platform === 'whatsapp') {
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(fullShareContent)}`;
        window.open(whatsappUrl, '_blank', 'width=600,height=400');
      } else if (platform === 'email') {
        const subject = `Check out: ${productName}`;
        const emailUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(fullShareContent)}`;
        window.location.href = emailUrl;
      } else if (platform === 'instagram') {
        window.open('https://www.instagram.com/', '_blank');
      } else if (platform === 'native') {
        const shared = await nativeShare({
          title: productName,
          text: shareText,
          url: productUrl,
          imageUrl: imageUrl
        });
        if (!shared && !navigator.share) {
          toast.error('Share not supported on this device');
        }
      }
      setShowShareMenu(false);
    } catch (err) {
      console.error('Share failed:', err);
      if (err.name !== 'AbortError') {
        toast.error('Failed to share');
      }
    }
  };


  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-500">Loading product details...</div>
      </div>
    );


  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500 text-xl">
        {error}
      </div>
    );


  if (!product) return null;

  const jsonLd = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.name,
    "image": product.images || [],
    "description": product.description || `Beautiful anti-tarnish ${product.category} from Sera.`,
    "sku": product._id,
    "offers": {
      "@type": "Offer",
      "url": window.location.href,
      "priceCurrency": "INR",
      "price": product.price || 0,
      "availability": product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "itemCondition": "https://schema.org/NewCondition"
    }
  };
  
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://www.serastore.in"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Shop",
        "item": "https://www.serastore.in/shop"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": product.category,
        "item": `https://www.serastore.in/shop/${product.category.toLowerCase()}`
      },
      {
        "@type": "ListItem",
        "position": 4,
        "name": product.name,
        "item": `https://www.serastore.in/product/${product._id}`
      }
    ]
  };
  
  if (product.numReviews > 0) {
    jsonLd.aggregateRating = {
      "@type": "AggregateRating",
      "ratingValue": product.rating,
      "reviewCount": product.numReviews
    };
  }

  return (
    <>
      <SEO 
        title={`${product.name} | Affordable Anti-Tarnish ${product.category}`}
        description={product.description?.substring(0, 160) || `Buy the ${product.name}. Affordable, waterproof, and high-quality anti-tarnish jewelry.`}
        canonicalUrl={`https://www.serastore.in/product/${product._id}`}
        ogImage={product.images?.[0] || FALLBACK_IMAGE}
        schema={[jsonLd, breadcrumbSchema]}
      />
      <div className="container mx-auto px-6 py-24">
      {/* Visual Breadcrumb Trail */}
      <nav aria-label="Breadcrumb" className="mb-6 text-sm text-gray-500 font-medium">
        <ol className="flex items-center space-x-2">
          <li>
            <Link to="/" className="hover:text-rose-500 transition-colors">Home</Link>
          </li>
          <li><span className="text-gray-300">/</span></li>
          <li>
            <Link to="/shop" className="hover:text-rose-500 transition-colors">Shop</Link>
          </li>
          <li><span className="text-gray-300">/</span></li>
          <li>
            <Link to={`/shop/${product.category.toLowerCase()}`} className="hover:text-rose-500 transition-colors">{product.category}</Link>
          </li>
          <li><span className="text-gray-300">/</span></li>
          <li className="text-gray-900 truncate max-w-[200px]" aria-current="page">
            {product.name}
          </li>
        </ol>
      </nav>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Image Gallery */}
        <div className="w-full lg:w-1/2">
          <div className="mb-6 aspect-square bg-gray-100 rounded-xl overflow-hidden shadow-lg">
            <motion.img
              key={selectedImage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              src={product.images?.[selectedImage] || FALLBACK_IMAGE}
              alt={`${product.name} - Anti-Tarnish Premium Jewelry`}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                e.currentTarget.src = FALLBACK_IMAGE;
              }}
            />
          </div>
          {product.images && product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  aria-label={`View image ${idx + 1}`}
                  onClick={() => setSelectedImage(idx)}
                  className={`w-20 h-20 flex-shrink-0 border-2 rounded-lg overflow-hidden transition-all ${
                    selectedImage === idx
                      ? 'border-rose-500 shadow-md ring-2 ring-rose-200'
                      : 'border-gray-200 hover:border-rose-300'
                  }`}
                >
                  <img
                    src={img}
                    alt={`${product.name} view ${idx + 1}`}
                    className="w-full h-full object-cover hover:opacity-90"
                    onError={(e) => {
                      e.currentTarget.src = FALLBACK_IMAGE;
                    }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>


        {/* Product Info */}
        {/* Product Info */}
        <div className="w-full lg:w-1/2 space-y-6">
          {/* Tags */}
          {product.tags && product.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-2">
              {product.tags.map((tag, idx) => (
                <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-700 text-[11px] font-medium rounded-full uppercase tracking-wider">
                  {tag}
                </span>
              ))}
            </div>
          )}
          
          <div className="flex justify-between items-start gap-4">
            <div className="flex-1 w-full overflow-hidden">
              <h1 className="text-3xl md:text-4xl lg:text-[40px] font-serif text-gray-900 leading-tight tracking-wide">
                {product.name}
              </h1>
              <p className="text-gray-500 text-sm mt-2 capitalize font-medium">
                {product.category}
              </p>
            </div>
            
            {/* Action Buttons: Share & Wishlist */}
            <div className="flex items-center gap-1 relative">
              <div>
                <button
                  onClick={() => setShowShareMenu(!showShareMenu)}
                  className="p-3 text-[1.35rem] group text-gray-300 hover:text-gray-600 transition-colors"
                  title="Share this product"
                >
                  <FaShareAlt />
                </button>
                {showShareMenu && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 bg-white/95 backdrop-blur-sm rounded-xl shadow-2xl border border-gray-100 py-2 z-50 w-56"
                  >
                    <button
                      onClick={() => handleShare('copy')}
                      className="w-full px-4 py-3 text-left flex items-center gap-3 hover:bg-rose-50 transition-colors text-gray-700 hover:text-rose-600 font-medium"
                    >
                      <span className="text-xl"><FaLink /></span>
                      Copy Link
                    </button>
                    <button
                      onClick={() => handleShare('whatsapp')}
                      className="w-full px-4 py-3 text-left flex items-center gap-3 hover:bg-green-50 transition-colors text-gray-700 hover:text-green-600 font-medium"
                    >
                      <span className="text-xl"><FaWhatsapp /></span>
                      WhatsApp
                    </button>
                    <button
                      onClick={() => handleShare('email')}
                      className="w-full px-4 py-3 text-left flex items-center gap-3 hover:bg-orange-50 transition-colors text-gray-700 hover:text-orange-600 font-medium"
                    >
                      <span className="text-xl"><FaEnvelope /></span>
                      Email
                    </button>
                    <button
                      onClick={() => handleShare('instagram')}
                      className="w-full px-4 py-3 text-left flex items-center gap-3 hover:bg-pink-50 transition-colors text-gray-700 hover:text-pink-600 font-medium"
                    >
                      <span className="text-xl"><FaInstagram /></span>
                      Instagram
                    </button>
                    {navigator.share && (
                      <button
                        onClick={() => handleShare('native')}
                        className="w-full px-4 py-3 text-left flex items-center gap-3 hover:bg-purple-50 transition-colors text-gray-700 hover:text-purple-600 font-medium border-t border-gray-100"
                      >
                        <span className="text-xl"><FaShareSquare /></span>
                        Share with an Image
                      </button>
                    )}
                  </motion.div>
                )}
              </div>

              <button
                onClick={handleWishlist}
                className="p-3 text-2xl group"
                title={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
              >
                <FaHeart className={`transition-all duration-300 ${isInWishlist ? 'text-rose-500 fill-rose-500 scale-110' : 'text-gray-300 group-hover:text-rose-300'}`} />
              </button>
            </div>
          </div>

          {/* Price & Rating */}
          <div className="flex items-center justify-between">
            <p className="text-2xl font-semibold text-gray-900">
              INR {product.price?.toLocaleString()}
            </p>
            {product.rating > 0 && (
              <div className="flex items-center gap-1.5 text-sm font-medium text-gray-700 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                <FaStar className="text-yellow-400" />
                {product.rating.toFixed(1)} <span className="text-gray-400 ml-1">({product.numReviews})</span>
              </div>
            )}
          </div>

          {/* More Colors (Accent Pairs) */}
          {product.accentPairs && product.accentPairs.length > 0 && (
            <div className="mt-6 border-t border-gray-100 pt-6">
              <p className="text-sm font-bold text-gray-900 mb-3">More Colors</p>
              <div className="flex gap-3 overflow-x-auto pb-2 hide-scrollbar">
                {product.accentPairs.map((pair) => (
                  <div 
                    key={pair._id} 
                    className="w-20 h-24 rounded-lg overflow-hidden border border-gray-200 cursor-pointer hover:border-[#4A3B32] transition-colors shrink-0 shadow-sm"
                    onClick={() => navigate(`/product/${pair._id}`)}
                  >
                    <img 
                      src={pair.images?.[0] || FALLBACK_IMAGE} 
                      alt={pair.name}
                      className="w-full h-full object-cover"
                      onError={(e) => e.currentTarget.src = FALLBACK_IMAGE}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bundle Contents shown only for combo products */}
          {product.isCombo && product.comboItems && product.comboItems.length > 0 && (
            <div className="mt-6 border-t border-gray-100 pt-6">
              <p className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                What is Inside This Bundle
              </p>
              <div className="flex gap-3 overflow-x-auto pb-2 hide-scrollbar">
                {product.comboItems.map((bundleItem) => (
                  <div
                    key={bundleItem._id}
                    onClick={() => navigate("/product/" + bundleItem._id)}
                    className="flex-shrink-0 w-28 cursor-pointer group"
                  >
                    <div className="w-28 h-28 rounded-xl overflow-hidden border border-gray-200 group-hover:border-rose-400 transition-colors shadow-sm">
                      <img
                        src={bundleItem.images?.[0] || FALLBACK_IMAGE}
                        alt={bundleItem.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => { e.currentTarget.src = FALLBACK_IMAGE; }}
                      />
                    </div>
                    <p className="text-xs font-medium text-gray-600 mt-1.5 truncate group-hover:text-rose-500 transition-colors text-center">
                      {bundleItem.name}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Size Selector for Apparel */}
          {product.category?.toLowerCase().includes('apparel') && (
            <div className="mt-6 border-t border-gray-100 pt-6">
              {/* Size Measurements Bar */}
              <div className="bg-gray-100/80 rounded-full px-4 py-2.5 flex items-center justify-between text-xs font-medium text-gray-700 mb-5 border border-gray-200">
                <div className="flex gap-4 tracking-wide">
                  {selectedSize === 'XS' ? <span>Chest 32" <span className="text-gray-300 font-light mx-1.5">|</span> Waist 24" <span className="text-gray-300 font-light mx-1.5">|</span> Hip 32"</span> :
                   selectedSize === 'S'  ? <span>Chest 34" <span className="text-gray-300 font-light mx-1.5">|</span> Waist 26" <span className="text-gray-300 font-light mx-1.5">|</span> Hip 34"</span> :
                   selectedSize === 'M'  ? <span>Chest 36" <span className="text-gray-300 font-light mx-1.5">|</span> Waist 28" <span className="text-gray-300 font-light mx-1.5">|</span> Hip 36"</span> :
                   selectedSize === 'L'  ? <span>Chest 38" <span className="text-gray-300 font-light mx-1.5">|</span> Waist 30" <span className="text-gray-300 font-light mx-1.5">|</span> Hip 38"</span> :
                   <span className="text-gray-500">Select a size to view measurements</span>}
                </div>
                <button 
                  onClick={() => navigate('/size-guide')}
                  className="bg-rose-600 text-white px-4 py-1.5 rounded-full hover:bg-rose-700 transition-colors whitespace-nowrap shadow-sm"
                >
                  What's my size?
                </button>
              </div>

              {/* Size Buttons */}
              <div className="flex flex-wrap gap-3 mb-6">
                {['XS', 'S', 'M', 'L'].map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center text-sm font-semibold transition-all duration-300 border ${
                      selectedSize === size 
                      ? 'border-rose-600 text-rose-600 border-2 bg-white shadow-sm' 
                      : 'border-gray-200 text-gray-500 hover:border-gray-300 bg-white'
                    }`}
                  >
                    {size}
                    {selectedSize === size && (
                      <div className="w-4 h-[2px] bg-rose-600 mt-1 rounded-full" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Add to Cart Area & Features Box */}
          <div className="mt-8 border border-gray-200 rounded-[20px] p-4 sm:p-5 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] bg-white relative">
            
            {/* Quantity and Stock */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden bg-white/50">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2.5 text-gray-600 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                >
                  <FaMinus className="w-3 h-3" />
                </button>
                <span className="w-8 text-center font-semibold text-gray-800 text-sm">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="px-4 py-2.5 text-gray-600 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                  disabled={quantity >= product.stock}
                >
                  <FaPlus className="w-3 h-3" />
                </button>
              </div>
              <span className="text-sm font-medium text-gray-500">
                {product.stock > 0 ? (
                  <span className={product.stock <= 5 ? "text-orange-500" : ""}>{product.stock} in stock</span>
                ) : (
                  <span className="text-red-500">Out of stock</span>
                )}
              </span>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={addingToCart || product.stock === 0}
              className="w-full bg-[#e3004b] text-white py-3.5 px-8 rounded-xl uppercase tracking-widest font-semibold text-sm shadow-md hover:shadow-lg hover:bg-[#cc0043] focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-3 mb-6"
            >
              {addingToCart ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <FaShoppingCart className="w-4 h-4" />
                  {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                </>
              )}
            </button>

            {/* Features/Trust Badges (Hidden for Apparel) */}
            {!(product.category?.toLowerCase().includes('apparel')) && (
              <div className="grid grid-cols-3 gap-2 pt-5 border-t border-gray-100">
                <div className="flex flex-col items-center text-center gap-2">
                  <FaTint className="text-gray-400 text-xl" />
                  <span className="text-[10px] md:text-xs uppercase font-medium tracking-wide text-gray-500">Sweatproof</span>
                </div>
                <div className="flex flex-col items-center text-center gap-2">
                  <FaGem className="text-gray-400 text-xl" />
                  <span className="text-[10px] md:text-xs uppercase font-medium tracking-wide text-gray-500">Premium Finish</span>
                </div>
                <div className="flex flex-col items-center text-center gap-2">
                  <FaTruck className="text-gray-400 text-xl" />
                  <span className="text-[10px] md:text-xs uppercase font-medium tracking-wide text-gray-500">Free Shipping<br/>Above ₹999</span>
                </div>
              </div>
            )}
            
            {/* Original Shipping Notice */}
            <div className="absolute -bottom-8 left-0 right-0 flex items-center justify-center gap-1.5 text-gray-400 text-[11px] font-medium tracking-wide">
              <span>{product.category?.toLowerCase().includes('apparel') ? 'Shipped in 7-10 business days' : 'Shipped in 5-7 business days'}</span>
            </div>
          </div>

          {/* Tabs Section */}
          <div className="mt-10 bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm">
            <div className="flex overflow-x-auto hide-scrollbar border-b border-gray-100 bg-gray-50/50">
              {['details', 'shipping_returns'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 min-w-[140px] py-4 px-4 text-sm font-semibold transition-colors relative ${
                    activeTab === tab ? 'text-rose-600' : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  {tab === 'details' ? 'Details & Description' : 'Shipping & Returns'}
                  {activeTab === tab && (
                    <motion.div layoutId="activeTabIndicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-rose-600" />
                  )}
                </button>
              ))}
            </div>
            <div className="p-6 md:p-8 bg-white min-h-[200px]">
              {activeTab === 'details' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
                  {product.category?.toLowerCase().includes('apparel') && (
                    <div className="bg-gray-50 rounded-xl px-5 py-4 mb-6 text-gray-800 font-medium flex items-center border border-gray-100">
                      <span className="text-gray-900 font-semibold mr-2">Fabric:</span> 100% Premium Material, soft and comfortable on skin
                    </div>
                  )}
                  {product.description}
                </motion.div>
              )}
              {activeTab === 'shipping_returns' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-gray-600 text-sm leading-relaxed space-y-6">
                  
                  {product.category?.toLowerCase().includes('apparel') ? (
                    <>
                      <div className="bg-rose-50 border border-rose-100 rounded-xl p-4">
                        <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">🚫 NO REFUNDS (Apparel)</h4>
                        <p>We maintain a strict <strong>no-refund policy</strong> for all apparel.</p>
                      </div>

                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">🔄 APPAREL EXCHANGES</h4>
                        <p className="mb-2"><strong>₹150 Exchange Fee</strong> (Free if SERA made a mistake)</p>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>Subject to availability and size.</li>
                          <li>Only regular-priced items are eligible for exchange. Sale items are FINAL SALE.</li>
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">📦 APPAREL RETURNS (Store Credit)</h4>
                        <p className="mb-2"><strong>₹100 Return Fee</strong></p>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>If apparel is returned, no money will be refunded.</li>
                          <li>You will receive a <strong>Coupon</strong> worth the apparel value which can be used in Sera Store.</li>
                          <li>The coupon is valid for <strong>3 months</strong>.</li>
                        </ul>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="bg-rose-50 border border-rose-100 rounded-xl p-4">
                        <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">🚫 NO REFUNDS</h4>
                        <p>We maintain a strict <strong>no-refund policy</strong>. But don't worry! We're happy to offer exchanges instead. Your satisfaction matters to us.</p>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">🔄 EXCHANGES (3-Day Window)</h4>
                        <p className="mb-2"><strong>₹100 Exchange Fee</strong> (Free if SERA made a mistake)</p>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>Subject to availability</li>
                          <li>Same size/quality replacement</li>
                          <li>Only regular-priced items are eligible for exchange. Sale items are FINAL SALE.</li>
                        </ul>
                      </div>
                    </>
                  )}

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">How to Exchange/Return</h4>
                    <ol className="list-decimal pl-5 space-y-2">
                      <li><strong>Request:</strong> Profile → My Orders → Apply within 3 days.</li>
                      <li><strong>Ship Back:</strong> Send with unboxing video proof.</li>
                      <li><strong>Resolution:</strong> Quality check → Exchange ships or Coupon is issued.</li>
                    </ol>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Order Cancellations & Shipping</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>For orders cancelled on <em>pending</em> status, no fees are applicable.</li>
                      <li>For orders cancelled on <em>processing</em> status, a fee of ₹100 will be applicable.</li>
                      <li><strong>Orders cannot be cancelled once shipped.</strong></li>
                      <li>If your order arrives damaged during shipping, contact us within 3 days with an unboxing video for a FREE exchange.</li>
                    </ul>
                  </div>

                  <p className="text-xs text-gray-400 pt-4 border-t border-gray-100">
                    *UNBOXING VIDEO required as proof for all damage or wrong-item claims. Need Help? Contact us via Email, WhatsApp, or Instagram DM.
                  </p>

                </motion.div>
              )}
            </div>
          </div>
          {/* ========== REVIEWS SECTION - INTEGRATED ========== */}


          {/* Display all reviews (public) */}
          {product.reviews && product.reviews.length > 0 && (
            <div className="border-t pt-8">
              <h3 className="font-serif text-2xl font-medium mb-6 text-gray-900">
                Customer Reviews ({product.numReviews || 0})
              </h3>


              <div className="space-y-6 mb-8">
                {product.reviews.map((review, idx) => (
                  <div key={idx} className="bg-gray-50 p-6 rounded-xl border-l-4 border-rose-200">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <FaStar
                            key={i}
                            className={i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                            size={16}
                          />
                        ))}
                      </div>
                      <span className="font-medium text-gray-900">{review.rating}</span>
                      <span className="text-sm text-gray-500">by {review.user?.name || 'Anonymous'}</span>
                    </div>
                    {review.comment && (
                      <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}


          {/* Review Form - Only for eligible users */}
          {getUserInfo() && canReview && (
            <div className="border-t pt-8">
              <button
                onClick={() => setShowReviewForm(!showReviewForm)}
                className="w-full border-2 border-dashed border-rose-200 bg-gradient-to-r from-rose-50 to-pink-50 p-6 rounded-2xl text-center hover:border-rose-300 hover:shadow-md transition-all duration-300 font-serif text-xl font-medium text-rose-700 mb-6"
              >
                ✨ {showReviewForm ? 'Cancel Review' : 'Write Your Review'} ✨
              </button>


              {showReviewForm && (
                <motion.form
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  onSubmit={handleSubmitReview}
                  className="bg-white border border-rose-100 rounded-2xl p-8 shadow-lg space-y-6"
                >
                  {/* Star Rating */}
                  <div>
                    <label className="block font-serif text-lg font-medium text-gray-800 mb-4">
                      Your Rating
                    </label>
                    <div className="flex gap-2 justify-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <motion.div
                          key={star}
                          whileHover={{ scale: 1.3 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <FaStar
                            className={`cursor-pointer text-3xl transition-all duration-200 ${
                              star <= userRating
                                ? 'text-yellow-400 fill-yellow-400 drop-shadow-lg'
                                : 'text-gray-300 hover:text-yellow-400 hover:fill-yellow-400 hover:drop-shadow-md'
                            }`}
                            onClick={() => setUserRating(star)}
                          />
                        </motion.div>
                      ))}
                    </div>
                    {!userRating && (
                      <p className="text-center text-gray-500 text-sm mt-2 font-medium">
                        ⭐ Click a star to rate (1–5)
                      </p>
                    )}
                  </div>


                  {/* Comment */}
                  <div>
                    <label className="block font-serif text-lg font-medium text-gray-800 mb-3">
                      Share Your Experience (Optional)
                    </label>
                    <textarea
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      rows={5}
                      maxLength={1000}
                      className="w-full p-5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-rose-400 focus:ring-4 focus:ring-rose-100 resize-vertical font-serif text-lg placeholder-gray-400 transition-all"
                      placeholder="Tell us about your experience with this beautiful piece..."
                    />
                    <div className="flex justify-between items-center text-xs mt-2 text-gray-500">
                      <span>{reviewComment.length}/1000 characters</span>
                      <span className={reviewComment.length > 900 ? 'text-rose-500 font-medium' : ''}>
                        {reviewComment.length > 900 ? 'Shorten review' : ''}
                      </span>
                    </div>
                  </div>


                  {/* Submit Button */}
                  <motion.button
                    type="submit"
                    disabled={reviewLoading || userRating === 0}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-gradient-to-r from-rose-500 to-rose-600 text-white py-5 px-8 rounded-2xl uppercase tracking-wider font-semibold text-xl shadow-xl hover:shadow-2xl hover:from-rose-600 hover:to-rose-700 focus:outline-none focus:ring-4 focus:ring-rose-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none transition-all duration-300 flex items-center justify-center gap-3 font-serif"
                  >
                    {reviewLoading ? (
                      <>
                        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Publishing your review...
                      </>
                    ) : (
                      <>
                        <FaStar className="text-yellow-300" />
                        Submit Review
                      </>
                    )}
                  </motion.button>
                </motion.form>
              )}
            </div>
          )}


          {/* Non-eligible users message */}
          {getUserInfo() && !canReview && (
            <div className="border-t pt-8">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12 bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl border-2 border-dashed border-rose-200"
              >
                <div className="text-4xl mb-4">💝</div>
                <h3 className="font-serif text-xl font-semibold text-gray-800 mb-2">
                  Verified Purchase Required
                </h3>
                <p className="text-gray-600 mb-4 max-w-md mx-auto">
                  Share your review after your order is delivered. 
                  <br />
                  {product.numReviews || 0} reviews already shared ✨
                </p>
              </motion.div>
            </div>
          )}


          {/* ========== END REVIEWS SECTION ========== */}


          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 text-sm text-gray-500">
            <div className="flex flex-col">
              <span className="font-medium text-gray-700">Product ID:</span>
              <code className="font-mono bg-gray-100 px-2 py-1 rounded text-xs mt-1">
                {product._id?.substring(0, 11)}
              </code>
            </div>
            <div>
              <span>Category: </span>
              <span className="font-medium capitalize">{product.category}</span>
            </div>
            <div>
              <span>Availability: </span>
              <span
                className={
                  product.stock > 5
                    ? 'text-green-600 font-medium'
                    : product.stock > 0
                    ? 'text-yellow-600 font-medium'
                    : 'text-red-600 font-medium'
                }
              >
                {product.stock > 5
                  ? 'In Stock'
                  : product.stock > 0
                  ? `${product.stock} left`
                  : 'Out of Stock'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Recently Viewed Section */}
      {recentProducts.length > 0 && (
        <div className="mt-24 pt-12 border-t">
          <h3 className="font-serif text-3xl font-medium mb-8 text-gray-900 text-center">
            Recently Viewed
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {recentProducts.map((recent) => (
              <div 
                key={recent._id} 
                className="group cursor-pointer bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
                onClick={() => {
                  window.scrollTo(0, 0);
                  navigate(`/product/${recent._id}`);
                }}
              >
                <div className="aspect-square bg-gray-100 overflow-hidden">
                  <img 
                    src={recent.images?.[0] || FALLBACK_IMAGE} 
                    alt={recent.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => e.currentTarget.src = FALLBACK_IMAGE}
                  />
                </div>
                <div className="p-4 text-center border border-t-0 rounded-b-xl">
                  <p className="text-xs text-gray-500 mb-1 capitalize truncate">{recent.category}</p>
                  <h4 className="font-medium text-gray-900 truncate mb-1">{recent.name}</h4>
                  <p className="text-sm text-rose-500 font-bold">
                    INR {Math.round((recent.price || 0) * 0.5).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      </div>

    {/* Apparel Size Chart Modal */}
    {showSizeChart && (
      <div
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
        onClick={() => setShowSizeChart(false)}
      >
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 60 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="relative bg-white w-full sm:max-w-xl rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
            <div>
              <h2 className="text-lg font-serif font-semibold text-gray-900">Size Chart</h2>
              <p className="text-xs text-gray-400 mt-0.5">All measurements are approximate</p>
            </div>
            <button
              onClick={() => setShowSizeChart(false)}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors text-gray-600"
            >
              ✕
            </button>
          </div>

          {/* Table */}
          <div className="p-4 sm:p-6 overflow-x-auto">
            {/* Unit Toggle - visual only, table always shows both */}
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-rose-50">
                  <th className="text-left px-3 py-2.5 text-xs font-semibold uppercase tracking-wider text-rose-700 rounded-tl-lg">Size</th>
                  <th className="text-center px-3 py-2.5 text-xs font-semibold uppercase tracking-wider text-rose-700">Chest (in)</th>
                  <th className="text-center px-3 py-2.5 text-xs font-semibold uppercase tracking-wider text-rose-700">Chest (cm)</th>
                  <th className="text-center px-3 py-2.5 text-xs font-semibold uppercase tracking-wider text-rose-700">Length (in)</th>
                  <th className="text-center px-3 py-2.5 text-xs font-semibold uppercase tracking-wider text-rose-700 rounded-tr-lg">Length (cm)</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { size: 'XS', chestIn: '32–33', chestCm: '81–84', lengthIn: '23', lengthCm: '58' },
                  { size: 'S',  chestIn: '34–35', chestCm: '86–89', lengthIn: '24', lengthCm: '61' },
                  { size: 'M',  chestIn: '36–37', chestCm: '91–94', lengthIn: '25', lengthCm: '63' },
                  { size: 'L',  chestIn: '38–40', chestCm: '96–101', lengthIn: '26', lengthCm: '66' },
                ].map((row, i) => (
                  <tr key={row.size} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-3 py-3 font-semibold text-gray-900 text-center">{row.size}</td>
                    <td className="px-3 py-3 text-center text-gray-600">{row.chestIn}</td>
                    <td className="px-3 py-3 text-center text-gray-600">{row.chestCm}</td>
                    <td className="px-3 py-3 text-center text-gray-600">{row.lengthIn}</td>
                    <td className="px-3 py-3 text-center text-gray-600">{row.lengthCm}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <p className="text-xs text-gray-400 mt-4 text-center">
              If you're between sizes, we recommend sizing up for a relaxed fit.
            </p>
          </div>
        </motion.div>
      </div>
    )}
    </>
  );
};


export default ProductDetails;
