import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function SearchOverlay({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    if (isOpen) {
      // Fetch products when overlay opens
      const fetchProducts = async () => {
        try {
          const { data } = await axios.get('http://localhost:5000/api/products');
          setProducts(data);
        } catch (error) {
          console.error('Error fetching products for search:', error);
        }
      };
      fetchProducts();
    }
  }, [isOpen]);

  useEffect(() => {
    if (query.trim() === '') {
      setFilteredProducts([]);
    } else {
      const lowerQuery = query.toLowerCase();
      const filtered = products.filter(p => 
        p.name.toLowerCase().includes(lowerQuery) || 
        p.category.toLowerCase().includes(lowerQuery)
      );
      setFilteredProducts(filtered);
    }
  }, [query, products]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 bg-black/50 z-[60] flex items-start justify-center pt-24"
            onClick={onClose}
        >
            <div 
                className="bg-white p-6 w-full max-w-2xl rounded-lg shadow-lg max-h-[80vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                <input 
                    type="text" 
                    placeholder="Search for Necklace, Rings..." 
                    className="w-full border-b border-gray-300 p-2 text-xl font-serif focus:outline-none focus:border-rose-500 mb-4"
                    autoFocus
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />

                {/* Results */}
                <div className="space-y-4">
                  {filteredProducts.length > 0 ? (
                    filteredProducts.map(product => (
                      <div key={product._id} className="flex items-center gap-4 border-b border-gray-100 pb-2 hover:bg-rose-50 p-2 rounded cursor-pointer">
                        <img 
                          src={product.images[0] || 'https://via.placeholder.com/50'} 
                          alt={product.name} 
                          className="w-12 h-12 object-cover rounded" 
                        />
                        <div>
                          <h4 className="font-serif text-lg">{product.name}</h4>
                          <p className="text-gray-500 text-sm">Rs {product.price}</p>
                        </div>
                      </div>
                    ))
                  ) : query !== '' ? (
                    <p className="text-gray-500 text-center">No products found.</p>
                  ) : null}
                </div>
            </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
