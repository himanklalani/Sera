import React, { useState } from 'react';
import SEO from '../components/SEO';
import { motion } from 'framer-motion';

const SizeGuide = () => {
  const [unit, setUnit] = useState('in');

  const apparelData = [
    { name: 'Bust', sizes: [32, 34, 36, 38, 40] },
    { name: 'Under Bust', sizes: [27, 29, 31, 33, 35] },
    { name: 'Waist', sizes: [24, 26, 28, 30, 32] },
    { name: 'High Hip', sizes: [32, 34, 36, 38, 40] },
    { name: 'Shoulder', sizes: [13, 13.5, 14, 14.5, 15] },
    { name: 'Armhole', sizes: [15, 16, 17, 18, 19] },
  ];

  // Helper to format values elegantly
  const formatSize = (valInches) => {
    if (unit === 'in') return `${valInches}”`; // Using elegant curly quote for inches
    return `${Math.round(valInches * 2.54)}`; // Displaying just the number for CM
  };

  return (
    <div className="min-h-screen bg-rose-50/30 text-gray-900 pt-32 pb-24">
      <SEO
        title="Apparel Size Guide | Sera"
        description="Find your perfect fit. Our comprehensive size guide for Sera apparel collections in inches and centimeters."
        canonicalUrl="https://www.serastore.in/size-guide"
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-serif mb-6 tracking-wide text-gray-900 leading-none">
            Apparel Size Guide
          </h1>
          <p className="text-base md:text-lg text-gray-500 max-w-2xl mx-auto font-light tracking-wide">
            Measure yourself and use the chart below to find your perfect Sera fit.
          </p>
        </motion.div>
        
        {/* Unit Toggle */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="flex justify-center mb-12"
        >
          <div className="bg-white p-1 rounded-full flex border border-gray-200 shadow-sm">
            <button 
              onClick={() => setUnit('in')}
              className={`px-8 py-2.5 rounded-full text-xs tracking-widest uppercase font-semibold transition-all duration-300 ${unit === 'in' ? 'bg-gray-900 text-white shadow-md' : 'text-gray-400 hover:text-gray-900'}`}
            >
              Inches
            </button>
            <button 
              onClick={() => setUnit('cm')}
              className={`px-8 py-2.5 rounded-full text-xs tracking-widest uppercase font-semibold transition-all duration-300 ${unit === 'cm' ? 'bg-gray-900 text-white shadow-md' : 'text-gray-400 hover:text-gray-900'}`}
            >
              CM
            </button>
          </div>
        </motion.div>

        {/* Cinematic Table */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="overflow-x-auto rounded-3xl border border-gray-100 bg-white shadow-xl"
        >
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="py-8 px-8 font-semibold text-lg md:text-xl text-gray-900 tracking-wide">Measurement</th>
                <th className="py-8 px-4 font-semibold text-lg md:text-xl text-gray-900 text-center">XS</th>
                <th className="py-8 px-4 font-semibold text-lg md:text-xl text-gray-900 text-center">S</th>
                <th className="py-8 px-4 font-semibold text-lg md:text-xl text-gray-900 text-center">M</th>
                <th className="py-8 px-4 font-semibold text-lg md:text-xl text-gray-900 text-center">L</th>
                <th className="py-8 px-4 font-semibold text-lg md:text-xl text-gray-900 text-center">XL</th>
              </tr>
            </thead>
            <tbody>
              {apparelData.map((row, idx) => (
                <tr 
                  key={row.name} 
                  className={`transition-colors duration-300 hover:bg-rose-50/50 ${idx !== apparelData.length - 1 ? "border-b border-gray-50" : ""}`}
                >
                  <td className="py-6 px-8 font-bold text-gray-800 text-base md:text-lg tracking-wide">{row.name}</td>
                  {row.sizes.map((size, i) => (
                    <td key={i} className="py-6 px-4 text-center text-gray-600 font-medium text-base md:text-lg tracking-wider">
                      {formatSize(size)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
        
      </div>
    </div>
  );
};

export default SizeGuide;
