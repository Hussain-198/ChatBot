import React from "react";

export default function ChatHistorySidebar({
  sessions,
  selectedSessionId,
  onSelectSession,
  onNewSession,
}) {
  return (
    <aside className="w-64 bg-white/80 border-r border-indigo-100/60 h-full shadow-lg flex flex-col">
      <div className="p-4 border-b border-indigo-100/60 flex items-center justify-between">
        <span className="font-bold text-lg text-indigo-700">History</span>
        <button
          className="bg-indigo-500 text-white px-3 py-1 rounded hover:bg-indigo-600 text-sm"
          onClick={onNewSession}
        >
          + New Chat
        </button>
      </div>
      <ul className="flex-1 overflow-y-auto">
        {sessions.length === 0 && (
          <li className="text-gray-400 p-4 text-center">No chats yet</li>
        )}
        {sessions.map((session) => (
          <li
            key={session.id}
            className={`cursor-pointer px-4 py-3 border-b border-indigo-50 hover:bg-indigo-100/60 transition-colors ${
              selectedSessionId === session.id
                ? "bg-indigo-200/60 font-semibold"
                : ""
            }`}
            onClick={() => onSelectSession(session.id)}
          >
            {session.title || session.id}
          </li>
        ))}
      </ul>
    </aside>
  );
}
