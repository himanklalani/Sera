import React from 'react';
import { Link } from 'react-router-dom';

export default function TextArrowCTA({ children, to, className = '' }) {
  return (
    <Link 
      to={to} 
      className={`group flex items-center gap-3 text-white uppercase tracking-[0.2em] text-xs font-semibold cursor-pointer ${className}`}
    >
      <span className="relative overflow-hidden py-1">
        <span className="inline-block transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:-translate-y-[120%]">
          {children}
        </span>
        <span className="absolute left-0 top-full inline-block transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:-translate-y-full">
          {children}
        </span>
      </span>
      <div className="flex items-center">
        <div className="h-[1.5px] bg-white transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] w-4 group-hover:w-10" />
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="1.5" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          className="w-4 h-4 -ml-[2px] transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]"
        >
          <path d="M14 5l7 7-7 7" />
        </svg>
      </div>
    </Link>
  );
}
