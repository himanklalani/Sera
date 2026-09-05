import React from 'react';
import { motion } from 'framer-motion';

/**
 * FreeShippingBar Component
 * Displays a visual progress bar indicating how close the customer is
 * to unlocking Free Shipping (threshold: above INR 999).
 */
const FreeShippingBar = ({ subtotal = 0, isCouponFreeShipping = false, threshold = 999 }) => {
  // Free shipping applies when subtotal is strictly above the threshold or unlocked by coupon
  const isFree = isCouponFreeShipping || subtotal > threshold;
  const amountLeft = Math.max(0, (threshold + 1) - subtotal);
  const progress = isFree
    ? 100
    : Math.min(99, Math.max(0, Math.round((subtotal / (threshold + 1)) * 100)));

  return (
    <div className="w-full">
      {isFree ? (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-emerald-50/90 border border-emerald-200/80 rounded-2xl p-3.5 mb-5 shadow-xs"
        >
          <div className="flex items-center justify-between text-xs sm:text-sm">
            <div className="flex items-center gap-2 font-semibold text-emerald-900">
              <svg className="w-4 h-4 text-emerald-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              <span>Congratulations! You've unlocked <strong>FREE Shipping</strong></span>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
              FREE
            </span>
          </div>
          <div className="w-full bg-emerald-200/60 h-2 rounded-full mt-2.5 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="bg-emerald-500 h-full rounded-full shadow-xs"
            />
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/95 border border-rose-200/80 rounded-2xl p-3.5 mb-5 shadow-xs"
        >
          <div className="flex items-center justify-between text-xs sm:text-sm font-medium text-gray-800 mb-2">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-rose-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
              </svg>
              <span>
                Add <strong className="text-rose-600 font-bold">INR {amountLeft}</strong> more for{' '}
                <strong className="text-gray-900">FREE Delivery</strong>
              </span>
            </div>
            <span className="text-xs text-rose-500 font-bold bg-rose-50 px-2 py-0.5 rounded-full">
              {progress}%
            </span>
          </div>
          <div className="w-full bg-rose-100/70 h-2 rounded-full overflow-hidden relative">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="bg-gradient-to-r from-rose-400 via-rose-500 to-rose-600 h-full rounded-full shadow-xs"
            />
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default FreeShippingBar;
