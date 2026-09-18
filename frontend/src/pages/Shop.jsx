import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useLocation, useNavigate, Link, useParams } from 'react-router-dom';
import SEO from '../components/SEO';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FaFilter, FaSearch, FaShoppingCart, FaTimes, FaCheck, FaChevronLeft, FaChevronRight, FaStar, FaChevronDown } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { useCart } from '../components/CartContext';


// Category slug & normalization helpers to support singular and plural seamlessly
const normalizeCategory = (cat) => {
  if (!cat || cat.toLowerCase() === 'all') return 'All';
  const lower = cat.toLowerCase().trim();
  if (lower === 'necklaces' || lower === 'necklace') return 'Necklace';
  if (lower === 'bracelets' || lower === 'bracelet') return 'Bracelet';
  if (lower === 'earrings' || lower === 'earring') return 'Earrings';
  if (lower === 'combos' || lower === 'combo') return 'Combos';
  if (lower === 'apparel' || lower === 'apparels') return 'Apparel';
  return cat.charAt(0).toUpperCase() + cat.slice(1).toLowerCase();
};

const categoryToSlug = (cat) => {
  const map = {
    'Necklace': 'necklaces',
    'Bracelet': 'bracelets',
    'Earrings': 'earrings',
    'Combos': 'combos',
    'Apparel': 'apparel'
  };
  return map[cat] || cat.toLowerCase();
};

// Custom Hook: Synchronize URL params with state (prevents race conditions)
const useURLSync = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { category: pathCategory, aesthetic: pathAesthetic } = useParams();
  
  const getURLParams = useCallback(() => {
    const params = new URLSearchParams(location.search);
    let cat = params.get('category') || pathCategory;
    return {
      category: normalizeCategory(cat),
      aesthetic: pathAesthetic || params.get('aesthetic') || null,
      page: Math.max(1, parseInt(params.get('page') || '1', 10)),
      tags: params.get('tags') ? params.get('tags').split(',').map(t => t.trim()) : [],
      sortBy: params.get('sort') || 'relevance',
      searchQuery: params.get('search') || '',
      priceRange: params.get('maxPrice') ? parseInt(params.get('maxPrice'), 10) : 10000,
      showInStock: params.get('inStock') !== 'false'
    };
  }, [location.search, pathCategory, pathAesthetic]);


  const updateURLParams = useCallback((newParams) => {
    const params = new URLSearchParams();
    if (newParams.page && newParams.page > 1) params.set('page', newParams.page);
    if (newParams.tags && newParams.tags.length > 0) {
      params.set('tags', newParams.tags.join(','));
    }
    if (newParams.sortBy && newParams.sortBy !== 'relevance') params.set('sort', newParams.sortBy);
    if (newParams.searchQuery && newParams.searchQuery.trim() !== '') params.set('search', newParams.searchQuery);
    if (newParams.priceRange && newParams.priceRange < 10000) params.set('maxPrice', newParams.priceRange);
    if (newParams.showInStock === false) params.set('inStock', 'false');
    
    let basePath = '/shop';
    if (newParams.aesthetic) {
      basePath = `/shop/collection/${newParams.aesthetic.toLowerCase()}`;
    } else if (newParams.category && newParams.category !== 'All') {
      basePath = `/shop/${categoryToSlug(newParams.category)}`;
    }
    navigate(`${basePath}${params.toString() ? '?' + params.toString() : ''}`, { replace: true });
  }, [navigate]);


  return { getURLParams, updateURLParams, location };
};


