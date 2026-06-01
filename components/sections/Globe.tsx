"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

// react-globe.gl is WebGL + three.js — load it only on the client, after paint.
const GlobeImpl = dynamic(() => import("./GlobeImpl"), {
  ssr: false,
  loading: () => null,
});

export function Globe() {
  const reduced = useReducedMotion();
  // Only mount the (heavy) WebGL globe on larger screens — keeps the three.js
  // bundle off mobile entirely, where the globe is hidden anyway.
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 640px)");
    const update = () => setEnabled(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  if (!enabled) return null;

  return (
    <div className="h-full w-full">
      <GlobeImpl reducedMotion={Boolean(reduced)} />
    </div>
  );
}
