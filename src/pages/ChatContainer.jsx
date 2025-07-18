import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TbMessageChatbotFilled } from "react-icons/tb";
import MessageList from "../components/MessageList";
import TypingIndicator from "../components/TypingIndicator";
import ChatInput from "../components/ChatInput";
import ChatHistorySidebar from "../components/ChatHistorySidebar";
import { HiMenu } from "react-icons/hi";

const getTodayId = () => {
  const d = new Date();
  return d.toISOString().slice(0, 10);
};
const getTodayTitle = () => {
  return new Date().toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const DEFAULT_BOT_MSG = {
  id: 1,
  text: "Hello! How can I help you today?",
  sender: "bot",
};

export default function ChatContainer() {
  const [sessions, setSessions] = useState([]);
  const [selectedSessionId, setSelectedSessionId] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [sessionsLoaded, setSessionsLoaded] = useState(false);
  const [latestAnimatedAiId, setLatestAnimatedAiId] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Load sessions from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("chat_sessions");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setSessions(parsed);
        if (parsed.length > 0) setSelectedSessionId(parsed[0].id);
      } catch (e) {
        const todayId = getTodayId();
        const todaySession = {
          id: todayId,
          title: getTodayTitle(),
          messages: [DEFAULT_BOT_MSG],
        };
        setSessions([todaySession]);
        setSelectedSessionId(todayId);
      }
    } else {
      // Start with today's session if none exist
      const todayId = getTodayId();
      const todaySession = {
        id: todayId,
        title: getTodayTitle(),
        messages: [DEFAULT_BOT_MSG],
      };
      setSessions([todaySession]);
      setSelectedSessionId(todayId);
    }
    setSessionsLoaded(true);
  }, []);

  // Save sessions to localStorage whenever they change
  useEffect(() => {
    if (sessionsLoaded) {
      localStorage.setItem("chat_sessions", JSON.stringify(sessions));
    }
  }, [sessions, sessionsLoaded]);

  // Reset animation state after a short delay
  useEffect(() => {
    if (latestAnimatedAiId) {
      const timeout = setTimeout(() => setLatestAnimatedAiId(null), 2000);
      return () => clearTimeout(timeout);
    }
  }, [latestAnimatedAiId]);

  const currentSession = sessions.find((s) => s.id === selectedSessionId);
  const messages = currentSession ? currentSession.messages : [];

  const handleSend = async (msg) => {
    if (!currentSession) return;
    const userMsg = { id: Date.now(), text: msg, sender: "user" };
    setSessions((prev) =>
      prev.map((s) =>
        s.id === selectedSessionId
          ? { ...s, messages: [...s.messages, userMsg] }
          : s
      )
    );
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
      const botMsg = { id: Date.now() + 1, text: aiReply, sender: "bot" };
      setSessions((prev) =>
        prev.map((s) =>
          s.id === selectedSessionId
            ? { ...s, messages: [...s.messages, botMsg] }
            : s
        )
      );
      setLatestAnimatedAiId(botMsg.id);
    } catch (err) {
      console.error(err);
      const errorMsg = {
        id: Date.now() + 1,
        text: "Sorry, there was an error contacting the AI.",
        sender: "bot",
      };
      setSessions((prev) =>
        prev.map((s) =>
          s.id === selectedSessionId
            ? { ...s, messages: [...s.messages, errorMsg] }
            : s
        )
      );
      setLatestAnimatedAiId(errorMsg.id);
    }
    setIsTyping(false);
  };

  const handleSelectSession = (id) => {
    setSelectedSessionId(id);
    // Auto-close sidebar on mobile
    if (window.innerWidth < 768) setSidebarOpen(false);
  };

  const handleNewSession = () => {
    const newId = Date.now().toString();
    const today = new Date();
    const title = today.toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
    const newSession = {
      id: newId,
      title,
      messages: [DEFAULT_BOT_MSG],
    };
    setSessions((prev) => [newSession, ...prev]);
    setSelectedSessionId(newId);
  };

  return (
    <div className="w-screen h-screen min-h-screen flex bg-gradient-to-br from-[#e0e7ff] via-[#f8fafc] to-[#c7d2fe] relative overflow-hidden">
      {/* Dashboard-style abstract shapes */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-gradient-to-br from-blue-400/30 to-indigo-300/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-tr from-indigo-400/20 to-blue-200/0 rounded-full blur-2xl" />
        <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] -translate-x-1/2 -translate-y-1/2 bg-gradient-radial from-white/60 to-transparent rounded-full blur-2xl" />
        {/* Subtle grid */}
        <svg
          className="absolute inset-0 w-full h-full"
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
      {/* Chat layout with sidebar */}
      <div className="flex w-full h-full bg-transparent z-10 relative">
        {/* Sidebar for desktop, overlay for mobile */}
        {/* Hamburger button for mobile */}
        <button
          className="absolute top-4 left-4 z-30 md:hidden bg-white/80 rounded-full p-2 shadow-md"
          onClick={() => setSidebarOpen(true)}
          aria-label="Open sidebar"
        >
          <HiMenu size={24} />
        </button>
        {/* Sidebar overlay for mobile */}
        <div
          className={`fixed inset-0 bg-black/30 z-40 transition-opacity duration-300 md:hidden ${
            sidebarOpen
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          }`}
          onClick={() => setSidebarOpen(false)}
        >
          <div
            className={`absolute left-0 top-0 h-full w-64 bg-white shadow-xl transition-transform duration-300 ${
              sidebarOpen ? "translate-x-0" : "-translate-x-full"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <ChatHistorySidebar
              sessions={sessions}
              selectedSessionId={selectedSessionId}
              onSelectSession={handleSelectSession}
              onNewSession={handleNewSession}
              onCloseSidebar={() => setSidebarOpen(false)}
            />
          </div>
        </div>
        {/* Sidebar for desktop */}
        <div className="hidden md:block h-full">
          <ChatHistorySidebar
            sessions={sessions}
            selectedSessionId={selectedSessionId}
            onSelectSession={handleSelectSession}
            onNewSession={handleNewSession}
          />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 80, damping: 18 }}
          className="flex flex-col flex-1 h-full bg-indigo-50 bg-no-repeat bg-cover bg-center backdrop-blur-xl relative"
        >
          <header className="bg-gradient-to-r from-blue-600 to-indigo-500 text-white p-5 font-bold text-xl flex items-center justify-center shadow-md">
            <TbMessageChatbotFilled size={24} />
            <span className="tracking-wide ml-2">ChatBot</span>
          </header>
          <div className="flex-1 flex flex-col overflow-y-auto px-2 sm:px-4 py-4">
            <MessageList
              messages={messages}
              latestAnimatedAiId={latestAnimatedAiId}
            />
            <AnimatePresence>
              {isTyping && <TypingIndicator key="typing" />}
            </AnimatePresence>
          </div>
          <div className="px-2 sm:px-3 pb-3 pt-2 border-t border-indigo-200/60 rounded-b-3xl">
            <ChatInput onSend={handleSend} />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
