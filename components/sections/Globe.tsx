"use client";

import dynamic from "next/dynamic";
import { useReducedMotion } from "framer-motion";

// react-globe.gl is WebGL + three.js — load it only on the client, after paint.
const GlobeImpl = dynamic(() => import("./GlobeImpl"), {
  ssr: false,
  loading: () => null,
});

export function Globe() {
  const reduced = useReducedMotion();
  return (
    <div className="h-full w-full">
      <GlobeImpl reducedMotion={Boolean(reduced)} />
    </div>
  );
}
