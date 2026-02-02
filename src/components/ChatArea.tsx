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
      <div className="chat-area h-full flex items-center justify-center">
        <span className="text-amber-400 text-xs">源さんが話しかけてきます…</span>
      </div>
    );
  }

  return (
    <div ref={scrollRef} className="chat-area h-full">
      {messages.map((msg) => (
        <div key={msg.id} className="chat-message">
          <div className="chat-avatar">源</div>
          <div className="chat-bubble">{msg.text}</div>
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  );
}
