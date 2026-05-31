import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      // Add a slight delay before showing so it feels less intrusive
      const timer = setTimeout(() => setShow(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    setShow(false);
    
    // Notify Google Tag Manager that consent is granted
    if (typeof window !== 'undefined') {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: 'cookie_consent_update',
        cookie_consent: 'granted'
      });
    }
  };

  const handleDecline = () => {
    localStorage.setItem('cookieConsent', 'declined');
    setShow(false);
    
    // Notify Google Tag Manager that consent is denied
    if (typeof window !== 'undefined') {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: 'cookie_consent_update',
        cookie_consent: 'denied'
      });
    }
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 200, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 200, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed bottom-4 left-4 right-4 md:left-auto md:right-8 md:bottom-8 md:max-w-[400px] z-[9999] bg-white border border-rose-100 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] p-6"
        >
          <div className="flex flex-col gap-4">
            <div>
              <h3 className="font-serif text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
                <span className="text-2xl">🍪</span> We value your privacy
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                We use cookies to enhance your browsing experience, analyze site traffic, and serve tailored marketing. By clicking "Accept All", you consent to our use of cookies.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 mt-1">
              <button
                onClick={handleAccept}
                className="flex-1 bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white font-medium py-2.5 px-4 rounded-xl transition-all shadow-md hover:shadow-lg text-sm"
              >
                Accept All
              </button>
              <button
                onClick={handleDecline}
                className="flex-1 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 font-medium py-2.5 px-4 rounded-xl transition-all text-sm"
              >
                Reject Non-Essential
              </button>
            </div>
            
            <div className="text-center pt-2">
              <Link 
                to="/privacy-policy" 
                onClick={() => setShow(false)}
                className="text-xs text-gray-500 hover:text-rose-500 underline transition-colors"
              >
                Read our Privacy Policy
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
