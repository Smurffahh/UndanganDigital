"use client";

import React, { useEffect, useId, useState } from "react";

interface FloatingFlowersProps {
  active?: boolean;
}

const FLOWER_PARTICLES = [
  { id: 1, left: "7%", size: 22, duration: 12.5, delay: 0.5, driftX: 28, rot: 190, opacity: 0.65 },
  { id: 2, left: "24%", size: 18, duration: 14.0, delay: 4.2, driftX: -22, rot: 230, opacity: 0.55 },
  { id: 3, left: "48%", size: 26, duration: 11.0, delay: 2.0, driftX: 34, rot: 160, opacity: 0.70 },
  { id: 4, left: "68%", size: 20, duration: 13.2, delay: 6.8, driftX: -26, rot: 210, opacity: 0.60 },
  { id: 5, left: "86%", size: 24, duration: 12.0, delay: 1.5, driftX: 20, rot: 180, opacity: 0.65 },
  { id: 6, left: "36%", size: 16, duration: 15.0, delay: 8.5, driftX: -18, rot: 250, opacity: 0.50 },
  { id: 7, left: "93%", size: 22, duration: 13.5, delay: 5.0, driftX: -30, rot: 195, opacity: 0.60 },
];

export function FloatingFlowers({ active = false }: FloatingFlowersProps) {
  const containerId = useId();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (active) {
      const raf = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(raf);
    } else {
      setVisible(false);
    }
  }, [active]);

  if (!active) return null;

  return (
    <div
      id={`floating-flowers-${containerId}`}
      aria-hidden="true"
      className={`fixed inset-0 pointer-events-none select-none overflow-hidden z-[1] transition-opacity duration-[1100ms] ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      {FLOWER_PARTICLES.map((flower) => (
        <div
          key={flower.id}
          className="absolute top-0 animate-ambient-float pointer-events-none"
          style={
            {
              left: flower.left,
              width: `${flower.size}px`,
              height: `${flower.size}px`,
              opacity: flower.opacity,
              "--float-duration": `${flower.duration}s`,
              "--float-delay": `${flower.delay}s`,
              "--float-x": `${flower.driftX}px`,
              "--float-rot": `${flower.rot}deg`,
            } as React.CSSProperties
          }
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/javanese/bunga-melayang.webp"
            alt=""
            aria-hidden="true"
            width={flower.size}
            height={flower.size}
            className="w-full h-full aspect-square object-contain pointer-events-none select-none"
            loading="lazy"
            draggable={false}
          />
        </div>
      ))}
    </div>
  );
}
