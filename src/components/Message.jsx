import React from "react";
import { motion } from "framer-motion";

const bubbleVariants = {
  hidden: { opacity: 0, x: 40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: "spring", stiffness: 400, damping: 30 },
  },
  exit: { opacity: 0, x: -40, transition: { duration: 0.2 } },
};

export default function Message({ message }) {
  const isUser = message.sender === "user";
  return (
    <motion.div
      className={`flex ${isUser ? "justify-end" : "justify-start"}`}
      initial="hidden"
      animate="visible"
      exit="exit"
      layout
    >
      <div
        className={`max-w-[75%] px-4 py-2 rounded-2xl shadow-sm text-sm font-medium transition-colors
          ${
            isUser
              ? "bg-blue-500 text-white rounded-tr-md"
              : "bg-gray-200 text-gray-900 rounded-tl-md"
          }
        `}
      >
        {message.text}
      </div>
    </motion.div>
  );
}
