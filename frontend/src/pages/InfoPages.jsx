// InfoPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';

export const About = () => (
  <div className="min-h-screen bg-rose-50/50 py-12 px-4 lg:px-8">
    <div className="max-w-6xl mx-auto">
      {/* Hero Section */}
      <div className="text-center mb-20">
        <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 mb-8 tracking-tight">
          ABOUT SERA
        </h1>
        <p className="text-xl lg:text-2xl text-gray-700 font-light max-w-3xl mx-auto leading-relaxed">
          Where timeless elegance meets modern intention.
        </p>
      </div>

      {/* Brand Story */}
      <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
        <div className="space-y-8">
          <div className="space-y-6">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight">Our Story</h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              Founded in <span className="font-bold text-rose-600">2024</span> in the heart of Mumbai, SERA was born from a 
              deep love for minimalist luxury and meaningful design. Every piece is crafted to celebrate 
              the quiet confidence of women who know their worth.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              We craft premium <span className="font-semibold text-rose-700">anti-tarnish imitation jewelry</span> with 
              exceptional quality, blending traditional Indian craftsmanship with contemporary aesthetics.
            </p>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-2 gap-8 pt-8 border-t border-rose-200">
            <div className="text-center">
              <div className="text-4xl font-bold text-rose-600 mb-2">50+</div>
              <div className="text-sm uppercase tracking-wider text-rose-600 font-bold">Unique Designs</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-rose-600 mb-2">1000+</div>
              <div className="text-sm uppercase tracking-wider text-rose-600 font-bold">Happy Customers</div>
            </div>
          </div>
        </div>
        
        <div className="relative">
          <div className="bg-rose-50 rounded-3xl p-12 lg:p-20 aspect-square mx-auto max-w-md border border-rose-200">
            <div className="w-48 h-48 lg:w-64 lg:h-64 bg-rose-100 rounded-full mx-auto shadow-lg"></div>
          </div>
        </div>
      </div>

      {/* Values */}
      <section className="text-center mb-24">
        <h2 className="text-4xl font-bold text-gray-900 mb-16 tracking-tight">Our Values</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="p-8 rounded-2xl bg-white border border-rose-100 shadow-lg">
            <div className="w-20 h-20 bg-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-6 text-2xl text-white">💎</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4 tracking-wide uppercase">Quality</h3>
            <p className="text-gray-700 leading-relaxed">Premium anti-tarnish materials, lifetime polishing guarantee.</p>
          </div>
          <div className="p-8 rounded-2xl bg-white border border-rose-100 shadow-lg">
            <div className="w-20 h-20 bg-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6 text-2xl text-white">🌿</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4 tracking-wide uppercase">Ethical</h3>
            <p className="text-gray-700 leading-relaxed">Sustainable practices, fair craftsmanship.</p>
          </div>
          <div className="p-8 rounded-2xl bg-white border border-rose-100 shadow-lg">
            <div className="w-20 h-20 bg-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6 text-2xl text-white">❤️</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4 tracking-wide uppercase">Personal</h3>
            <p className="text-gray-700 leading-relaxed">Pieces that tell your unique story.</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <div className="text-center">
        <Link 
          to="/shop" 
          className="inline-block bg-rose-500 text-white px-12 py-6 rounded-lg text-xl font-bold tracking-wide hover:bg-rose-600"
        >
          Discover Our Collection
        </Link>
      </div>
    </div>
  </div>
);

