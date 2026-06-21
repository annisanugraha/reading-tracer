"use client";

import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

/**
 * PageTransition — curtain wipe effect saat pindah halaman.
 * Children di-animate dari bawah dengan stagger, dengan "veil" overlay
 * yang turun dan naik untuk transisi yang halus.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{
          duration: 0.6,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="flex flex-1 flex-col"
      >
        {/* Curtain veil — slide down briefly to mask content swap */}
        <motion.div
          aria-hidden
          initial={{ scaleY: 1 }}
          animate={{ scaleY: 0 }}
          exit={{ scaleY: 1 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          style={{
            transformOrigin: "top",
            background:
              "linear-gradient(180deg, rgba(244,241,234,0.95) 0%, rgba(255,253,248,0.6) 100%)",
          }}
          className="pointer-events-none fixed inset-0 z-[60]"
        />
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
