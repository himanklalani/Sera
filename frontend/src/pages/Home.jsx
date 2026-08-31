import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { FaInstagram } from 'react-icons/fa';
import axios from 'axios';
import SEO from '../components/SEO';
import FramerButton from '../components/FramerButton';
import TextArrowCTA from '../components/TextArrowCTA';
import { Component as LuminaSlider } from '../components/ui/lumina-interactive-list';


// ============================================
// OPTIMIZED LazyImage Component (Shared)
// ============================================
const LazyImage = ({ 
  src, 
  alt, 
  className, 
  style,
  priority = false,
  srcSet = null,
  width,
  height
}) => {
  const [isLoaded, setIsLoaded] = useState(priority);
  const [isInView, setIsInView] = useState(priority);
  const imgRef = useRef();


  useEffect(() => {
    if (!imgRef.current) return;
    if (priority) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { 
        rootMargin: '1200px',
        threshold: 0.01
      }
    );


    observer.observe(imgRef.current);
    return () => observer.disconnect();
  }, [priority]);


  const getOptimizedUrl = (url) => {
    if (url.includes('unsplash.com')) {
      return `${url}&q=75&auto=format&fit=crop&w=2000`;
    }
    return url;
  };


  return (
    <div 
      ref={imgRef} 
      className={className} 
      style={style}
      data-lazy={!priority}
    >
      {(isInView || priority) && (
        <>
          {!isLoaded && (
            <div className="absolute inset-0 bg-gray-200 animate-pulse" />
          )}
          <img
            src={getOptimizedUrl(src)}
            srcSet={srcSet}
            alt={alt}
            width={width}
            height={height}
            className={`${className} transition-opacity duration-200 ${
              isLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setIsLoaded(true)}
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
          />
        </>
      )}
    </div>
  );
};


// ============================================
// NEW: Ultra Cutesy Demure Pink Flying Flyer with Multiple Offers
// ============================================
const FlyingOfferBanner = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasEntered, setHasEntered] = useState(false);
  const [currentOfferIndex, setCurrentOfferIndex] = useState(0);

  const [offers, setOffers] = useState([]);
  const [isFetched, setIsFetched] = useState(false);

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/coupons/public`);
        const formattedOffers = data.map((c) => ({
          code: c.code,
          title: c.isFirstOrderOnly ? '✨ First Order Special ✨' : '✨ Special Offer ✨',
          discount: c.isFreeShipping ? 'FREE SHIPPING' : (c.discountType === 'percentage' ? `${c.discountValue}%` : `INR ${c.discountValue}`),
          description: c.description || (c.isFirstOrderOnly ? `Save ${c.discountType === 'percentage' ? c.discountValue + '%' : 'INR ' + c.discountValue} on your first order` : 'Limited time offer just for you!'),
          icon: (
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" className="text-white drop-shadow-md">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )
        }));
        setOffers(formattedOffers);
      } catch (err) {
        console.error('Failed to fetch flyer coupons', err);
      } finally {
        setIsFetched(true);
      }
    };
    fetchCoupons();
  }, []);

  useEffect(() => {
    if (!isFetched) return;
    
    // If no offers from DB, don't show the flyer at all
    if (offers.length === 0) {
      if (onComplete) onComplete();
      return;
    }

    // Check if flyer has already been shown in this session
    const flyerShown = sessionStorage.getItem('flyerShown');
    if (flyerShown) {
      // If already shown, signal completion immediately to show the button
      if (onComplete) onComplete();
      return;
    }

    const triggerFlyer = () => {
      setIsVisible(true);
      setHasEntered(true);
      sessionStorage.setItem('flyerShown', 'true');
    };

    // If cookie consent is not yet given, the popup WILL appear.
    // Wait for the 'cookieConsentClosed' event before triggering the flyer.
    if (!localStorage.getItem('cookieConsent')) {
      const handleCookieClosed = () => {
        // Wait 2 seconds after cookie box closes before showing flyer
        setTimeout(triggerFlyer, 2000);
      };
      window.addEventListener('cookieConsentClosed', handleCookieClosed);
      return () => window.removeEventListener('cookieConsentClosed', handleCookieClosed);
    } else {
      // Cookie consent is already done. Show flyer with a normal slight delay.
      const timer = setTimeout(triggerFlyer, 1500);
      return () => clearTimeout(timer);
    }
  }, [onComplete, isFetched, offers.length]);

  useEffect(() => {
    if (!hasEntered || !isVisible || offers.length === 0) return;

    // Auto-rotate offers every 2.5 seconds
    const rotateTimer = setInterval(() => {
      setCurrentOfferIndex((prev) => (prev + 1) % offers.length);
    }, 2500);

    // Hide flyer after 6 seconds total (shows both offers)
    const hideTimer = setTimeout(() => {
      setIsVisible(false);
      if (onComplete) {
        setTimeout(() => onComplete(), 800);
      }
    }, 6000);

    return () => {
      clearInterval(rotateTimer);
      clearTimeout(hideTimer);
    };
  }, [hasEntered, isVisible, onComplete, offers.length]);


  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    toast.success(`Code ${code} copied!`, {
      icon: '✂️',
      style: {
        borderRadius: '10px',
        background: '#333',
        color: '#fff',
      },
    });
  };

  return (
    <AnimatePresence>
      {isVisible && offers.length > 0 && (
        <>
          {/* Background blur overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/40 z-[99] will-change-opacity"
          />

          {/* Flying flyer */}
          <motion.div
            initial={{ x: 400, y: 400, opacity: 0, rotate: 20, scale: 0.7 }}
            animate={{ 
              x: 0, 
              y: 0, 
              opacity: 1, 
              rotate: 0,
              scale: 1
            }}
            exit={{ 
              x: -420, 
              y: window.innerHeight < 768 ? 55 : 280,
              opacity: 0,
              scale: 0.4,
              rotate: -8,
              transition: { duration: 0.8, ease: [0.4, 0, 0.2, 1] }
            }}
            transition={{ 
              duration: 1, 
              ease: [0.34, 1.56, 0.64, 1],
              delay: 0
            }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[100] pointer-events-none will-change-transform"
          >
            {/* Flyer with smooth transitions */}
            <div className="relative bg-gradient-to-br from-pink-50/90 via-rose-50/85 to-pink-100/90 backdrop-blur-xl rounded-[2.5rem] shadow-2xl border-2 border-white/60 overflow-hidden px-8 py-8 pointer-events-auto w-[360px] will-change-transform">
              {/* Dreamy decorative blobs */}
              <div className="absolute top-0 left-0 w-32 h-32 bg-rose-200/25 rounded-full blur-2xl" />
              <div className="absolute bottom-0 right-0 w-40 h-40 bg-pink-300/25 rounded-full blur-3xl" />
              <div className="absolute top-1/2 left-1/2 w-28 h-28 bg-rose-100/35 rounded-full blur-2xl" />
              
              {/* Floating sparkles with enhanced cuteness */}
              <motion.div
                className="absolute top-4 right-4"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.7, 1, 0.7],
                  rotate: [0, 180, 360],
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-rose-300 drop-shadow-md">
                  <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" fill="currentColor" />
                </svg>
              </motion.div>

              <motion.div
                className="absolute top-6 left-6"
                animate={{
                  scale: [1, 1.4, 1],
                  opacity: [0.6, 1, 0.6],
                  rotate: [0, -180, -360],
                }}
                transition={{
                  duration: 2.8,
                  repeat: Infinity,
                  delay: 0.3
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-pink-300 drop-shadow-md">
                  <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" fill="currentColor" />
                </svg>
              </motion.div>

              <motion.div
                className="absolute bottom-6 right-6"
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.5, 0.9, 0.5],
                  rotate: [0, 180, 360],
                }}
                transition={{
                  duration: 3.2,
                  repeat: Infinity,
                  delay: 0.6
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-rose-200 drop-shadow-md">
                  <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" fill="currentColor" />
                </svg>
              </motion.div>

              {/* Multiple heart decorations for extra cuteness */}
              <motion.div
                className="absolute top-3 left-4"
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.5, 0.8, 0.5],
                }}
                transition={{
                  duration: 2.2,
                  repeat: Infinity,
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-rose-300 drop-shadow-sm">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" fill="currentColor" />
                </svg>
              </motion.div>

              <motion.div
                className="absolute bottom-4 left-8"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.4, 0.7, 0.4],
                }}
                transition={{
                  duration: 2.6,
                  repeat: Infinity,
                  delay: 0.8
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-pink-300 drop-shadow-sm">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" fill="currentColor" />
                </svg>
              </motion.div>

              {/* Content with offer rotation */}
              <div className="relative flex flex-col items-center text-center gap-4">
                {/* Cute icon with subtle pulse */}
                <AnimatePresence mode="wait">
                  <motion.div 
                    key={currentOfferIndex}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-gradient-to-br from-rose-300/70 to-pink-400/70 backdrop-blur-sm rounded-2xl p-5 shadow-xl"
                  >
                    {offers[currentOfferIndex].icon}
                  </motion.div>
                </AnimatePresence>

                {/* Text with smooth transitions */}
                <div className="min-h-[140px] flex flex-col justify-center">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentOfferIndex}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.4, ease: "easeInOut" }}
                    >
                      <h3 className="text-xl font-bold text-gray-800 tracking-wide mb-2 drop-shadow-sm">
                        {offers[currentOfferIndex].title}
                      </h3>
                      <button 
                        onClick={() => handleCopyCode(offers[currentOfferIndex].code)}
                        className="group/btn relative px-4 py-1.5 rounded-lg bg-white/50 hover:bg-white/80 transition-all border border-rose-200/50 mb-2"
                        title="Click to copy code"
                      >
                        <p className="text-sm font-mono font-bold text-rose-600 tracking-wider">
                          {offers[currentOfferIndex].code}
                        </p>
                        <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover/btn:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                          Click to copy
                        </span>
                      </button>
                      <p className="text-lg text-gray-700 font-semibold leading-relaxed">
                        Save <span className="text-2xl font-extrabold text-rose-500">{offers[currentOfferIndex].discount}</span>
                      </p>
                      <p className="text-sm text-gray-600 mt-1.5">
                        {offers[currentOfferIndex].description}
                      </p>
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Free shipping banner */}
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 }}
                  className="bg-gradient-to-r from-emerald-100/60 to-teal-100/60 px-4 py-2 rounded-full border border-emerald-200/50"
                >
                  <p className="text-xs text-emerald-700 font-semibold">
                    🎁 Free Shipping above ₹999
                  </p>
                </motion.div>

                {/* Offer indicator dots */}
                <div className="flex gap-2 mt-2">
                  {offers.map((_, index) => (
                    <div
                      key={index}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        index === currentOfferIndex 
                          ? 'w-6 bg-rose-500' 
                          : 'w-1.5 bg-rose-200'
                      }`}
                    />
                  ))}
                </div>

                {/* Close button */}
                <button
                  onClick={() => setIsVisible(false)}
                  className="absolute -top-2 -right-2 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg text-gray-400 hover:text-gray-600 hover:scale-110 transition-all"
                  aria-label="Close offer banner"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </button>
              </div>

              {/* Dreamy bottom gradient bar */}
              <motion.div
                className="absolute bottom-0 left-0 h-2 bg-gradient-to-r from-rose-300/70 via-pink-300/70 to-rose-300/70 rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 6, ease: "linear" }}
              />

              {/* Soft glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-transparent pointer-events-none rounded-[2.5rem]" />
              
              {/* Extra shimmer overlay */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none will-change-transform"
                animate={{
                  x: ['-100%', '200%'],
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  repeatDelay: 1,
                  ease: "easeInOut"
                }}
              />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};


// ============================================
// Updated: Floating Coupon Drawer with Multiple Coupons
// ============================================
export const FloatingCouponDrawer = ({ shouldShow }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [coupons, setCoupons] = useState([]);

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/coupons/public`);
        
        const formattedCoupons = data.map((c) => ({
          code: c.code,
          discount: c.isFreeShipping ? 'FREE SHIPPING' : (c.discountType === 'percentage' ? `${c.discountValue}% OFF` : `INR ${c.discountValue} OFF`),
          description: c.description || (c.isFirstOrderOnly ? 'Valid only for first order' : 'Special offer just for you!'),
          validTill: c.expiryDate ? (
            <span className="flex items-center gap-1 text-xs text-gray-500">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="inline-block">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Valid till {new Date(c.expiryDate).toLocaleDateString()}
            </span>
          ) : (
            <span className="flex items-center gap-1 text-xs text-green-600">
              Never expires
            </span>
          ),
          color: 'from-purple-50/60 via-indigo-50/60 to-purple-50/60',
          borderColor: 'border-purple-300/60',
          textColor: 'text-purple-600',
          badgeColor: 'bg-purple-500'
        }));
        
        setCoupons(formattedCoupons);
      } catch (err) {
        console.error('Failed to fetch flyer coupons', err);
      }
    };
    fetchCoupons();
  }, []);

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    toast.success(`Code ${code} copied!`, {
      icon: '✂️',
      style: {
        borderRadius: '10px',
        background: '#333',
        color: '#fff',
      },
    });
  };

  return (
    <>
      <AnimatePresence>
        {shouldShow && coupons.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, x: -50 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ 
              duration: 0.6, 
              ease: [0.34, 1.56, 0.64, 1],
              delay: 0.2 
            }}
            className="fixed left-4 top-[25%] md:top-[32%] z-50"
          >
            <motion.button
              onClick={() => setIsOpen(!isOpen)}
              whileHover={{ scale: 1.05, x: 5 }}
              whileTap={{ scale: 0.95 }}
              className="group relative flex items-center gap-2 bg-white/20 backdrop-blur-md border border-white/30 rounded-full px-3 py-2 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-center gap-2">
                <span className="text-black text-xs md:text-sm font-medium tracking-wide drop-shadow-lg whitespace-nowrap">
                  Offers
                </span>
                
                <motion.svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="text-black drop-shadow-lg"
                  animate={{ 
                    rotate: isOpen ? 180 : 0
                  }}
                  transition={{
                    rotate: {
                      duration: 0.3,
                      ease: "easeInOut"
                    }
                  }}
                >
                  <path
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </motion.svg>
              </div>


              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </motion.button>


            {!isOpen && (
              <motion.div
                className="absolute -top-1 -right-1 w-3 h-3 bg-rose-500 rounded-full shadow-lg"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [1, 0.8, 1]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>


      <AnimatePresence>
        {isOpen && shouldShow && (
          <motion.div
            initial={{ opacity: 0, x: -100, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -100, scale: 0.9 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed left-4 top-[31%] md:top-[39%] z-40 w-72 bg-white/70 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/40 overflow-hidden"
          >
            <div className="bg-gradient-to-r from-rose-400/80 to-pink-400/80 backdrop-blur-sm p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-white">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <h3 className="text-sm font-bold text-white tracking-wide drop-shadow">Active Coupons</h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/90 hover:text-white hover:rotate-90 transition-all duration-300 p-2 min-w-[44px] min-h-[44px] flex items-center justify-center -mr-2"
                aria-label="Close coupons"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            </div>
            
            <div className="p-4 pb-6 space-y-3 max-h-[45vh] md:max-h-[40vh] overflow-y-auto">
              {coupons.map((coupon, index) => (
                <motion.div
                  key={coupon.code}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.1 }}
                  onClick={() => handleCopyCode(coupon.code)}
                  className={`relative bg-gradient-to-r ${coupon.color} backdrop-blur-sm p-4 rounded-xl border-2 border-dashed ${coupon.borderColor} overflow-hidden group cursor-pointer hover:shadow-md transition-all`}
                >
                  <div className="absolute top-0 right-0 w-16 h-16 bg-rose-200/20 rounded-full blur-2xl" />
                  <div className="relative">
                    <div className="flex items-center justify-between mb-2">
                      <p className={`text-base font-mono font-bold ${coupon.textColor} tracking-wider drop-shadow-sm`}>
                        {coupon.code}
                      </p>
                      <div className={`${coupon.badgeColor} text-white text-[10px] px-2 py-1 rounded-full font-semibold shadow-sm`}>
                        {coupon.discount}
                      </div>
                    </div>
                    <p className="text-xs text-gray-800 leading-relaxed font-medium">
                      {coupon.description}
                    </p>
                    <div className="mt-2 flex items-center justify-between">
                      {coupon.validTill}
                      <span className="text-[10px] bg-white/40 px-1.5 py-0.5 rounded border border-white/50 opacity-0 group-hover:opacity-100 transition-opacity">Copy</span>
                    </div>
                    
                  </div>
                </motion.div>
              ))}

              {/* Free shipping banner */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="relative bg-gradient-to-r from-emerald-50/60 via-teal-50/60 to-emerald-50/60 backdrop-blur-sm p-3 rounded-xl border border-emerald-200/60"
              >
                <div className="flex items-center gap-2">
                  <div className="bg-emerald-500 text-white p-1.5 rounded-full">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-emerald-700">Free Shipping 🎁</p>
                    <p className="text-[10px] text-gray-600">On all orders above ₹999</p>
                  </div>
                </div>
              </motion.div>
            </div>


            <div className="bg-gradient-to-r from-gray-50/50 to-rose-50/50 backdrop-blur-sm p-3 border-t border-white/40">
              <p className="text-[10px] text-center text-gray-700 font-medium">
                ✂️ Click any code to copy!
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};


// ============================================
// GiftingSection
// ============================================
const GiftingSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [carouselReady, setCarouselReady] = useState(false);
  const autoplayRef = useRef(null);
  const touchStartRef = useRef(null);
  const touchEndRef = useRef(null);
  const imageCache = useRef({});


  const giftImages = useMemo(() => [
    'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=65&w=600&auto=format&fit=crop&fm=webp',
    'https://res.cloudinary.com/dhby5v7rw/image/upload/f_auto,q_auto,w_800/v1780230280/gift1_yugt68.avif',
    'https://res.cloudinary.com/dhby5v7rw/image/upload/f_auto,q_auto,w_800/v1780230275/gift2_cdwj05.avif',
    'https://res.cloudinary.com/dhby5v7rw/image/upload/f_auto,q_auto,w_800/v1780230276/gift3_dkqp7u.avif',
    'https://res.cloudinary.com/dhby5v7rw/image/upload/f_auto,q_auto,w_800/v1780230275/gift4_mpppql.avif',
    'https://res.cloudinary.com/dhby5v7rw/image/upload/f_auto,q_auto,w_800/v1780230276/gift5_j1siec.avif'
  ], []);


  useEffect(() => {
    const imagesToPreload = [
      giftImages[activeIndex],
      giftImages[(activeIndex + 1) % giftImages.length],
      giftImages[(activeIndex + 2) % giftImages.length],
      giftImages[(activeIndex - 1 + giftImages.length) % giftImages.length],
    ];


    const uniqueImages = [...new Set(imagesToPreload)];


    uniqueImages.forEach((src) => {
      if (!imageCache.current[src]) {
        const img = new Image();
        img.src = src;
        img.onload = () => {
          imageCache.current[src] = true;
        };
      }
    });
  }, [activeIndex, giftImages]);


  const resetAutoplay = useCallback(() => {
    if (autoplayRef.current) clearInterval(autoplayRef.current);


    autoplayRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % giftImages.length);
    }, 4500);
  }, [giftImages.length]);


  useEffect(() => {
    setCarouselReady(true);
    resetAutoplay();


    return () => {
      if (autoplayRef.current) clearInterval(autoplayRef.current);
    };
  }, [resetAutoplay]);


  const handleDotClick = useCallback((index) => {
    setActiveIndex(index);
    resetAutoplay();
  }, [resetAutoplay]);


  const handleMouseEnter = useCallback(() => {
    if (autoplayRef.current) clearInterval(autoplayRef.current);
  }, []);


  const handleMouseLeave = useCallback(() => {
    resetAutoplay();
  }, [resetAutoplay]);


  const handleTouchStart = useCallback((e) => {
    touchStartRef.current = e.changedTouches[0].clientX;
  }, []);


  const handleTouchEnd = useCallback((e) => {
    touchEndRef.current = e.changedTouches[0].clientX;
    
    if (!touchStartRef.current || !touchEndRef.current) return;
    
    const distance = touchStartRef.current - touchEndRef.current;
    const threshold = 50;


    if (Math.abs(distance) > threshold) {
      if (distance > 0) {
        setActiveIndex((prev) => (prev + 1) % giftImages.length);
      } else {
        setActiveIndex((prev) => (prev - 1 + giftImages.length) % giftImages.length);
      }
      resetAutoplay();
    }


    touchStartRef.current = null;
    touchEndRef.current = null;
  }, [giftImages.length, resetAutoplay]);


  return (
    <section className="flex flex-col md:flex-row min-h-[600px] md:h-[600px]">
      <div 
        className="w-full md:w-1/2 min-h-[400px] md:h-full relative bg-gradient-to-br from-rose-50 to-pink-100 flex items-center justify-center overflow-hidden"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div className="relative w-64 h-80 md:w-80 md:h-96">
          {giftImages.map((img, index) => {
            const offset = index - activeIndex;
            const isActive = index === activeIndex;
            const isVisible = Math.abs(offset) <= 2;
            
            if (!isVisible) return null;
            
            return (
              <motion.div
                key={index}
                className="absolute inset-0 w-full h-full will-change-transform"
                initial={false}
                animate={{
                  rotateZ: offset * 3,
                  y: offset * 15,
                  x: offset * 10,
                  scale: isActive ? 1 : 0.9 - Math.abs(offset) * 0.05,
                  zIndex: giftImages.length - Math.abs(offset),
                }}
                transition={{
                  duration: 0.3,
                  ease: "easeOut"
                }}
              >
                <div className="w-full h-full rounded-2xl overflow-hidden shadow-lg border-4 border-white">
                  <img
                    src={img}
                    alt={`Gift ${index + 1}`}
                    className="w-full h-full object-cover will-change-transform"
                    loading="eager"
                    decoding="async"
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
        
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
          {giftImages.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => handleDotClick(index)}
              className={`relative after:absolute after:-inset-3 rounded-full transition-all duration-300 cursor-pointer ${
                index === activeIndex 
                  ? 'bg-rose-500 w-8 h-2.5' 
                  : 'bg-white/60 w-2 h-2 hover:bg-white/90'
              }`}
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.95 }}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>


        {!carouselReady && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/20 backdrop-blur-sm">
            <div className="w-12 h-12 border-4 border-rose-200 border-t-rose-500 rounded-full animate-spin" />
          </div>
        )}
      </div>


      <div className="w-full md:w-1/2 min-h-[300px] md:h-full bg-pink-50 flex flex-col items-center justify-center p-8 md:p-12 text-center">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-3xl md:text-5xl font-serif mb-4 md:mb-6 text-gray-900"
        >
          Ace the art of Gifting
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          viewport={{ once: true }}
          className="max-w-md text-base md:text-lg text-gray-700 leading-relaxed mb-8 md:mb-10"
        >
          Jewellery that feels personal, packaging that looks like a celebration. Whether it's a thoughtful surprise or a spontaneous gesture, our pieces come ready to gift, no extra wrapping required.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.2, ease: [0.32,0.72,0,1] }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row gap-6 sm:gap-8 justify-center items-center"
        >
          <FramerButton to="/shop?category=COMBOS" variant="dark">Shop Combos</FramerButton>
          <TextArrowCTA to="/gifts" variant="dark">Gifting Hub</TextArrowCTA>
        </motion.div>
      </div>
    </section>
  );
};


// ============================================
// HeroSection (WITH Transformation Magic + Background Loading + Delayed Flyer)
// ============================================
const HeroSection = () => {
  const [showButton, setShowButton] = useState(false);
  const [showFlyer, setShowFlyer] = useState(false);

  // Show flyer after hero content loads
  useEffect(() => {
    const flyerTimer = setTimeout(() => {
      setShowFlyer(true);
    }, 3300);

    return () => clearTimeout(flyerTimer);
  }, []);

  return (
    <div className="relative w-full h-[100svh] overflow-hidden bg-gray-900 safe-area">
      <Helmet>
        <title>Sera | Affordable Anti-Tarnish Jewelry</title>
        <meta name="description" content="Discover Sera's premium collection of waterproof, anti-tarnish jewelry. Shop affordable necklaces, rings, earrings, and bracelets that won't turn your skin green." />
      </Helmet>
      
      {/* Dynamic WebGL Slider */}
      <LuminaSlider />
      
      {/* Flying Offer Banner - only shows after hero content loads */}
      {showFlyer && <FlyingOfferBanner onComplete={() => setShowButton(true)} />}
      
      {/* Floating Coupon Drawer appears after flyer disappears */}
      <FloatingCouponDrawer shouldShow={showButton} />
    </div>
  );
};


// ============================================
// ApparelDropSection
// ============================================
const ApparelDropSection = () => (
  <section className="relative w-full min-h-[80vh] md:min-h-[90vh] flex items-center justify-center overflow-hidden">
    {/* Background Image */}
    <div className="absolute inset-0">
      <img
        src="https://res.cloudinary.com/dhby5v7rw/image/upload/f_auto/q_auto/v1788087694/good12_kzhffe.jpg"
        alt="Sera Apparel Collection"
        className="w-full h-full object-cover object-[center_30%]"
      />
      {/* Gradient Overlay for Text Readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0c] via-black/50 to-black/30" />
    </div>

    {/* Content Overlay */}
    <div className="relative z-10 w-full max-w-5xl mx-auto px-6 md:px-12 flex flex-col items-center text-center py-20">
      {/* Headline */}
      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.1, ease: [0.32, 0.72, 0, 1] }}
        viewport={{ once: true }}
        className="font-serif text-5xl sm:text-6xl md:text-[5.5rem] lg:text-[6.5rem] text-white leading-[0.95] tracking-tight mb-6 drop-shadow-lg"
      >
        Wear the
        <span className="block italic text-rose-300 mt-2">Sera world.</span>
      </motion.h2>

      {/* Body */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2, ease: [0.32, 0.72, 0, 1] }}
        viewport={{ once: true }}
        className="text-stone-300 text-sm md:text-base leading-[1.8] mb-10 max-w-xl mx-auto font-light tracking-wide drop-shadow-md"
      >
        Minimal. Intentional. Made to move with you. Our debut apparel drop pairs effortlessly with every Sera piece you love, soft basics with an elevated edge.
      </motion.p>

      {/* Button-in-Button CTAs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3, ease: [0.32, 0.72, 0, 1] }}
        viewport={{ once: true }}
        className="flex flex-col sm:flex-row gap-4"
      >
        <FramerButton to="/shop?category=APPAREL" variant="light">Explore Apparel</FramerButton>
        <FramerButton to="/size-guide" variant="transparent">Size Guide</FramerButton>
      </motion.div>

      {/* Micro-label at bottom */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.6, ease: [0.32, 0.72, 0, 1] }}
        viewport={{ once: true }}
        className="mt-16 flex flex-col items-center gap-4"
      >
        <div className="h-[30px] w-px bg-stone-500/50" />
        <span className="text-stone-400 text-[10px] tracking-[0.3em] uppercase drop-shadow-sm">Soft. Minimal. Effortless.</span>
      </motion.div>
    </div>
  </section>
);


