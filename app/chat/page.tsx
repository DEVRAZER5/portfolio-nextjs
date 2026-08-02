"use client";

import { useChat } from "ai/react";
import { useEffect, useRef, useState } from "react";

export default function ChatPage() {
  const { messages, input, handleInputChange, handleSubmit, isLoading, stop } =
    useChat({
      api: "/api/chat",
    });

  const scrollRef = useRef<HTMLDivElement>(null);
  const [userScrolledUp, setUserScrolledUp] = useState(false);

  // Auto-scroll to the latest message, but only if the visitor hasn't
  // manually scrolled up to read something earlier.
  useEffect(() => {
    if (!userScrolledUp) {
      scrollRef.current?.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, userScrolledUp]);

  function handleScroll() {
    const el = scrollRef.current;
    if (!el) return;
    const distanceFromBottom =
      el.scrollHeight - el.scrollTop - el.clientHeight;
    setUserScrolledUp(distanceFromBottom > 80);
  }

  // Show a "thinking" indicator only while waiting for the first
  // token, once real content starts streaming in, the text itself is
  // the indicator.
  const lastMessage = messages[messages.length - 1];
  const isWaitingForFirstToken =
    isLoading && (!lastMessage || lastMessage.role === "user");

  return (
    <section className="max-w-2xl mx-auto px-4 py-10 flex flex-col h-[calc(100vh-80px)]">
      <h1 className="text-2xl font-bold text-ink mb-1">Ask about my work</h1>
      <p className="text-sm text-muted mb-6">
        Ask about any of my projects, this is answered live by Claude, grounded in my real case studies.
      </p>

      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto space-y-3 mb-4 pr-1"
      >
        {messages.length === 0 && (
          <p className="text-sm text-muted">
            Try asking: "What was the hardest project?" or "Tell me about the Amazon clone."
          </p>
        )}

        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm whitespace-pre-wrap ${
                m.role === "user"
                  ? "bg-accent text-white rounded-br-sm"
                  : "bg-white border border-gray-200 text-ink rounded-bl-sm"
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}

        {isWaitingForFirstToken && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-sm px-4 py-2 text-sm text-muted">
              <span className="inline-flex gap-1">
                <span className="animate-bounce [animation-delay:-0.3s]">•</span>
                <span className="animate-bounce [animation-delay:-0.15s]">•</span>
                <span className="animate-bounce">•</span>
              </span>
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          value={input}
          onChange={handleInputChange}
          placeholder="Ask a question..."
          className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
        />
        {isLoading ? (
          <button
            type="button"
            onClick={stop}
            className="bg-gray-200 text-ink px-4 py-2 rounded-full text-sm font-medium"
          >
            Stop
          </button>
        ) : (
          <button
            type="submit"
            className="bg-accent text-white px-5 py-2 rounded-full text-sm font-medium"
          >
            Send
          </button>
        )}
      </form>
    </section>
  );
}
