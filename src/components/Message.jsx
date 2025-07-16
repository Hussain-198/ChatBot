import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";

function useTypewriter(text, enabled, speed = 10) {
  const [displayed, setDisplayed] = useState(enabled ? "" : text);
  useEffect(() => {
    if (!enabled) {
      setDisplayed(text);
      return;
    }
    setDisplayed("");
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) clearInterval(interval);
    }, speed);
    return () => clearInterval(interval);
  }, [text, enabled, speed]);
  return displayed;
}

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
  const showTypewriter = !isUser;
  const displayedText = useTypewriter(message.text, showTypewriter);
  return (
    <motion.div
      className={`flex ${isUser ? "justify-end" : "justify-start"}`}
      initial="hidden"
      animate="visible"
      exit="exit"
      layout
    >
      <div
        className={`max-w-[75%] px-4 py-4 rounded-2xl shadow-sm text-sm font-medium transition-colors break-words
          ${
            isUser
              ? "bg-zinc-500 text-white rounded-tr-md"
              : "bg-gray-200 text-gray-900 rounded-tl-md"
          }
        `}
      >
        <ReactMarkdown>{displayedText}</ReactMarkdown>
      </div>
    </motion.div>
  );
}
