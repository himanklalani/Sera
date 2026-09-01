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
          "text": "While our jewelry is highly resistant to water, harsh chemicals can gradually break down the protective coating. We strongly recommend applying perfumes, lotions, and hand sanitizers before putting on your jewelry."
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
        description="Learn how to care for your anti-tarnish and waterproof jewelry from Sera. Keep your minimalist necklaces and rings shining forever."
        canonicalUrl="https://www.serastore.in/jewelry-care"
        schema={faqSchema}
      />
      
      <h1 className="text-4xl md:text-5xl font-light text-gray-900 mb-8">Jewelry Care Guide</h1>
      
      <div className="prose prose-rose max-w-none text-gray-700">
        <p className="text-lg leading-relaxed mb-6">
          At Sera, we craft our jewelry to be as resilient as it is beautiful. Our anti-tarnish, waterproof pieces are designed for everyday wear, but a little love goes a long way in ensuring they maintain their brilliant shine for years to come. Curious about what goes into our pieces? <Link to="/materials" className="text-rose-600 font-medium hover:underline">Read our full Materials Guide</Link>.
        </p>

        <h2 className="text-2xl font-medium text-gray-900 mt-10 mb-4">1. Is it truly waterproof?</h2>
        <p className="mb-6">
          Yes! Our premium materials and advanced waterproof finish ensure that your jewelry can withstand water. You can confidently wear our pieces while washing your hands, showering, or getting caught in the rain without worrying about immediate tarnishing.
        </p>

        <h2 className="text-2xl font-medium text-gray-900 mt-10 mb-4">2. Handling Chemicals & Perfumes</h2>
        <p className="mb-6">
          While our jewelry is highly resistant to water, harsh chemicals can gradually break down the protective coating. We strongly recommend applying perfumes, lotions, hairsprays, and hand sanitizers <strong>before</strong> putting on your jewelry. Let the products dry completely to preserve the finish.
        </p>

        <h2 className="text-2xl font-medium text-gray-900 mt-10 mb-4">3. Safe Storage</h2>
        <p className="mb-6">
          When you're not wearing your Sera pieces, store them in a cool, dry place. The complimentary pouch or box your jewelry arrived in is perfect for keeping it safe from scratching against other harder metals. 
        </p>

        <h2 className="text-2xl font-medium text-gray-900 mt-10 mb-4">4. How to Clean Your Jewelry</h2>
        <p className="mb-6">
          To restore the shine and remove natural body oils, simply wipe your jewelry with a soft, non-abrasive microfiber cloth. For a deeper clean, use mild soap and warm water, then gently pat completely dry. Avoid using harsh chemical jewelry cleaners as they can strip the anti-tarnish coating.
        </p>
      </div>
    </div>
  );
};

export default JewelryCare;