const Shop = () => {
  const { getURLParams, updateURLParams } = useURLSync();
  const initialParams = getURLParams();

  const [currentPage, setCurrentPage] = useState(initialParams.page);
  const ITEMS_PER_PAGE = 12;


  const [products, setProducts] = useState([]);
  const [topBestsellerIds, setTopBestsellerIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(initialParams.category);
  const [selectedAesthetic, setSelectedAesthetic] = useState(initialParams.aesthetic);
  const [selectedTags, setSelectedTags] = useState(initialParams.tags);
  const [searchQuery, setSearchQuery] = useState(initialParams.searchQuery);
  const [priceRange, setPriceRange] = useState(initialParams.priceRange);
  const [showInStock, setShowInStock] = useState(initialParams.showInStock);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState(initialParams.sortBy);
  const [totalPages, setTotalPages] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);
  const [openFaqIndex, setOpenFaqIndex] = useState(null);
  const navigate = useNavigate();
  const { addToCart: contextAddToCart } = useCart();
  const categories = ['All', 'Necklace', 'Earrings', 'Bracelet', 'Combos', 'Apparel'];
  
  // Use refs to prevent race conditions
  const abortControllerRef = useRef(null);
  const lastFetchParamsRef = useRef(null);


  // Memoized fetch params to prevent unnecessary refetches
  const fetchParams = useMemo(() => ({
    currentPage,
    selectedCategory,
    selectedAesthetic,
    selectedTags,
    searchQuery,
    priceRange,
    showInStock,
    sortBy,
  }), [currentPage, selectedCategory, selectedAesthetic, selectedTags, searchQuery, priceRange, showInStock, sortBy]);


  // OPTIMIZED: Fetch products with proper async handling
  const fetchProducts = useCallback(async () => {
    // Cancel previous request if still pending
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();


    setLoading(true);
    try {
      const paramKey = JSON.stringify(fetchParams);
      lastFetchParamsRef.current = paramKey;


      if (selectedTags.includes('bestseller')) {
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/products/bestsellers`,
          { signal: abortControllerRef.current.signal }
        );


        // AbortController ensures this is the latest request, no need for strict paramKey matching
        const safeProducts = Array.isArray(data.products) ? data.products : [];
        setProducts(safeProducts);
        setTotalPages(1);
        setTotalProducts(safeProducts.length);
        setLoading(false);
      } else {
        const params = new URLSearchParams();
        params.set('page', currentPage);
        params.set('limit', ITEMS_PER_PAGE);


        if (selectedCategory !== 'All') {
          params.set('category', categoryToSlug(selectedCategory));
        }
        if (selectedAesthetic) {
          params.set('aesthetics', selectedAesthetic.toLowerCase());
        }
        if (selectedTags.length > 0) {
          params.set('tags', selectedTags.join(','));
        }
        if (searchQuery.trim()) {
          params.set('keyword', searchQuery);
        }
        if (priceRange < 10000) {
          params.set('maxPrice', priceRange);
        }
        if (showInStock) {
          params.set('inStock', 'true');
        }
        if (sortBy !== 'relevance') {
          params.set('sort', sortBy);
        }


        const { data } = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/products?${params.toString()}`,
          { signal: abortControllerRef.current.signal }
        );


        // AbortController ensures this is the latest request, no need for strict paramKey matching
        const safeProducts = Array.isArray(data.products) ? data.products : [];
        setProducts(safeProducts);
        setTotalPages(data.pages || 1);
        setTotalProducts(data.total || 0);
        setLoading(false);
      }
    } catch (error) {
      // FIXED: Properly ignore AbortError/CanceledError
      if (axios.isCancel(error) || error.name === 'AbortError' || error.code === 'ERR_CANCELED') {
        // Request was cancelled, don't show error
        return;
      }
      
      console.error('Error fetching products:', error);
      setProducts([]);
      setTotalPages(0);
      setTotalProducts(0);
      toast.error('Failed to load products');
      setLoading(false);
    }
  }, [currentPage, selectedCategory, searchQuery, priceRange, showInStock, selectedTags, sortBy, fetchParams]);


  // Fetch when filter dependencies change
  useEffect(() => {
    fetchProducts();
  }, [fetchParams]);


  // Handle URL synchronization on mount and location change
  useEffect(() => {
    const fetchTopBestsellers = async () => {
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/products/top-bestsellers`);
        if (Array.isArray(data)) {
          setTopBestsellerIds(data);
        }
      } catch (error) {
        console.error('Failed to fetch top bestsellers:', error);
      }
    };
    fetchTopBestsellers();
  }, []);

  useEffect(() => {
    const urlParams = getURLParams();
    
    // Only update state if URL params differ from current state
    if (urlParams.category !== selectedCategory) {
      setSelectedCategory(urlParams.category);
    }
    if (urlParams.page !== currentPage) {
      setCurrentPage(urlParams.page);
    }
    if (JSON.stringify(urlParams.tags) !== JSON.stringify(selectedTags)) {
      setSelectedTags(urlParams.tags);
    }
    if (urlParams.sortBy !== sortBy) setSortBy(urlParams.sortBy);
    if (urlParams.searchQuery !== searchQuery) setSearchQuery(urlParams.searchQuery);
    if (urlParams.priceRange !== priceRange) setPriceRange(urlParams.priceRange);
    if (urlParams.showInStock !== showInStock) setShowInStock(urlParams.showInStock);
  }, [getURLParams]);


  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
    setShowFilters(false);
    updateURLParams({ category, page: 1, tags: selectedTags, sortBy, searchQuery, priceRange, showInStock });
  };


  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      updateURLParams({ category: selectedCategory, page: newPage, tags: selectedTags, sortBy, searchQuery, priceRange, showInStock });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };


  const handleBestsellersToggle = () => {
    const newTags = selectedTags.includes('bestseller')
      ? selectedTags.filter(t => t !== 'bestseller')
      : [...selectedTags, 'bestseller'];
    setSelectedTags(newTags);
    setCurrentPage(1);
    updateURLParams({ category: selectedCategory, page: 1, tags: newTags, sortBy, searchQuery, priceRange, showInStock });
  };


  const handleAddToCart = async (e, productId) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      await contextAddToCart(productId, 1);
      toast.success('Added to cart!');
    } catch (error) {
      console.error('Add to cart error:', error);
      toast.error('Failed to add to cart');
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


    if (products.length === 0) {
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
                setSelectedTags([]);
                setSortBy('relevance');
                setShowInStock(true);
                setPriceRange(10000);
                setCurrentPage(1);
                updateURLParams({ category: 'All', page: 1, tags: [], sortBy: 'relevance', searchQuery: '', priceRange: 10000, showInStock: true });
              }}
              className="bg-rose-500 text-white px-6 md:px-8 py-2 md:py-3 rounded-lg font-medium hover:bg-rose-600 transition-colors text-sm md:text-base"
            >
              Clear Filters
            </button>
          </motion.div>
        </div>
      );
    }


    return products.map((product, index) => (
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
              src={product.images?.[0] || 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'300\' height=\'300\' viewBox=\'0 0 300 300\'%3E%3Crect fill=\'%23f3f4f6\' width=\'300\' height=\'300\'/%3E%3Ctext fill=\'%239ca3af\' font-family=\'sans-serif\' font-size=\'24\' dy=\'10.5\' font-weight=\'bold\' x=\'50%25\' y=\'50%25\' text-anchor=\'middle\'%3ENo Image%3C/text%3E%3C/svg%3E'}
              alt={`${product.name || 'Product'} - Anti-Tarnish Premium Jewelry`}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              loading={index < 4 ? "eager" : "lazy"}
              fetchpriority={index < 2 ? "high" : "auto"}
              decoding="async"
              onError={(e) => {
                e.target.src = 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'300\' height=\'300\' viewBox=\'0 0 300 300\'%3E%3Crect fill=\'%23f3f4f6\' width=\'300\' height=\'300\'/%3E%3Ctext fill=\'%239ca3af\' font-family=\'sans-serif\' font-size=\'24\' dy=\'10.5\' font-weight=\'bold\' x=\'50%25\' y=\'50%25\' text-anchor=\'middle\'%3ENo Image%3C/text%3E%3C/svg%3E';
              }}
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />


            <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
              {product.stock === 0 && (
                <div className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-sm w-max">
                  Out of Stock
                </div>
              )}

              {/* Bestseller Badge */}
              {topBestsellerIds.includes(product._id) && (
                <div className="bg-black/80 backdrop-blur-sm text-white px-3 py-1.5 rounded-sm text-[10px] font-bold uppercase tracking-widest shadow-sm flex items-center gap-1.5 border border-white/10 w-max">
                  <FaStar className="text-yellow-400 w-2.5 h-2.5" /> Best Seller
                </div>
              )}
            </div>


            <button
              onClick={(e) => handleAddToCart(e, product._id)}
              className="absolute bottom-3 right-3 md:bottom-4 md:right-4 bg-white text-gray-900 p-2 md:p-3 rounded-full shadow-lg opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:bg-rose-500 hover:text-white hover:shadow-xl"
              title="Add to Cart"
              disabled={product.stock === 0}
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
              INR {product.price?.toLocaleString() || 0}
            </p>
          </div>
        </motion.div>
      </Link>
    ));
  };


  const renderPagination = () => {
    if (totalPages <= 1) return null;


    const pageNumbers = [];
    const maxVisible = 5;


    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);


    if (endPage - startPage < maxVisible - 1) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }


    if (startPage > 1) {
      pageNumbers.push(1);
      if (startPage > 2) pageNumbers.push('...');
    }


    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }


    if (endPage < totalPages) {
      if (endPage < totalPages - 1) pageNumbers.push('...');
      pageNumbers.push(totalPages);
    }


    const getPageUrl = (pageNum) => {
      const params = new URLSearchParams(window.location.search);
      params.set('page', pageNum);
      return `/shop${window.location.search ? '?' + params.toString() : '?page=' + pageNum}`;
    };

    return (
      <div className="flex items-center justify-center gap-2 mt-8 flex-wrap">
        {currentPage === 1 ? (
          <button
            disabled
            className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <FaChevronLeft className="w-4 h-4" />
          </button>
        ) : (
          <Link
            to={getPageUrl(currentPage - 1)}
            onClick={(e) => { e.preventDefault(); handlePageChange(currentPage - 1); }}
            className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition-colors inline-flex items-center"
            title="Previous page"
          >
            <FaChevronLeft className="w-4 h-4" />
          </Link>
        )}


        {pageNumbers.map((num, idx) => {
          if (num === '...') {
            return (
              <span key={idx} className="px-3 py-2 text-gray-500 cursor-default">
                ...
              </span>
            );
          }
          return (
            <Link
              key={idx}
              to={getPageUrl(num)}
              onClick={(e) => { e.preventDefault(); handlePageChange(num); }}
              className={`
                px-3 py-2 rounded-lg font-medium transition-colors inline-flex items-center justify-center
                ${num === currentPage
                ? 'bg-rose-500 text-white'
                : 'border border-gray-300 hover:bg-rose-50 hover:border-rose-500'
              }
              `}
            >
              {num}
            </Link>
          );
        })}


        {currentPage === totalPages ? (
          <button
            disabled
            className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <FaChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <Link
            to={getPageUrl(currentPage + 1)}
            onClick={(e) => { e.preventDefault(); handlePageChange(currentPage + 1); }}
            className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition-colors inline-flex items-center"
            title="Next page"
          >
            <FaChevronRight className="w-4 h-4" />
          </Link>
        )}
      </div>
    );
  };


  const seoTitles = {
    'All': 'Anti-Tarnish Waterproof Jewelry & Chic Women\'s Apparel | Sera Store',
    'Necklace': 'Anti-Tarnish Waterproof Necklaces & Pendants | Sera',
    'Earrings': 'Waterproof Anti-Tarnish Earrings, Hoops & Studs | Sera',
    'Bracelet': 'Waterproof Anti-Tarnish Bracelets & Cuffs | Sera',
    'Combos': 'Curated Jewelry Combo Sets & Gift Bundles | Sera',
    'Apparel': 'Chic Women\'s Tops & Breathable Cotton Blend Apparel | Sera'
  };

  const seoDescriptions = {
    'All': "Explore Sera's collection of waterproof anti-tarnish jewelry, chic women's tops, matching jewelry combos, and curated gift boxes. Designed for effortless everyday wear.",
    'Necklace': "Discover elegant anti-tarnish necklaces, dainty pendants, and layered chains. Waterproof and sweatproof, crafted for daily wear without fading.",
    'Earrings': "Shop lightweight waterproof earrings made for everyday wear. From classic hoops to delicate studs and drop earrings, find your signature pair.",
    'Bracelet': "Stack and style with durable, waterproof bracelets and cuffs. Sweatproof and tarnish-resistant for all-day wear.",
    'Combos': "Curated matching jewelry combo sets and bundles. Beautifully paired necklaces, earrings, and bracelets at bundle prices—perfect gifts for her.",
    'Apparel': "Shop chic women's tops and everyday clothes crafted from breathable, premium cotton blend fabrics. Effortless silhouettes designed for daily comfort and timeless grace."
  };

  const categoryFaqs = {
    'Earrings': [
      {
        question: "Are Sera earrings waterproof and sweatproof?",
        answer: "Yes, all Sera earrings are crafted to be fully waterproof and sweatproof. You can wear them through workouts, showers, and daily routines without tarnishing."
      },
      {
        question: "What styles of earrings does Sera offer?",
        answer: "Our collection features lightweight hoops, minimalist studs, huggies, and elegant drop earrings designed for all-day comfort."
      },
      {
        question: "How do I care for anti-tarnish earrings?",
        answer: "Simply wipe with a soft dry cloth after wearing and store in a clean pouch to keep them shining like new."
      }
    ],
    'Necklace': [
      {
        question: "Can I wear Sera necklaces every day?",
        answer: "Yes, our anti-tarnish necklaces are designed specifically for daily wear and layering. They maintain their luster through sweat and moisture."
      },
      {
        question: "How do I keep layered necklaces from tangling?",
        answer: "Layer necklaces of different lengths (such as 14, 16, and 18 inches) and mix chain textures to prevent twisting."
      },
      {
        question: "Do necklaces include adjustable extenders?",
        answer: "Most of our necklaces feature built-in extender chains so you can adjust the drop length for any neckline."
      }
    ],
    'Bracelet': [
      {
        question: "Are Sera bracelets resistant to water?",
        answer: "Yes, our bracelets are waterproof and sweatproof, making them safe for hand washing, gym sessions, and daily wear."
      },
      {
        question: "How should I style stackable bracelets?",
        answer: "Pair delicate chain bracelets with structured cuffs for an effortless, chic layered look."
      }
    ],
    'Combos': [
      {
        question: "What is included in a Sera Jewelry Combo Set?",
        answer: "Each combo set features matching, complementary pieces—such as matching necklaces, earrings, and bracelets—curated together at bundle savings."
      },
      {
        question: "Are jewelry combos suitable for gifting?",
        answer: "Yes, our curated combos are customer favorites for birthdays, anniversaries, and special celebrations, complete with optional gift cards and notes."
      }
    ],
    'Apparel': [
      {
        question: "What fabrics are used in Sera women's tops?",
        answer: "Our apparel is crafted from premium, breathable cotton blend fabrics that provide soft touch, gentle stretch, and all-day comfort."
      },
      {
        question: "How do I find my size in Sera tops?",
        answer: "Refer to our interactive Size Guide for detailed bust and length measurements across standard sizes."
      },
      {
        question: "How should I wash Sera cotton blend tops?",
        answer: "Machine wash on gentle cold cycle with similar colors and hang dry to maintain fabric softness and shape."
      }
    ],
    'All': [
      {
        question: "What makes Sera products unique?",
        answer: "Sera unites durable anti-tarnish, waterproof jewelry with chic, breathable women's fashion and curated gift combos for effortless everyday style."
      },
      {
        question: "Does Sera offer free delivery across India?",
        answer: "Yes, all orders above INR 999 automatically qualify for Free Shipping everywhere in India."
      },
      {
        question: "Can I add a personalized gift message to my order?",
        answer: "Yes, during checkout you can include a custom greeting card and heartfelt note for your recipient."
      }
    ]
  };

  const currentFaqs = categoryFaqs[selectedCategory] || categoryFaqs['All'];

  return (
    <div className="min-h-screen bg-white pt-16 md:pt-20">
      <SEO 
        title={seoTitles[selectedCategory] || seoTitles['All']}
        description={seoDescriptions[selectedCategory] || seoDescriptions['All']}
        canonicalUrl={`https://www.serastore.in/shop${selectedCategory === 'All' ? '' : '/' + categoryToSlug(selectedCategory)}`}
        schema={[
          {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": selectedCategory === 'All' ? 'Shop All Collections' : `${selectedCategory} Collection`,
            "description": seoDescriptions[selectedCategory] || seoDescriptions['All'],
            "url": `https://www.serastore.in/shop${selectedCategory === 'All' ? '' : '/' + categoryToSlug(selectedCategory)}`
          },
          {
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
              ...(selectedCategory !== 'All' ? [{
                "@type": "ListItem",
                "position": 3,
                "name": selectedCategory,
                "item": `https://www.serastore.in/shop/${categoryToSlug(selectedCategory)}`
              }] : [])
            ]
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": currentFaqs.map((faq) => ({
              "@type": "Question",
              "name": faq.question,
              "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer
              }
            }))
          }
        ]}
      />
      {/* Visual Breadcrumb Trail */}
      <nav aria-label="Breadcrumb" className="bg-rose-50 px-4 md:px-6 pt-6 -mb-4 text-sm text-gray-500 font-medium">
        <ol className="flex items-center space-x-2 max-w-7xl mx-auto">
          <li>
            <Link to="/" className="hover:text-rose-500 transition-colors">Home</Link>
          </li>
          <li><span className="text-gray-300">/</span></li>
          {selectedCategory === 'All' ? (
            <li className="text-gray-900" aria-current="page">Shop</li>
          ) : (
            <>
              <li>
                <Link to="/shop" className="hover:text-rose-500 transition-colors">Shop</Link>
              </li>
              <li><span className="text-gray-300">/</span></li>
              <li className="text-gray-900" aria-current="page">{selectedCategory}</li>
            </>
          )}
        </ol>
      </nav>

      {/* Header */}
      <div className="bg-rose-50 py-8 md:py-16 px-4 md:px-6 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl md:text-4xl lg:text-5xl font-serif text-gray-900 mb-2 md:mb-4"
        >
          {selectedTags.includes('bestseller') ? '⭐ Bestsellers' : selectedCategory === 'All' ? 'Our Collection' : `${selectedCategory} Collection`}
        </motion.h1>
        {selectedTags.length > 0 && (
          <p className="text-rose-500 font-medium mb-2 uppercase tracking-wide text-sm">
            Filtered by: {selectedTags.join(', ')}
          </p>
        )}
        <p className="text-sm md:text-base text-gray-600 max-w-2xl mx-auto px-4">
          Discover our handcrafted jewelry designed to elevate your everyday style.
        </p>
      </div>


      <div className="container mx-auto px-4 md:px-6 py-6 md:py-12">
        {/* Mobile Filter Button */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          aria-label={showFilters ? "Close filters" : "Open filters"}
          aria-expanded={showFilters}
          className="lg:hidden fixed bottom-6 right-6 z-40 bg-rose-500 text-white p-4 rounded-full shadow-lg hover:bg-rose-600 transition-colors"
        >
          {showFilters ? <FaTimes className="w-5 h-5" /> : <FaFilter className="w-5 h-5" />}
        </button>


        <div className="flex flex-col lg:flex-row gap-6 md:gap-12">
          {/* Sidebar / Filters */}
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
                <button
                  onClick={() => setShowFilters(false)}
                  className="lg:hidden absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                >
                  <FaTimes className="w-6 h-6" />
                </button>


                {/* Categories */}
                <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border mt-12 lg:mt-0">
                  <h3 className="text-base md:text-lg font-serif font-bold mb-4 md:mb-6 flex items-center gap-2">
                    <FaFilter className="text-rose-500" /> Categories
                  </h3>
                  <ul className="space-y-2 md:space-y-3">
                    {categories.map(cat => (
                      <li key={cat}>
                        <button
                          onClick={() => handleCategoryClick(cat)}
                          disabled={selectedTags.includes('bestseller')}
                          className={`w-full text-left py-2 px-3 md:px-4 rounded-lg transition-colors text-sm md:text-base font-medium ${
                            selectedCategory === cat
                              ? 'bg-rose-500 text-white shadow-md'
                              : 'text-gray-600 hover:bg-rose-50 hover:text-rose-500'
                          } ${selectedTags.includes('bestseller') ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          {cat}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>


                {/* Stock Filter */}
                <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border">
                  <h3 className="text-base md:text-lg font-serif font-bold mb-4 md:mb-6 flex items-center gap-2">
                    <FaCheck className="text-rose-500" /> Availability
                  </h3>
                  <label className="flex items-center gap-3 cursor-pointer group select-none">
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={showInStock}
                        onChange={(e) => {
                          const newInStock = e.target.checked;
                          setShowInStock(newInStock);
                          setCurrentPage(1);
                          updateURLParams({ category: selectedCategory, page: 1, tags: selectedTags, sortBy, searchQuery, priceRange, showInStock: newInStock });
                        }}
                        disabled={selectedTags.includes('bestseller')}
                        className="sr-only peer"
                      />
                      <div className={`w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-500 ${selectedTags.includes('bestseller') ? 'opacity-50' : ''}`}></div>
                    </div>
                    <span className={`text-gray-700 font-medium group-hover:text-rose-600 transition-colors ${selectedTags.includes('bestseller') ? 'opacity-50' : ''}`}>
                      In Stock Only
                    </span>
                  </label>
                </div>


                {/* Bestseller Toggle */}
                <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border">
                  <h3 className="text-base md:text-lg font-serif font-bold mb-4 md:mb-6 flex items-center gap-2">
                    <FaStar className="text-rose-500" /> Bestsellers
                  </h3>
                  <label className="flex items-center gap-3 cursor-pointer group select-none">
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={selectedTags.includes('bestseller')}
                        onChange={handleBestsellersToggle}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-500"></div>
                    </div>
                    <span className="text-gray-700 font-medium group-hover:text-rose-600 transition-colors">
                      Show Bestsellers Only
                    </span>
                  </label>
                </div>


                {/* Sort By Dropdown */}
                <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border">
                  <h3 className="text-base md:text-lg font-serif font-bold mb-4 md:mb-6 flex items-center gap-2">
                    <FaFilter className="text-rose-500" /> Sort By
                  </h3>
                  <select
                    value={sortBy}
                    onChange={(e) => {
                      const newSort = e.target.value;
                      setSortBy(newSort);
                      setCurrentPage(1);
                      updateURLParams({ category: selectedCategory, page: 1, tags: selectedTags, sortBy: newSort, searchQuery, priceRange, showInStock });
                    }}
                    disabled={selectedTags.includes('bestseller')}
                    className="w-full border border-gray-300 rounded-lg px-3 md:px-4 py-2 md:py-3 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 text-sm md:text-base bg-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <option value="relevance">Relevance</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="newest">Newest First</option>
                    <option value="best-selling">Best Selling</option>
                  </select>
                </div>


                {/* Search */}
                <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border">
                  <h3 className="text-base md:text-lg font-serif font-bold mb-4 md:mb-6 flex items-center gap-2">
                    <FaSearch className="text-rose-500" /> Search
                  </h3>
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => {
                      const newSearch = e.target.value;
                      setSearchQuery(newSearch);
                      setCurrentPage(1);
                      updateURLParams({ category: selectedCategory, page: 1, tags: selectedTags, sortBy, searchQuery: newSearch, priceRange, showInStock });
                    }}
                    disabled={selectedTags.includes('bestseller')}
                    className="w-full border border-gray-300 rounded-lg px-3 md:px-4 py-2 md:py-3 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 text-sm md:text-base disabled:opacity-50 disabled:cursor-not-allowed"
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
                {selectedTags.includes('bestseller')
                  ? `Showing ${products.length} top-selling products`
                  : `Showing ${products.length > 0 ? ((currentPage - 1) * ITEMS_PER_PAGE) + 1 : 0}–${Math.min(currentPage * ITEMS_PER_PAGE, totalProducts)} of ${totalProducts} products`
                }
              </div>
            </div>


            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
              {renderProducts()}
            </div>


            {!selectedTags.includes('bestseller') && renderPagination()}

            {/* SEO Buying Guide & FAQ Section */}
            <div className="mt-16 pt-8 border-t border-gray-100 pb-12">
              <div className="bg-rose-50/50 rounded-2xl p-6 md:p-8 border border-rose-100/60 mb-8">
                <h2 className="text-xl md:text-2xl font-serif text-gray-900 mb-3">
                  {selectedCategory === 'All'
                    ? 'Anti-Tarnish Waterproof Jewelry & Women\'s Everyday Fashion'
                    : selectedCategory === 'Apparel'
                    ? 'Chic Women\'s Tops & Breathable Cotton Blend Apparel'
                    : selectedCategory === 'Combos'
                    ? 'Matching Jewelry Combo Sets & Gift Bundles for Her'
                    : `Anti-Tarnish Waterproof ${selectedCategory} for Daily Wear`}
                </h2>
                <p className="text-gray-600 text-sm md:text-base leading-relaxed mb-4">
                  {seoDescriptions[selectedCategory] || seoDescriptions['All']}
                </p>
                <p className="text-gray-500 text-xs md:text-sm leading-relaxed">
                  {selectedCategory === 'Apparel'
                    ? 'Each piece in our apparel collection is thoughtfully tailored from soft cotton blend fabrics to blend effortlessly into your daily wardrobe—from casual brunch to evening outings.'
                    : selectedCategory === 'Combos'
                    ? 'Our matching sets take the guesswork out of styling. Designed as coordinated pairs of necklaces, earrings, and bracelets, they make meaningful, memorable gifts for her.'
                    : 'Crafted for active lifestyles and effortless elegance, our anti-tarnish waterproof pieces stay bright and durable through showers, workouts, and busy days without fading.'}
                </p>
              </div>

              {/* FAQ Accordion */}
              <div className="space-y-3">
                <h3 className="font-serif text-lg md:text-xl font-medium text-gray-900 mb-4">
                  Frequently Asked Questions
                </h3>
                {currentFaqs.map((faq, idx) => {
                  const isOpen = openFaqIndex === idx;
                  return (
                    <div
                      key={idx}
                      className="border border-gray-200 rounded-xl overflow-hidden transition-colors bg-white"
                    >
                      <button
                        type="button"
                        onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                        className="w-full flex items-center justify-between p-4 md:p-5 text-left text-sm md:text-base font-medium text-gray-900 hover:text-rose-600 transition-colors"
                      >
                        <span>{faq.question}</span>
                        <FaChevronDown
                          className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 flex-shrink-0 ml-3 ${
                            isOpen ? 'rotate-180 text-rose-500' : ''
                          }`}
                        />
                      </button>
                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="px-4 pb-4 md:px-5 md:pb-5 pt-0 text-xs md:text-sm text-gray-600 leading-relaxed border-t border-gray-50">
                              {faq.answer}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};


export default Shop;