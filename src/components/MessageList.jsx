import React, { useEffect, useRef } from "react";
import { AnimatePresence } from "framer-motion";
import Message from "./Message";

export default function MessageList({ messages }) {
  const bottomRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    // Always scroll to the bottom (top of the reversed flex)
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div
      ref={containerRef}
      className="flex flex-col-reverse gap-2 overflow-y-auto h-full "
      style={{ flexGrow: 1 }}
    >
      <div ref={bottomRef} />
      <AnimatePresence initial={false}>
        {[...messages].reverse().map((msg) => (
          <Message key={msg.id} message={msg} />
        ))}
      </AnimatePresence>
    </div>
  );
}
