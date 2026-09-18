import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { FaLeaf, FaBoxOpen, FaHandsHelping } from 'react-icons/fa';

const Sustainability = () => {
  return (
    <div className="min-h-screen bg-stone-50 pt-24 pb-16">
      <SEO
        title="Sustainability & Conscious Craftsmanship | Sera"
        description="Learn about Sera's commitment to durable anti-tarnish jewelry, mindful packaging, and timeless cotton blend apparel designed to reduce throwaway fashion."
        canonicalUrl="https://www.serastore.in/sustainability"
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-20">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tight">
            Conscious Craftsmanship
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We believe that premium quality shouldn't come at the cost of our planet. Here is how we build lasting jewelry and conscious fashion.
          </p>
        </div>

        <div className="space-y-16">
          {/* Section 1 */}
          <div className="bg-white rounded-xl shadow-sm p-8 md:p-12 border border-gray-100 flex flex-col md:flex-row gap-8 items-center">
            <div className="md:w-1/3 flex justify-center">
              <div className="w-32 h-32 bg-stone-100 rounded-full flex items-center justify-center">
                <FaLeaf className="text-5xl text-stone-600" />
              </div>
            </div>
            <div className="md:w-2/3">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Durable Materials & Longevity</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Our core philosophy is built on creating pieces that last. By engineering our <Link to="/shop/necklaces" className="text-rose-600 font-medium hover:underline">anti-tarnish waterproof necklaces</Link> and <Link to="/shop/earrings" className="text-rose-600 font-medium hover:underline">waterproof everyday earrings</Link> to withstand moisture, we actively combat the "throwaway" culture associated with cheap fashion jewelry.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Similarly, our <Link to="/shop/apparel" className="text-rose-600 font-medium hover:underline">women's cotton blend tops</Link> are woven for wrinkle-resistant durability, ensuring they stay in your wardrobe rotation for seasons to come.
              </p>
            </div>
          </div>

          {/* Section 2 */}
          <div className="bg-white rounded-xl shadow-sm p-8 md:p-12 border border-gray-100 flex flex-col md:flex-row-reverse gap-8 items-center">
            <div className="md:w-1/3 flex justify-center">
              <div className="w-32 h-32 bg-rose-50 rounded-full flex items-center justify-center">
                <FaBoxOpen className="text-5xl text-rose-400" />
              </div>
            </div>
            <div className="md:w-2/3">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Thoughtful Packaging</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                A memorable unboxing experience shouldn't mean unnecessary plastic waste. We carefully balance presentation with mindful material choices.
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Sturdy, reusable gift boxes designed to store and protect your pieces long-term.</li>
                <li>Optimized box sizing to reduce our transportation and shipping footprint.</li>
                <li>Minimal single-use plastics across our packaging and order fulfillment.</li>
              </ul>
            </div>
          </div>

          {/* Section 3 */}
          <div className="bg-white rounded-xl shadow-sm p-8 md:p-12 border border-gray-100 flex flex-col md:flex-row gap-8 items-center">
            <div className="md:w-1/3 flex justify-center">
              <div className="w-32 h-32 bg-zinc-100 rounded-full flex items-center justify-center">
                <FaHandsHelping className="text-5xl text-zinc-600" />
              </div>
            </div>
            <div className="md:w-2/3">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Community & Fair Pricing</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Sustainability isn't just about materials; it's about transparency and accessible pricing. By curating <Link to="/shop/combos" className="text-rose-600 font-medium hover:underline">matching jewelry combo sets</Link> priced fairly, we make high-grade essentials accessible without inflated markups.
              </p>
              <p className="text-gray-600 leading-relaxed">
                We also provide a <Link to="/jewelry-care" className="text-rose-600 font-medium hover:underline">comprehensive jewelry care guide</Link> to help you maintain your pieces for years of shine.
              </p>
            </div>
          </div>
        </div>

        {/* Strategy 4 Contextual Explore Section */}
        <div className="mt-20 p-8 bg-white rounded-2xl border border-stone-200 text-center">
          <h3 className="text-2xl font-serif font-bold text-gray-900 mb-4">Discover Sustainable Staples</h3>
          <p className="text-gray-600 text-sm max-w-xl mx-auto mb-8">
            Invest in timeless wardrobe essentials and long-lasting jewelry crafted for real everyday life.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/shop/combos" className="px-6 py-3 bg-black text-white text-xs uppercase tracking-widest font-semibold hover:bg-rose-600 transition-colors">
              Shop Jewelry Combo Sets
            </Link>
            <Link to="/shop/necklaces" className="px-6 py-3 bg-stone-100 text-gray-900 text-xs uppercase tracking-widest font-semibold hover:bg-rose-100 transition-colors">
              Waterproof Necklaces
            </Link>
            <Link to="/shop/apparel" className="px-6 py-3 bg-stone-100 text-gray-900 text-xs uppercase tracking-widest font-semibold hover:bg-rose-100 transition-colors">
              Chic Women's Tops
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Sustainability;
