"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export interface RatingStarsProps {
  value: number;
  max?: number;
  readOnly?: boolean;
  onChange?: (value: number) => void;
  size?: "sm" | "md" | "lg";
  className?: string;
  ariaLabel?: string;
}

const SIZE_MAP = {
  sm: { box: 18, icon: 13 },
  md: { box: 26, icon: 16 },
  lg: { box: 36, icon: 20 },
} as const;

const STAR_PATH =
  "M12 2.5l2.95 5.98 6.6.96-4.78 4.66 1.13 6.58L12 17.34 6.1 20.68l1.13-6.58L2.45 9.44l6.6-.96L12 2.5z";

/**
 * Rating stars — neumorphic circular buttons dengan stagger reveal animation.
 * Hover micro-interaction: stars naik seperti "lift" satu per satu.
 */
export function RatingStars({
  value,
  max = 5,
  readOnly = false,
  onChange,
  size = "md",
  className = "",
  ariaLabel,
}: RatingStarsProps) {
  const [hover, setHover] = useState<number | null>(null);
  const display = hover ?? value;
  const { box, icon } = SIZE_MAP[size];

  const handleClick = (idx: number) => {
    if (readOnly || !onChange) return;
    onChange(idx);
  };

  return (
    <div
      className={`inline-flex items-center gap-1.5 ${className}`}
      role={readOnly ? "img" : "radiogroup"}
      aria-label={ariaLabel ?? `Rating ${value} dari ${max}`}
    >
      {Array.from({ length: max }, (_, i) => {
        const idx = i + 1;
        const filled = display >= idx;
        const half = !filled && display >= idx - 0.5;
        return (
          <motion.button
            key={i}
            type="button"
            disabled={readOnly}
            onClick={() => handleClick(idx)}
            onMouseEnter={() => !readOnly && setHover(idx)}
            onMouseLeave={() => !readOnly && setHover(null)}
            whileHover={
              !readOnly
                ? { y: -3, scale: 1.08 }
                : undefined
            }
            whileTap={!readOnly ? { scale: 0.92 } : undefined}
            transition={{ type: "spring", stiffness: 380, damping: 18 }}
            className="inline-flex items-center justify-center"
            style={{
              width: `${box}px`,
              height: `${box}px`,
              borderRadius: "9999px",
              background: filled
                ? "rgba(255,194,217,0.5)"
                : "rgba(255,255,255,0.6)",
              border: filled
                ? "1px solid rgba(250,158,188,0.45)"
                : "1px solid rgba(11,25,87,0.08)",
              boxShadow: filled
                ? "0 2px 6px rgba(250,158,188,0.20), inset 0 1px 0 rgba(255,255,255,0.6)"
                : "inset 1px 1px 2px rgba(11,25,87,0.04), inset -1px -1px 2px rgba(255,255,255,0.8)",
              cursor: readOnly ? "default" : "pointer",
            }}
            aria-label={`${idx} bintang`}
            aria-pressed={readOnly ? undefined : value === idx}
          >
            <svg
              viewBox="0 0 24 24"
              width={icon}
              height={icon}
              aria-hidden
              style={{
                fill: filled
                  ? "var(--pink-soft)"
                  : half
                  ? "url(#half-star)"
                  : "var(--ink-light)",
                opacity: filled || half ? 1 : 0.5,
                transition: "all 0.4s cubic-bezier(0.22, 1, 0.36, 1)",
              }}
            >
              <defs>
                <linearGradient id="half-star" x1="0" x2="100%" y1="0" y2="0">
                  <stop offset="50%" stopColor="var(--pink-soft)" />
                  <stop offset="50%" stopColor="var(--ink-light)" stopOpacity="0.5" />
                </linearGradient>
              </defs>
              <path d={STAR_PATH} />
            </svg>
          </motion.button>
        );
      })}
    </div>
  );
}
