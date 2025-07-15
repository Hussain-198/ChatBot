import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { FiSend } from "react-icons/fi";

export default function ChatInput({ onSend }) {
  const [input, setInput] = useState("");
  const inputRef = useRef(null);

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
    <div className="flex items-center gap-2 p-3 border-t bg-white">
      <input
        ref={inputRef}
        className="flex-1 px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition text-sm bg-gray-50"
        type="text"
        placeholder="Type your message..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <motion.button
        whileTap={{ scale: 0.9 }}
        whileHover={{ scale: 1.1 }}
        className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-700 transition"
        onClick={handleSend}
        aria-label="Send message"
      >
        <FiSend size={20} />
      </motion.button>
    </div>
  );
}
