'use client';

import { useEffect, useRef } from 'react';

export interface ChatMessage {
  id: number;
  text: string;
  timestamp: number;
}

interface ChatAreaProps {
  messages: ChatMessage[];
}

export default function ChatArea({ messages }: ChatAreaProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new message
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="h-full flex items-center justify-center overflow-hidden">
        <span className="text-amber-400 text-xs">源さんが話しかけてきます…</span>
      </div>
    );
  }

  return (
    <div
      ref={scrollRef}
      className="h-full overflow-y-auto px-2 py-1"
      style={{ scrollBehavior: 'smooth' }}
    >
      {messages.map((msg, i) => (
        <div
          key={msg.id}
          className="flex items-start gap-1.5 mb-1 animate-[chatMsgIn_0.3s_ease-out]"
        >
          {/* Only show avatar on first message or if gap between messages */}
          <div
            className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-white font-bold"
            style={{
              fontSize: '10px',
              background: 'linear-gradient(135deg, #8B6914, #6B4F12)',
              boxShadow: '0 0 0 2px rgba(139,105,20,0.2)',
            }}
          >
            源
          </div>
          <div
            className="text-xs text-amber-900 leading-snug px-2.5 py-1.5 rounded-xl rounded-tl-sm max-w-[85%]"
            style={{
              background: 'rgba(255,248,231,0.9)',
              backdropFilter: 'blur(8px)',
            }}
          >
            {msg.text}
          </div>
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  );
}
