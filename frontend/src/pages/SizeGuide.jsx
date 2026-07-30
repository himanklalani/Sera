import React from 'react';
import SEO from '../components/SEO';
import { FaRuler, FaHandsWash, FaCircle } from 'react-icons/fa';

const SizeGuide = () => {
  return (
    <div className="min-h-screen bg-white pt-24 pb-16">
      <SEO
        title="Size Guide | Rings, Necklaces & Bracelets | Sera"
        description="Find your perfect fit. Our comprehensive size guide for necklaces and bracelets. Plus, discover our signature free-size adjustable rings."
        canonicalUrl="https://www.serastore.in/size-guide"
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tight">
            The Fit Guide
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Jewelry that fits perfectly, feels effortless, and moves with you. Here is everything you need to know about Sera sizing.
          </p>
        </div>

        {/* Free Size Rings Notice - Highlighted for conversion */}
        <div className="bg-rose-50/50 border border-rose-100 rounded-xl p-8 mb-16 text-center transform hover:-translate-y-1 transition-transform duration-300">
          <FaHandsWash className="text-4xl text-rose-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Zero Sizing Anxiety on Rings</h2>
          <p className="text-gray-700 text-lg mb-0">
            We believe you shouldn't have to guess your ring size. <span className="font-bold text-rose-700">Every single ring at Sera is Free-Size (Adjustable).</span> 
            <br className="hidden md:block" /> Gently squeeze or pull the band to perfectly fit any finger you choose to wear it on today.
          </p>
        </div>

        {/* Necklaces */}
        <div className="mb-20">
          <div className="flex items-center gap-4 mb-8 border-b pb-4">
            <FaRuler className="text-2xl text-gray-400" />
            <h2 className="text-3xl font-bold text-gray-900">Necklace Lengths</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 text-gray-700">
              <p>Our necklaces are designed to be layered. Most Sera necklaces come with an adjustable chain extender (typically 2 inches) so you can fine-tune the drop.</p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <span className="font-bold text-gray-900 min-w-[40px]">14"</span>
                  <span><strong>Choker:</strong> Wraps closely around the base of the neck. Perfect for the foundational layer of a stack.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="font-bold text-gray-900 min-w-[40px]">16"</span>
                  <span><strong>Collarbone:</strong> Falls perfectly at the collarbone. The most common length for everyday pendants.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="font-bold text-gray-900 min-w-[40px]">18"</span>
                  <span><strong>Princess:</strong> Falls just below the collarbone. Ideal for larger pendants or layering below a 16".</span>
                </li>
              </ul>
            </div>
            {/* Visualizer Placeholder / CSS Mockup */}
            <div className="bg-gray-50 rounded-xl p-8 flex justify-center items-center relative min-h-[300px]">
                <div className="absolute top-10 w-32 h-32 rounded-full border-t-2 border-rose-300"></div>
                <div className="absolute top-10 w-40 h-40 rounded-full border-t-2 border-gray-400"></div>
                <div className="absolute top-10 w-48 h-48 rounded-full border-t-2 border-stone-300"></div>
                <span className="absolute top-[80px] left-1/2 -translate-x-1/2 text-xs text-rose-500 font-bold bg-gray-50 px-1">14"</span>
                <span className="absolute top-[100px] left-1/2 -translate-x-1/2 text-xs text-gray-500 font-bold bg-gray-50 px-1">16"</span>
                <span className="absolute top-[120px] left-1/2 -translate-x-1/2 text-xs text-stone-500 font-bold bg-gray-50 px-1">18"</span>
            </div>
          </div>
        </div>

        {/* Bracelets */}
        <div className="mb-10">
          <div className="flex items-center gap-4 mb-8 border-b pb-4">
            <FaCircle className="text-2xl text-gray-400" />
            <h2 className="text-3xl font-bold text-gray-900">Bracelet Sizing</h2>
          </div>
          <div className="prose prose-lg text-gray-700 max-w-none">
            <p>Similar to our necklaces, most Sera chain bracelets feature an adjustable 1-inch to 1.5-inch extender.</p>
            <p><strong>Standard Fit:</strong> Our bracelets typically measure 6.5 inches with a 1.5-inch extender, accommodating wrist sizes from 6" to 7.5".</p>
            <p><strong>How to measure:</strong> Wrap a piece of string around your wrist just below the wrist bone. Mark where the string overlaps, lay it flat, and measure with a ruler. Add half an inch for a comfortable fit.</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SizeGuide;
