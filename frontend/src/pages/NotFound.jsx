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
      
      <Link 
        to="/" 
        className="px-8 py-3 bg-gray-900 text-white hover:bg-rose-500 transition-colors duration-300 font-sans tracking-wide"
      >
        RETURN TO SHOP
      </Link>
    </div>
  );
};

export default NotFound;
