"use client";

import {
  useEffect,
  useRef,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";

export interface StatCardProps {
  label: string;
  value: ReactNode;
  hint?: string;
  icon?: string;
  accent?: "blue" | "pink" | "pale" | "mauve" | "mute";
  className?: string;
}

/**
 * StatCard v2 — neumorphism card with odometer rolling digits,
 * hover sparkle particles, animated progressive border reveal,
 * and gradient background rotation.
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
  const [isHovered, setIsHovered] = useState(false);

  const accentBg: Record<string, string> = {
    blue: "linear-gradient(135deg, rgba(194,225,252,0.7) 0%, rgba(255,255,255,0.95) 100%)",
    pink: "linear-gradient(135deg, rgba(255,194,217,0.7) 0%, rgba(255,255,255,0.95) 100%)",
    pale: "linear-gradient(135deg, rgba(194,225,252,0.55) 0%, rgba(244,209,255,0.45) 100%)",
    mauve:
      "linear-gradient(135deg, rgba(244,209,255,0.7) 0%, rgba(255,255,255,0.95) 100%)",
    mute: "linear-gradient(135deg, rgba(238,242,252,0.9) 0%, rgba(255,255,255,0.95) 100%)",
  };

  const accentColor: Record<string, string> = {
    blue: "var(--blue-soft)",
    pink: "var(--pink-soft)",
    pale: "var(--blue-light)",
    mauve: "#a855a8",
    mute: "var(--ink-light)",
  };

  return (
    <motion.div
      ref={ref}
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative overflow-hidden p-5 ${className}`}
      style={{
        background: accentBg[accent],
        border: "1px solid var(--hairline)",
        borderRadius: "1rem",
        boxShadow: "var(--shadow-nm)",
      }}
    >
      {/* Animated border reveal — draws itself when card enters viewport */}
      <motion.span
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          borderRadius: "inherit",
          border: `1.5px solid ${accentColor[accent]}`,
          opacity: 0.35,
          clipPath: inView
            ? "inset(0% 0% 0% 0%)"
            : "inset(0% 100% 100% 0%)",
          transition: "clip-path 1.2s cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      />

      {/* Top hairline accent */}
      <span
        aria-hidden
        className="absolute top-0 left-6 right-6 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(255,255,255,0.9), transparent)",
        }}
      />

      {/* Icon bubble — morphs on hover */}
      <motion.div
        whileHover={{ scale: 1.08, rotate: -6 }}
        transition={{ type: "spring", stiffness: 320, damping: 18 }}
        className="mb-3 inline-flex h-9 w-9 items-center justify-center"
        style={{
          background: "rgba(255,255,255,0.7)",
          border: "1px solid rgba(255,255,255,0.9)",
          borderRadius: "10px",
          boxShadow:
            "0 2px 6px rgba(11,25,87,0.06), inset 0 1px 0 rgba(255,255,255,1)",
        }}
      >
        <i
          className={isHovered ? icon.replace("-line", "-fill") : icon}
          style={{
            fontSize: "1.05rem",
            color: "var(--navy)",
            transition: "all 0.4s cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        />
      </motion.div>

      {/* Odometer value */}
      <div
        className="num-ticker font-display text-[2.2rem] font-normal leading-none tracking-tight"
        style={{ color: "var(--navy)" }}
      >
        <OdometerValue value={value} active={inView} />
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

      {/* Hover sparkle particles */}
      <AnimatePresence>
        {isHovered && <SparkleParticles color={accentColor[accent]} />}
      </AnimatePresence>
    </motion.div>
  );
}

/* ── Odometer Rolling Value ──────────────────────────────────── */

function OdometerValue({
  value,
  active,
}: {
  value: ReactNode;
  active: boolean;
}) {
  if (typeof value === "number") {
    return <OdometerNumber target={active ? value : 0} />;
  }

  if (typeof value === "string") {
    const match = value.match(/(-?\d+\.?\d*)/);
    if (match) {
      const num = parseFloat(match[0]);
      const prefix = value.slice(0, value.indexOf(match[0]));
      const suffix = value.slice(value.indexOf(match[0]) + match[0].length);
      const isFloat = match[0].includes(".");
      return (
        <>
          {prefix && <span>{prefix}</span>}
          <OdometerNumber
            target={active ? num : 0}
            decimals={isFloat ? 1 : 0}
          />
          {suffix && <span>{suffix}</span>}
        </>
      );
    }
    return <>{value}</>;
  }

  return <>{value}</>;
}

function OdometerNumber({
  target,
  decimals = 0,
}: {
  target: number;
  decimals?: number;
}) {
  const [display, setDisplay] = useState(0);
  const prevRef = useRef(0);
  const rafRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const start = prevRef.current;
    const end = target;
    const duration = 1400;
    const startTime = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = start + (end - start) * eased;
      setDisplay(current);

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        prevRef.current = end;
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [target]);

  const formatted =
    decimals > 0
      ? display.toFixed(decimals)
      : Math.round(display).toLocaleString("id-ID");

  const digits = formatted.split("");

  return (
    <span className="odometer-container" aria-label={formatted}>
      {digits.map((char, i) => {
        const isDigit = /\d/.test(char);
        if (!isDigit) {
          return (
            <span key={`sep-${i}`} style={{ width: "0.35em", textAlign: "center" }}>
              {char}
            </span>
          );
        }
        return <RollingDigit key={`d-${i}`} digit={parseInt(char)} />;
      })}
    </span>
  );
}

function RollingDigit({ digit }: { digit: number }) {
  return (
    <span className="odometer-digit">
      <span
        className="odometer-digit-inner"
        style={{
          transform: `translateY(-${digit * 10}%)`,
        }}
      >
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
          <span key={n}>{n}</span>
        ))}
      </span>
    </span>
  );
}

/* ── Sparkle Particles ──────────────────────────────────────── */

function SparkleParticles({ color }: { color: string }) {
  const particles = Array.from({ length: 6 }, (_, i) => ({
    id: i,
    left: `${15 + Math.random() * 70}%`,
    delay: Math.random() * 0.5,
    size: 2 + Math.random() * 3,
  }));

  return (
    <>
      {particles.map((p) => (
        <motion.span
          key={p.id}
          initial={{ opacity: 0, y: 0, scale: 0 }}
          animate={{
            opacity: [0, 1, 0],
            y: [0, -20 - Math.random() * 20],
            scale: [0, 1, 0.3],
          }}
          exit={{ opacity: 0 }}
          transition={{
            duration: 0.8 + Math.random() * 0.4,
            delay: p.delay,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="pointer-events-none absolute"
          style={{
            left: p.left,
            bottom: "30%",
            width: `${p.size}px`,
            height: `${p.size}px`,
            borderRadius: "50%",
            background: color,
          }}
        />
      ))}
    </>
  );
}
