import React from 'react';

export const About = () => (
  <div className="container mx-auto px-6 py-24">
    <h1 className="text-4xl font-serif mb-8 text-center">About Sera</h1>
    <div className="max-w-3xl mx-auto prose lg:prose-xl">
      <p className="text-gray-600 mb-6">
        Sera is a luxury jewelry brand dedicated to bringing you the finest craftsmanship and timeless designs. 
        Our collection is curated with love and passion, ensuring that every piece tells a unique story.
      </p>
      <p className="text-gray-600">
        Founded in 2024, we believe in the power of elegance and the beauty of simplicity. 
        Whether you are looking for a statement piece or everyday wear, Sera has something for you.
      </p>
    </div>
  </div>
);

export const FAQ = () => (
  <div className="container mx-auto px-6 py-24">
    <h1 className="text-4xl font-serif mb-8 text-center">Frequently Asked Questions</h1>
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h3 className="text-xl font-bold mb-2">What implies shipping?</h3>
        <p className="text-gray-600">We offer free shipping on all orders above $500. Standard shipping takes 3-5 business days.</p>
      </div>
      <div>
        <h3 className="text-xl font-bold mb-2">Do you offer international shipping?</h3>
        <p className="text-gray-600">Yes, we ship globally. Shipping rates vary by location.</p>
      </div>
      <div>
        <h3 className="text-xl font-bold mb-2">What is your return policy?</h3>
        <p className="text-gray-600">You can return any unworn item within 30 days of purchase for a full refund.</p>
      </div>
    </div>
  </div>
);

export const Terms = () => (
  <div className="container mx-auto px-6 py-24">
    <h1 className="text-4xl font-serif mb-8 text-center">Terms & Conditions</h1>
    <div className="max-w-3xl mx-auto">
      <p className="text-gray-600 mb-4">
        Welcome to Sera. By accessing or using our website, you agree to be bound by these terms and conditions.
      </p>
      <h2 className="text-2xl font-bold mt-8 mb-4">Use of Website</h2>
      <p className="text-gray-600 mb-4">
        You may use our website only for lawful purposes. You must not use our website in any way that causes, or may cause, damage to the website or impairment of the availability or accessibility of the website.
      </p>
      <h2 className="text-2xl font-bold mt-8 mb-4">Intellectual Property</h2>
      <p className="text-gray-600 mb-4">
        All content on this website, including text, graphics, logos, and images, is the property of Sera and is protected by copyright laws.
      </p>
    </div>
  </div>
);
