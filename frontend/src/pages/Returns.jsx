// Returns.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Returns = () => {
  return (
    <div className="min-h-screen bg-rose-50/50 py-12 px-4 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-20">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 tracking-tight">
            RETURNS & EXCHANGE
          </h1>
          <p className="text-xl text-gray-700 font-light max-w-2xl mx-auto leading-relaxed">
            Transparent policy for your peace of mind.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 mb-16">
          {/* No Refund Policy */}
          <div className="bg-rose-50 p-10 rounded-2xl border-2 border-rose-200 shadow-lg">
            <div className="w-20 h-20 bg-rose-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-2xl font-bold text-white">🚫</span>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-4 tracking-wide text-center">NO REFUNDS</h3>
            <p className="text-xl text-rose-800 text-center font-semibold mb-8">We maintain a strict no-refund policy.</p>
            <p className="text-lg text-gray-700 leading-relaxed text-center">Don't worry! We're happy to offer exchanges instead. Your satisfaction matters to us.</p>
          </div>

          {/* Exchange Available */}
          <div className="bg-emerald-50 p-10 rounded-2xl border-2 border-emerald-200 shadow-lg">
            <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-2xl font-bold text-white">🔄</span>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-4 tracking-wide text-center">EXCHANGES</h3>
            <p className="text-xl text-emerald-800 text-center font-semibold mb-8">₹100 Exchange Fee</p>
            <ul className="text-lg text-gray-700 space-y-2 text-left">
              <li>• Free if SERA made a mistake</li>
              <li>• Subject to availability</li>
              <li>• Same size/quality replacement</li>
            </ul>
          </div>
        </div>

        {/* Timeline & Process */}
        <section className="space-y-12 mb-16">
          <div className="bg-rose-50 p-10 rounded-2xl border-2 border-rose-200">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 tracking-wide text-center uppercase">3-DAY EXCHANGE WINDOW</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white">1</div>
                <h4 className="font-bold text-xl mb-2">Request Exchange</h4>
                <p className="text-gray-700">Profile → My Orders → Apply within 3 days</p>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white">2</div>
                <h4 className="font-bold text-xl mb-2">Ship Back</h4>
                <p className="text-gray-700">Send with unboxing video proof</p>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white">3</div>
                <h4 className="font-bold text-xl mb-2">New Piece Ships</h4>
                <p className="text-gray-700">Quality check → Exchange ships</p>
              </div>
            </div>
          </div>

          {/* FAQ */}
          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-10 tracking-wide uppercase text-center">Frequently Asked Questions</h2>
            <div className="space-y-6">
              <div className="bg-white p-8 rounded-2xl shadow-lg border border-rose-100">
                <h4 className="text-xl font-bold text-gray-900 mb-4">DO YOU OFFER REFUNDS?</h4>
                <p className="text-lg text-gray-700">We have a NO-REFUND POLICY, but don't worry—we're happy to offer you an EXCHANGE instead!</p>
              </div>
              <div className="bg-white p-8 rounded-2xl shadow-lg border border-rose-100">
                <h4 className="text-xl font-bold text-gray-900 mb-4">CAN I RETURN SALE ITEMS?</h4>
                <p className="text-lg text-gray-700">Only regular-priced items are eligible for exchange. Sale items are FINAL SALE and cannot be returned.</p>
              </div>
              <div className="bg-white p-8 rounded-2xl shadow-lg border border-rose-100">
                <h4 className="text-xl font-bold text-gray-900 mb-4">WHAT IF MY ORDER ARRIVES DAMAGED?</h4>
                <p className="text-lg text-gray-700">Contact us within 3 days with unboxing video. FREE exchange if damage occurred during shipping.</p>
              </div>
            </div>
          </section>
        </section>

        {/* Important Notes */}
        <div className="bg-rose-500 text-white p-12 rounded-2xl shadow-lg mb-16 border border-rose-400">
          <h3 className="text-3xl font-bold mb-6 text-center tracking-wide uppercase">IMPORTANT NOTES</h3>
          <div className="grid md:grid-cols-2 gap-8 text-xl leading-relaxed">
            <ul className="space-y-3 list-disc list-inside">
              <li>Products on SALE or PROMOTIONAL periods are FINAL SALE</li>
              
              <li>UNBOXING VIDEO required as proof</li>
            </ul>
            <ul className="space-y-3 list-disc list-inside">
              <li>Orders cannot be cancelled once shipped</li>
              <li>Exchange subject to availability</li>
              <li>Persistent issues? We reach out proactively</li>
            </ul>
          </div>
        </div>

        {/* Contact Section */}
        <section className="text-center">
          <div className="bg-white border border-rose-200 text-gray-900 p-12 rounded-2xl shadow-lg">
            <h3 className="text-3xl font-bold mb-6 tracking-wide text-gray-900">Need Help?</h3>
            <p className="text-xl text-gray-600 mb-8">Contact via Email, WhatsApp, or Instagram DM</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact" className="bg-rose-500 text-white px-10 py-5 rounded-lg font-bold text-xl hover:bg-rose-600">
                CONTACT US
              </Link>
              <Link to="/privacy-policy" className="border-2 border-rose-200 text-gray-900 px-10 py-5 rounded-lg font-bold text-xl hover:bg-rose-50">
                PRIVACY POLICY
              </Link>
            </div>
          </div>
        </section>

        <p className="text-center text-sm text-gray-500 mt-12 pt-12 border-t border-rose-200">
          Last Updated: December 28, 2025
        </p>
      </div>
    </div>
  );
};

export default Returns;
