import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

const Sitemap = () => {
  return (
    <div className="min-h-screen bg-white pt-24 pb-16">
      <SEO
        title="Sitemap | Sera Jewels"
        description="Navigate Sera Jewels. Find all our collections, products, guides, and policies in one place."
        canonicalUrl="https://www.serastore.in/sitemap"
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 border-b border-gray-200 pb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4 tracking-tight">Sitemap</h1>
          <p className="text-gray-600">A complete overview of the Sera Jewels website.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          
          {/* Shop */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4 border-b pb-2">Shop</h2>
            <ul className="space-y-3">
              <li><Link to="/shop" className="text-gray-600 hover:text-rose-600 transition-colors">All Jewelry</Link></li>
              <li><Link to="/shop/rings" className="text-gray-600 hover:text-rose-600 transition-colors">Rings</Link></li>
              <li><Link to="/shop/earrings" className="text-gray-600 hover:text-rose-600 transition-colors">Earrings</Link></li>
              <li><Link to="/shop/necklaces" className="text-gray-600 hover:text-rose-600 transition-colors">Necklaces</Link></li>
              <li><Link to="/shop/bracelets" className="text-gray-600 hover:text-rose-600 transition-colors">Bracelets</Link></li>
              <li><Link to="/gifts" className="text-gray-600 hover:text-rose-600 transition-colors">Gifting Hub</Link></li>
            </ul>
          </div>

          {/* Resources & Guides */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4 border-b pb-2">Resources</h2>
            <ul className="space-y-3">
              <li><Link to="/jewelry-care" className="text-gray-600 hover:text-rose-600 transition-colors">Jewelry Care</Link></li>
              <li><Link to="/size-guide" className="text-gray-600 hover:text-rose-600 transition-colors">Size Guide</Link></li>
              <li><Link to="/materials" className="text-gray-600 hover:text-rose-600 transition-colors">Our Materials</Link></li>
              <li><Link to="/journal" className="text-gray-600 hover:text-rose-600 transition-colors">Journal (Blog)</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4 border-b pb-2">Company</h2>
            <ul className="space-y-3">
              <li><Link to="/about" className="text-gray-600 hover:text-rose-600 transition-colors">About Us</Link></li>
              <li><Link to="/sustainability" className="text-gray-600 hover:text-rose-600 transition-colors">Sustainability</Link></li>
              <li><Link to="/contact" className="text-gray-600 hover:text-rose-600 transition-colors">Contact Us</Link></li>
              <li><Link to="/faq" className="text-gray-600 hover:text-rose-600 transition-colors">FAQ</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4 border-b pb-2">Legal & Policies</h2>
            <ul className="space-y-3">
              <li><Link to="/returns" className="text-gray-600 hover:text-rose-600 transition-colors">Returns & Exchanges</Link></li>
              <li><Link to="/privacy-policy" className="text-gray-600 hover:text-rose-600 transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-gray-600 hover:text-rose-600 transition-colors">Terms of Service</Link></li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4 border-b pb-2">Account</h2>
            <ul className="space-y-3">
              <li><Link to="/login" className="text-gray-600 hover:text-rose-600 transition-colors">Login</Link></li>
              <li><Link to="/register" className="text-gray-600 hover:text-rose-600 transition-colors">Create Account</Link></li>
              <li><Link to="/profile" className="text-gray-600 hover:text-rose-600 transition-colors">My Profile</Link></li>
              <li><Link to="/cart" className="text-gray-600 hover:text-rose-600 transition-colors">Shopping Cart</Link></li>
            </ul>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Sitemap;
