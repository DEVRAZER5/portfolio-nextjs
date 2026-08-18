"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

// Keeps three.js / fiber / drei (a genuinely heavy bundle) out of the main
// page bundle entirely; it only downloads when this component actually
// mounts on the client.
const Scene3D = dynamic(() => import("./Scene3D"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full animate-pulse bg-gray-200 rounded-2xl" />
  ),
});

export default function Hero3DLoader() {
  const [reducedMotion, setReducedMotion] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    setReady(true);

    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Before we know the visitor's motion preference, render a plain
  // placeholder, avoids a flash of the canvas and a server/client mismatch.
  if (!ready) {
    return <div className="w-full h-64 sm:h-80 rounded-2xl bg-gray-100" />;
  }

  if (reducedMotion) {
    return (
      <div className="w-full h-64 sm:h-80 rounded-2xl bg-gradient-to-br from-accent/20 to-accent/5 flex items-center justify-center text-sm text-muted px-6 text-center">
        A rotating 3D shape normally lives here. Hidden because your system
        is set to reduce motion.
      </div>
    );
  }

  return (
    <div>
      <div className="w-full h-64 sm:h-80 rounded-2xl overflow-hidden bg-gray-50">
        <Scene3D />
      </div>
      <p className="text-xs text-muted mt-2 text-center">
        Drag to rotate, click to change color, double-click for wireframe.
      </p>
    </div>
  );
}
