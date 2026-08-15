import React from 'react';
import { Link } from 'react-router-dom';

export default function FramerButton({ children, to, variant = 'light', className = '' }) {
  // Ultra-premium theme tokens matching the Rose (pink) & White brand identity
  const themes = {
    light: {
      wrapper: 'bg-white text-gray-900 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]',
      iconCircle: 'bg-rose-500 text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]',
      hoverCircle: 'group-hover:bg-rose-600',
    },
    dark: {
      wrapper: 'bg-gray-900 text-white border border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.2)]',
      iconCircle: 'bg-rose-500 text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]',
      hoverCircle: 'group-hover:bg-rose-600',
    },
    transparent: {
      wrapper: 'bg-white/5 text-white border border-white/20 backdrop-blur-md',
      iconCircle: 'bg-white/10 text-white border border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]',
      hoverCircle: 'group-hover:bg-rose-500 group-hover:border-rose-400 group-hover:shadow-[0_0_15px_rgba(244,63,94,0.4)]',
    },
    transparentDark: {
      wrapper: 'bg-black/5 text-gray-900 border border-black/10 backdrop-blur-md',
      iconCircle: 'bg-black/5 text-gray-900 border border-black/5',
      hoverCircle: 'group-hover:bg-rose-500 group-hover:text-white group-hover:border-rose-400 group-hover:shadow-[0_0_15px_rgba(244,63,94,0.3)]',
    }
  };

  const theme = themes[variant] || themes.light;

  return (
    <Link 
      to={to} 
      className={`group relative flex items-center h-14 rounded-full pl-7 pr-2 py-2 overflow-hidden cursor-pointer transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.97] w-fit ${theme.wrapper} ${className}`}
    >
      {/* Subtle internal shine effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/0 to-transparent group-hover:via-white/[0.07] dark:group-hover:via-white/[0.03] transition-colors duration-700" />
      
      {/* Text Label */}
      <span className="relative z-10 text-[11px] font-bold tracking-[0.22em] uppercase mr-5 transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-1">
        {children}
      </span>

      {/* Button-in-Button: The Nested Trailing Icon */}
      <div className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-[2px] group-hover:-translate-y-[2px] group-hover:scale-[1.05] ${theme.iconCircle} ${theme.hoverCircle}`}>
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 24 24" 
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-4 h-4 transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:rotate-45"
        >
          {/* A crisp, clean right arrow that rotates into a 'launch' arrow ↗ on hover */}
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </div>
    </Link>
  );
}
