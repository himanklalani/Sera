import React from 'react';
import { Helmet } from 'react-helmet-async';

const MaterialsGuide = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16 md:py-24 font-serif">
      <Helmet>
        <title>Our Materials | High Quality Anti-Tarnish Jewelry | Sera</title>
        <meta name="description" content="Discover the premium, hypoallergenic materials behind Sera's waterproof and anti-tarnish jewelry. Crafted with 316L stainless steel and 18k gold plating." />
      </Helmet>
      
      <h1 className="text-4xl md:text-5xl font-light text-gray-900 mb-8">Our Materials & Quality</h1>
      
      <div className="prose prose-rose max-w-none text-gray-700">
        <p className="text-lg leading-relaxed mb-6">
          We believe that everyday luxury should be accessible and enduring. That's why every piece of Sera jewelry is meticulously crafted using modern, high-performance materials designed to resist tarnishing, fading, and skin irritation.
        </p>

        <h2 className="text-2xl font-medium text-gray-900 mt-10 mb-4">316L Stainless Steel Base</h2>
        <p className="mb-6">
          The foundation of our jewelry is 316L Stainless Steel—a premium, surgical-grade metal. Unlike cheap brass or copper alloys that oxidize quickly and turn your skin green, stainless steel is inherently highly durable, waterproof, and entirely hypoallergenic. It provides the perfect, unyielding canvas for our gold plating.
        </p>

        <h2 className="text-2xl font-medium text-gray-900 mt-10 mb-4">18K Gold PVD Plating</h2>
        <p className="mb-6">
          To achieve our signature luxurious finish, we use an advanced technique called Physical Vapor Deposition (PVD) to coat our stainless steel base with real 18-karat gold. PVD plating binds the gold to the steel at a molecular level, resulting in a coating that is up to 10 times thicker and vastly more durable than traditional gold plating.
        </p>

        <h2 className="text-2xl font-medium text-gray-900 mt-10 mb-4">Hypoallergenic & Skin-Safe</h2>
        <p className="mb-6">
          Say goodbye to itchy earlobes and green rings. Because we refuse to use nickel or lead in our manufacturing process, our entire collection is 100% hypoallergenic. It is completely safe for sensitive skin and meant to be worn comfortably all day, every day.
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
