import { useState } from 'react';
import SEO from '../components/SEO';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!validateEmail(formData.email))
      newErrors.email = 'Invalid email format';
    if (!formData.message.trim()) newErrors.message = 'Message is required';
    return newErrors;
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setLoading(true);
    setStatus('');

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/contact`, {
        // ⚠️ backend URL + port
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setStatus("Message sent successfully! We'll get back to you soon.");
        setFormData({ name: '', email: '', subject: '', message: '' });
        setErrors({});
      } else {
        setStatus(
          data.error || data.message || 'Something went wrong. Please try again.'
        );
      }
    } catch (error) {
      setStatus('Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#ffe4e6] py-16 px-4 sm:px-6 lg:px-8">
      <SEO 
        title="Contact Us | Sera Jewels"
        description="Have a question, custom request, or need help with an order? Contact the Sera team today."
        canonicalUrl="https://www.serastore.in/contact"
        schema={{
          "@context": "https://schema.org",
          "@type": "ContactPage",
          "mainEntity": {
            "@type": "Organization",
            "name": "serastore.in",
            "url": "https://www.serastore.in",
            "email": "serajewels1@gmail.com",
            "contactPoint": {
              "@type": "ContactPoint",
              "email": "serajewels1@gmail.com",
              "contactType": "customer support"
            }
          }
        }}
      />
      <div className="max-w-6xl mx-auto">
        
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-20 items-start">
          
          {/* Left Side: Contact Info & E-E-A-T Signals */}
          <div className="lg:col-span-2 space-y-10 pt-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-serif text-[#c5a666] tracking-tight mb-4">
                Get in Touch
              </h1>
              <p className="text-base text-[#4a3b3b] leading-relaxed max-w-sm">
                Have a question, custom request, or need help with an order? We’re here to ensure your Sera experience is flawless.
              </p>
            </div>

            <div className="space-y-8">
              {/* Official Store Name */}
              <div>
                <h3 className="text-xs font-semibold tracking-[0.2em] text-[#8b6b6b] mb-2 uppercase">Official Store</h3>
                <p className="text-xl font-serif text-[#4a3b3b]">serastore.in</p>
                <p className="text-sm text-[#8b6b6b] mt-1">Premium Online Boutique</p>
              </div>

              {/* Email Support */}
              <div>
                <h3 className="text-xs font-semibold tracking-[0.2em] text-[#8b6b6b] mb-2 uppercase">Email Support</h3>
                <a href="mailto:serajewels1@gmail.com" className="text-lg font-medium text-rose-500 hover:text-rose-600 transition-colors">
                  serajewels1@gmail.com
                </a>
              </div>

              {/* Hours */}
              <div>
                <h3 className="text-xs font-semibold tracking-[0.2em] text-[#8b6b6b] mb-2 uppercase">Support Hours</h3>
                <p className="text-sm text-[#4a3b3b] leading-relaxed">
                  Monday - Saturday<br/>
                  10:00 AM - 7:00 PM (IST)
                </p>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="pt-8 border-t border-[#f9d5da] flex items-center gap-4">
              <div className="flex items-center gap-2 text-xs font-medium text-[#8b6b6b]">
                <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                Secure Checkout
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-[#8b6b6b]">
                <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Fast Responses
              </div>
            </div>
          </div>

          {/* Right Side: Form */}
          <div className="lg:col-span-3">
            <form
              onSubmit={handleSubmit}
              className="bg-[#fff7f8] border border-[#f9d5da] shadow-sm rounded-3xl p-8 md:p-10 space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name Field */}
                <div>
                  <label className="block text-xs font-semibold tracking-[0.2em] text-[#8b6b6b] mb-2 uppercase">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-xl bg-[#fffdfd] text-sm text-[#4a3b3b] placeholder-[#c09b9b] focus:outline-none focus:ring-1 focus:ring-[#f4a7b4] focus:border-[#f4a7b4] transition ${
                      errors.name ? 'border-rose-400' : 'border-[#f3c7cf]'
                    }`}
                    placeholder="Enter your full name"
                  />
                  {errors.name && (
                    <p className="mt-1 text-xs text-rose-600">{errors.name}</p>
                  )}
                </div>

                {/* Email Field */}
                <div>
                  <label className="block text-xs font-semibold tracking-[0.2em] text-[#8b6b6b] mb-2 uppercase">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-xl bg-[#fffdfd] text-sm text-[#4a3b3b] placeholder-[#c09b9b] focus:outline-none focus:ring-1 focus:ring-[#f4a7b4] focus:border-[#f4a7b4] transition ${
                      errors.email ? 'border-rose-400' : 'border-[#f3c7cf]'
                    }`}
                    placeholder="you@example.com"
                  />
                  {errors.email && (
                    <p className="mt-1 text-xs text-rose-600">{errors.email}</p>
                  )}
                </div>
              </div>

              {/* Subject Field */}
              <div>
                <label className="block text-xs font-semibold tracking-[0.2em] text-[#8b6b6b] mb-2 uppercase">
                  Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border rounded-xl bg-[#fffdfd] text-sm text-[#4a3b3b] placeholder-[#c09b9b] focus:outline-none focus:ring-1 focus:ring-[#f4a7b4] focus:border-[#f4a7b4] transition border-[#f3c7cf]"
                  placeholder="Order query, sizing, customization..."
                />
              </div>

              {/* Message Field */}
              <div>
                <label className="block text-xs font-semibold tracking-[0.2em] text-[#8b6b6b] mb-2 uppercase">
                  Message *
                </label>
                <textarea
                  name="message"
                  rows="5"
                  value={formData.message}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-xl bg-[#fffdfd] text-sm text-[#4a3b3b] placeholder-[#c09b9b] focus:outline-none focus:ring-1 focus:ring-[#f4a7b4] focus:border-[#f4a7b4] transition resize-y ${
                    errors.message ? 'border-rose-400' : 'border-[#f3c7cf]'
                  }`}
                  placeholder="Share your thoughts, questions, or story with us..."
                />
                {errors.message && (
                  <p className="mt-1 text-xs text-rose-600">{errors.message}</p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#c5a666] hover:bg-[#b19253] text-white tracking-[0.2em] text-xs font-semibold py-4 rounded-full shadow-sm transition flex items-center justify-center gap-2 uppercase"
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        className="opacity-25"
                      />
                      <path
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Sending
                  </>
                ) : (
                  'Send Message'
                )}
              </button>
            </form>

            {status && (
              <div
                className={`mt-8 p-4 rounded-2xl text-center text-sm ${
                  status.includes('successfully') || status.includes('sent')
                    ? 'bg-[#e8f5ec] text-[#276749] border border-[#c6e6cf]'
                    : 'bg-[#ffe4e6] text-[#972b39] border border-[#f8b4c0]'
                }`}
              >
                {status}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
