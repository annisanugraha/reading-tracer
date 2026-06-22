"use client";

import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

const CURTAIN_COLORS = [
  "linear-gradient(180deg, rgba(194,225,252,0.92) 0%, rgba(255,253,248,0.5) 100%)",
  "linear-gradient(180deg, rgba(244,209,255,0.85) 0%, rgba(255,253,248,0.5) 100%)",
  "linear-gradient(180deg, rgba(255,194,217,0.85) 0%, rgba(255,253,248,0.5) 100%)",
  "linear-gradient(180deg, rgba(238,242,252,0.92) 0%, rgba(255,255,255,0.6) 100%)",
];

function hashPath(pathname: string): number {
  let h = 0;
  for (let i = 0; i < pathname.length; i++) {
    h = (h * 31 + pathname.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

function curtainFor(pathname: string): string {
  return CURTAIN_COLORS[hashPath(pathname) % CURTAIN_COLORS.length];
}

/**
 * PageTransition v2 — curtain veil with deterministic palette color
 * derived from pathname (stable across SSR & hydration),
 * unfold-from-center enter animation.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const curtainColor = curtainFor(pathname ?? "/");

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 16, scale: 0.995 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10, scale: 0.998 }}
        transition={{
          duration: 0.6,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="flex flex-1 flex-col"
      >
        {/* Curtain veil — slide down with random palette color */}
        <motion.div
          aria-hidden
          initial={{ scaleY: 1 }}
          animate={{ scaleY: 0 }}
          exit={{ scaleY: 1 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          style={{
            transformOrigin: "top",
            background: curtainColor,
          }}
          className="pointer-events-none fixed inset-0 z-[60]"
        />
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
