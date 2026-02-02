'use client';

import { useEffect, useState, useRef, useCallback } from 'react';

export interface BubbleMessage {
  id: number;
  text: string;
}

interface ChatBubbleProps {
  messages: BubbleMessage[];
}

export default function ChatBubble({ messages }: ChatBubbleProps) {
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);
  const fadeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prevMsgIdRef = useRef<number>(0);

  const latest = messages.length > 0 ? messages[messages.length - 1] : null;

  const dismiss = useCallback(() => {
    setFading(true);
    setTimeout(() => setVisible(false), 300);
  }, []);

  // When a new message arrives, show it and set auto-fade
  useEffect(() => {
    if (!latest) return;
    if (latest.id === prevMsgIdRef.current) return;
    prevMsgIdRef.current = latest.id;

    setVisible(true);
    setFading(false);

    if (fadeTimerRef.current) clearTimeout(fadeTimerRef.current);
    fadeTimerRef.current = setTimeout(() => {
      dismiss();
    }, 5000);

    return () => {
      if (fadeTimerRef.current) clearTimeout(fadeTimerRef.current);
    };
  }, [latest, dismiss]);

  if (!latest || !visible) return null;

  return (
    <div
      className={`chat-float ${fading ? 'fading' : ''}`}
      onClick={dismiss}
    >
      <div className="flex items-start gap-2">
        <div
          className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-white font-bold text-xs"
          style={{ background: 'linear-gradient(135deg, #8B6914, #6B4F12)' }}
        >
          源
        </div>
        <p className="text-sm text-amber-900 leading-relaxed font-medium">
          {latest.text}
        </p>
      </div>
    </div>
  );
}
