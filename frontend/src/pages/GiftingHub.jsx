import React from 'react';
import { Link } from 'react-router-dom';
import { FaHeart, FaGift, FaStar, FaTshirt } from 'react-icons/fa';
import SEO from '../components/SEO';

const GiftingHub = () => {
  return (
    <div className="min-h-screen bg-rose-50/30 pt-24 pb-16">
      <SEO
        title="Gifts For Her | Curated Jewelry Gifts & Bundles | Sera"
        description="Shop Sera for thoughtful gifts for her. Discover anti-tarnish waterproof jewelry gift sets, matching combos under ₹1500, chic tops, and anniversary gifts."
        canonicalUrl="https://www.serastore.in/gifts"
        schema={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "Sera Gifting Hub",
          "description": "Curated anti-tarnish jewelry gifts, matching combo sets, and chic apparel for every occasion."
        }}
      />
      
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 tracking-tight">
          The Gifting Hub
        </h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Meaningful pieces for the ones who matter most. Discover our curated collections of anti-tarnish waterproof jewelry and chic women's fashion.
        </p>
      </div>

      {/* Curated Collections Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Card 1: Necklaces */}
          <Link to="/shop/necklaces" className="group relative h-96 overflow-hidden bg-white shadow-sm hover:shadow-xl transition-all duration-500 rounded-sm flex flex-col justify-center items-center p-8 text-center">
            <div className="absolute inset-0 bg-rose-100/50 group-hover:bg-rose-200/50 transition-colors duration-500 z-0"></div>
            <div className="relative z-10 flex flex-col items-center">
              <FaHeart className="text-4xl text-rose-400 mb-4 transform group-hover:scale-110 transition-transform duration-500" />
              <h2 className="text-xl font-bold text-gray-900 mb-2">Waterproof Necklaces</h2>
              <p className="text-gray-600 text-sm mb-6">Timeless everyday pendant and chain styles she will wear constantly.</p>
              <span className="inline-block border-b border-gray-900 text-gray-900 pb-1 text-xs font-semibold tracking-wider uppercase group-hover:border-rose-500 group-hover:text-rose-500 transition-colors">
                Shop Waterproof Necklaces
              </span>
            </div>
          </Link>

          {/* Card 2: Combos */}
          <Link to="/shop/combos" className="group relative h-96 overflow-hidden bg-white shadow-sm hover:shadow-xl transition-all duration-500 rounded-sm flex flex-col justify-center items-center p-8 text-center">
            <div className="absolute inset-0 bg-stone-100/50 group-hover:bg-stone-200/50 transition-colors duration-500 z-0"></div>
            <div className="relative z-10 flex flex-col items-center">
              <FaGift className="text-4xl text-stone-400 mb-4 transform group-hover:scale-110 transition-transform duration-500" />
              <h2 className="text-xl font-bold text-gray-900 mb-2">Jewelry Combo Sets</h2>
              <p className="text-gray-600 text-sm mb-6">Curated matching necklace and earring sets ready to gift under ₹1,500.</p>
              <span className="inline-block border-b border-gray-900 text-gray-900 pb-1 text-xs font-semibold tracking-wider uppercase group-hover:border-stone-500 group-hover:text-stone-500 transition-colors">
                Shop Jewelry Combos
              </span>
            </div>
          </Link>

          {/* Card 3: Earrings */}
          <Link to="/shop/earrings" className="group relative h-96 overflow-hidden bg-white shadow-sm hover:shadow-xl transition-all duration-500 rounded-sm flex flex-col justify-center items-center p-8 text-center">
            <div className="absolute inset-0 bg-zinc-100/50 group-hover:bg-zinc-200/50 transition-colors duration-500 z-0"></div>
            <div className="relative z-10 flex flex-col items-center">
              <FaStar className="text-4xl text-zinc-400 mb-4 transform group-hover:scale-110 transition-transform duration-500" />
              <h2 className="text-xl font-bold text-gray-900 mb-2">Anti-Tarnish Earrings</h2>
              <p className="text-gray-600 text-sm mb-6">Sweatproof hoops, drops, and huggies crafted for day-to-night comfort.</p>
              <span className="inline-block border-b border-gray-900 text-gray-900 pb-1 text-xs font-semibold tracking-wider uppercase group-hover:border-zinc-500 group-hover:text-zinc-500 transition-colors">
                Shop Waterproof Earrings
              </span>
            </div>
          </Link>

          {/* Card 4: Apparel */}
          <Link to="/shop/apparel" className="group relative h-96 overflow-hidden bg-white shadow-sm hover:shadow-xl transition-all duration-500 rounded-sm flex flex-col justify-center items-center p-8 text-center">
            <div className="absolute inset-0 bg-amber-50/50 group-hover:bg-amber-100/50 transition-colors duration-500 z-0"></div>
            <div className="relative z-10 flex flex-col items-center">
              <FaTshirt className="text-4xl text-amber-500 mb-4 transform group-hover:scale-110 transition-transform duration-500" />
              <h2 className="text-xl font-bold text-gray-900 mb-2">Chic Women's Tops</h2>
              <p className="text-gray-600 text-sm mb-6">Breathable cotton blend tops tailored for effortless contemporary styling.</p>
              <span className="inline-block border-b border-gray-900 text-gray-900 pb-1 text-xs font-semibold tracking-wider uppercase group-hover:border-amber-600 group-hover:text-amber-600 transition-colors">
                Shop Women's Tops
              </span>
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
              <h4 className="font-bold text-gray-900 mb-2 text-lg">Anti-Tarnish & Waterproof</h4>
              <p className="text-gray-600">Built to endure daily life. Sweatproof, water-resistant, and durable.</p>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-2 text-lg">Curated Gift Packaging</h4>
              <p className="text-gray-600">Every order arrives in our signature ready-to-gift unboxing packaging.</p>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-2 text-lg">Complimentary Shipping</h4>
              <p className="text-gray-600">Free shipping on all prepaid orders over ₹999.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Internal SEO Linking Section */}
      <div className="bg-rose-50/20 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h3 className="text-2xl font-serif text-gray-900 mb-6">Explore Our Curated Gifting Collections</h3>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto text-sm leading-relaxed">
            Finding the perfect gift is an art. Whether you are searching for delicate 
            <Link to="/shop/necklaces" className="text-rose-600 font-medium hover:underline mx-1">anti-tarnish waterproof necklaces</Link> 
            to celebrate an anniversary, a stunning pair of 
            <Link to="/shop/earrings" className="text-rose-600 font-medium hover:underline mx-1">waterproof earrings</Link> 
            for a birthday, or a minimal 
            <Link to="/shop/bracelets" className="text-rose-600 font-medium hover:underline mx-1">tarnish-resistant bracelet</Link> 
            for daily wear, Sera has you covered. Explore our curated 
            <Link to="/shop/combos" className="text-rose-600 font-medium hover:underline mx-1">matching jewelry combo sets</Link> 
            or pair your accessories with our 
            <Link to="/shop/apparel" className="text-rose-600 font-medium hover:underline mx-1">chic cotton blend tops</Link> 
            for a complete wardrobe upgrade. All our jewelry pieces are sweatproof, waterproof, and designed for comfortable everyday wear.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/shop/combos" className="inline-block bg-black text-white px-6 py-3 uppercase tracking-widest text-xs hover:bg-rose-600 transition-colors">
              Shop Jewelry Combo Sets
            </Link>
            <Link to="/shop/necklaces" className="inline-block bg-white text-gray-900 border border-gray-300 px-6 py-3 uppercase tracking-widest text-xs hover:border-rose-600 hover:text-rose-600 transition-colors">
              Shop Waterproof Necklaces
            </Link>
            <Link to="/shop/apparel" className="inline-block bg-white text-gray-900 border border-gray-300 px-6 py-3 uppercase tracking-widest text-xs hover:border-rose-600 hover:text-rose-600 transition-colors">
              Shop Women's Tops
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
};

export default GiftingHub;
