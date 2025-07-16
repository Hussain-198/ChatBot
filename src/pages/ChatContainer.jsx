import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MessageList from "../components/MessageList";
import TypingIndicator from "../components/TypingIndicator";
import ChatInput from "../components/ChatInput";

const sampleMessages = [
  { id: 1, text: "Hello! How can I help you today?", sender: "bot" },
];

export default function ChatContainer() {
  const [messages, setMessages] = useState(sampleMessages);
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async (msg) => {
    setMessages((prev) => [
      ...prev,
      { id: Date.now(), text: msg, sender: "user" },
    ]);
    setIsTyping(true);
    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-goog-api-key": apiKey,
          },
          body: JSON.stringify({
            contents: [
              ...messages.map((m) => ({
                role: m.sender === "user" ? "user" : "model",
                parts: [{ text: m.text }],
              })),
              {
                role: "user",
                parts: [{ text: msg }],
              },
            ],
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("API Error:", errorData);
        throw new Error("Failed to fetch from Gemini API");
      }

      const data = await response.json();
      const aiReply =
        data.candidates?.[0]?.content?.parts?.[0]?.text ||
        "Sorry, I couldn't get a response.";
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, text: aiReply, sender: "bot" },
      ]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          text: "Sorry, there was an error contacting the AI.",
          sender: "bot",
        },
      ]);
    }
    setIsTyping(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#e0e7ff] via-[#f8fafc] to-[#c7d2fe] relative overflow-hidden">
      {/* Dashboard-style abstract shapes */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-gradient-to-br from-blue-400/30 to-indigo-300/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-tr from-indigo-400/20 to-blue-200/0 rounded-full blur-2xl" />
        <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] -translate-x-1/2 -translate-y-1/2 bg-gradient-radial from-white/60 to-transparent rounded-full blur-2xl" />
        {/* Subtle grid */}
        <svg
          className="absolute inset-0 w-full h-full opacity-10"
          width="100%"
          height="100%"
        >
          <defs>
            <pattern
              id="grid"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="#a5b4fc"
                strokeWidth="0.5"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>
      <div className="flex flex-col w-full max-w-md h-[80vh] bg-white/80 shadow-2xl rounded-3xl border border-indigo-100/80 backdrop-blur-xl z-10 relative">
        <header className="bg-gradient-to-r from-blue-600 to-indigo-500 text-white p-5 font-bold text-xl flex items-center justify-between shadow-md rounded-t-3xl">
          <span className="tracking-wide">ChatBot</span>
          <span className="text-xs font-medium opacity-80">Online</span>
        </header>
        <div className="flex-1 flex flex-col overflow-y-auto px-4 py-4 bg-white/60 rounded-b-3xl">
          <MessageList messages={messages} />
          <AnimatePresence>
            {isTyping && <TypingIndicator key="typing" />}
          </AnimatePresence>
        </div>
        <div className="bg-white/80 px-3 pb-3 pt-2 border-t border-indigo-100/60 rounded-b-3xl">
          <ChatInput onSend={handleSend} />
        </div>
      </div>
    </div>
  );
}
