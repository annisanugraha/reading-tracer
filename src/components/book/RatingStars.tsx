"use client";

import { useState } from "react";

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
  sm: "h-3.5 w-3.5",
  md: "h-5 w-5",
  lg: "h-7 w-7",
} as const;

/**
 * Bintang rating dengan soft style.
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
  const sizeClass = SIZE_MAP[size];

  const handleClick = (idx: number) => {
    if (readOnly || !onChange) return;
    onChange(idx);
  };

  return (
    <div
      className={`inline-flex items-center gap-1 ${className}`}
      role={readOnly ? "img" : "radiogroup"}
      aria-label={ariaLabel ?? `Rating ${value} dari ${max}`}
    >
      {Array.from({ length: max }, (_, i) => {
        const idx = i + 1;
        const filled = display >= idx;
        const half = !filled && display >= idx - 0.5;
        return (
          <button
            key={i}
            type="button"
            disabled={readOnly}
            onClick={() => handleClick(idx)}
            onMouseEnter={() => !readOnly && setHover(idx)}
            onMouseLeave={() => !readOnly && setHover(null)}
            className={`${
              readOnly ? "cursor-default" : "cursor-pointer"
            } transition-transform duration-200`}
            style={
              !readOnly
                ? { transform: hover === idx ? "scale(1.2)" : "scale(1)" }
                : undefined
            }
            aria-label={`${idx} bintang`}
            aria-pressed={readOnly ? undefined : value === idx}
          >
            <svg
              viewBox="0 0 20 20"
              className={sizeClass}
              style={{
                fill: filled
                  ? "var(--pink-hot)"
                  : half
                  ? "url(#half-star)"
                  : "var(--ink-light)",
                opacity: filled || half ? 1 : 0.3,
                transition: "all 0.2s ease",
              }}
              aria-hidden
            >
              <defs>
                <linearGradient id="half-star" x1="0" x2="100%" y1="0" y2="0">
                  <stop offset="50%" stopColor="var(--pink-hot)" />
                  <stop offset="50%" stopColor="var(--ink-light)" stopOpacity="0.3" />
                </linearGradient>
              </defs>
              <path d="M10 1.5l2.6 5.27 5.82.85-4.21 4.1.99 5.78L10 14.77l-5.2 2.73.99-5.78-4.21-4.1 5.82-.85L10 1.5z" />
            </svg>
          </button>
        );
      })}
    </div>
  );
}