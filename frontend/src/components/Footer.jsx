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
      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Section: Brand & Description */}
        <div className="lg:col-span-4 space-y-6">
          <img src="/logo.avif" alt="SERA Logo" className="h-32 md:h-40 w-auto object-contain -ml-3 -mt-8 md:-mt-12 -mb-8 md:-mb-12" />
          <div className="space-y-4 text-sm leading-relaxed max-w-md">
            <p className="font-medium">Where elegance meets intention.</p>
            <p>
              SERA was born from a love of timeless simplicity, bringing together thoughtfully tailored apparel and refined jewellery. Every piece in our collection is designed to celebrate you—your story, your strength, your softness. From romantic, effortless silhouettes to delicate necklaces, bracelets, and earrings, our creations are crafted with care to blend seamlessly into your daily life while standing out with quiet grace.
            </p>
            <p>Let <span className="font-bold">SERA</span> elevate your everyday style.</p>
          </div>
          {/* Social Icons Row */}
          <div className="flex items-center gap-4 pt-4">
            <a href="https://www.instagram.com/serastore.in" target="_blank" rel="noopener noreferrer" 
               className="group" aria-label="Instagram">
              <FaInstagram className="w-6 h-6 text-gray-900 group-hover:text-rose-600 transition-colors duration-300 hover:scale-110" />
            </a>
            <a href="https://www.pinterest.com/serastore/" target="_blank" rel="noopener noreferrer" 
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
                id="newsletter-email"
                type="email" 
                placeholder="Enter your email" 
                aria-label="Email address for newsletter"
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

        {/* Right Section: 4 Distinct Link Columns */}
        <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-8">
          
          {/* Col 1: Collections with Descriptive Anchors */}
          <div className="space-y-6">
            <h3 className="font-bold tracking-widest uppercase text-xs text-rose-600">Collections</h3>
            <ul className="space-y-3 text-sm font-light">
              <li><Link to="/shop/necklaces" className="hover:text-rose-600 transition-colors group flex items-center gap-1.5 hover:gap-2.5">Waterproof Necklaces <span className="w-1 h-1 bg-rose-600 rounded-full scale-0 group-hover:scale-100 transition-all duration-300"></span></Link></li>
              <li><Link to="/shop/earrings" className="hover:text-rose-600 transition-colors group flex items-center gap-1.5 hover:gap-2.5">Anti-Tarnish Earrings <span className="w-1 h-1 bg-rose-600 rounded-full scale-0 group-hover:scale-100 transition-all duration-300"></span></Link></li>
              <li><Link to="/shop/bracelets" className="hover:text-rose-600 transition-colors group flex items-center gap-1.5 hover:gap-2.5">Tarnish-Resistant Bracelets <span className="w-1 h-1 bg-rose-600 rounded-full scale-0 group-hover:scale-100 transition-all duration-300"></span></Link></li>
              <li><Link to="/shop/combos" className="hover:text-rose-600 transition-colors group flex items-center gap-1.5 hover:gap-2.5 font-medium text-rose-600">Jewelry Combo Sets <span className="w-1 h-1 bg-rose-600 rounded-full scale-0 group-hover:scale-100 transition-all duration-300"></span></Link></li>
              <li><Link to="/shop/apparel" className="hover:text-rose-600 transition-colors group flex items-center gap-1.5 hover:gap-2.5">Chic Women's Tops <span className="w-1 h-1 bg-rose-600 rounded-full scale-0 group-hover:scale-100 transition-all duration-300"></span></Link></li>
              <li><Link to="/shop" className="hover:text-rose-600 transition-colors group flex items-center gap-1.5 hover:gap-2.5 text-xs uppercase tracking-wider text-gray-500">View All Products →</Link></li>
            </ul>
          </div>

          {/* Col 2: Gifting & Care Guides */}
          <div className="space-y-6">
            <h3 className="font-bold tracking-widest uppercase text-xs text-rose-600">Guides & Gifts</h3>
            <ul className="space-y-3 text-sm font-light">
              <li><Link to="/gifts" className="hover:text-rose-600 transition-colors group flex items-center gap-1.5 hover:gap-2.5 font-medium text-rose-600">Curated Gifting Hub <span className="w-1 h-1 bg-rose-600 rounded-full scale-0 group-hover:scale-100 transition-all duration-300"></span></Link></li>
              <li><Link to="/jewelry-care" className="hover:text-rose-600 transition-colors group flex items-center gap-1.5 hover:gap-2.5">Jewelry Care Guide <span className="w-1 h-1 bg-rose-600 rounded-full scale-0 group-hover:scale-100 transition-all duration-300"></span></Link></li>
              <li><Link to="/materials" className="hover:text-rose-600 transition-colors group flex items-center gap-1.5 hover:gap-2.5">Materials & Quality <span className="w-1 h-1 bg-rose-600 rounded-full scale-0 group-hover:scale-100 transition-all duration-300"></span></Link></li>
              <li><Link to="/size-guide" className="hover:text-rose-600 transition-colors group flex items-center gap-1.5 hover:gap-2.5">Apparel Size Guide <span className="w-1 h-1 bg-rose-600 rounded-full scale-0 group-hover:scale-100 transition-all duration-300"></span></Link></li>
              <li><Link to="/sustainability" className="hover:text-rose-600 transition-colors group flex items-center gap-1.5 hover:gap-2.5">Sustainability <span className="w-1 h-1 bg-rose-600 rounded-full scale-0 group-hover:scale-100 transition-all duration-300"></span></Link></li>
            </ul>
          </div>

          {/* Col 3: Company & Journal */}
          <div className="space-y-6">
            <h3 className="font-bold tracking-widest uppercase text-xs text-rose-600">Company</h3>
            <ul className="space-y-3 text-sm font-light">
              <li><Link to="/about" className="hover:text-rose-600 transition-colors group flex items-center gap-1.5 hover:gap-2.5">About Sera <span className="w-1 h-1 bg-rose-600 rounded-full scale-0 group-hover:scale-100 transition-all duration-300"></span></Link></li>
              <li><Link to="/journal" className="hover:text-rose-600 transition-colors group flex items-center gap-1.5 hover:gap-2.5">The Journal <span className="w-1 h-1 bg-rose-600 rounded-full scale-0 group-hover:scale-100 transition-all duration-300"></span></Link></li>
              <li><Link to="/faq" className="hover:text-rose-600 transition-colors group flex items-center gap-1.5 hover:gap-2.5">Help & FAQ <span className="w-1 h-1 bg-rose-600 rounded-full scale-0 group-hover:scale-100 transition-all duration-300"></span></Link></li>
              <li><Link to="/contact" className="hover:text-rose-600 transition-colors group flex items-center gap-1.5 hover:gap-2.5">Contact Us <span className="w-1 h-1 bg-rose-600 rounded-full scale-0 group-hover:scale-100 transition-all duration-300"></span></Link></li>
              <li><Link to="/returns" className="hover:text-rose-600 transition-colors group flex items-center gap-1.5 hover:gap-2.5">Returns & Exchanges <span className="w-1 h-1 bg-rose-600 rounded-full scale-0 group-hover:scale-100 transition-all duration-300"></span></Link></li>
            </ul>
          </div>

          {/* Col 4: Contact Info */}
          <div className="space-y-6">
            <h3 className="font-bold tracking-widest uppercase text-xs text-rose-600">Contact</h3>
            <div className="space-y-4 text-sm font-light">
              <h4 className="font-semibold text-rose-600 mb-1 tracking-wide uppercase text-[11px]">Email</h4>
              <p className="flex items-start gap-2">
                <span className="w-5 h-5 mt-0.5 bg-rose-200 rounded-full flex-shrink-0 flex items-center justify-center">
                  <span className="text-[10px] font-bold text-rose-600">✉</span>
                </span>
                <a href="mailto:serajewels1@gmail.com" className="hover:text-rose-600 transition-colors break-all text-xs">serajewels1@gmail.com</a>
              </p>
              <div>
                <h4 className="font-semibold text-rose-600 mb-1 tracking-wide uppercase text-[11px]">Social</h4>
                <div className="space-y-2">
                  <a href="https://www.instagram.com/serastore.in" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-rose-600 transition-colors text-xs">
                    <FaInstagram className="w-3.5 h-3.5" />
                    <span>Instagram</span>
                  </a>
                  <a href="https://www.pinterest.com/serastore/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-rose-600 transition-colors text-xs">
                    <FaPinterest className="w-3.5 h-3.5" />
                    <span>Pinterest</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="container mx-auto mt-16 pt-8 border-t border-rose-200">
        <div className="flex flex-col md:flex-row justify-between items-center text-xs tracking-widest text-gray-600 gap-6 md:gap-0">
          <div className="flex flex-wrap gap-4 md:gap-8">
            <Link to="/privacy-policy" className="hover:text-rose-600 transition-colors uppercase hover:underline">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-rose-600 transition-colors uppercase hover:underline">Terms of Service</Link>
            <Link to="/sitemap" className="hover:text-rose-600 transition-colors uppercase hover:underline">Sitemap</Link>
            <span>© {new Date().getFullYear()} SERA. All rights reserved.</span>
          </div>
          <div>
            <span className="text-gray-400">timeless jewelry & conscious fashion</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;