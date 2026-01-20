// Terms.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Terms = () => {
  return (
    <div className="min-h-screen bg-rose-50/50 py-12 px-4 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-20">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 tracking-tight">
            TERMS & CONDITIONS
          </h1>
          <p className="text-xl text-gray-700 font-light max-w-2xl mx-auto leading-relaxed">
            Elegant agreements for your luxury jewelry experience with SERA.
          </p>
        </div>

        <div className="space-y-12">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 tracking-wide uppercase border-b-2 border-rose-200 pb-4">Use of Website</h2>
            <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-4">
              <p>By accessing serajewelry.com, you agree to these terms. SERA reserves the right to modify prices, products, and policies without notice. All jewelry designs and content are intellectual property of SERA.</p>
              
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 tracking-wide uppercase border-b-2 border-rose-200 pb-4">Pricing & Payments</h2>
            <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-4">
              <p>We accept UPI, cards, net banking, and wallets via Razorpay. All sales are final except as per our exchange policy.</p>
              <p>Prices reflect current market rates and may change. Final price shown at checkout is binding.</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 tracking-wide uppercase border-b-2 border-rose-200 pb-4">Jewelry Quality</h2>
            <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-4">
              <p>All jewelry is premium anti-tarnish imitation crafted with high quality materials. Weights are approximate ±5%. Slight variations in color, texture, or stone placement are normal in handmade pieces.</p>
              
            </div>
          </section>

          <section className="bg-rose-50 p-8 rounded-2xl border border-rose-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 tracking-wide uppercase">Governing Law</h2>
            <p className="text-lg text-gray-700 leading-relaxed">These terms are governed by Indian law. Disputes will be resolved in Mumbai courts. Consumer Protection Act 2019 applies.</p>
          </section>

          <section className="text-center pt-12">
            <div className="bg-white border border-rose-200 text-gray-900 p-12 rounded-2xl shadow-lg">
              <h3 className="text-3xl font-bold mb-4 tracking-wide text-gray-900">Last Updated: December 2025</h3>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  to="/privacy-policy" 
                  className="bg-rose-500 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-rose-600"
                >
                  PRIVACY POLICY
                </Link>
                <Link 
                  to="/returns" 
                  className="border-2 border-rose-200 text-gray-900 px-8 py-4 rounded-lg font-bold text-lg hover:bg-rose-50"
                >
                  RETURNS & EXCHANGE
                </Link>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Terms;
