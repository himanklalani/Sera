import React from 'react';
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
          "text": "Sera jewelry is crafted using high-quality base metals with a premium protective finish. This ensures durability, a beautiful shine, and a comfortable feel for everyday wear."
        }
      },
      {
        "@type": "Question",
        "name": "Can I wear this jewelry every day?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, our pieces are thoughtfully designed to be worn comfortably all day. We recommend following our care instructions to keep the finish looking its absolute best over time."
        }
      },
      {
        "@type": "Question",
        "name": "Is the jewelry comfortable to wear?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Absolutely. We focus on creating lightweight, beautifully finished pieces that feel as good as they look, perfect for seamlessly stacking or wearing solo from morning to night."
        }
      }
    ]
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-16 md:py-24 font-serif">
      <SEO 
        title="Our Materials & Quality | Sera Jewelry"
        description="Discover the premium materials and craftsmanship behind Sera's jewelry. Designed for everyday elegance, durability, and ultimate comfort."
        canonicalUrl="https://www.serastore.in/materials"
        schema={faqSchema}
      />
      
      <h1 className="text-4xl md:text-5xl font-light text-gray-900 mb-8">Our Materials & Quality</h1>
      
      <div className="prose prose-rose max-w-none text-gray-700">
        <p className="text-lg leading-relaxed mb-6">
          We believe that everyday luxury should be both accessible and beautiful. That's why every piece of Sera jewelry is meticulously crafted using carefully selected materials designed for elegance, comfort, and longevity.
        </p>

        <h2 className="text-2xl font-medium text-gray-900 mt-10 mb-4">Quality Foundation</h2>
        <p className="mb-6">
          The foundation of our jewelry relies on robust, high-quality base metals. Instead of cutting corners, we prioritize a solid core that provides the perfect, unyielding canvas for our signature finish, giving each piece a premium weight and feel.
        </p>

        <h2 className="text-2xl font-medium text-gray-900 mt-10 mb-4">Premium Finish</h2>
        <p className="mb-6">
          To achieve our luxurious look, we apply an advanced, high-grade protective coating to every piece. This technique creates a rich, radiant shine that is designed to withstand the rigors of everyday life beautifully.
        </p>

        <h2 className="text-2xl font-medium text-gray-900 mt-10 mb-4">Designed for Comfort</h2>
        <p className="mb-6">
          Beauty shouldn't mean compromise. We are committed to ensuring our collection is lightweight and exceptionally smooth. It is designed to be gentle to the touch and meant to be worn comfortably all day, every day.
        </p>

        <h2 className="text-2xl font-medium text-gray-900 mt-10 mb-4">The Sera Promise</h2>
        <p className="mb-6">
          Our commitment to quality craftsmanship ensures that your rings, necklaces, and bracelets look stunning when you put them on, and stay beautiful as you wear them. We create jewelry designed to seamlessly blend into your life and elevate your everyday style.
        </p>
      </div>
    </div>
  );
};

export default MaterialsGuide;

