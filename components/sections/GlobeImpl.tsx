"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Globe, { type GlobeMethods } from "react-globe.gl";
import * as THREE from "three";
import { feature } from "topojson-client";
import worldTopo from "world-atlas/countries-110m.json";

const GOLD = "#d8b27a";
const GOLD_SOFT = "#e7cd9a";

// A spread of global hubs — including Bogotá, a nod to Fernando Piero.
const CITIES = [
  { name: "New York", lat: 40.71, lng: -74.01 },
  { name: "San Francisco", lat: 37.77, lng: -122.42 },
  { name: "Toronto", lat: 43.65, lng: -79.38 },
  { name: "Bogotá", lat: 4.71, lng: -74.07 },
  { name: "Mexico City", lat: 19.43, lng: -99.13 },
  { name: "São Paulo", lat: -23.55, lng: -46.63 },
  { name: "Santiago", lat: -33.45, lng: -70.66 },
  { name: "London", lat: 51.51, lng: -0.13 },
  { name: "Madrid", lat: 40.42, lng: -3.7 },
  { name: "Berlin", lat: 52.52, lng: 13.4 },
  { name: "Lagos", lat: 6.52, lng: 3.38 },
  { name: "Dubai", lat: 25.2, lng: 55.27 },
  { name: "Mumbai", lat: 19.08, lng: 72.88 },
  { name: "Singapore", lat: 1.35, lng: 103.82 },
  { name: "Tokyo", lat: 35.68, lng: 139.69 },
  { name: "Sydney", lat: -33.87, lng: 151.21 },
];

// A fixed network of connections (deterministic — no randomness).
const ARC_PAIRS: [number, number][] = [
  [0, 7], [0, 3], [0, 4], [1, 14], [1, 13], [1, 0],
  [7, 9], [7, 8], [7, 10], [8, 3], [3, 5], [5, 6],
  [2, 7], [11, 12], [11, 7], [12, 13], [13, 15], [14, 15], [9, 11],
];

export default function GlobeImpl({ reducedMotion = false }: { reducedMotion?: boolean }) {
  const globeRef = useRef<GlobeMethods | undefined>(undefined);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });

  const countries = useMemo(() => {
    try {
      const fc = feature(
        worldTopo as never,
        (worldTopo as { objects: { countries: never } }).objects.countries,
      ) as unknown as { features: object[] };
      return fc.features;
    } catch {
      return [];
    }
  }, []);

  const arcs = useMemo(
    () =>
      ARC_PAIRS.map(([a, b]) => ({
        startLat: CITIES[a]!.lat,
        startLng: CITIES[a]!.lng,
        endLat: CITIES[b]!.lat,
        endLng: CITIES[b]!.lng,
      })),
    [],
  );

  const globeMaterial = useMemo(
    () =>
      new THREE.MeshPhongMaterial({
        color: "#0a0d14",
        emissive: "#0a0d14",
        emissiveIntensity: 0.25,
        shininess: 1.5,
        transparent: true,
        opacity: 0.95,
      }),
    [],
  );

  // Measure the container so the canvas fills it responsively.
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const measure = () => {
      const w = el.clientWidth || el.parentElement?.clientWidth || window.innerWidth || 720;
      const h = el.clientHeight || el.parentElement?.clientHeight || window.innerHeight || 720;
      setSize({ w, h });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Configure controls + camera once the globe is ready.
  useEffect(() => {
    const g = globeRef.current;
    if (!g) return;
    const controls = g.controls() as unknown as {
      enableZoom: boolean;
      enablePan: boolean;
      autoRotate: boolean;
      autoRotateSpeed: number;
    };
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.autoRotate = !reducedMotion;
    controls.autoRotateSpeed = 0.55;
    g.pointOfView({ lat: 18, lng: -55, altitude: 2.3 }, 0);
  }, [reducedMotion, size.w]);

  return (
    <div ref={wrapRef} className="h-full w-full">
      {size.w > 0 && size.h > 0 ? (
        <Globe
          ref={globeRef}
          width={size.w}
          height={size.h}
          backgroundColor="rgba(0,0,0,0)"
          animateIn={false}
          globeMaterial={globeMaterial}
          atmosphereColor={GOLD}
          atmosphereAltitude={0.16}
          showGraticules
          polygonsData={countries}
          polygonCapColor={() => "rgba(216,178,122,0.05)"}
          polygonSideColor={() => "rgba(0,0,0,0)"}
          polygonStrokeColor={() => "rgba(216,178,122,0.22)"}
          polygonAltitude={0.006}
          pointsData={CITIES}
          pointLat="lat"
          pointLng="lng"
          pointColor={() => GOLD_SOFT}
          pointAltitude={0.012}
          pointRadius={0.22}
          ringsData={CITIES}
          ringLat="lat"
          ringLng="lng"
          ringColor={() => (t: number) => `rgba(231,205,154,${Math.sqrt(1 - t)})`}
          ringMaxRadius={3}
          ringPropagationSpeed={2}
          ringRepeatPeriod={1600}
          arcsData={arcs}
          arcColor={() => ["rgba(231,205,154,0)", GOLD, "rgba(231,205,154,0)"]}
          arcStroke={0.5}
          arcAltitudeAutoScale={0.5}
          arcDashLength={0.4}
          arcDashGap={0.25}
          arcDashAnimateTime={4500}
        />
      ) : null}
    </div>
  );
}
