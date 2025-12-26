import { FaInstagram, FaPinterest, FaFacebook } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-[#ffe4e6] pt-16 pb-8 px-6 md:px-12 text-[#4a3b3b]">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-12 gap-12">
        {/* Left Section: Brand & Description */}
        <div className="md:col-span-5 space-y-6">
          <h2 className="text-6xl font-serif text-[#c5a666] tracking-tight">SERA</h2>
          <div className="space-y-4 text-sm leading-relaxed max-w-md">
            <p className="font-medium">Where elegance meets intention.</p>
            <p>
              SERA is a jewellery brand born from the love of timeless simplicity. 
              Every piece in this collection is designed to celebrate you — your story, 
              your strength, your softness. Crafted with care and a keen eye for detail, 
              our rings, bracelets, necklaces, and earrings are made to blend effortlessly 
              into your everyday, while still standing out with grace.
            </p>
            <p>Let <span className="font-bold">SERA</span> be your everyday luxury.</p>
          </div>
        </div>

        {/* Right Section: Links */}
        <div className="md:col-span-7 grid grid-cols-1 md:grid-cols-3 gap-8 md:pl-12 border-l border-white/50">
          
          {/* Quick Links */}
          <div className="space-y-6">
            <h3 className="font-bold tracking-widest uppercase text-sm">Quick Links</h3>
            <ul className="space-y-4 text-sm font-light">
              <li><Link to="/privacy-policy" className="hover:text-rose-600 transition-colors">PRIVACY POLICY</Link></li>
              <li><Link to="/terms" className="hover:text-rose-600 transition-colors">TERMS AND CONDITIONS</Link></li>
              <li><Link to="/returns" className="hover:text-rose-600 transition-colors">RETURNS AND EXCHANGE</Link></li>
              <li><Link to="/contact" className="hover:text-rose-600 transition-colors">CONTACT</Link></li>
            </ul>
          </div>

          {/* Explore */}
          <div className="space-y-6">
            <h3 className="font-bold tracking-widest uppercase text-sm">Explore</h3>
            <ul className="space-y-4 text-sm font-light">
              <li><button className="hover:text-rose-600 transition-colors uppercase">Search</button></li>
              <li><Link to="/about" className="hover:text-rose-600 transition-colors uppercase">About Us</Link></li>
              <li><Link to="/faq" className="hover:text-rose-600 transition-colors uppercase">FAQ's</Link></li>
            </ul>
          </div>

          {/* Social */}
          <div className="space-y-6">
            <h3 className="font-bold tracking-widest uppercase text-sm">Social</h3>
            <ul className="space-y-4 text-sm font-light">
              <li>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-rose-600 transition-colors uppercase flex items-center gap-2">
                   Instagram
                </a>
              </li>
              <li>
                <a href="https://pinterest.com" target="_blank" rel="noopener noreferrer" className="hover:text-rose-600 transition-colors uppercase flex items-center gap-2">
                   Pinterest
                </a>
              </li>
              <li>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-rose-600 transition-colors uppercase flex items-center gap-2">
                   Facebook
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="container mx-auto mt-16 pt-8 flex flex-col md:flex-row justify-between items-center text-xs tracking-widest opacity-80 gap-4">
        <div>
          <Link to="/terms" className="uppercase hover:underline">Terms of Service</Link>
        </div>
        <div className="flex flex-col md:flex-row gap-8">
           <span>SERAJEWELS1@GMAIL.COM</span>
           <span>+91 8928803447</span>
           <span>+91 7738532850</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
