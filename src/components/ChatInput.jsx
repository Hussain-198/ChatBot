import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { FiSend } from "react-icons/fi";

export default function ChatInput({ onSend }) {
  const [input, setInput] = useState("");
  const inputRef = useRef(null);

  // Auto-grow textarea height
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
      inputRef.current.style.height = inputRef.current.scrollHeight + "px";
    }
  }, [input]);

  const handleSend = () => {
    if (input.trim()) {
      onSend(input);
      setInput("");
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <div className="flex items-center gap-2 p-3  bg-white rounded-3xl">
      <textarea
        ref={inputRef}
        className="flex-1 px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition text-sm bg-gray-50 resize-none"
        placeholder="Type your message..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        rows={1}
        style={{maxHeight:"7em"}}
      />
      <motion.button
        whileTap={{ scale: 0.9 }}
        // whileHover={{ scale: 1.1 }}
        className="p-2 rounded-xl bg-indigo-500 text-white hover:bg-indigo-600 active:bg-indigo-700 transition"
        onClick={handleSend}
        aria-label="Send message"
      >
        <FiSend size={20} />
      </motion.button>
    </div>
  );
}
