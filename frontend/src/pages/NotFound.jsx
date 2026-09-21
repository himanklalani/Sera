import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-6 font-serif text-center">
      <Helmet>
        <title>Page Not Found | Sera</title>
        <meta name="robots" content="noindex, follow" />
      </Helmet>
      
      <h1 className="text-6xl md:text-8xl font-light text-rose-500 mb-4">404</h1>
      <h2 className="text-2xl md:text-3xl font-medium text-gray-900 mb-6">Page Not Found</h2>
      
      <p className="text-gray-600 mb-10 max-w-md mx-auto">
        We can't seem to find the page you're looking for. It might have been removed, renamed, or temporarily unavailable.
      </p>
      
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
        <Link 
          to="/shop" 
          className="px-8 py-3 bg-gray-900 text-white hover:bg-rose-500 transition-colors duration-300 font-sans tracking-wide rounded-lg text-sm font-semibold"
        >
          EXPLORE THE SHOP
        </Link>
        <Link 
          to="/" 
          className="px-8 py-3 border border-gray-300 text-gray-800 hover:border-rose-500 hover:text-rose-600 transition-colors duration-300 font-sans tracking-wide rounded-lg text-sm font-semibold"
        >
          BACK TO HOME
        </Link>
      </div>

      <div className="pt-6 border-t border-gray-100 max-w-lg mx-auto">
        <p className="text-xs uppercase tracking-widest text-gray-400 mb-3 font-sans">Popular Collections</p>
        <div className="flex flex-wrap justify-center gap-2 font-sans text-xs">
          <Link to="/shop/necklaces" className="px-3 py-1.5 bg-rose-50 text-rose-700 rounded-full hover:bg-rose-100 transition-colors">Necklaces</Link>
          <Link to="/shop/earrings" className="px-3 py-1.5 bg-rose-50 text-rose-700 rounded-full hover:bg-rose-100 transition-colors">Earrings</Link>
          <Link to="/shop/bracelets" className="px-3 py-1.5 bg-rose-50 text-rose-700 rounded-full hover:bg-rose-100 transition-colors">Bracelets</Link>
          <Link to="/shop/combos" className="px-3 py-1.5 bg-rose-50 text-rose-700 rounded-full hover:bg-rose-100 transition-colors">Combo Sets</Link>
          <Link to="/gifts" className="px-3 py-1.5 bg-rose-50 text-rose-700 rounded-full hover:bg-rose-100 transition-colors">Gifting Hub</Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
