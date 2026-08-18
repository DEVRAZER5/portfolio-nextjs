"use client";

import { useChat } from "@ai-sdk/react";
import { useEffect, useRef, useState } from "react";
import { EXAMPLE_PROMPTS, MessageList } from "./chat-parts";

// --- Main chat page -------------------------------------------------

export default function ChatPage() {
  const { messages, sendMessage, status, stop, error, regenerate } = useChat();

  const [input, setInput] = useState("");
  const [isRetrying, setIsRetrying] = useState(false);
  const isLoading = status === "streaming" || status === "submitted";

  const scrollRef = useRef<HTMLDivElement>(null);
  const [userScrolledUp, setUserScrolledUp] = useState(false);

  useEffect(() => {
    if (!userScrolledUp) {
      scrollRef.current?.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, userScrolledUp]);

  // Once a new request settles (succeeds or fails again), release the
  // retry button so it isn't stuck disabled forever, and so a second,
  // deliberate retry is possible.
  useEffect(() => {
    if (status !== "submitted" && status !== "streaming") {
      setIsRetrying(false);
    }
  }, [status]);

  function handleScroll() {
    const el = scrollRef.current;
    if (!el) return;
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    setUserScrolledUp(distanceFromBottom > 80);
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;
    sendMessage({ text: input });
    setInput("");
  }

  function handleRetry() {
    // Guards against double-clicks: once a retry is in flight, ignore
    // further clicks until it resolves (see the effect above).
    if (isRetrying) return;
    setIsRetrying(true);
    // Re-runs generation for the last user message only — it does not
    // resend the whole conversation.
    regenerate();
  }

  const lastMessage = messages[messages.length - 1];
  const showThinking =
    status === "submitted" ||
    (status === "streaming" &&
      lastMessage?.role === "assistant" &&
      (!lastMessage.parts || lastMessage.parts.length === 0));

  const isRateLimit = error?.message === "RATE_LIMIT";

  // Announces the finished assistant reply to screen readers once, when
  // streaming completes, rather than on every token (which would be
  // unusably noisy with aria-live).
  const [announcement, setAnnouncement] = useState("");
  useEffect(() => {
    if (status === "ready" && lastMessage?.role === "assistant") {
      const text = lastMessage.parts
        ?.filter((p: any) => p.type === "text")
        .map((p: any) => p.text)
        .join(" ");
      if (text) setAnnouncement(text);
    }
  }, [status, lastMessage]);

  return (
    <section className="max-w-2xl mx-auto px-4 py-10 flex flex-col h-[calc(100dvh-80px)]">
      <h1 className="text-2xl font-bold text-ink mb-1">Ask about my work</h1>
      <p className="text-sm text-muted mb-6">
        Ask about a specific project, the assistant looks up the real case study data live.
      </p>

      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto overscroll-contain space-y-3 mb-4 pr-1"
      >
        {messages.length === 0 && (
          <div className="space-y-2">
            <p className="text-sm text-muted">Try asking:</p>
            <div className="flex flex-wrap gap-2">
              {EXAMPLE_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => setInput(prompt)}
                  className="text-xs border border-gray-300 rounded-full px-3 py-1.5 text-ink hover:border-accent hover:text-accent transition-colors"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        <MessageList messages={messages} showThinking={showThinking} />
      </div>

      <div aria-live="polite" className="sr-only">
        {announcement}
      </div>

      {error && (
        <div className="mb-3 flex items-start justify-between gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <div>
            <p className="font-medium">Something went wrong</p>
            <p className="text-red-600/80">
              {isRateLimit
                ? "The assistant is getting a lot of requests right now. Give it a moment and try again."
                : "That message couldn't be sent. Your other messages are safe."}
            </p>
          </div>
          <button
            type="button"
            onClick={handleRetry}
            disabled={isRetrying}
            className="shrink-0 rounded-full bg-red-600 px-3 py-1.5 text-xs font-medium text-white disabled:opacity-50"
          >
            {isRetrying ? "Retrying…" : "Retry"}
          </button>
        </div>
      )}

      <form onSubmit={onSubmit} className="flex gap-2">
        <label htmlFor="chat-input" className="sr-only">
          Message
        </label>
        <input
          id="chat-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about a project..."
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
