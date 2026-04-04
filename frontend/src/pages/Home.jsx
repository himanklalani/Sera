import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef, useMemo, useCallback } from 'react';


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
        rootMargin: '100px',
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

  const offers = useMemo(() => [
    {
      code: 'SPECIAL25',
      title: '✨ New Drop Special ✨',
      discount: '25%',
      description: 'Save 25% on your orders',
      icon: (
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" className="text-white drop-shadow-md">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    },
    {
      code: 'FIRST10',
      title: '✨ First Order Special ✨',
      discount: '10%',
      description: 'Save 10% on your first order',
      icon: (
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" className="text-white drop-shadow-md">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    }
  ], []);

  useEffect(() => {
    // Check if flyer has already been shown in this session
    const flyerShown = sessionStorage.getItem('flyerShown');
    if (!flyerShown) {
      setIsVisible(true);
      setHasEntered(true);
      sessionStorage.setItem('flyerShown', 'true');
    } else {
      // If already shown, signal completion immediately to show the button
      if (onComplete) onComplete();
    }
  }, [onComplete]);

  useEffect(() => {
    if (!hasEntered || !isVisible) return;

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
      {isVisible && (
        <>
          {/* Background blur overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-md z-[99]"
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
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[100] pointer-events-none"
          >
            {/* Flyer with smooth transitions */}
            <div className="relative bg-gradient-to-br from-pink-50/90 via-rose-50/85 to-pink-100/90 backdrop-blur-2xl rounded-[2.5rem] shadow-2xl border-2 border-white/60 overflow-hidden px-8 py-8 pointer-events-auto w-[360px] will-change-transform">
              {/* Dreamy decorative blobs */}
              <div className="absolute top-0 left-0 w-32 h-32 bg-rose-200/25 rounded-full blur-2xl" />
              <div className="absolute bottom-0 right-0 w-40 h-40 bg-pink-300/25 rounded-full blur-3xl" />
              <div className="absolute top-1/2 left-1/2 w-h-28 bg-rose-100/35 rounded-full blur-2xl" />
              
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
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none"
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

  const coupons = useMemo(() => [
   {
  code: 'FIRST10',
  discount: '10% OFF',
  description: 'Get 10% discount on your first order',
  validTill: (
    <span className="flex items-center gap-1 text-xs text-gray-500">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="inline-block">
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      Valid only for first order
    </span>
  ),
  color: 'from-purple-50/60 via-indigo-50/60 to-purple-50/60',
  borderColor: 'border-purple-300/60',
  textColor: 'text-purple-600',
  badgeColor: 'bg-purple-500'
},
   {
  code: 'SPECIAL25',
  discount: '25% OFF',
  description: 'Get 25% discount on your orders',
  validTill: (
    <span className="flex items-center gap-1 text-xs text-gray-500">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="inline-block">
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      Valid uptil 30th April.
    </span>
  ),
  color: 'from-purple-50/60 via-indigo-50/60 to-purple-50/60',
  borderColor: 'border-purple-300/60',
  textColor: 'text-purple-600',
  badgeColor: 'bg-purple-500'
}

  ], []);

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
        {shouldShow && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, x: -50 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ 
              duration: 0.6, 
              ease: [0.34, 1.56, 0.64, 1],
              delay: 0.2 
            }}
            className="fixed left-4 top-[13%] md:top-[32%] z-50"
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
            className="fixed left-4 top-[19%] md:top-[39%] z-40 w-72 bg-white/70 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/40 overflow-hidden"
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
                className="text-white/90 hover:text-white hover:rotate-90 transition-all duration-300"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            </div>
            
            <div className="p-4 space-y-3 max-h-[400px] overflow-y-auto">
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

  return (
    <>
      <AnimatePresence>
        {shouldShow && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, x: -50 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ 
              duration: 0.6, 
              ease: [0.34, 1.56, 0.64, 1],
              delay: 0.2 
            }}
            className="fixed left-4 top-[13%] md:top-[32%] z-50"
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
            className="fixed left-4 top-[19%] md:top-[39%] z-40 w-72 bg-white/70 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/40 overflow-hidden"
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
                className="text-white/90 hover:text-white hover:rotate-90 transition-all duration-300"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            </div>
            
            <div className="p-4 space-y-3 max-h-[400px] overflow-y-auto">
              {coupons.map((coupon, index) => (
                <motion.div
                  key={coupon.code}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.1 }}
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
                    <div className="mt-2">
  {coupon.validTill}
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
                💝 Apply at checkout to save more!
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
    'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=65&w=1200&auto=format&fit=crop&fm=webp',
    '/images/gift1.jpg',
    '/images/gift2.jpg',
    '/images/gift3.jpg',
    '/images/gift4.jpg',
    '/images/gift5.jpg'
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
                <div className="w-full h-full rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
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
              className={`rounded-full transition-all duration-300 cursor-pointer ${
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
          className="max-w-md text-base md:text-lg text-gray-700 leading-relaxed mb-6 md:mb-8"
        >
          Jewellery that feels personal, packaging that looks like a celebration. Whether it's a thoughtful surprise or a spontaneous gesture, our pieces come ready to gift, no extra wrapping required.
        </motion.p>
      </div>
    </section>
  );
};


// ============================================
// HeroSection (WITH Transformation Magic + Background Loading + Delayed Flyer)
// ============================================
const HeroSection = () => {
  const [showButton, setShowButton] = useState(false);
  const [backgroundLoaded, setBackgroundLoaded] = useState(false);
  const [showFlyer, setShowFlyer] = useState(false);
  const heroImage = 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=75&w=1920&auto=format&fit=crop&fm=webp';
  
  // Preload hero image
  useEffect(() => {
    const img = new Image();
    img.src = heroImage;
    img.onload = () => setBackgroundLoaded(true);
  }, [heroImage]);

  // Show flyer after hero content loads (text animations complete + 0.5s)
  useEffect(() => {
    // Text animations complete at 0.8s (0.6s duration + 0.2s delay)
    // Add 0.5s wait = 1.3s total
    const flyerTimer = setTimeout(() => {
      setShowFlyer(true);
    }, 1300);

    return () => clearTimeout(flyerTimer);
  }, []);

  return (
    <div className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden bg-gray-900 safe-area">
      
      <div 
        className={`absolute inset-0 w-full h-full bg-cover bg-center z-0 transition-opacity duration-500 ${
          backgroundLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ 
          backgroundImage: `url("${heroImage}")`,
          filter: 'brightness(0.6)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          WebkitBackgroundAttachment: 'scroll',
          backgroundAttachment: 'scroll',
          willChange: 'opacity'
        }}
      />

      {/* Loading placeholder */}
      {!backgroundLoaded && (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 z-0" />
      )}
      
      {/* Flying Offer Banner - only shows after hero content loads */}
      {showFlyer && <FlyingOfferBanner onComplete={() => setShowButton(true)} />}
      
      {/* Floating Coupon Drawer appears after flyer disappears */}
      <FloatingCouponDrawer shouldShow={showButton} />
      
      <div className="relative z-10 flex flex-col items-center justify-center flex-1 text-white text-center px-4 py-16 sm:py-8">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-7xl font-serif mb-4 tracking-wide will-change-transform"
        >
          Welcome to Sera
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-base sm:text-lg md:text-2xl lg:text-3xl font-light tracking-widest uppercase drop-shadow-lg mb-12"
        >
          timeless elegance <span className="block md:inline font-serif italic text-rose-200">meets</span> modern intention
        </motion.p>
        
        <motion.div 
          className="absolute bottom-[15%] sm:bottom-[20%] left-1/2 transform -translate-x-1/2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ 
            opacity: 1, 
            y: [0, 8, 0],
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            repeatDelay: 1,
            ease: "easeInOut"
          }}
        >
          <svg 
            width="28" 
            height="28" 
            viewBox="0 0 24 24" 
            fill="none" 
            className="text-white/90 drop-shadow-lg"
          >
            <path 
              d="M6 9L12 15L18 9" 
              stroke="currentColor" 
              strokeWidth="2.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        </motion.div>
      </div>
    </div>
  );
};


// ============================================
// CategoriesSection
// ============================================
const CategoriesSection = () => {
  const navigate = useNavigate();
  
  const categories = useMemo(() => [
    { 
      name: 'EARRINGS', 
      img: '/images/earring.jpg',
      srcSet: '/images/earring-sm.jpg 480w, /images/earring-md.jpg 768w, /images/earring.jpg 1024w'
    },
    { 
      name: 'BRACELET', 
      img: '/images/bracelet.png',
      srcSet: '/images/bracelet-sm.png 480w, /images/bracelet-md.png 768w, /images/bracelet.png 1024w'
    },
    { 
      name: 'RINGS', 
      img: '/images/ring.png',
      srcSet: '/images/ring-sm.png 480w, /images/ring-md.png 768w, /images/ring.png 1024w'
    },
    { 
      name: 'NECKLACE', 
      img: '/images/necklace.jpg',
      srcSet: '/images/necklace-sm.jpg 480w, /images/necklace-md.jpg 768w, /images/necklace.jpg 1024w'
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
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {categories.map((cat, index) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.03 }}
              viewport={{ once: true }}
              onClick={() => navigate(`/shop?category=${cat.name}`)}
              className="group cursor-pointer relative"
            >
              <div className="relative overflow-hidden rounded-2xl aspect-[3/4] bg-gray-100 shadow-md hover:shadow-xl transition-all duration-300">
                <LazyImage 
                  src={cat.img}
                  srcSet={cat.srcSet}
                  alt={cat.name} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 will-change-transform"
                  width={400}
                  height={533}
                />
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
      img: '/images/bestsellers.jpg',
      size: 'large',
      color: 'from-rose-100 to-pink-50',
      link: '/shop?tags=bestseller'
    },
    {
      name: 'Everyday Essentials',
      description: 'Chic daily pieces',
      img: '/images/everyday.jpg',
      size: 'tall',
      color: 'from-pink-50 to-rose-50',
      link: '/shop?tags=everyday'
    },
    {
      name: 'Accent Pairs',
      description: 'Bold & beautiful',
      img: '/images/pair.jpg',
      size: 'small',
      color: 'from-rose-50 to-white',
      link: '/shop?tags=accent'
    },
    {
      name: 'Minimalist',
      description: 'Less is more',
      img: '/images/minimalist.jpg',
      size: 'small',
      color: 'from-white to-rose-50',
      link: '/shop?tags=minimalist'
    },
    {
      name: 'Boho Vibes',
      description: 'Free-spirited designs',
      img: '/images/boho.png',
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
    { img: '/images/gallery2.png', height: 'h-64', delay: 0 },
    { img: '/images/gallery1.png', height: 'h-80', delay: 0.05 },
    { img: '/images/gallery3.jpg', height: 'h-72', delay: 0.1 },
    { img: '/images/gallery4.jpg', height: 'h-96', delay: 0.15 },
    { img: '/images/gallery5.jpg', height: 'h-64', delay: 0.2 },
    { img: '/images/gallery6.jpg', height: 'h-88', delay: 0.25 },
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
// Main Home Component
// ============================================
export default function Home() {
  return (
    <div>
      <HeroSection />
      <CategoriesSection />
      <GiftingSection />
      <BentoCollectionsSection />
      <FloatingGallerySection />
    </div>
  );
}