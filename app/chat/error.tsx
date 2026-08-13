"use client";

import { useEffect } from "react";

export default function ChatError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Logged so the failure shows up wherever server/edge logs are collected,
    // even though this boundary renders on the client.
    console.error("Chat route crashed:", error);
  }, [error]);

  return (
    <section className="max-w-2xl mx-auto px-4 py-16 text-center">
      <h1 className="text-xl font-bold text-ink mb-2">This page hit a snag</h1>
      <p className="text-sm text-muted mb-6">
        Something broke while loading the chat. You can try again, or head
        back to the homepage.
      </p>
      <div className="flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="bg-accent text-white px-5 py-2 rounded-full text-sm font-medium"
        >
          Try again
        </button>
        <a href="/" className="text-sm text-muted underline">
          Back home
        </a>
      </div>
    </section>
  );
}
