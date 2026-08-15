import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function FramerButton({ children, to, variant = 'light', className = '' }) {
  // Theme styling logic
  const themes = {
    light: {
      bg: 'bg-white',
      text: 'text-gray-900',
      pillBg: 'bg-gray-900',
      pillHoverBg: 'bg-rose-500',
      svgColor: 'text-white'
    },
    dark: {
      bg: 'bg-gray-900',
      text: 'text-white',
      pillBg: 'bg-white/15',
      pillHoverBg: 'bg-rose-600',
      svgColor: 'text-white'
    },
    transparent: {
      bg: 'bg-transparent border border-white/30',
      text: 'text-white',
      pillBg: 'bg-white/10 border border-white/20',
      pillHoverBg: 'bg-rose-500',
      svgColor: 'text-white'
    },
    transparentDark: {
      bg: 'bg-transparent border border-gray-900/40',
      text: 'text-gray-900',
      pillBg: 'bg-gray-900/5 border border-gray-900/20',
      pillHoverBg: 'bg-rose-600',
      svgColor: 'text-white'
    }
  };

  const theme = themes[variant] || themes.light;

  const arrowPaths = {
    default: "M 12.175 9 L 0 9 L 0 7 L 12.175 7 L 6.575 1.4 L 8 0 L 16 8 L 8 16 L 6.575 14.6 Z",
    hover: "M 36.675 9 L 0 9 L 0 7 L 36.675 7 L 31.075 1.4 L 32.5 0 L 40.5 8 L 32.5 16 L 31.075 14.6 Z"
  };

  return (
    <Link to={to} className={`block w-fit ${className}`}>
      <motion.div
        initial="default"
        whileHover="hover"
        className={`relative flex items-center h-14 rounded-full pl-6 pr-2 py-2 overflow-hidden cursor-pointer shadow-md ${theme.bg}`}
        style={{ minWidth: '180px' }}
      >
        {/* Animated Text */}
        <motion.span
          variants={{
            default: { x: 0, opacity: 1 },
            hover: { x: -40, opacity: 0 }
          }}
          transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
          className={`text-sm font-semibold tracking-widest uppercase mr-12 z-10 whitespace-nowrap ${theme.text}`}
        >
          {children}
        </motion.span>

        {/* Expanding Pill Container */}
        <motion.div
          variants={{
            default: { width: '40px', height: '40px', right: '8px' },
            hover: { width: 'calc(100% - 16px)', height: '40px', right: '8px' }
          }}
          transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
          className={`absolute flex items-center justify-center rounded-full ${theme.pillBg} overflow-hidden z-20`}
        >
          {/* Background color transition on hover */}
          <motion.div
            variants={{
              default: { opacity: 0 },
              hover: { opacity: 1 }
            }}
            transition={{ duration: 0.3 }}
            className={`absolute inset-0 ${theme.pillHoverBg}`}
          />
          
          {/* Arrow SVG */}
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 41 16" 
            className={`relative z-10 w-10 h-4 ${theme.svgColor} ${variant === 'transparentDark' ? 'text-gray-700 group-hover:text-white' : ''}`}
            style={{ overflow: 'visible' }}
          >
            <motion.path
              variants={{
                default: { d: arrowPaths.default, fill: "currentColor" },
                hover: { d: arrowPaths.hover, fill: "#ffffff" }
              }}
              transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
            />
          </svg>
        </motion.div>
      </motion.div>
    </Link>
  );
}
