import { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FaFilter, FaSearch, FaShoppingCart, FaHeart, FaTimes } from 'react-icons/fa';

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState(10000);
  const [showFilters, setShowFilters] = useState(false); // ✅ Mobile filter toggle
  const location = useLocation();
  const navigate = useNavigate();

  const categories = ['All', 'Necklace', 'Earrings', 'Bracelet', 'Rings'];

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await axios.get('http://localhost:5000/api/products');
      const safeProducts = Array.isArray(data.products) ? data.products : Array.isArray(data) ? data : [];
      setProducts(safeProducts);
      setFilteredProducts(safeProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
      setFilteredProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categoryParam = params.get('category');
    if (categoryParam) {
      const formattedCategory = categoryParam.charAt(0).toUpperCase() + categoryParam.slice(1).toLowerCase();
      setSelectedCategory(formattedCategory);
    } else {
      setSelectedCategory('All');
    }
  }, [location]);

  useEffect(() => {
    const safeProducts = Array.isArray(products) ? products : [];
    let result = safeProducts;

    if (selectedCategory !== 'All') {
      result = result.filter(p => 
        p.category && 
        p.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    if (searchQuery.trim()) {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.name && p.name.toLowerCase().includes(lowerQuery)
      );
    }

    result = result.filter(p => 
      p.price && typeof p.price === 'number' && p.price <= priceRange
    );

    setFilteredProducts(result);
  }, [products, selectedCategory, searchQuery, priceRange]);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setShowFilters(false); // ✅ Close mobile menu after selection
    if (category === 'All') {
      navigate('/shop');
    } else {
      navigate(`/shop?category=${category.toLowerCase()}`);
    }
  };

  const addToCart = async (e, productId) => {
    e.preventDefault();
    e.stopPropagation();
    
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (!userInfo) {
      navigate('/login?redirect=/shop');
      return;
    }

    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      await axios.post('http://localhost:5000/api/cart', { productId, quantity: 1 }, config);
      alert('Added to cart!');
    } catch (error) {
      console.error('Add to cart error:', error);
      alert('Failed to add to cart');
    }
  };

  const renderProducts = () => {
    if (loading) {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 rounded-lg overflow-hidden shadow-sm h-80">
                <div className="h-64 bg-gray-300"></div>
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                  <div className="h-6 bg-gray-300 rounded w-1/3"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (filteredProducts.length === 0) {
      return (
        <div className="text-center py-12 md:py-20 col-span-full">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md mx-auto px-4"
          >
            <div className="text-4xl md:text-6xl text-gray-300 mb-4">🔍</div>
            <h2 className="text-xl md:text-2xl font-serif font-bold text-gray-600 mb-2">
              No products found
            </h2>
            <p className="text-sm md:text-base text-gray-500 mb-6">
              Try adjusting your search or category filters
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
                navigate('/shop');
              }}
              className="bg-rose-500 text-white px-6 md:px-8 py-2 md:py-3 rounded-lg font-medium hover:bg-rose-600 transition-colors text-sm md:text-base"
            >
              Clear Filters
            </button>
          </motion.div>
        </div>
      );
    }

    return filteredProducts.map(product => (
      <Link 
        to={`/product/${product._id}`} 
        key={product._id || Math.random()} 
        className="group"
      >
        <motion.div
          whileHover={{ y: -8 }}
          className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
        >
          <div className="relative aspect-square overflow-hidden bg-gray-100">
            <img 
              src={product.images?.[0] || 'https://via.placeholder.com/300?text=No+Image'} 
              alt={product.name || 'Product'}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/300?text=No+Image';
              }}
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
            
            <button 
              onClick={(e) => addToCart(e, product._id)}
              className="absolute bottom-3 right-3 md:bottom-4 md:right-4 bg-white text-gray-900 p-2 md:p-3 rounded-full shadow-lg opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:bg-rose-500 hover:text-white hover:shadow-xl"
              title="Add to Cart"
            >
              <FaShoppingCart className="w-3 h-3 md:w-4 md:h-4" />
            </button>
          </div>
          
          <div className="p-3 md:p-4 text-center">
            <h3 className="font-serif text-base md:text-lg text-gray-900 group-hover:text-rose-500 transition-colors mb-1 truncate">
              {product.name || 'Unnamed Product'}
            </h3>
            <p className="text-gray-500 text-xs md:text-sm mb-2 capitalize truncate">
              {product.category || 'Uncategorized'}
            </p>
            <p className="text-lg md:text-xl font-medium text-gray-900">
              Rs. {product.price?.toLocaleString() || 0}
            </p>
          </div>
        </motion.div>
      </Link>
    ));
  };

  return (
    <div className="min-h-screen bg-white pt-16 md:pt-20">
      {/* Header */}
      <div className="bg-rose-50 py-8 md:py-16 px-4 md:px-6 text-center">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl md:text-4xl lg:text-5xl font-serif text-gray-900 mb-2 md:mb-4"
        >
          {selectedCategory === 'All' ? 'Our Collection' : `${selectedCategory} Collection`}
        </motion.h1>
        <p className="text-sm md:text-base text-gray-600 max-w-2xl mx-auto px-4">
          Discover our handcrafted jewelry designed to elevate your everyday style.
        </p>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-6 md:py-12">
        {/* Mobile Filter Button */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="lg:hidden fixed bottom-6 right-6 z-40 bg-rose-500 text-white p-4 rounded-full shadow-lg hover:bg-rose-600 transition-colors"
        >
          {showFilters ? <FaTimes className="w-5 h-5" /> : <FaFilter className="w-5 h-5" />}
        </button>

        <div className="flex flex-col lg:flex-row gap-6 md:gap-12">
          {/* Sidebar / Filters - Mobile Overlay */}
          <AnimatePresence>
            {(showFilters || window.innerWidth >= 1024) && (
              <motion.div 
                initial={{ x: -300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -300, opacity: 0 }}
                transition={{ type: "spring", damping: 25 }}
                className={`
                  fixed lg:static top-0 left-0 h-full lg:h-auto
                  w-72 lg:w-1/4 bg-white lg:bg-transparent
                  z-50 lg:z-auto shadow-2xl lg:shadow-none
                  overflow-y-auto lg:overflow-visible
                  p-6 lg:p-0 space-y-6 md:space-y-8
                  ${showFilters ? 'block' : 'hidden lg:block'}
                `}
              >
                {/* Mobile Close Button */}
                <button
                  onClick={() => setShowFilters(false)}
                  className="lg:hidden absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                >
                  <FaTimes className="w-6 h-6" />
                </button>

                <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border mt-12 lg:mt-0">
                  <h3 className="text-base md:text-lg font-serif font-bold mb-4 md:mb-6 flex items-center gap-2">
                    <FaFilter className="text-rose-500" /> Categories
                  </h3>
                  <ul className="space-y-2 md:space-y-3">
                    {categories.map(cat => (
                      <li key={cat}>
                        <button 
                          onClick={() => handleCategoryClick(cat)}
                          className={`w-full text-left py-2 px-3 md:px-4 rounded-lg transition-colors text-sm md:text-base font-medium ${
                            selectedCategory === cat 
                              ? 'bg-rose-500 text-white shadow-md' 
                              : 'text-gray-600 hover:bg-rose-50 hover:text-rose-500'
                          }`}
                        >
                          {cat}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border">
                  <h3 className="text-base md:text-lg font-serif font-bold mb-4 md:mb-6 flex items-center gap-2">
                    <FaSearch className="text-rose-500" /> Search
                  </h3>
                  <input 
                    type="text" 
                    placeholder="Search products..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 md:px-4 py-2 md:py-3 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 text-sm md:text-base"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Overlay for mobile */}
          {showFilters && (
            <div 
              className="lg:hidden fixed inset-0 bg-black/50 z-40"
              onClick={() => setShowFilters(false)}
            />
          )}

          {/* Product Grid */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full lg:w-3/4"
          >
            <div className="mb-4 md:mb-8 flex items-center justify-between flex-wrap gap-2 md:gap-4">
              <div className="text-xs md:text-sm text-gray-600">
                Showing {filteredProducts.length} of {products.length} products
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
              {renderProducts()}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Shop;
