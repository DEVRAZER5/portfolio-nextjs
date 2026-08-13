"use client";

import SendButton from "../components/SendButton";

// Fake async calls with different behavior per demo button, so
// reviewers can see every state on demand instead of hoping the
// random 20% failure shows up.

function realisticSend() {
  return new Promise((resolve, reject) => {
    const delay = 800 + Math.random() * 1000;
    setTimeout(() => {
      if (Math.random() < 0.2) reject(new Error("simulated failure"));
      else resolve();
    }, delay);
  });
}

function forcedSuccess() {
  return new Promise((resolve) => {
    setTimeout(resolve, 900);
  });
}

function forcedError() {
  return new Promise((_, reject) => {
    setTimeout(() => reject(new Error("forced failure")), 900);
  });
}

export default function ButtonDemoPage() {
  return (
    <section className="max-w-2xl mx-auto px-4 py-16">
      <h1 className="text-2xl font-bold text-ink mb-2">Send Button</h1>
      <p className="text-sm text-muted mb-10">
        One reusable button component, three demo instances below so every
        state is reachable on demand, not just by chance.
      </p>

      <div className="space-y-10">
        <div>
          <h2 className="text-sm font-semibold text-ink mb-3">
            Realistic (20% random failure)
          </h2>
          <SendButton simulate={realisticSend} />
        </div>

        <div>
          <h2 className="text-sm font-semibold text-ink mb-3">
            Force success
          </h2>
          <SendButton simulate={forcedSuccess} idleLabel="Save" />
        </div>

        <div>
          <h2 className="text-sm font-semibold text-ink mb-3">
            Force error
          </h2>
          <SendButton simulate={forcedError} idleLabel="Deploy" />
        </div>
      </div>

      <div className="mt-16 pt-8 border-t border-gray-200 text-sm text-muted space-y-2">
        <h2 className="text-sm font-semibold text-ink">
          Duration and easing choices
        </h2>
        <p>
          I set every crossfade to 220ms, fast enough that it feels responsive,
          slow enough that you actually see it change instead of just flicker.
          The spinner spins at a steady 800ms per turn with no easing, since a
          spinner that speeds up and slows down looks broken, not smooth. The
          checkmark draws itself in 320ms right as the fade finishes. The error
          shake is short on purpose, one quick 380ms shake, it's meant to be a
          warning, not something annoying. Everything only animates transform
          and opacity, and the button has a fixed width, so nothing jumps
          around when the content changes. If someone has reduced motion
          turned on, the shake and spin get removed or slowed down, but you
          still see the state change happen, just calmer.
        </p>
      </div>
    </section>
  );
}
