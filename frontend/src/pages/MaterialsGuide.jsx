import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

const MaterialsGuide = () => {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is Sera jewelry made of?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Sera jewelry is crafted using high-quality base metals with an advanced protective finish. This ensures durability, a beautiful radiant shine, and a comfortable feel for everyday wear."
        }
      },
      {
        "@type": "Question",
        "name": "What fabrics does Sera use for apparel?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Sera apparel features premium cotton blends engineered for breathability, softness, and wrinkle resistance. This ensures all-day comfort and shape retention through daily wear."
        }
      },
      {
        "@type": "Question",
        "name": "Can I wear Sera jewelry every day?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, our pieces are thoughtfully designed to be sweatproof, waterproof, and comfortable for all-day wear. Follow our care instructions to keep the finish looking its absolute best."
        }
      }
    ]
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-16 md:py-24 font-serif">
      <SEO 
        title="Our Materials & Quality | Sera Jewelry & Apparel"
        description="Discover the premium materials behind Sera's waterproof jewelry and breathable cotton blend apparel. Designed for everyday elegance, durability, and comfort."
        canonicalUrl="https://www.serastore.in/materials"
        schema={faqSchema}
      />
      
      <h1 className="text-4xl md:text-5xl font-light text-gray-900 mb-8">Our Materials & Quality</h1>
      
      <div className="prose prose-rose max-w-none text-gray-700">
        <p className="text-lg leading-relaxed mb-6">
          We believe that premium everyday fashion and jewelry should be accessible, durable, and effortlessly wearable. Every piece in the Sera collection—from our <Link to="/shop/necklaces" className="text-rose-600 font-medium hover:underline">anti-tarnish waterproof necklaces</Link> to our <Link to="/shop/apparel" className="text-rose-600 font-medium hover:underline">chic cotton blend tops</Link>—is meticulously crafted using carefully selected materials engineered for modern lifestyles.
        </p>

        <h2 className="text-2xl font-medium text-gray-900 mt-10 mb-4">Waterproof Anti-Tarnish Jewelry</h2>
        <p className="mb-4">
          Traditional fashion accessories often tarnish, turn green, or lose their luster after exposure to moisture and sweat. Sera addresses this by pairing solid base metals with an advanced protective finish. This technique creates a rich, radiant barrier designed to withstand water, sweat, and daily activity.
        </p>
        <p className="mb-6">
          Whether you are choosing our <Link to="/shop/earrings" className="text-rose-600 font-medium hover:underline">waterproof everyday earrings</Link> or stacking <Link to="/shop/bracelets" className="text-rose-600 font-medium hover:underline">tarnish-resistant bracelets</Link>, each piece offers a solid, premium weight without feeling heavy or cumbersome on your skin.
        </p>

        <h2 className="text-2xl font-medium text-gray-900 mt-10 mb-4">Premium Cotton Blend Apparel</h2>
        <p className="mb-4">
          Our women's apparel line is built around high-grade cotton blends. While pure cotton offers breathability, it easily wrinkles and loses structure after repeated washing. By combining natural breathable cotton fibers with resilient elastic components, our tops deliver:
        </p>
        <ul className="list-disc pl-6 mb-6 space-y-2">
          <li><strong>All-Day Breathability:</strong> Keeps you cool and comfortable from morning meetings to evening dinners.</li>
          <li><strong>Wrinkle Resistance:</strong> Structured weave that retains its smooth drape with minimal ironing required.</li>
          <li><strong>Shape Retention:</strong> Retains its flattering silhouette wash after wash without stretching out or shrinking.</li>
        </ul>
        <p className="mb-6">
          Explore our <Link to="/shop/apparel" className="text-rose-600 font-medium hover:underline">women's cotton blend tops</Link> to find minimalist silhouettes tailored for effortless pairing with your favorite jewelry.
        </p>

        <h2 className="text-2xl font-medium text-gray-900 mt-10 mb-4">Designed for Comfort & Longevity</h2>
        <p className="mb-6">
          Beauty should never require compromise. All Sera jewelry is lightweight and polished to a mirror-smooth touch for seamless stacking. For detailed longevity tips, refer to our <Link to="/jewelry-care" className="text-rose-600 font-medium hover:underline">complete jewelry care guide</Link>.
        </p>

        {/* Strategy 4 Contextual Category Links */}
        <div className="mt-12 p-8 bg-stone-50 rounded-2xl border border-stone-200 not-prose">
          <h3 className="text-xl font-bold text-gray-900 mb-3 font-serif">Explore the Sera Range</h3>
          <p className="text-gray-600 text-sm mb-6 font-sans">
            Discover our curated categories designed for durable daily wear and effortless gifting.
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
            <Link to="/shop/apparel" className="text-xs font-semibold px-4 py-2 bg-white border border-gray-200 rounded-full text-gray-800 hover:border-rose-500 hover:text-rose-600 transition-colors">
              Chic Women's Tops
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

export default MaterialsGuide;
