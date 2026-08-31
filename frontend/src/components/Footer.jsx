import { FaInstagram, FaPinterest } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';


const Footer = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;

    try {
      setLoading(true);
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/newsletter`, { email });
      toast.success(res.data.message || 'Thank you for subscribing to Sera!');
      setEmail('');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to subscribe. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="bg-rose-50 pt-16 pb-8 px-6 md:px-12 text-gray-900 border-t border-rose-200 min-h-[400px]">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-12 gap-12">
        {/* Left Section: Brand & Description */}
        <div className="md:col-span-5 space-y-6">
          <img src="/logo.avif" alt="SERA Logo" className="h-32 md:h-40 w-auto object-contain -ml-3 -mt-8 md:-mt-12 -mb-8 md:-mb-12" />
          <div className="space-y-4 text-sm leading-relaxed max-w-md">
            <p className="font-medium">Where elegance meets intention.</p>
            <p>
              SERA was born from a love of timeless simplicity, bringing together thoughtfully tailored apparel and refined jewellery. Every piece in our collection is designed to celebrate you your story, your strength, your softness. From romantic, effortless silhouettes to delicate necklaces, bracelets, and earrings, our creations are crafted with care to blend seamlessly into your daily life while standing out with quiet grace.
            </p>
            <p>Let <span className="font-bold">SERA</span> be your everyday luxury.</p>
          </div>
          {/* Social Icons Row */}
          <div className="flex items-center gap-4 pt-4">
            <a href="https://www.instagram.com/serastore.in" target="_blank" rel="noopener noreferrer" 
               className="group" aria-label="Instagram">
              <FaInstagram className="w-6 h-6 text-gray-900 group-hover:text-rose-600 transition-colors duration-300 hover:scale-110" />
            </a>
            <a href="https://pinterest.com" target="_blank" rel="noopener noreferrer" 
               className="group" aria-label="Pinterest">
              <FaPinterest className="w-6 h-6 text-gray-900 group-hover:text-rose-600 transition-colors duration-300 hover:scale-110" />
            </a>
          </div>

          {/* Newsletter Signup */}
          <div className="pt-8">
            <h3 className="font-serif text-xl font-bold text-gray-900 mb-2 tracking-wide">Join the Sera Insider</h3>
            <p className="text-sm text-gray-700 mb-4 font-medium">Subscribe for exclusive offers, early access, and jewelry care tips.</p>
            <form className="flex max-w-sm" onSubmit={handleSubscribe}>
              <input 
                type="email" 
                placeholder="Enter your email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-4 py-3 border border-rose-200 rounded-l-lg focus:outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-400 text-sm bg-white/50 backdrop-blur-sm"
                required
              />
              <button 
                type="submit"
                disabled={loading}
                className="bg-rose-600 text-white px-6 py-3 rounded-r-lg hover:bg-rose-700 transition-colors text-sm font-bold tracking-widest uppercase shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? '...' : 'Subscribe'}
              </button>
            </form>
          </div>
        </div>


        {/* Right Section: Links */}
        <div className="md:col-span-7 grid grid-cols-1 md:grid-cols-3 gap-8 md:pl-12">
          
          {/* Quick Links */}
          <div className="space-y-6">
            <h3 className="font-bold tracking-widest uppercase text-sm text-rose-600">Quick Links</h3>
            <ul className="space-y-4 text-sm font-light">
              <li><Link to="/privacy-policy" className="hover:text-rose-600 transition-colors group flex items-center gap-2 hover:gap-3">PRIVACY POLICY <span className="w-1 h-1 bg-rose-600 rounded-full scale-0 group-hover:scale-100 transition-all duration-300"></span></Link></li>
              <li><Link to="/terms" className="hover:text-rose-600 transition-colors group flex items-center gap-2 hover:gap-3">TERMS & CONDITIONS <span className="w-1 h-1 bg-rose-600 rounded-full scale-0 group-hover:scale-100 transition-all duration-300"></span></Link></li>
              <li><Link to="/returns" className="hover:text-rose-600 transition-colors group flex items-center gap-2 hover:gap-3">RETURNS & EXCHANGE <span className="w-1 h-1 bg-rose-600 rounded-full scale-0 group-hover:scale-100 transition-all duration-300"></span></Link></li>
              <li><Link to="/contact" className="hover:text-rose-600 transition-colors group flex items-center gap-2 hover:gap-3">CONTACT <span className="w-1 h-1 bg-rose-600 rounded-full scale-0 group-hover:scale-100 transition-all duration-300"></span></Link></li>
              <li><Link to="/journal" className="hover:text-rose-600 transition-colors group flex items-center gap-2 hover:gap-3">JOURNAL <span className="w-1 h-1 bg-rose-600 rounded-full scale-0 group-hover:scale-100 transition-all duration-300"></span></Link></li>
            </ul>
          </div>


          {/* Explore */}
          <div className="space-y-6">
            <h3 className="font-bold tracking-widest uppercase text-sm text-rose-600">Explore</h3>
            <ul className="space-y-4 text-sm font-light">
              <li><Link to="/shop" className="hover:text-rose-600 transition-colors group flex items-center gap-2 hover:gap-3 uppercase">Shop <span className="w-1 h-1 bg-rose-600 rounded-full scale-0 group-hover:scale-100 transition-all duration-300"></span></Link></li>
              <li><Link to="/gifts" className="hover:text-rose-600 transition-colors group flex items-center gap-2 hover:gap-3 uppercase text-rose-500 font-medium">Gifting Hub <span className="w-1 h-1 bg-rose-600 rounded-full scale-0 group-hover:scale-100 transition-all duration-300"></span></Link></li>
              <li><Link to="/jewelry-care" className="hover:text-rose-600 transition-colors group flex items-center gap-2 hover:gap-3 uppercase">Jewelry Care <span className="w-1 h-1 bg-rose-600 rounded-full scale-0 group-hover:scale-100 transition-all duration-300"></span></Link></li>
              <li><Link to="/size-guide" className="hover:text-rose-600 transition-colors group flex items-center gap-2 hover:gap-3 uppercase">Size Guide <span className="w-1 h-1 bg-rose-600 rounded-full scale-0 group-hover:scale-100 transition-all duration-300"></span></Link></li>
              <li><Link to="/materials" className="hover:text-rose-600 transition-colors group flex items-center gap-2 hover:gap-3 uppercase">Materials Guide <span className="w-1 h-1 bg-rose-600 rounded-full scale-0 group-hover:scale-100 transition-all duration-300"></span></Link></li>
              <li><Link to="/about" className="hover:text-rose-600 transition-colors group flex items-center gap-2 hover:gap-3 uppercase">About Us <span className="w-1 h-1 bg-rose-600 rounded-full scale-0 group-hover:scale-100 transition-all duration-300"></span></Link></li>
              <li><Link to="/sustainability" className="hover:text-rose-600 transition-colors group flex items-center gap-2 hover:gap-3 uppercase">Sustainability <span className="w-1 h-1 bg-rose-600 rounded-full scale-0 group-hover:scale-100 transition-all duration-300"></span></Link></li>
              <li><Link to="/faq" className="hover:text-rose-600 transition-colors group flex items-center gap-2 hover:gap-3">FAQ's <span className="w-1 h-1 bg-rose-600 rounded-full scale-0 group-hover:scale-100 transition-all duration-300"></span></Link></li>
            </ul>
          </div>


          {/* Contact Info */}
          <div className="space-y-6">
            <h3 className="font-bold tracking-widest uppercase text-sm text-rose-600">Contact</h3>
            <div className="space-y-4 text-sm font-light">
              <h4 className="font-semibold text-rose-600 mb-2 tracking-wide uppercase text-xs">Email</h4>
              <p className="flex items-start gap-2">
                <span className="w-5 h-5 mt-1 bg-rose-200 rounded-full flex-shrink-0 flex items-center justify-center">
                  <span className="text-xs font-bold text-rose-600">✉</span>
                </span>
                <a href="mailto:serajewels1@gmail.com" className="hover:text-rose-600 transition-colors break-all">serajewels1@gmail.com</a>
              </p>
              <div>
                <h4 className="font-semibold text-rose-600 mb-2 tracking-wide uppercase text-xs">Instagram</h4>
                <a href="https://www.instagram.com/serastore.in" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-rose-600 transition-colors">
                  <FaInstagram className="w-4 h-4" />
                  <span>Follow us</span>
                </a>
              </div>
              <div>
                <h4 className="font-semibold text-rose-600 mb-2 tracking-wide uppercase text-xs">Pinterest</h4>
                <a href="https://pinterest.com/serajewelry" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-rose-600 transition-colors">
                  <FaPinterest className="w-4 h-4" />
                  <span>Follow us</span>
                </a>
                
              </div>
            </div>
          </div>
        </div>
      </div>


      {/* Bottom Bar */}
      <div className="container mx-auto mt-16 pt-12 border-t border-rose-200">
        <div className="flex flex-col md:flex-row justify-between items-center text-xs tracking-widest text-gray-600 gap-6 md:gap-0">
          <div className="flex flex-wrap gap-4 md:gap-8">
            
            <Link to="/privacy-policy" className="hover:text-rose-600 transition-colors uppercase hover:underline">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-rose-600 transition-colors uppercase hover:underline">Terms of Service</Link>
            <Link to="/sitemap" className="hover:text-rose-600 transition-colors uppercase hover:underline">Sitemap</Link>
            <a><span>~developed by himanklalani@gmail.com</span></a>
            <span>© 2025 SERA. All rights reserved.</span>
            
          </div>
        </div>
      </div>
    </footer>
  );
};


export default Footer;