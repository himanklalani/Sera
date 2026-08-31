import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Preloader() {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const isLoadedRef = useRef(false);

  useEffect(() => {
    // 1. Explicitly preload heavy hero images AND category images
    const imagesToPreload = [
      // Hero Images
      "https://res.cloudinary.com/dhby5v7rw/image/upload/v1782307100/jewelry-products/zvcq5yqjtbwlk2etcrmx.jpg",
      "https://res.cloudinary.com/dhby5v7rw/image/upload/f_auto/q_auto/v1786971801/new22_mgyrk6.jpg",
      "https://res.cloudinary.com/dhby5v7rw/image/upload/q_auto/f_auto/v1786970934/new3_usglan.jpg",
      "https://res.cloudinary.com/dhby5v7rw/image/upload/v1767446388/jewelry-products/d9jprpcgv9zfhuhfzljy.jpg",
      // Category Images
      "https://res.cloudinary.com/dhby5v7rw/image/upload/f_auto,q_auto/v1780227856/earring_xq3tnr.jpg",
      "https://res.cloudinary.com/dhby5v7rw/image/upload/f_auto,q_auto/v1780227859/bracelet_euzi0c.png",
      "https://res.cloudinary.com/dhby5v7rw/image/upload/f_auto,q_auto/v1780227857/necklace_mfa0eu.jpg"
    ];

    let loadedImagesCount = 0;
    
    const checkAllLoaded = () => {
      loadedImagesCount++;
      if (loadedImagesCount === imagesToPreload.length) {
        // Also ensure standard DOM load has happened, but the images are the main blocker
        if (document.readyState === 'complete') {
          isLoadedRef.current = true;
        } else {
          window.addEventListener('load', () => { isLoadedRef.current = true; }, { once: true });
        }
      }
    };

    imagesToPreload.forEach((src) => {
      const img = new Image();
      img.src = src;
      img.onload = checkAllLoaded;
      img.onerror = checkAllLoaded; // don't hang if one fails
    });

    // Failsafe: if network is extremely slow, don't let them stare at a preloader forever
    setTimeout(() => { isLoadedRef.current = true; }, 8000);

    const duration = 1800; // Base animation time
    const startTime = performance.now();

    const animateProgress = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progressRatio = Math.min(elapsed / duration, 1);
      
      // Cinematic easing curve
      const easeOut = 1 - Math.pow(1 - progressRatio, 4);
      let calculatedProgress = Math.floor(easeOut * 100);

      // Cap at 90% if actual load event hasn't fired yet
      if (calculatedProgress > 90 && !isLoadedRef.current) {
        calculatedProgress = 90;
      }

      setProgress(calculatedProgress);

      if (calculatedProgress < 100) {
        requestAnimationFrame(animateProgress);
      } else {
        // Wait at 100% for a split second before triggering exit
        setTimeout(() => setIsVisible(false), 300);
      }
    };

    requestAnimationFrame(animateProgress);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="preloader"
          // Slide up smoothly to reveal the site beneath
          exit={{ y: "-100%", transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] } }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#F9F6F0] overflow-hidden"
        >
          {/* Vertical Pink Fill tied to loading progress */}
          <div 
            className="absolute bottom-0 left-0 w-full bg-rose-200/30 z-0 origin-bottom" 
            style={{ height: `${progress}%`, transition: 'height 50ms linear' }} 
          />

          {/* Logo Reveal */}
          <div className="overflow-hidden z-10 relative">
            <motion.img 
              src="/logo.avif"
              alt="SERA Logo"
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="h-28 md:h-36 w-auto object-contain"
            />
          </div>
          
        

          {/* Bottom Right Percentage Counter */}
          <div className="absolute bottom-8 right-8 md:bottom-12 md:right-12 z-10">
            <span className="text-4xl md:text-6xl font-serif italic text-gray-900/10">
              {progress}%
            </span>
          </div>

          {/* Minimalist Progress Line at bottom */}
          <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gray-200 z-10">
            <motion.div 
              className="h-full bg-rose-400 origin-left"
              style={{ scaleX: progress / 100 }}
              transition={{ duration: 0 }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
