import React from 'react';
import SEO from '../components/SEO';

const MaterialsGuide = () => {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is anti tarnish jewelry made of?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Sera anti-tarnish jewelry is crafted with a high-quality stainless steel base and coated using Physical Vapor Deposition (PVD) plating. This makes it waterproof, highly durable, and resistant to tarnishing, unlike cheap brass or copper alloys."
        }
      },
      {
        "@type": "Question",
        "name": "Is stainless steel jewelry waterproof?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, our high-quality stainless steel base is inherently waterproof. When combined with our premium PVD plating, the jewelry is designed to be worn comfortably all day through workouts and showers without rusting or fading."
        }
      },
      {
        "@type": "Question",
        "name": "Will this jewelry turn my skin green?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No. We refuse to use nickel or lead, and our stainless steel base does not oxidize quickly like brass or copper. Our entire collection is allergy-resistant and skin-friendly."
        }
      }
    ]
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-16 md:py-24 font-serif">
      <SEO 
        title="Our Materials | High Quality Anti-Tarnish Jewelry"
        description="Discover the premium, skin-friendly materials behind Sera's waterproof and anti-tarnish jewelry. Crafted with high-quality stainless steel and premium plating."
        canonicalUrl="https://www.serastore.in/materials"
        schema={faqSchema}
      />
      
      <h1 className="text-4xl md:text-5xl font-light text-gray-900 mb-8">Our Materials & Quality</h1>
      
      <div className="prose prose-rose max-w-none text-gray-700">
        <p className="text-lg leading-relaxed mb-6">
          We believe that everyday luxury should be accessible and enduring. That's why every piece of Sera jewelry is meticulously crafted using modern, high-performance materials designed to resist tarnishing, fading, and skin irritation.
        </p>

        <h2 className="text-2xl font-medium text-gray-900 mt-10 mb-4">Premium Stainless Steel Base</h2>
        <p className="mb-6">
          The foundation of our jewelry is high-quality stainless steel—a premium, durable metal. Unlike cheap brass or copper alloys that oxidize quickly and turn your skin green, stainless steel is inherently highly durable, waterproof, and generally allergy-resistant. It provides the perfect, unyielding canvas for our plating.
        </p>

        <h2 className="text-2xl font-medium text-gray-900 mt-10 mb-4">Premium PVD Plating</h2>
        <p className="mb-6">
          To achieve our signature luxurious finish, we use an advanced technique called Physical Vapor Deposition (PVD) to coat our stainless steel base. PVD plating binds to the steel at a molecular level, resulting in a coating that is up to 10 times thicker and vastly more durable than traditional plating.
        </p>

        <h2 className="text-2xl font-medium text-gray-900 mt-10 mb-4">Skin-Friendly & Allergy-Resistant</h2>
        <p className="mb-6">
          Say goodbye to itchy earlobes and green rings. Because we refuse to use nickel or lead in our manufacturing process, our entire collection is crafted to be allergy-resistant. It is designed to be gentle on sensitive skin and meant to be worn comfortably all day, every day.
        </p>

        <h2 className="text-2xl font-medium text-gray-900 mt-10 mb-4">The Sera Promise</h2>
        <p className="mb-6">
          Our commitment to these premium materials ensures that your rings, necklaces, and bracelets are waterproof, sweatproof, and anti-tarnish. We create jewelry that lives with you, through workouts, showers, and celebrations.
        </p>
      </div>
    </div>
  );
};

export default MaterialsGuide;
