import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

// Placeholder components for sections
const HeroSection = () => {
  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{ 
          backgroundImage: 'url("https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=2070&auto=format&fit=crop")',
          filter: 'brightness(0.6)'
        }}
      />
      
      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center px-4">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="text-5xl md:text-7xl font-serif mb-4 tracking-wide"
        >
          Welcome to Sera
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.0 }}
          className="text-xl md:text-2xl font-light tracking-wider"
        >
          Where elegance meets intention
        </motion.p>
      </div>
    </div>
  );
};

const CategoriesSection = () => {
  const navigate = useNavigate();
  const categories = [
    { name: 'EARRINGS', img: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=1000&auto=format&fit=crop' },
    { name: 'BRACELET', img: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=1000&auto=format&fit=crop' },
    { name: 'RINGS', img: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=1000&auto=format&fit=crop' },
    { name: 'NECKLACE', img: 'https://images.unsplash.com/photo-1599643478518-17488fbbcd75?q=80&w=1000&auto=format&fit=crop' },
  ];

  return (
    <section className="py-20 px-6 bg-white">
      <h2 className="text-4xl font-serif text-center mb-12 uppercase tracking-widest text-gray-900">Explore Categories</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {categories.map((cat) => (
          <div 
            key={cat.name} 
            className="group cursor-pointer"
            onClick={() => navigate(`/shop?category=${cat.name}`)}
          >
            <div className="overflow-hidden aspect-square mb-4">
              <img 
                src={cat.img} 
                alt={cat.name} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </div>
            <h3 className="text-center font-serif text-xl tracking-widest group-hover:text-rose-500 transition-colors">
              {cat.name}
            </h3>
          </div>
        ))}
      </div>
    </section>
  );
};

const GiftingSection = () => {
  return (
    <section className="flex flex-col md:flex-row h-auto md:h-[600px]">
      <div className="w-full md:w-1/2 h-[400px] md:h-full">
         <img 
            src="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=1000&auto=format&fit=crop" 
            alt="Gifting" 
            className="w-full h-full object-cover"
         />
      </div>
      <div className="w-full md:w-1/2 bg-baby-pink flex flex-col items-center justify-center p-12 text-center">
        <h2 className="text-4xl md:text-5xl font-serif mb-6 text-gray-900">Ace the art of Gifting</h2>
        <p className="max-w-md text-lg text-gray-700 leading-relaxed mb-8">
          Jewellery that feels personal, packaging that looks like a celebration. Whether it's a thoughtful surprise or a spontaneous gesture, our pieces come ready to gift, no extra wrapping required.
        </p>
        <button className="px-8 py-3 border border-gray-900 text-gray-900 uppercase tracking-widest hover:bg-gray-900 hover:text-white transition-colors duration-300">
          Shop Gifts
        </button>
      </div>
    </section>
  );
};

const BestsellersSection = () => {
  // Mock data for now
  const products = [
    { id: 1, name: 'Gold Hoops', price: 1200, img: 'https://images.unsplash.com/photo-1630019852942-f89202989a51?q=80&w=1000&auto=format&fit=crop' },
    { id: 2, name: 'Pearl Necklace', price: 2500, img: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?q=80&w=1000&auto=format&fit=crop' },
    { id: 3, name: 'Diamond Ring', price: 5000, img: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=1000&auto=format&fit=crop' },
    { id: 4, name: 'Silver Bracelet', price: 1800, img: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=1000&auto=format&fit=crop' },
  ];

  return (
    <section className="py-20 px-6 bg-rose-50">
      <h2 className="text-4xl font-serif text-center mb-12 text-white drop-shadow-md">Our Bestsellers</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl hover:shadow-rose-200 transition-shadow duration-300 group">
             <div className="relative aspect-square overflow-hidden bg-gray-100">
                <img 
                  src={product.img} 
                  alt={product.name} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
             </div>
             <div className="p-4 text-center">
                <h3 className="font-serif text-lg mb-2">{product.name}</h3>
                <p className="text-gray-600 mb-4">Rs. {product.price}</p>
                <button className="w-full bg-rose-500 text-white py-2 rounded uppercase text-sm tracking-wider hover:bg-rose-600 transition-colors">
                  Add to Cart
                </button>
             </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default function Home() {
  return (
    <div>
      <HeroSection />
      <CategoriesSection />
      <GiftingSection />
      <BestsellersSection />
    </div>
  );
}
