"use client";

import { useEffect, useRef } from "react";

/**
 * CursorGlow — soft luminous halo that follows the pointer with lerp smoothing.
 * Adds an "ethereal" layer of tactility over the entire app. Hidden on touch devices.
 */
export function CursorGlow() {
  const ref = useRef<HTMLDivElement>(null);
  const target = useRef({ x: -1000, y: -1000 });
  const current = useRef({ x: -1000, y: -1000 });
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      target.current.x = e.clientX;
      target.current.y = e.clientY;
      if (ref.current) {
        ref.current.style.opacity = "1";
      }
    };
    const onLeave = () => {
      if (ref.current) ref.current.style.opacity = "0";
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseleave", onLeave);

    const tick = () => {
      const lerp = 0.085;
      current.current.x += (target.current.x - current.current.x) * lerp;
      current.current.y += (target.current.y - current.current.y) * lerp;
      if (ref.current) {
        ref.current.style.transform = `translate(${current.current.x}px, ${current.current.y}px) translate(-50%, -50%)`;
      }
      rafId.current = requestAnimationFrame(tick);
    };
    rafId.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, []);

  return <div ref={ref} className="cursor-glow" aria-hidden />;
}
