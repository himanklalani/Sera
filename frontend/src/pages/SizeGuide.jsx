import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaRulerCombined, FaTshirt, FaGem } from 'react-icons/fa';

const SizeGuide = () => {
  const [unit, setUnit] = useState('in');

  const apparelData = [
    { name: 'Bust', sizes: [32, 34, 36, 38] },
    { name: 'Under Bust', sizes: [27, 29, 31, 33] },
    { name: 'Waist', sizes: [24, 26, 28, 30] },
    { name: 'High Hip', sizes: [32, 34, 36, 38] },
    { name: 'Shoulder', sizes: [13, 13.5, 14, 14.5] },
    { name: 'Armhole', sizes: [15, 16, 17, 18] },
  ];

  // Helper to format values elegantly
  const formatSize = (valInches) => {
    if (unit === 'in') return `${valInches}”`;
    return `${Math.round(valInches * 2.54)}`;
  };

  return (
    <div className="min-h-screen bg-rose-50/30 text-gray-900 pt-32 pb-24">
      <SEO
        title="Size & Fit Guide | Free Size Jewelry & Apparel Sizing | Sera"
        description="Comprehensive Sera sizing guide: All jewelry and accessories are Anti-Tarnish, Waterproof, and Free Size (universal fit for all). Apparel available in XS, S, M, L."
        canonicalUrl="https://www.serastore.in/size-guide"
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16"
        >
          <span className="text-xs font-bold uppercase tracking-widest text-rose-600 bg-rose-100/60 px-4 py-1.5 rounded-full inline-block mb-4">
            Fit & Measurements Guide
          </span>
          <h1 className="text-4xl md:text-6xl font-serif mb-6 tracking-wide text-gray-900 leading-none">
            Size & Fit Guide
          </h1>
          <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto font-light tracking-wide leading-relaxed">
            All Sera jewelry & accessories are universal <strong>Free Size</strong> designed to fit everyone effortlessly. Our chic apparel collection features tailored sizing (XS to L).
          </p>
        </motion.div>

        {/* PILLAR 1: JEWELRY & ACCESSORIES - FREE SIZE (ALL CAN FIT) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="mb-16 bg-white rounded-3xl p-8 md:p-12 border border-rose-100 shadow-xl"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center text-rose-600">
              <FaGem className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-serif font-bold text-gray-900">
                Jewelry & Accessories: Universal Free Size
              </h2>
              <p className="text-xs md:text-sm text-emerald-600 font-semibold flex items-center gap-1.5 mt-0.5">
                <FaCheckCircle className="w-3.5 h-3.5" /> All pieces are Free Size — all can fit comfortably!
              </p>
            </div>
          </div>

          <p className="text-gray-600 leading-relaxed mb-8 text-sm md:text-base">
            Every piece of jewelry and accessory at Sera is crafted to be <strong>anti-tarnish, waterproof, and sweatproof</strong> with adjustable, universal free-size engineering. You never need to worry about sizing when picking a piece for yourself or gifting to someone special.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-2xl bg-rose-50/40 border border-rose-100">
              <h3 className="font-bold text-gray-900 mb-2 font-serif text-lg">Waterproof Necklaces</h3>
              <p className="text-gray-600 text-xs md:text-sm leading-relaxed mb-3">
                All necklaces feature built-in 2-inch extension chain extenders, allowing you to easily adjust the drop from a collarbone choker (14"-16") to a relaxed chest layer (18"+).
              </p>
              <Link to="/shop/necklaces" className="text-xs font-bold text-rose-600 hover:underline">
                Explore Necklaces →
              </Link>
            </div>

            <div className="p-5 rounded-2xl bg-rose-50/40 border border-rose-100">
              <h3 className="font-bold text-gray-900 mb-2 font-serif text-lg">Tarnish-Resistant Bracelets</h3>
              <p className="text-gray-600 text-xs md:text-sm leading-relaxed mb-3">
                Engineered with flexible open cuff construction or multi-loop lobster clasps that comfortably fit both petite and fuller wrists without slipping or pinching.
              </p>
              <Link to="/shop/bracelets" className="text-xs font-bold text-rose-600 hover:underline">
                Explore Bracelets →
              </Link>
            </div>

            <div className="p-5 rounded-2xl bg-rose-50/40 border border-rose-100">
              <h3 className="font-bold text-gray-900 mb-2 font-serif text-lg">Anti-Tarnish Earrings & Combos</h3>
              <p className="text-gray-600 text-xs md:text-sm leading-relaxed mb-3">
                Hoops, huggies, studs, and curated combo sets are universal standard fit, ultra-lightweight, and comfortable for 24/7 all-day wear and gifting.
              </p>
              <Link to="/shop/combos" className="text-xs font-bold text-rose-600 hover:underline">
                Explore Combo Sets →
              </Link>
            </div>
          </div>
        </motion.div>

        {/* PILLAR 2: WOMEN'S APPAREL - SIZED CHART (XS, S, M, L) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-16"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center text-rose-600">
                <FaTshirt className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-serif font-bold text-gray-900">
                  Women's Apparel Sizing Chart
                </h2>
                <p className="text-xs md:text-sm text-gray-500">
                  Tailored sizes (XS, S, M, L) for our breathable cotton blend tops
                </p>
              </div>
            </div>

            {/* Unit Toggle */}
            <div className="bg-white p-1 rounded-full flex border border-gray-200 shadow-sm w-fit">
              <button 
                onClick={() => setUnit('in')}
                className={`px-6 py-2 rounded-full text-xs tracking-widest uppercase font-semibold transition-all duration-300 ${unit === 'in' ? 'bg-gray-900 text-white shadow-md' : 'text-gray-400 hover:text-gray-900'}`}
              >
                Inches
              </button>
              <button 
                onClick={() => setUnit('cm')}
                className={`px-6 py-2 rounded-full text-xs tracking-widest uppercase font-semibold transition-all duration-300 ${unit === 'cm' ? 'bg-gray-900 text-white shadow-md' : 'text-gray-400 hover:text-gray-900'}`}
              >
                CM
              </button>
            </div>
          </div>

          {/* Cinematic Table */}
          <div className="overflow-x-auto rounded-3xl border border-gray-100 bg-white shadow-xl">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="py-6 px-8 font-semibold text-base md:text-lg text-gray-900 tracking-wide">Measurement</th>
                  <th className="py-6 px-4 font-semibold text-base md:text-lg text-gray-900 text-center">XS</th>
                  <th className="py-6 px-4 font-semibold text-base md:text-lg text-gray-900 text-center">S</th>
                  <th className="py-6 px-4 font-semibold text-base md:text-lg text-gray-900 text-center">M</th>
                  <th className="py-6 px-4 font-semibold text-base md:text-lg text-gray-900 text-center">L</th>
                </tr>
              </thead>
              <tbody>
                {apparelData.map((row, idx) => (
                  <tr 
                    key={row.name} 
                    className={`transition-colors duration-300 hover:bg-rose-50/50 ${idx !== apparelData.length - 1 ? "border-b border-gray-50" : ""}`}
                  >
                    <td className="py-5 px-8 font-bold text-gray-800 text-sm md:text-base tracking-wide">{row.name}</td>
                    {row.sizes.map((size, i) => (
                      <td key={i} className="py-5 px-4 text-center text-gray-600 font-medium text-sm md:text-base tracking-wider">
                        {formatSize(size)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Strategy 4 Contextual Navigation Links */}
        <div className="mt-16 text-center space-y-6">
          <p className="text-gray-600 text-sm">
            Ready to explore? Find your look across our waterproof jewelry and tailored apparel collections.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              to="/shop/apparel" 
              className="inline-block bg-black text-white px-8 py-3 uppercase tracking-widest text-xs font-semibold hover:bg-rose-600 transition-colors"
            >
              Shop Women's Tops
            </Link>
            <Link 
              to="/shop/necklaces" 
              className="inline-block bg-white text-gray-900 border border-gray-300 px-8 py-3 uppercase tracking-widest text-xs font-semibold hover:border-rose-600 hover:text-rose-600 transition-colors"
            >
              Shop Waterproof Necklaces
            </Link>
            <Link 
              to="/shop/combos" 
              className="inline-block bg-white text-gray-900 border border-gray-300 px-8 py-3 uppercase tracking-widest text-xs font-semibold hover:border-rose-600 hover:text-rose-600 transition-colors"
            >
              Matching Jewelry Combos
            </Link>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default SizeGuide;
