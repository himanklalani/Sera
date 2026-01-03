// InfoPage.jsx
import React, { useState } from 'react';
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
      <div className="max-w-4xl mx-auto mb-20">
        <div className="space-y-8">
          <div className="space-y-6 text-center">
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
        </div>
      </div>




      {/* Values */}
      <section className="text-center mb-24">
        <h2 className="text-4xl font-bold text-gray-900 mb-16 tracking-tight">Our Values</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="p-8 rounded-2xl bg-white border border-rose-100 shadow-lg">
            <div className="w-20 h-20 bg-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-6 text-2xl text-white">💎</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4 tracking-wide uppercase">Quality</h3>
            <p className="text-gray-700 leading-relaxed">Premium anti-tarnish materials.</p>
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




export const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);



  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };



  const faqs = [
    {
      question: "Shipping Timeline?",
      answer: "Orders ship within 2-3 business days via courier services & delivery may take 5-7 working days. Free shipping on orders above ₹999."
    },
    {
      question: "International Shipping?",
      answer: "Currently shipping within India only. International shipping coming soon!"
    },
    {
      question: "Payment Methods?",
      answer: "UPI, Credit/Debit Cards, Net Banking, Wallets via Razorpay. All transactions encrypted with SSL."
    },
    {
      question: "Material Quality?",
      answer: "All jewelry is premium anti-tarnish imitation crafted with high quality materials."
    },
    {
      question: "Exchange Policy?",
      answer: (
        <span>
          <strong>No refunds, exchanges only within 3 days.</strong> ₹100 fee (free if our mistake). See <Link to="/returns" className="text-rose-600 font-bold hover:underline">full policy</Link>.
        </span>
      )
    },
    {
      question: "How to Take Care of Your Anti-Tarnish Jewellery?",
      answer: (
        <div className="space-y-4">
          <p className="text-gray-700">
            Even though SERA jewellery is crafted with an anti-tarnish coating, taking proper care ensures your pieces stay shiny and beautiful for years.
          </p>
          <p className="text-gray-700 font-semibold">
            Follow these simple tips to protect your jewellery's lustre and keep it looking brand new:
          </p>
          
          <div className="space-y-5 mt-4">
            <div>
              <h4 className="font-bold text-rose-600 mb-2">1. Store It Right</h4>
              <ul className="space-y-1 ml-4 text-gray-700">
                <li>• Keep your jewellery in a cool, dry place, away from humidity and direct sunlight.</li>
                <li>• Use the SERA box or a soft zip pouch provided to prevent scratches and moisture exposure.</li>
                <li>• Store each piece separately to avoid tangling or rubbing.</li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-rose-600 mb-2">2. Avoid Contact with Chemicals</h4>
              <ul className="space-y-1 ml-4 text-gray-700">
                <li>• Remove your jewellery before applying perfume, lotion, makeup, or hair products.</li>
                <li>• Avoid wearing your pieces while swimming, showering, or exercising, as sweat and chlorine can dull the shine.</li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-rose-600 mb-2">3. Handle with Care</h4>
              <ul className="space-y-1 ml-4 text-gray-700">
                <li>• Always handle your jewellery with clean, dry hands.</li>
                <li>• Don't pull on delicate chains or pressure-fit designs — they can lose shape over time.</li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-rose-600 mb-2">4. Clean Gently</h4>
              <ul className="space-y-1 ml-4 text-gray-700">
                <li>• Wipe your pieces after each use with a soft, dry microfiber or cotton cloth to remove oils and sweat.</li>
                <li>• For light cleaning, gently rub the surface; avoid chemical jewellery cleaners that may strip the anti-tarnish coating.</li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-rose-600 mb-2">5. Wear It Often</h4>
              <p className="ml-4 text-gray-700">
                Believe it or not, the natural oils on your skin actually help keep your jewellery from tarnishing faster. So go ahead — wear your favourite SERA piece regularly!
              </p>
            </div>
          </div>
        </div>
      )
    }
  ];



  return (
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
          {faqs.map((faq, index) => (
            <div 
              key={index}
              className="bg-white rounded-2xl border border-rose-100 shadow-lg hover:shadow-xl transition-shadow"
            >
              <div 
                className="flex items-start justify-between cursor-pointer p-8"
                onClick={() => toggleFAQ(index)}
              >
                <h3 className="text-2xl font-bold text-gray-900 hover:text-rose-600 transition-colors flex-1 pr-4">
                  {faq.question}
                </h3>
                <span 
                  className={`text-3xl transition-transform duration-300 flex-shrink-0 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                >
                  ▼
                </span>
              </div>
              {openIndex === index && (
                <div className="px-8 pb-8 text-gray-700 leading-relaxed text-lg animate-fadeIn">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
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
};
