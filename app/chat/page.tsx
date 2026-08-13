"use client";

import { useChat } from "@ai-sdk/react";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";

// --- Tool result component -------------------------------------------------
// Renders the actual output of getProjectDetails as a real card, not JSON.

function ProjectCard({ output }: { output: any }) {
  if (!output.found) {
    return (
      <div className="border border-amber-200 bg-amber-50 rounded-xl p-4 text-sm">
        <p className="font-semibold text-amber-800 mb-1">
          Couldn't find "{output.query}"
        </p>
        <p className="text-amber-700">
          Available projects: {output.availableProjects.join(", ")}
        </p>
      </div>
    );
  }

  return (
    <div className="border border-gray-200 bg-white rounded-xl overflow-hidden max-w-sm">
      <div className="relative w-full h-32 bg-gray-100">
        <Image src={output.image} alt={output.name} fill className="object-cover" />
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-ink mb-1">{output.name}</h3>
        <p className="text-xs text-muted mb-2">{output.summary}</p>
        <p className="text-xs text-ink">
          <span className="font-medium">Outcome: </span>
          {output.outcome}
        </p>
      </div>
    </div>
  );
}

// --- Tool lifecycle renderer -------------------------------------------------
// Each of the four tool part states gets its own distinct visual treatment,
// per the FE-07 assignment: no dumping raw JSON at any stage.

function ToolPart({ part }: { part: any }) {
  switch (part.state) {
    case "input-streaming":
      return (
        <div className="border border-gray-200 bg-gray-50 rounded-xl p-4 text-sm text-muted animate-pulse">
          Preparing to look up a project...
        </div>
      );

    case "input-available":
      return (
        <div className="border border-gray-200 bg-gray-50 rounded-xl p-4 text-sm text-muted flex items-center gap-2">
          <span className="inline-block w-3 h-3 rounded-full border-2 border-accent border-t-transparent animate-spin" />
          Looking up: {part.input?.query}
        </div>
      );

    case "output-available":
      return <ProjectCard output={part.output} />;

    case "output-error":
      return (
        <div className="border border-red-200 bg-red-50 rounded-xl p-4 text-sm text-red-700">
          Something went wrong looking that up: {part.errorText}
        </div>
      );

    default:
      return null;
  }
}

// --- Thinking skeleton -------------------------------------------------
// Matches the shape of a real assistant bubble so nothing shifts layout
// when the actual text streams in and replaces it.

function ThinkingBubble() {
  return (
    <div className="flex justify-start">
      <div className="max-w-[85%] rounded-2xl rounded-bl-sm border border-gray-200 bg-white px-4 py-3 space-y-2">
        <div className="h-2.5 w-40 rounded-full bg-gray-200 animate-pulse" />
        <div className="h-2.5 w-24 rounded-full bg-gray-200 animate-pulse" />
      </div>
    </div>
  );
}

// --- Empty state example prompts -------------------------------------------------

const EXAMPLE_PROMPTS = [
  "Tell me about the Amazon clone",
  "What's the JS Fundamentals project?",
  "What are Rifet's strengths?",
];

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

        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className="max-w-[85%] space-y-2">
              {m.parts?.map((part: any, i: number) => {
                if (part.type === "text") {
                  return (
                    <div
                      key={i}
                      className={`rounded-2xl px-4 py-2 text-sm whitespace-pre-wrap ${
                        m.role === "user"
                          ? "bg-accent text-white rounded-br-sm"
                          : "bg-white border border-gray-200 text-ink rounded-bl-sm"
                      }`}
                    >
                      {part.text}
                    </div>
                  );
                }

                if (part.type === "tool-getProjectDetails") {
                  return <ToolPart key={i} part={part} />;
                }

                return null;
              })}
            </div>
          </div>
        ))}

        {showThinking && <ThinkingBubble />}
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
        <input
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
