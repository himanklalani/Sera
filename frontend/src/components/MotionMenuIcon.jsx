import React from 'react';
import { motion } from 'framer-motion';

export default function MotionMenuIcon({ isOpen }) {
  const variant = isOpen ? "open" : "closed";

  const top = {
    closed: { rotate: 0, translateY: 0 },
    open: { rotate: 45, translateY: 6 }
  };

  const middle = {
    closed: { rotate: 0, opacity: 1 },
    open: { rotate: -45, opacity: 0 }
  };

  const bottom = {
    closed: { rotate: 0, translateY: 0, opacity: 1 },
    open: { rotate: -45, translateY: -6, opacity: 1 }
  };

  const lineStyle = "h-[2px] w-6 bg-current origin-center rounded-full";

  return (
    <motion.div
      initial={false}
      animate={variant}
      className="flex flex-col justify-between w-6 h-[14px] cursor-pointer"
    >
      <motion.div
        variants={top}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className={lineStyle}
      />
      <motion.div
        variants={middle}
        transition={{ duration: 0.1 }}
        className={lineStyle}
      />
      <motion.div
        variants={bottom}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className={lineStyle}
      />
    </motion.div>
  );
}