// ============================================
// CategoriesSection
// ============================================
const CategoriesSection = () => {
  const navigate = useNavigate();
  
  const categories = useMemo(() => [
    { 
      name: 'EARRINGS', 
      img: 'https://res.cloudinary.com/dhby5v7rw/image/upload/f_auto,q_auto/v1780227856/earring_xq3tnr.jpg',
      srcSet: ''
    },
    { 
      name: 'BRACELET', 
      img: 'https://res.cloudinary.com/dhby5v7rw/image/upload/f_auto,q_auto/v1780227859/bracelet_euzi0c.png',
      srcSet: ''
    },
    { 
      name: 'NECKLACE', 
      img: 'https://res.cloudinary.com/dhby5v7rw/image/upload/f_auto,q_auto/v1780227857/necklace_mfa0eu.jpg',
      srcSet: ''
    },
    { 
      name: 'COMBOS', 
      img: 'https://res.cloudinary.com/dhby5v7rw/image/upload/f_auto/q_auto/v1788177820/Gemini_Generated_Image_81iw5v81iw5v81iw_-_Edited_vynei9.avif',
      srcSet: ''
    },
    { 
      name: 'APPAREL', 
      img: 'https://res.cloudinary.com/dhby5v7rw/image/upload/f_auto/q_auto/v1788169399/aparrel_jtnjpa.avif', 
      srcSet: ''
    },
  ], []);


  return (
    <section className="py-16 px-4 md:px-6 bg-gradient-to-b from-white to-rose-50">
      <div className="max-w-6xl mx-auto">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-serif text-center mb-3 uppercase tracking-widest text-gray-900"
        >
          Explore Categories
        </motion.h2>
        <p className="text-center text-gray-600 mb-10 text-sm md:text-base">
          Find your perfect accessory
        </p>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 md:gap-6">
          {categories.map((cat, index) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.03 }}
              viewport={{ once: true }}
              onClick={() => navigate(`/shop?category=${cat.name}`)}
              className={`group cursor-pointer relative ${index === 4 ? 'col-span-2 sm:col-span-1' : ''}`}
            >
              <div className={`relative overflow-hidden rounded-2xl bg-gray-100 shadow-md hover:shadow-xl transition-all duration-300 ${index === 4 ? 'aspect-[2/1] sm:aspect-[3/4]' : 'aspect-[3/4]'}`}>
                {cat.img ? (
                  <LazyImage 
                    src={cat.img}
                    srcSet={cat.srcSet}
                    alt={cat.name} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 will-change-transform"
                    width={400}
                    height={533}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-stone-100 to-stone-200 flex items-center justify-center">
                    <span className="text-stone-400 text-xs tracking-widest uppercase">Coming Soon</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
                
                <div className="absolute inset-0 flex flex-col items-center justify-end pb-4 md:pb-6">
                  <h3 className="text-white font-serif text-base md:text-xl tracking-widest transform group-hover:translate-y-[-4px] transition-transform duration-300">
                    {cat.name}
                  </h3>
                </div>


                <div className="hidden md:flex absolute inset-0 items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button className="bg-white text-gray-900 px-4 md:px-6 py-2 rounded-full text-xs md:text-sm uppercase tracking-wider font-medium transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 shadow-lg">
                    Shop Now
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>


        <div className="md:hidden flex justify-center mt-8">
          <button 
            onClick={() => navigate('/shop')}
            className="inline-flex items-center justify-center px-8 py-3 rounded-full text-xs font-semibold tracking-[0.18em] uppercase
                       bg-gradient-to-r from-rose-400 via-rose-300 to-pink-300
                       text-white shadow-md shadow-rose-100
                       border border-white/50
                       hover:shadow-lg hover:shadow-rose-200 hover:brightness-110
                       active:scale-95
                       transition-all duration-200"
          >
            Shop
          </button>
        </div>
      </div>
    </section>
  );
};


// ============================================
// BentoCollectionsSection
// ============================================
const BentoCollectionsSection = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  
  const collections = useMemo(() => [
    {
      name: 'Our Bestsellers',
      description: 'Customer favorites that never go out of style',
      img: 'https://res.cloudinary.com/dhby5v7rw/image/upload/f_auto,q_auto,w_800/v1780227857/bestsellers_zffy5n.jpg',
      size: 'large',
      color: 'from-rose-100 to-pink-50',
      link: '/shop?tags=bestseller'
    },
    {
      name: 'Everyday Essentials',
      description: 'Chic daily pieces',
      img: 'https://res.cloudinary.com/dhby5v7rw/image/upload/f_auto,q_auto,w_800/v1780227859/everyday_s8miea.jpg',
      size: 'tall',
      color: 'from-pink-50 to-rose-50',
      link: '/shop?tags=everyday'
    },
    {
      name: 'Accent Pairs',
      description: 'Bold & beautiful',
      img: 'https://res.cloudinary.com/dhby5v7rw/image/upload/f_auto,q_auto,w_800/v1780227858/pair_cqurjg.jpg',
      size: 'small',
      color: 'from-rose-50 to-white',
      link: '/shop?tags=accent'
    },
    {
      name: 'Minimalist',
      description: 'Less is more',
      img: 'https://res.cloudinary.com/dhby5v7rw/image/upload/f_auto,q_auto,w_800/v1780227859/minimalist_cdynyl.jpg',
      size: 'small',
      color: 'from-white to-rose-50',
      link: '/shop?tags=minimalist'
    },
    {
      name: 'Boho Vibes',
      description: 'Free-spirited designs',
      img: 'https://res.cloudinary.com/dhby5v7rw/image/upload/f_auto,q_auto,w_800/v1780227858/boho_ejcz5g.png',
      size: 'wider',
      color: 'from-rose-50 to-pink-100',
      link: '/shop?tags=boho'
    },
  ], []);


  const getSizeClasses = (size) => {
    switch(size) {
      case 'large':
        return 'col-span-2 row-span-2 md:col-span-2 md:row-span-2';
      case 'medium':
        return 'col-span-2 row-span-1 md:col-span-1 md:row-span-2';
      case 'wide':
        return 'col-span-2 row-span-1 md:col-span-2 md:row-span-1';
      case 'tall':
        return 'col-span-2 row-span-2 md:col-span-1 md:row-span-3';
      case 'wider':
        return 'col-span-2 row-span-1 md:col-span-3 md:row-span-1';
      default:
        return 'col-span-1 row-span-1';
    }
  };


  return (
    <section className="py-16 md:py-24 px-4 md:px-6 bg-gradient-to-b from-rose-50 via-white to-pink-50">
      <motion.h2 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="text-3xl md:text-5xl font-serif text-center mb-4 uppercase tracking-widest text-gray-900"
      >
        Curated Collections
      </motion.h2>
      <p className="text-center text-gray-600 mb-12 md:mb-16 max-w-2xl mx-auto text-sm md:text-base px-4">
        Trendy accessories that match your vibe 
      </p>
      
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-3 auto-rows-[180px] md:auto-rows-[240px] gap-3 md:gap-4">
        {collections.map((collection, index) => (
          <Link
            to={collection.link}
            key={collection.name}
            className={`${getSizeClasses(collection.size)} group relative overflow-hidden rounded-3xl cursor-pointer block`}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: index * 0.03 }}
              viewport={{ once: true }}
              onHoverStart={() => setHoveredIndex(index)}
              onHoverEnd={() => setHoveredIndex(null)}
              className="w-full h-full relative"
            >
              <div className="absolute inset-0">
                <LazyImage 
                  src={collection.img} 
                  alt={collection.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 will-change-transform"
                />
                <div className={`absolute inset-0 bg-gradient-to-br ${collection.color} mix-blend-multiply opacity-40 group-hover:opacity-60 transition-opacity duration-300`} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              </div>


              <div className="absolute inset-0 p-4 md:p-6 flex flex-col justify-end">
                <motion.div
                  animate={{
                    y: hoveredIndex === index ? -10 : 0,
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <h3 className="text-white font-serif text-lg md:text-2xl mb-1 md:mb-2 tracking-wide">
                    {collection.name}
                  </h3>
                  <p className="text-white/90 text-xs md:text-sm mb-3 md:mb-4">
                    {collection.description}
                  </p>
                  
                  <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{
                      opacity: hoveredIndex === index ? 1 : 0,
                      y: hoveredIndex === index ? 0 : 10,
                    }}
                    transition={{ duration: 0.2 }}
                    className="bg-white text-gray-900 px-4 md:px-5 py-2 rounded-full text-xs md:text-sm uppercase tracking-wider font-medium shadow-lg hover:bg-rose-500 hover:text-white transition-colors"
                  >
                    Explore
                  </motion.button>
                </motion.div>
              </div>


              <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-bl-full blur-2xl" />
            </motion.div>
          </Link>
        ))}
      </div>
    </section>
  );
};


// ============================================
// FloatingGallerySection
// ============================================
const FloatingGallerySection = () => {
  const galleryItems = useMemo(() => [
    { img: 'https://res.cloudinary.com/dhby5v7rw/image/upload/f_auto,q_auto,w_600/v1780230150/gallery2_yxa0cq.avif', height: 'h-64', delay: 0 },
    { img: 'https://res.cloudinary.com/dhby5v7rw/image/upload/f_auto,q_auto,w_600/v1780230149/gallery1_wd75ie.avif', height: 'h-80', delay: 0.05 },
    { img: 'https://res.cloudinary.com/dhby5v7rw/image/upload/f_auto,q_auto,w_600/v1780230150/gallery3_hgea56.avif', height: 'h-72', delay: 0.1 },
    { img: 'https://res.cloudinary.com/dhby5v7rw/image/upload/f_auto,q_auto,w_600/v1780230149/gallery4_zkqgaa.avif', height: 'h-96', delay: 0.15 },
    { img: 'https://res.cloudinary.com/dhby5v7rw/image/upload/f_auto,q_auto,w_600/v1780230153/gallery5_tasn9g.avif', height: 'h-64', delay: 0.2 },
    { img: 'https://res.cloudinary.com/dhby5v7rw/image/upload/f_auto,q_auto,w_600/v1780230150/gallery6_igxgvk.avif', height: 'h-88', delay: 0.25 },
  ], []);


  return (
    <section className="py-16 md:py-24 px-4 md:px-6 bg-gradient-to-b from-pink-50 to-rose-100 overflow-hidden">
      <motion.h2 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="text-3xl md:text-5xl font-serif text-center mb-4 uppercase tracking-widest text-gray-900"
      >
        The Vibe
      </motion.h2>
      <p className="text-center text-gray-700 mb-12 md:mb-16 max-w-xl mx-auto text-sm md:text-base">
        Catch the energy, feel the style 
      </p>


      <div className="max-w-7xl mx-auto columns-2 md:columns-3 gap-3 md:gap-4 space-y-3 md:space-y-4">
        {galleryItems.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: item.delay }}
            viewport={{ once: true }}
            className="break-inside-avoid group"
          >
            <div className={`${item.height} relative overflow-hidden rounded-2xl shadow-lg group-hover:shadow-2xl transition-all duration-500`}>
              <LazyImage
                src={item.img}
                alt={`Gallery ${index + 1}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out will-change-transform"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none" />
              <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none" />
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};


// ============================================
// Instagram Feed Section (Lazy Loaded & Deferred)
// ============================================
const InstagramFeedSection = () => {
  const [shouldLoad, setShouldLoad] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    // Lazy load the Instagram script only when scrolled near the section
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' }
    );
    
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    
    // Fallback: load after 5 seconds of idle time regardless
    const timer = setTimeout(() => {
      setShouldLoad(true);
    }, 5000);

    return () => {
      observer.disconnect();
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    if (shouldLoad) {
      // Load Instagram embed script asynchronously
      const script = document.createElement('script');
      script.src = "//www.instagram.com/embed.js";
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
      
      // Ensure existing embeds are processed
      if (window.instgrm) {
        window.instgrm.Embeds.process();
      }
    }
  }, [shouldLoad]);

  return (
    <section ref={containerRef} className="py-16 px-4 md:px-8 bg-white overflow-hidden flex flex-col items-center">
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-5xl font-serif text-gray-900 mb-4">Sera In The Wild</h2>
        <p className="text-gray-600">Tag <a href="https://instagram.com/serastore.in" target="_blank" rel="noopener noreferrer" className="text-rose-500 font-medium hover:underline">@serastore.in</a> to be featured</p>
      </div>
      
      {shouldLoad ? (
        <div className="w-full max-w-4xl mx-auto flex justify-center">
          <blockquote 
            className="instagram-media" 
            data-instgrm-permalink="https://www.instagram.com/serastore.in/" 
            data-instgrm-version="14" 
            style={{ background: '#FFF', border: '0', borderRadius: '12px', boxShadow: '0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15)', margin: '1px', maxWidth: '540px', minWidth: '326px', padding: '0', width: 'calc(100% - 2px)' }}
          >
          </blockquote>
        </div>
      ) : (
        <div className="w-full max-w-lg mx-auto h-[600px] bg-gray-50 animate-pulse rounded-2xl flex items-center justify-center border border-gray-100">
          <FaInstagram className="text-4xl text-gray-300" />
        </div>
      )}
    </section>
  );
};

// ============================================
// BrandPromiseSection — below Instagram
// Archetype: Asymmetric Bento, Editorial Luxury
// ============================================
const BrandPromiseSection = () => {
  const pillars = [
    {
      label: 'Anti-Tarnish',
      headline: 'Made to last. Born to be loved.',
      body: 'Every Sera piece is crafted with a premium protective finish that resists tarnish, sweat, and water. Wear it every single day without a second thought.',
      accent: 'from-rose-50 to-pink-50',
      dot: 'bg-rose-400',
      span: 'md:col-span-2',
    },
    {
      label: 'Everyday Elegance',
      headline: 'Beauty without the weight.',
      body: 'Thoughtfully designed to feel as good as it looks. Lightweight, incredibly comfortable, and perfect for seamlessly stacking or wearing solo from morning to night.',
      accent: 'from-stone-50 to-gray-50',
      dot: 'bg-stone-400',
      span: 'md:col-span-1',
    },
    {
      label: 'Gift-Ready',
      headline: 'The perfect present, always.',
      body: 'Every order ships in thoughtfully designed packaging. Birthdays, anniversaries, or just because, we handle the presentation.',
      accent: 'from-stone-50 to-gray-50',
      dot: 'bg-stone-400',
      span: 'md:col-span-1',
    },
    {
      label: 'Free Shipping',
      headline: 'On orders above ₹999.',
      body: "Across India. Every time. Because quality shouldn't come with a shipping surcharge.",
      accent: 'from-rose-50 to-pink-50',
      dot: 'bg-rose-300',
      span: 'md:col-span-2',
    },
  ];

  return (
    <section className="bg-[#FDFBF7] py-24 md:py-32 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.32,0.72,0,1] }}
          viewport={{ once: true }}
          className="mb-16 md:mb-20"
        >
          <h2 className="font-serif text-4xl md:text-6xl text-gray-900 leading-tight max-w-xl">
            Made to last.
            <span className="block italic text-rose-400">Worn to love.</span>
          </h2>
        </motion.div>

        {/* Asymmetric Bento Grid (Stacking Cards on Mobile) */}
        <div className="flex flex-col md:grid md:grid-cols-3 gap-6 md:gap-4 relative pb-10 md:pb-0">
          {pillars.map((p, i) => (
            <motion.div
              key={p.label}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: i * 0.07, ease: [0.32,0.72,0,1] }}
              viewport={{ once: true }}
              className={`sticky md:static md:top-auto w-full bg-[#FDFBF7] ${p.span}`}
              style={{ zIndex: 10 + i, top: `calc(6rem + ${i * 1.5}rem)` }}
            >
              {/* Double-Bezel outer shell */}
              <div className="rounded-[2rem] ring-1 ring-black/5 bg-black/[0.02] p-2 h-full shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.05)] md:shadow-none transition-transform duration-500 hover:scale-[1.02] md:hover:scale-100">
                {/* Inner core */}
                <div className={`relative rounded-[calc(2rem-0.375rem)] bg-gradient-to-br ${p.accent} p-8 md:p-10 h-full shadow-[inset_0_1px_1px_rgba(255,255,255,0.8)] flex flex-col justify-between min-h-[200px] overflow-hidden`}>
                  {/* Radial accent */}
                  <div className="absolute top-0 right-0 w-40 h-40 bg-white/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />
                  <div>
                    {/* Eyebrow */}
                    <span className="inline-flex items-center gap-1.5 mb-5">
                      <span className={`h-1.5 w-1.5 rounded-full ${p.dot}`} />
                      <span className="text-[10px] uppercase tracking-[0.22em] text-stone-500 font-medium">{p.label}</span>
                    </span>
                    <h3 className="font-serif text-2xl md:text-3xl text-gray-900 leading-tight mb-3">{p.headline}</h3>
                    <p className="text-sm text-stone-500 leading-relaxed max-w-xs">{p.body}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.32,0.72,0,1] }}
          viewport={{ once: true }}
          className="mt-14 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pt-10 border-t border-stone-100"
        >
          <p className="text-stone-400 text-sm max-w-sm">
            Join thousands who have made Sera their everyday luxury.
          </p>
          <FramerButton to="/shop" variant="dark">Start Shopping</FramerButton>
        </motion.div>
      </div>
    </section>
  );
};

// ============================================
// Main Home Component
// ============================================
export default function Home() {
  return (
    <div>
      <SEO canonicalUrl="https://www.serastore.in/" />
      <HeroSection />
      <CategoriesSection />
      <ApparelDropSection />
      <GiftingSection />
      <BentoCollectionsSection />
      <FloatingGallerySection />
      <InstagramFeedSection />
      <BrandPromiseSection />
    </div>
  );
}