export const FAQ = () => (
  <div className="min-h-screen bg-rose-50/50 py-12 px-4 lg:px-8">
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-20">
        <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 tracking-tight">
          FAQ'S
        </h1>
        <p className="text-xl text-gray-700 font-light max-w-2xl mx-auto">
          Everything you need to know before your SERA purchase.
        </p>
      </div>

      {/* FAQ Accordion */}
      <div className="space-y-4">
        <div className="group bg-white rounded-2xl p-8 border border-rose-100 shadow-lg hover:shadow-xl">
          <div className="flex items-start justify-between cursor-pointer">
            <h3 className="text-2xl font-bold text-gray-900 group-hover:text-rose-600 transition-colors flex-1 pr-4">
              Shipping Timeline?
            </h3>
            <span className="text-3xl transition-transform group-hover:rotate-180">▼</span>
          </div>
          <p className="text-gray-700 mt-6 leading-relaxed text-lg opacity-0 group-hover:opacity-100 transition-all duration-300 max-h-0 group-hover:max-h-32 overflow-hidden">
            Orders ship within 2-3 business days via courier services. delivery may take 5-7 working days. 
            Free shipping on orders above ₹999.
          </p>
        </div>

        <div className="group bg-white rounded-2xl p-8 border border-rose-100 shadow-lg hover:shadow-xl">
          <div className="flex items-start justify-between cursor-pointer">
            <h3 className="text-2xl font-bold text-gray-900 group-hover:text-rose-600 transition-colors flex-1 pr-4">
              International Shipping?
            </h3>
            <span className="text-3xl transition-transform group-hover:rotate-180">▼</span>
          </div>
          <p className="text-gray-700 mt-6 leading-relaxed text-lg opacity-0 group-hover:opacity-100 transition-all duration-300 max-h-0 group-hover:max-h-32 overflow-hidden">
            Currently shipping within India only. International shipping coming soon!
          </p>
        </div>

        <div className="group bg-white rounded-2xl p-8 border border-rose-100 shadow-lg hover:shadow-xl">
          <div className="flex items-start justify-between cursor-pointer">
            <h3 className="text-2xl font-bold text-gray-900 group-hover:text-rose-600 transition-colors flex-1 pr-4">
              Payment Methods?
            </h3>
            <span className="text-3xl transition-transform group-hover:rotate-180">▼</span>
          </div>
          <p className="text-gray-700 mt-6 leading-relaxed text-lg opacity-0 group-hover:opacity-100 transition-all duration-300 max-h-0 group-hover:max-h-32 overflow-hidden">
            UPI, Credit/Debit Cards, Net Banking, Wallets via Razorpay. All transactions encrypted with SSL.
          </p>
        </div>

        <div className="group bg-white rounded-2xl p-8 border border-rose-100 shadow-lg hover:shadow-xl">
          <div className="flex items-start justify-between cursor-pointer">
            <h3 className="text-2xl font-bold text-gray-900 group-hover:text-rose-600 transition-colors flex-1 pr-4">
              Material Quality?
            </h3>
            <span className="text-3xl transition-transform group-hover:rotate-180">▼</span>
          </div>
          <p className="text-gray-700 mt-6 leading-relaxed text-lg opacity-0 group-hover:opacity-100 transition-all duration-300 max-h-0 group-hover:max-h-32 overflow-hidden">
            All jewelry is premium anti-tarnish imitation crafted with high quality materials.
          </p>
        </div>

        <div className="group bg-white rounded-2xl p-8 border border-rose-100 shadow-lg hover:shadow-xl">
          <div className="flex items-start justify-between cursor-pointer">
            <h3 className="text-2xl font-bold text-gray-900 group-hover:text-rose-600 transition-colors flex-1 pr-4">
              Exchange Policy?
            </h3>
            <span className="text-3xl transition-transform group-hover:rotate-180">▼</span>
          </div>
          <p className="text-gray-700 mt-6 leading-relaxed text-lg opacity-0 group-hover:opacity-100 transition-all duration-300 max-h-0 group-hover:max-h-32 overflow-hidden">
            <strong>No refunds, exchanges only within 3 days.</strong> ₹100 fee (free if our mistake). See <Link to="/returns" className="text-rose-600 font-bold hover:underline">full policy</Link>.
          </p>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center mt-24">
        <Link 
          to="/contact" 
          className="inline-block bg-rose-500 text-white px-12 py-6 rounded-lg text-xl font-bold tracking-wide hover:bg-rose-600"
        >
          Still have questions? Contact us
        </Link>
      </div>
    </div>
  </div>
);
