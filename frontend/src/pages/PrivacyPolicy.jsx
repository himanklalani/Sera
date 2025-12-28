// PrivacyPolicy.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-rose-50/50 py-12 px-4 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 tracking-tight">
            PRIVACY POLICY
          </h1>
          <p className="text-xl text-gray-700 font-light max-w-2xl mx-auto leading-relaxed">
            Your trust matters to us. SERA protects your personal information with care.
          </p>
        </div>

        {/* Content */}
        <div className="space-y-12">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 tracking-wide uppercase border-b-2 border-rose-200 pb-4">Information We Collect</h2>
            <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
              <p>SERA collects minimal personal information necessary to provide our luxury jewelry services. When you place an order, create an account, or contact us, we may collect your name, email address, shipping address, phone number, and payment details.</p>
              <p>We also collect order history, browsing behavior, and device information to improve your shopping experience and personalize recommendations.</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 tracking-wide uppercase border-b-2 border-rose-200 pb-4">How We Use Your Information</h2>
            <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-6">
              <ul className="list-disc list-inside space-y-3 text-lg">
                <li>Process and ship your jewelry orders securely</li>
                <li>Communicate order updates via email and WhatsApp</li>
                <li>Prevent fraud and verify customer identity</li>
                <li>Send exclusive offers for new collections (opt-out available)</li>
                <li>Improve website functionality and jewelry recommendations</li>
              </ul>
              <p>Your data powers a seamless luxury experience while staying protected.</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 tracking-wide uppercase border-b-2 border-rose-200 pb-4">Data Sharing & Security</h2>
            <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
              <p>We never sell your personal information. Data is shared only with trusted partners for shipping , payments , and order fulfillment. All data is encrypted with SSL and stored securely in compliance with Indian IT Act 2000.</p>
              <p>SERA uses advanced security measures including firewalls, regular audits, and secure payment gateways to protect your information from unauthorized access.</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 tracking-wide uppercase border-b-2 border-rose-200 pb-4">Your Rights</h2>
            <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-4">
              <p className="font-semibold text-gray-900">You have full control over your data:</p>
              <ul className="list-disc list-inside space-y-2">
                <li><strong>Access:</strong> Request your data anytime</li>
                <li><strong>Delete:</strong> Remove your information permanently</li>
                <li><strong>Opt-out:</strong> Stop marketing emails instantly</li>
                <li><strong>Rectify:</strong> Update incorrect information</li>
              </ul>
              <p>Email <Link to="/contact" className="text-gray-900 hover:text-gray-700 font-semibold">serajewels1@gmail.com</Link> to exercise these rights.</p>
            </div>
          </section>

          <section className="text-center pt-12">
            <div className="bg-white border border-rose-200 text-gray-900 p-12 rounded-2xl shadow-lg">
              <h3 className="text-3xl font-bold mb-4 tracking-wide">Last Updated: December 2025</h3>
              <p className="text-xl text-gray-600 mb-8">Questions? We're here to help.</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  to="/contact" 
                  className="bg-rose-500 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-rose-600"
                >
                  CONTACT US
                </Link>
                <Link 
                  to="/terms" 
                  className="border-2 border-rose-200 text-gray-900 px-8 py-4 rounded-lg font-bold text-lg hover:bg-rose-50"
                >
                  TERMS & CONDITIONS
                </Link>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
