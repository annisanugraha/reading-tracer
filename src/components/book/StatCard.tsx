"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, useInView } from "framer-motion";

export interface StatCardProps {
  label: string;
  value: ReactNode;
  hint?: string;
  icon?: string; // remix icon class e.g. "ri-book-mark-line"
  accent?: "blue" | "pink" | "pale" | "mauve" | "mute";
  className?: string;
}

/**
 * Stat card dengan neumorphism + count-up animation.
 * Hover micro-interaction: subtle lift + ink icon drift.
 */
export function StatCard({
  label,
  value,
  hint,
  icon = "ri-book-mark-line",
  accent = "pale",
  className = "",
}: StatCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  const accentBg: Record<string, string> = {
    blue: "linear-gradient(135deg, rgba(194,225,252,0.7) 0%, rgba(255,255,255,0.95) 100%)",
    pink: "linear-gradient(135deg, rgba(255,194,217,0.7) 0%, rgba(255,255,255,0.95) 100%)",
    pale: "linear-gradient(135deg, rgba(194,225,252,0.55) 0%, rgba(244,209,255,0.45) 100%)",
    mauve: "linear-gradient(135deg, rgba(244,209,255,0.7) 0%, rgba(255,255,255,0.95) 100%)",
    mute: "linear-gradient(135deg, rgba(238,242,252,0.9) 0%, rgba(255,255,255,0.95) 100%)",
  };

  return (
    <motion.div
      ref={ref}
      whileHover={{ y: -3 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className={`surface-nm relative overflow-hidden p-5 ${className}`}
      style={{ background: accentBg[accent] }}
    >
      {/* Top hairline accent */}
      <span
        aria-hidden
        className="absolute top-0 left-6 right-6 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(255,255,255,0.9), transparent)",
        }}
      />

      {/* Icon bubble */}
      <motion.div
        whileHover={{ scale: 1.08, rotate: -6 }}
        transition={{ type: "spring", stiffness: 320, damping: 18 }}
        className="mb-3 inline-flex h-9 w-9 items-center justify-center"
        style={{
          background: "rgba(255,255,255,0.7)",
          border: "1px solid rgba(255,255,255,0.9)",
          borderRadius: "12px",
          boxShadow:
            "0 2px 6px rgba(11,25,87,0.06), inset 0 1px 0 rgba(255,255,255,1)",
        }}
      >
        <i
          className={icon}
          style={{ fontSize: "1.05rem", color: "var(--navy)" }}
        />
      </motion.div>

      <div
        className="num-ticker font-display text-[2.2rem] font-normal leading-none tracking-tight"
        style={{ color: "var(--navy)" }}
      >
        <CountUp value={value} active={inView} />
      </div>

      <div className="mt-2 label-meta" style={{ color: "var(--ink-mid)" }}>
        {label}
      </div>

      {hint && (
        <div
          className="mt-1 font-display text-[0.78rem] italic"
          style={{ color: "var(--ink-light)" }}
        >
          {hint}
        </div>
      )}
    </motion.div>
  );
}

/**
 * CountUp — animates a numeric value from 0 to target when active becomes true.
 * Non-numeric values render as-is.
 */
function CountUp({ value, active }: { value: ReactNode; active: boolean }) {
  const [display, setDisplay] = useState<string | number>(
    typeof value === "number" || typeof value === "string" ? 0 : (value as string)
  );

  const numericTarget =
    typeof value === "number"
      ? value
      : typeof value === "string"
      ? Number((value.match(/-?\d+(\.\d+)?/) ?? ["0"])[0])
      : NaN;

  const prefix = typeof value === "string" ? value.replace(/[-+]?\d+(\.\d+)?/, "") : "";
  const suffix = typeof value === "string" && value.startsWith("-") ? "" : "";

  useEffect(() => {
    if (!active || Number.isNaN(numericTarget)) {
      setDisplay(value as any);
      return;
    }
    let frame = 0;
    const duration = 1100;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3); // ease-out cubic
      const v = numericTarget * eased;
      const isFloat = String(numericTarget).includes(".");
      setDisplay(
        isFloat
          ? Number(v.toFixed(1))
          : Math.round(v)
      );
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, numericTarget]);

  if (typeof value === "string") {
    return (
      <>
        {prefix.includes("★") ? "★ " : ""}
        {typeof display === "number"
          ? display.toLocaleString("id-ID")
          : display}
        {prefix && !prefix.includes("★") ? prefix : ""}
      </>
    );
  }
  if (typeof value === "number") {
    return <>{value.toLocaleString("id-ID")}</>;
  }
  return <>{value}</>;
}
