import React from 'react';
import SEO from '../components/SEO';
import { FaLeaf, FaBoxOpen, FaHandsHelping } from 'react-icons/fa';

const Sustainability = () => {
  return (
    <div className="min-h-screen bg-stone-50 pt-24 pb-16">
      <SEO
        title="Sustainability & Ethics | Sera Jewels"
        description="Learn about Sera's commitment to ethical sourcing, sustainable packaging, and conscious craftsmanship."
        canonicalUrl="https://www.serastore.in/sustainability"
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-20">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tight">
            Conscious Craftsmanship
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We believe that premium quality shouldn't come at the cost of our planet. Here is how we are building a more sustainable jewelry brand.
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
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Ethical Sourcing & Materials</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Our core philosophy is built on creating pieces that last. By engineering our jewelry to be anti-tarnish and waterproof, we actively reduce the "throwaway" culture associated with traditional fashion jewelry.
              </p>
              <p className="text-gray-600 leading-relaxed">
                We work exclusively with vetted manufacturing partners who adhere to strict labor standards and safe working conditions. Our base metals are responsibly sourced and our gold-plating process minimizes chemical waste.
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
                The luxury experience shouldn't mean unnecessary waste. We carefully balance a premium unboxing experience with mindful material choices.
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Sturdy, reusable boxes designed to store and protect your pieces long-term.</li>
                <li>Optimized box sizing to reduce our shipping footprint.</li>
                <li>Minimal single-use plastics in our supply chain transit.</li>
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
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Community & Longevity</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Sustainability isn't just about materials; it's about people and longevity. By pricing our premium pieces fairly, we make luxury accessible without exploiting our makers.
              </p>
              <p className="text-gray-600 leading-relaxed">
                We also provide extensive <a href="/jewelry-care" className="text-rose-600 hover:underline">jewelry care resources</a> to ensure your pieces maintain their luster for years, reducing the need for replacements.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Sustainability;
