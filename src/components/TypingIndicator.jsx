import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const dotVariants = {
  animate: (i) => ({
    y: [1, -2, 1],
    scale: [1, 1.5, 1],
    opacity: [0.5, 1, 0.5],
    transition: {
      y: {
        repeat: Infinity,
        repeatType: "loop",
        duration: 0.7,
        delay: i * 0.15,
        ease: "easeInOut",
      },
      scale: {
        repeat: Infinity,
        repeatType: "loop",
        duration: 0.7,
        delay: i * 0.15,
        ease: "easeInOut",
      },
      opacity: {
        repeat: Infinity,
        repeatType: "loop",
        duration: 0.7,
        delay: i * 0.15,
        ease: "easeInOut",
      },
    },
  }),
};

export default function TypingIndicator({ message }) {
  return (
    <div className="flex items-center gap-1 px-4 py-2">
      <div className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full rounded-tl-sm">
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="block w-1 h-1 bg-gray-500 rounded-full"
              custom={i}
              variants={dotVariants}
              animate="animate"
            />
          ))}
        </div>
      </div>
      <span className="text-xs text-gray-500 ml-2">Typing...</span>
    </div>
  );
}
