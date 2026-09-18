import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

const JewelryCare = () => {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Is Sera anti-tarnish jewelry truly waterproof?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes! Our premium materials and advanced waterproof finish ensure that your jewelry can withstand water. You can confidently wear our pieces while washing your hands, showering, or getting caught in the rain."
        }
      },
      {
        "@type": "Question",
        "name": "Can I wear perfume with anti-tarnish jewelry?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "While our jewelry is highly resistant to water, harsh chemicals can gradually break down the protective finish. We strongly recommend applying perfumes, lotions, and hand sanitizers before putting on your jewelry."
        }
      },
      {
        "@type": "Question",
        "name": "How do I clean my anti-tarnish jewelry?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "To restore the shine, simply wipe your jewelry with a soft, non-abrasive microfiber cloth. For a deeper clean, use mild soap and warm water, then gently pat completely dry. Avoid using harsh chemical jewelry cleaners."
        }
      }
    ]
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-16 md:py-24 font-serif">
      <SEO 
        title="Jewelry Care Guide | Sera Anti-Tarnish Jewelry"
        description="Learn how to care for your anti-tarnish and waterproof jewelry from Sera. Keep your minimalist necklaces, earrings, and bracelets shining forever."
        canonicalUrl="https://www.serastore.in/jewelry-care"
        schema={faqSchema}
      />
      
      <h1 className="text-4xl md:text-5xl font-light text-gray-900 mb-8">Jewelry Care Guide</h1>
      
      <div className="prose prose-rose max-w-none text-gray-700">
        <p className="text-lg leading-relaxed mb-6">
          At Sera, we craft our jewelry to be as resilient as it is beautiful. Our anti-tarnish, waterproof pieces are designed for everyday wear, but a little love goes a long way in ensuring they maintain their brilliant shine for years to come. Curious about the craftsmanship behind our collection? Explore our <Link to="/materials" className="text-rose-600 font-medium hover:underline">materials and quality guide</Link>.
        </p>

        <h2 className="text-2xl font-medium text-gray-900 mt-10 mb-4">1. Is it truly waterproof?</h2>
        <p className="mb-6">
          Yes! Our premium materials and advanced waterproof finish ensure that your jewelry can withstand water. You can confidently wear our <Link to="/shop/necklaces" className="text-rose-600 font-medium hover:underline">anti-tarnish waterproof necklaces</Link> and <Link to="/shop/earrings" className="text-rose-600 font-medium hover:underline">waterproof everyday earrings</Link> while washing your hands, showering, or working out without worrying about discoloration or dullness.
        </p>

        <h2 className="text-2xl font-medium text-gray-900 mt-10 mb-4">2. Handling Chemicals & Perfumes</h2>
        <p className="mb-6">
          While our jewelry is highly resistant to water and sweat, harsh chemicals can gradually wear down the protective finish over time. We strongly recommend applying perfumes, lotions, hairsprays, and hand sanitizers <strong>before</strong> putting on your <Link to="/shop/bracelets" className="text-rose-600 font-medium hover:underline">tarnish-resistant bracelets</Link> and necklaces. Let the products dry completely to preserve the finish.
        </p>

        <h2 className="text-2xl font-medium text-gray-900 mt-10 mb-4">3. Safe Storage</h2>
        <p className="mb-6">
          When you're not wearing your Sera pieces, store them in a cool, dry place. The complimentary pouch or box your jewelry arrived in is perfect for keeping it safe from friction against other items. If you own one of our <Link to="/shop/combos" className="text-rose-600 font-medium hover:underline">matching jewelry combo sets</Link>, storing each piece individually prevents delicate chains from intertwining.
        </p>

        <h2 className="text-2xl font-medium text-gray-900 mt-10 mb-4">4. How to Clean Your Jewelry</h2>
        <p className="mb-6">
          To restore the shine and remove natural body oils, simply wipe your jewelry with a soft, non-abrasive microfiber cloth. For a deeper clean, use mild soap and warm water, then gently pat completely dry. Avoid using harsh chemical jewelry cleaners as they can strip the anti-tarnish finish.
        </p>

        {/* Strategy 4 Contextual Links Section */}
        <div className="mt-12 p-8 bg-rose-50/50 rounded-2xl border border-rose-100 not-prose">
          <h3 className="text-xl font-bold text-gray-900 mb-3 font-serif">Explore Everyday Waterproof Essentials</h3>
          <p className="text-gray-600 text-sm mb-6 font-sans">
            Ready to add effortless, worry-free pieces to your daily rotation? Discover our core categories engineered for real everyday living.
          </p>
          <div className="flex flex-wrap gap-3 font-sans">
            <Link to="/shop/necklaces" className="text-xs font-semibold px-4 py-2 bg-white border border-gray-200 rounded-full text-gray-800 hover:border-rose-500 hover:text-rose-600 transition-colors">
              Waterproof Necklaces
            </Link>
            <Link to="/shop/earrings" className="text-xs font-semibold px-4 py-2 bg-white border border-gray-200 rounded-full text-gray-800 hover:border-rose-500 hover:text-rose-600 transition-colors">
              Anti-Tarnish Earrings
            </Link>
            <Link to="/shop/bracelets" className="text-xs font-semibold px-4 py-2 bg-white border border-gray-200 rounded-full text-gray-800 hover:border-rose-500 hover:text-rose-600 transition-colors">
              Tarnish-Resistant Bracelets
            </Link>
            <Link to="/shop/combos" className="text-xs font-semibold px-4 py-2 bg-white border border-gray-200 rounded-full text-gray-800 hover:border-rose-500 hover:text-rose-600 transition-colors">
              Jewelry Combo Sets
            </Link>
            <Link to="/gifts" className="text-xs font-semibold px-4 py-2 bg-rose-600 text-white rounded-full hover:bg-rose-700 transition-colors">
              Curated Gifting Hub
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JewelryCare;
