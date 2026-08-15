import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function TextArrowCTA({ children, to, className = '', variant = 'light' }) {
  const [isHovered, setIsHovered] = useState(false);

  const textColor = variant === 'dark' ? 'text-gray-900' : 'text-white';
  const lineColor = variant === 'dark' ? 'bg-gray-900' : 'bg-white';

  return (
    <Link 
      to={to} 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative inline-flex flex-col items-center justify-center cursor-pointer ${className}`}
    >
      <motion.div 
        layout
        className={`flex items-center gap-2 uppercase tracking-[0.2em] text-xs font-semibold ${textColor} pb-[2px]`}
        style={{ flexDirection: isHovered ? 'row-reverse' : 'row' }}
      >
        <motion.div layout transition={{ type: "spring", stiffness: 300, damping: 30 }}>
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="1.5" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="w-4 h-4"
          >
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </motion.div>
        <motion.span layout transition={{ type: "spring", stiffness: 300, damping: 30 }}>
          {children}
        </motion.span>
      </motion.div>
      
      {/* Animated Underline */}
      <div className="relative w-full h-[1.5px] bg-transparent overflow-hidden">
        {/* Line that shrinks to the right when hovered */}
        <motion.div 
          className={`absolute inset-0 ${lineColor}`}
          style={{ transformOrigin: 'right' }}
          initial={false}
          animate={{ scaleX: isHovered ? 0 : 1 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        />
        {/* Line that grows from right to left when hovered */}
        <motion.div 
          className={`absolute inset-0 ${lineColor}`}
          style={{ transformOrigin: 'right' }}
          initial={false}
          animate={{ scaleX: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3, delay: isHovered ? 0.15 : 0, ease: "easeInOut" }}
        />
      </div>
    </Link>
  );
}
