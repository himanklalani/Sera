import { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FaFilter, FaSearch, FaShoppingCart, FaHeart } from 'react-icons/fa';

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState(10000); // Max price
  const location = useLocation();
  const navigate = useNavigate();

  const categories = ['All', 'Necklace', 'Earrings', 'Bracelet', 'Rings'];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/products');
        setProducts(data);
        setFilteredProducts(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categoryParam = params.get('category');
    if (categoryParam) {
      setSelectedCategory(categoryParam.charAt(0).toUpperCase() + categoryParam.slice(1).toLowerCase());
    }
  }, [location]);

  useEffect(() => {
    let result = products;

    // Category Filter
    if (selectedCategory !== 'All') {
      result = result.filter(p => p.category.toLowerCase() === selectedCategory.toLowerCase());
    }

    // Search Filter
    if (searchQuery) {
      result = result.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }

    // Price Filter
    // Assuming price is a number. If string, need parsing.
    // result = result.filter(p => p.price <= priceRange);

    setFilteredProducts(result);
  }, [products, selectedCategory, searchQuery, priceRange]);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    if (category === 'All') {
      navigate('/shop');
    } else {
      navigate(`/shop?category=${category}`);
    }
  };

  const addToCart = async (e, productId) => {
    e.preventDefault(); // Prevent navigating to product details
    e.stopPropagation();
    
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (!userInfo) {
      navigate('/login?redirect=/shop');
      return;
    }

    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      await axios.post('http://localhost:5000/api/cart', { productId, quantity: 1 }, config);
      navigate('/cart');
    } catch (error) {
      alert('Failed to add to cart');
    }
  };

  return (
    <div className="min-h-screen bg-white pt-20">
      {/* Header */}
      <div className="bg-rose-50 py-16 px-6 text-center">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-serif text-gray-900 mb-4"
        >
          {selectedCategory === 'All' ? 'Our Collection' : `${selectedCategory} Collection`}
        </motion.h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Discover our handcrafted jewelry designed to elevate your everyday style.
        </p>
      </div>

      <div className="container mx-auto px-6 py-12 flex flex-col md:flex-row gap-12">
        {/* Sidebar / Filters */}
        <div className="w-full md:w-1/4 space-y-8">
          <div>
            <h3 className="text-lg font-serif font-bold mb-4 flex items-center gap-2">
              <FaFilter className="text-rose-500" /> Categories
            </h3>
            <ul className="space-y-3">
              {categories.map(cat => (
                <li key={cat}>
                  <button 
                    onClick={() => handleCategoryClick(cat)}
                    className={`text-lg transition-colors ${selectedCategory === cat ? 'text-rose-500 font-bold' : 'text-gray-600 hover:text-rose-500'}`}
                  >
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-serif font-bold mb-4 flex items-center gap-2">
              <FaSearch className="text-rose-500" /> Search
            </h3>
            <input 
              type="text" 
              placeholder="Search products..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-rose-500"
            />
          </div>
        </div>

        {/* Product Grid */}
        <div className="w-full md:w-3/4">
          {loading ? (
            <div className="text-center py-20">Loading...</div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-20 text-gray-500">No products found.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map(product => (
                <Link to={`/product/${product._id}`} key={product._id} className="group">
                  <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
                    <div className="relative aspect-square overflow-hidden bg-gray-100">
                      <img 
                        src={product.images[0] || 'https://via.placeholder.com/300'} 
                        alt={product.name} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                      
                      {/* Quick Add Button */}
                      <button 
                        onClick={(e) => addToCart(e, product._id)}
                        className="absolute bottom-4 right-4 bg-white text-gray-900 p-3 rounded-full shadow-lg opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:bg-rose-500 hover:text-white"
                        title="Add to Cart"
                      >
                        <FaShoppingCart />
                      </button>
                    </div>
                    
                    <div className="p-4 text-center">
                      <h3 className="font-serif text-lg text-gray-900 group-hover:text-rose-500 transition-colors mb-1">
                        {product.name}
                      </h3>
                      <p className="text-gray-500 text-sm mb-2">{product.category}</p>
                      <p className="text-xl font-medium text-gray-900">Rs. {product.price}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Shop;
