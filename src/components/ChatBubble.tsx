'use client';

import { useEffect, useState } from 'react';

export interface BubbleMessage {
  id: number;
  text: string;
}

interface ChatBubbleProps {
  messages: BubbleMessage[];
}

function SingleBubble({ text, isNew }: { text: string; isNew: boolean }) {
  const [visible, setVisible] = useState(!isNew);

  useEffect(() => {
    if (isNew) {
      // Trigger animation on next frame
      requestAnimationFrame(() => setVisible(true));
    }
  }, [isNew]);

  return (
    <div
      className={`chat-bubble-item flex items-start gap-2 transition-all duration-300 ease-out ${
        visible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-2 scale-95'
      }`}
    >
      {/* おっちゃんアバター */}
      <div className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md"
        style={{ background: 'linear-gradient(135deg, #8B6914, #6B4F12)' }}
      >
        源
      </div>
      {/* 吹き出し */}
      <div className="relative max-w-[80%]">
        <div
          className="px-3 py-2 rounded-xl rounded-tl-sm text-sm md:text-base font-medium shadow-sm border"
          style={{
            background: '#FFF8E7',
            borderColor: '#D4A76A',
            color: '#5C3A1E',
          }}
        >
          {text}
        </div>
      </div>
    </div>
  );
}

export default function ChatBubble({ messages }: ChatBubbleProps) {
  // Show latest 3 messages
  const visible = messages.slice(-3);

  if (visible.length === 0) return null;

  return (
    <div className="chat-bubble-container flex flex-col gap-1.5 mb-2 min-h-[3rem]">
      {visible.map((msg, idx) => (
        <SingleBubble
          key={msg.id}
          text={msg.text}
          isNew={idx === visible.length - 1}
        />
      ))}
    </div>
  );
}
