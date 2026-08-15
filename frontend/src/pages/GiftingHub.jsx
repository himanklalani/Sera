import React from 'react';
import { Link } from 'react-router-dom';
import { FaHeart, FaGift, FaStar } from 'react-icons/fa';
import SEO from '../components/SEO';

const GiftingHub = () => {
  return (
    <div className="min-h-screen bg-rose-50/30 pt-24 pb-16">
      <SEO
        title="Gifts For Her | Luxury Jewelry Gifting | Sera"
        description="Shop Sera Jewels for the perfect gift. Find premium, anti-tarnish jewelry gifts under ₹2000, anniversary gifts, and personalized options."
        canonicalUrl="https://www.serastore.in/gifts"
        schema={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "Sera Jewelry Gifting Hub",
          "description": "Curated jewelry gifts for every occasion."
        }}
      />
      
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 tracking-tight">
          The Gifting Hub
        </h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Meaningful pieces for the ones who matter most. Discover our curated collections of premium, everyday luxury jewelry.
        </p>
      </div>

      {/* Curated Collections Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Card 1 */}
          <Link to="/shop?category=necklace" className="group relative h-96 overflow-hidden bg-white shadow-sm hover:shadow-xl transition-all duration-500 rounded-sm">
            <div className="absolute inset-0 bg-rose-100/50 group-hover:bg-rose-200/50 transition-colors duration-500 z-0"></div>
            <div className="absolute inset-0 flex flex-col items-center justify-center p-8 z-10">
              <FaHeart className="text-4xl text-rose-400 mb-4 transform group-hover:scale-110 transition-transform duration-500" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Gifts For Her</h2>
              <p className="text-gray-600 text-center mb-6">Timeless staples she will wear every single day.</p>
              <span className="inline-block border-b border-gray-900 text-gray-900 pb-1 text-sm font-semibold tracking-wider uppercase group-hover:border-rose-500 group-hover:text-rose-500 transition-colors">Shop Collection</span>
            </div>
          </Link>

          {/* Card 2 */}
          <Link to="/shop?category=combos" className="group relative h-96 overflow-hidden bg-white shadow-sm hover:shadow-xl transition-all duration-500 rounded-sm">
            <div className="absolute inset-0 bg-stone-100/50 group-hover:bg-stone-200/50 transition-colors duration-500 z-0"></div>
            <div className="absolute inset-0 flex flex-col items-center justify-center p-8 z-10">
              <FaGift className="text-4xl text-stone-400 mb-4 transform group-hover:scale-110 transition-transform duration-500" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Gifts Under ₹1500</h2>
              <p className="text-gray-600 text-center mb-6">Affordable luxury that never compromises on quality.</p>
              <span className="inline-block border-b border-gray-900 text-gray-900 pb-1 text-sm font-semibold tracking-wider uppercase group-hover:border-stone-500 group-hover:text-stone-500 transition-colors">Shop Collection</span>
            </div>
          </Link>

          {/* Card 3 */}
          <Link to="/shop?category=earrings" className="group relative h-96 overflow-hidden bg-white shadow-sm hover:shadow-xl transition-all duration-500 rounded-sm">
            <div className="absolute inset-0 bg-zinc-100/50 group-hover:bg-zinc-200/50 transition-colors duration-500 z-0"></div>
            <div className="absolute inset-0 flex flex-col items-center justify-center p-8 z-10">
              <FaStar className="text-4xl text-zinc-400 mb-4 transform group-hover:scale-110 transition-transform duration-500" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Anniversary Edit</h2>
              <p className="text-gray-600 text-center mb-6">Celebrate milestones with our most exquisite pieces.</p>
              <span className="inline-block border-b border-gray-900 text-gray-900 pb-1 text-sm font-semibold tracking-wider uppercase group-hover:border-zinc-500 group-hover:text-zinc-500 transition-colors">Shop Collection</span>
            </div>
          </Link>

        </div>
      </div>

      {/* Why Gift Sera */}
      <div className="bg-white py-20 border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h3 className="text-3xl font-bold text-gray-900 mb-12">The Sera Promise</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <h4 className="font-bold text-gray-900 mb-2 text-lg">Anti-Tarnish</h4>
              <p className="text-gray-600">Built to last. Sweatproof, waterproof, and everyday wearable.</p>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-2 text-lg">Premium Packaging</h4>
              <p className="text-gray-600">Every order arrives in our signature luxe unboxing experience.</p>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-2 text-lg">Free Shipping</h4>
              <p className="text-gray-600">Complimentary fast shipping on all orders over ₹999.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Internal SEO Linking Section */}
      <div className="bg-rose-50/20 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h3 className="text-2xl font-serif text-gray-900 mb-6">Explore Our Jewelry Collections</h3>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto text-sm leading-relaxed">
            Finding the perfect jewelry gift is an art. Whether you are searching for a delicate 
            <Link to="/shop?category=necklace" className="text-rose-600 hover:underline mx-1">Necklace</Link> 
            to celebrate an anniversary, a stunning set of 
            <Link to="/shop?category=earrings" className="text-rose-600 hover:underline mx-1">Earrings</Link> 
            for a birthday, or a minimal 
            <Link to="/shop?category=bracelet" className="text-rose-600 hover:underline mx-1">Bracelet</Link> 
            for daily wear, Sera has you covered. Explore our curated 
            <Link to="/shop?category=combos" className="text-rose-600 hover:underline mx-1">Combos collection</Link> 
            or dive straight into our 
            <Link to="/shop?sort=best-selling" className="text-rose-600 hover:underline mx-1">Bestsellers</Link> 
            to see what everyone else is loving. All our pieces are anti-tarnish, waterproof, and designed to last a lifetime.
          </p>
          <Link to="/shop" className="inline-block bg-black text-white px-8 py-3 uppercase tracking-widest text-sm hover:bg-rose-600 transition-colors">
            Shop All Collections
          </Link>
        </div>
      </div>

    </div>
  );
};

export default GiftingHub;
