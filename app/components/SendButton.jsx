"use client";

import { useState, useRef, useCallback } from "react";

// SendButton
//
// A button that communicates its own lifecycle through motion instead of
// abrupt swaps: idle -> loading -> success -> idle, or idle -> loading ->
// error -> idle (retry).
//
// Props:
//   simulate: () => Promise<void>   required. Resolve = success, reject = error.
//   idleLabel: string                default "Send message"
//   retryLabel: string                default "Retry"
//
// State transitions are driven by a single `state` variable and CSS
// transitions on transform/opacity only (no width/height animation, so
// there's no layout thrash). The button has a fixed width so swapping
// content never shifts anything around it.

export default function SendButton({
  simulate,
  idleLabel = "Send message",
  retryLabel = "Retry",
}) {
  const [state, setState] = useState("idle"); // idle | loading | success | error
  const requestId = useRef(0);

  const handleClick = useCallback(async () => {
    // Ignore clicks while a request is already in flight, but always
    // allow a click from the error state (that's the retry).
    if (state === "loading") return;

    const thisRequest = ++requestId.current;
    setState("loading");

    try {
      await simulate();
      // If a newer click started after this one, ignore this stale result.
      if (requestId.current !== thisRequest) return;
      setState("success");
      setTimeout(() => {
        if (requestId.current === thisRequest) setState("idle");
      }, 1400);
    } catch {
      if (requestId.current !== thisRequest) return;
      setState("error");
    }
  }, [state, simulate]);

  return (
    <button
      type="button"
      className={`send-btn state-${state}`}
      onClick={handleClick}
      aria-live="polite"
      aria-busy={state === "loading"}
      disabled={state === "loading"}
    >
      <span className="layer label-idle">{idleLabel}</span>
      <span className="layer spinner" aria-hidden="true">
        <svg viewBox="0 0 24 24" className="spinner-svg">
          <circle cx="12" cy="12" r="9" fill="none" strokeWidth="3" />
        </svg>
      </span>
      <span className="layer checkmark" aria-hidden="true">
        <svg viewBox="0 0 24 24" className="check-svg">
          <path d="M4 12.5l5 5L20 6" fill="none" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      <span className="layer label-error">{retryLabel}</span>

      <span className="sr-only-status">
        {state === "loading" && "Sending"}
        {state === "success" && "Sent successfully"}
        {state === "error" && "Failed to send, click to retry"}
      </span>

      <style jsx>{`
        .send-btn {
          position: relative;
          width: 180px;
          height: 44px;
          border-radius: 999px;
          border: none;
          cursor: pointer;
          font-size: 14px;
          font-weight: 600;
          color: white;
          background: #1f9d55;
          overflow: hidden;
          isolation: isolate;
        }

        .send-btn:disabled {
          cursor: default;
        }

        .send-btn:focus-visible {
          outline: 3px solid #0b5d2f;
          outline-offset: 3px;
        }

        .send-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(31, 157, 85, 0.35);
        }

        .send-btn:active:not(:disabled) {
          transform: translateY(0px) scale(0.98);
        }

        .send-btn.state-error {
          background: #c0392b;
        }

        .layer {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: opacity 220ms ease, transform 220ms ease;
          opacity: 0;
          transform: translateY(6px) scale(0.96);
          pointer-events: none;
        }

        /* idle label */
        .state-idle .label-idle {
          opacity: 1;
          transform: translateY(0) scale(1);
        }

        /* loading spinner */
        .state-loading .spinner {
          opacity: 1;
          transform: translateY(0) scale(1);
        }

        .spinner-svg {
          width: 20px;
          height: 20px;
          animation: spin 800ms linear infinite;
        }

        .spinner-svg circle {
          stroke: white;
          stroke-dasharray: 40;
          stroke-dashoffset: 15;
          stroke-linecap: round;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        /* success checkmark */
        .state-success .checkmark {
          opacity: 1;
          transform: translateY(0) scale(1);
        }

        .check-svg {
          width: 22px;
          height: 22px;
          stroke: white;
        }

        .check-svg path {
          stroke-dasharray: 30;
          stroke-dashoffset: 30;
          animation: draw-check 320ms ease forwards 60ms;
        }

        @keyframes draw-check {
          to {
            stroke-dashoffset: 0;
          }
        }

        /* error label + shake */
        .state-error .label-error {
          opacity: 1;
          transform: translateY(0) scale(1);
        }

        .state-error {
          animation: shake 380ms ease;
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-6px); }
          40% { transform: translateX(5px); }
          60% { transform: translateX(-3px); }
          80% { transform: translateX(2px); }
        }

        .sr-only-status {
          position: absolute;
          width: 1px;
          height: 1px;
          overflow: hidden;
          clip: rect(0 0 0 0);
        }

        /* Reduced motion: keep feedback, drop the flourish */
        @media (prefers-reduced-motion: reduce) {
          .layer {
            transition: opacity 80ms linear;
            transform: none !important;
          }
          .send-btn:hover:not(:disabled),
          .send-btn:active:not(:disabled) {
            transform: none;
          }
          .spinner-svg {
            animation: spin 1200ms linear infinite;
          }
          .check-svg path {
            animation: none;
            stroke-dashoffset: 0;
          }
          .state-error {
            animation: none;
          }
        }
      `}</style>
    </button>
  );
}
