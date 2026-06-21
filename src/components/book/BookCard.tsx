"use client";

import Link from "next/link";
import { useRef, useState, type MouseEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { BookStatus } from "@/lib/types";
import { StatusBadge } from "./StatusBadge";
import { RatingStars } from "./RatingStars";
import { escapeAlt, hitungProgress, inisialJudul } from "@/lib/utils";

export interface BookCardProps {
  cover?: string;
  judul: string;
  penulis: string;
  status: BookStatus;
  rating?: number;
  progressPercent?: number;
  totalHalaman?: number;
  halamanTerbaca?: number;
  href?: string;
  className?: string;
}

const STATUS_RIBBON_COLORS: Record<BookStatus, { bg: string; border: string }> = {
  "mau-dibaca":    { bg: "rgba(194,225,252,0.85)", border: "rgba(150,203,252,0.5)" },
  "sedang-dibaca": { bg: "rgba(87,132,230,0.85)", border: "rgba(87,132,230,0.5)" },
  "selesai":       { bg: "rgba(250,158,188,0.85)", border: "rgba(250,158,188,0.5)" },
  "berhenti":      { bg: "rgba(156,163,175,0.7)", border: "rgba(156,163,175,0.4)" },
};

/**
 * BookCard v2 — 3D book spine, status ribbon, circular progress ring,
 * "open book" hover micro-animation, magnetic cursor glow.
 */
export function BookCard({
  cover,
  judul,
  penulis,
  status,
  rating,
  progressPercent,
  totalHalaman,
  halamanTerbaca,
  href,
  className = "",
}: BookCardProps) {
  const progress =
    progressPercent ??
    (typeof totalHalaman === "number" && typeof halamanTerbaca === "number"
      ? hitungProgress({ totalHalaman, halamanTerbaca })
      : undefined);

  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const onMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.setProperty("--tilt-x", `${y * -3}deg`);
    el.style.setProperty("--tilt-y", `${x * 5}deg`);
    el.style.setProperty("--mx", `${(x + 0.5) * 100}%`);
    el.style.setProperty("--my", `${(y + 0.5) * 100}%`);
  };

  const onMouseLeave = () => {
    const el = cardRef.current;
    if (!el) return;
    el.style.setProperty("--tilt-x", `0deg`);
    el.style.setProperty("--tilt-y", `0deg`);
    setIsHovered(false);
  };

  const inner = (
    <motion.div
      ref={cardRef}
      onMouseMove={onMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={onMouseLeave}
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 220, damping: 22 }}
      className={`book-tilt group relative flex gap-5 p-4 ${className}`}
      style={{
        background: "var(--surface)",
        border: "1px solid var(--hairline)",
        borderRadius: "1rem",
        boxShadow: "var(--shadow-float)",
        transform:
          "perspective(900px) rotateX(var(--tilt-x, 0deg)) rotateY(var(--tilt-y, 0deg))",
        transition:
          "transform 0.7s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.6s cubic-bezier(0.22, 1, 0.36, 1)",
      }}
    >
      {/* Cursor-following specular highlight */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          borderRadius: "inherit",
          background:
            "radial-gradient(circle 180px at var(--mx, 50%) var(--my, 50%), rgba(255,255,255,0.55), transparent 70%)",
        }}
      />

      {/* Top hairline accent */}
      <span
        aria-hidden
        className="pointer-events-none absolute top-0 left-8 right-8 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(255,255,255,0.95), transparent)",
        }}
      />

      {/* Circular Progress Ring — top-right corner */}
      {typeof progress === "number" && progress > 0 && progress < 100 && (
        <div
          className="absolute top-3 right-3 z-20"
          title={`${Math.round(progress)}%`}
        >
          <CircularProgress value={progress} size={32} />
        </div>
      )}

      {/* Cover with 3D spine */}
      <CoverImage
        src={cover}
        judul={judul}
        isHovered={isHovered}
      />

      <div className="flex min-w-0 flex-1 flex-col gap-2 justify-center">
        <div className="flex items-start justify-between gap-2">
          <h3
            className="font-display line-clamp-2 text-[1.02rem] font-normal leading-snug tracking-tight"
            style={{ color: "var(--navy)" }}
          >
            <span className="font-display italic">{judul.split(" ")[0]}</span>{" "}
            {judul.split(" ").slice(1).join(" ")}
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <i
            className="ri-user-3-line"
            style={{ fontSize: "0.7rem", color: "var(--ink-light)" }}
          />
          <p
            className="line-clamp-1 text-[0.78rem] font-light"
            style={{ color: "var(--ink-mid)" }}
          >
            {penulis}
          </p>
        </div>

        <div className="mt-1 flex items-center justify-between gap-2">
          <StatusBadge status={status} />
          {status === "selesai" && typeof rating === "number" && rating > 0 && (
            <RatingStars value={rating} readOnly size="sm" />
          )}
        </div>

        {/* Inline progress text for active reading */}
        {typeof progress === "number" && progress > 0 && (
          <div className="mt-0.5 flex items-center gap-2">
            <div className="flex-1 h-[2px] rounded-full overflow-hidden" style={{ background: "var(--paper-soft)" }}>
              <motion.div
                className="h-full rounded-full"
                style={{
                  background: "linear-gradient(90deg, var(--blue-soft), var(--pink-soft))",
                }}
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
              />
            </div>
            <span
              className="num-ticker font-display text-[0.7rem] italic shrink-0"
              style={{ color: "var(--ink-light)" }}
            >
              {Math.round(progress)}%
            </span>
          </div>
        )}
      </div>

      {/* Hover-only corner arrow */}
      <span
        aria-hidden
        className="pointer-events-none absolute right-4 bottom-4 opacity-0 transition-all duration-500 group-hover:opacity-100 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
        style={{ color: "var(--ink-light)" }}
      >
        <i className="ri-arrow-right-up-line" style={{ fontSize: "0.92rem" }} />
      </span>
    </motion.div>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="block focus:outline-none"
        style={{ borderRadius: "1rem" }}
      >
        {inner}
      </Link>
    );
  }
  return inner;
}

/* ── Cover image with 3D spine ────────────────────────────────── */

const COVER_GRADIENTS = [
  "linear-gradient(135deg, #C2E1FC 0%, #5784E6 100%)",
  "linear-gradient(135deg, #F4D1FF 0%, #FA9EBC 100%)",
  "linear-gradient(135deg, #96CBFC 0%, #4E8BC4 100%)",
  "linear-gradient(135deg, #FFC2D9 0%, #FF99BE 100%)",
  "linear-gradient(135deg, #C2E1FC 0%, #F4D1FF 100%)",
];

function CoverImage({
  src,
  judul,
  isHovered,
}: {
  src?: string;
  judul: string;
  isHovered: boolean;
}) {
  const alt = escapeAlt(`Cover buku ${judul}`);
  const inisial = inisialJudul(judul);
  const idx = inisial.charCodeAt(0) % COVER_GRADIENTS.length;

  const coverStyle = {
    borderRadius: "0.6rem",
    boxShadow:
      "0 4px 14px rgba(11,25,87,0.10), inset 0 1px 0 rgba(255,255,255,0.3)",
  };

  return (
    <div className="relative flex-shrink-0" style={{ perspective: "600px" }}>
      {/* 3D spine — darker edge on the left */}
      <div
        aria-hidden
        className="absolute top-1 bottom-1 left-0 w-[6px] z-10"
        style={{
          background: "linear-gradient(90deg, rgba(11,25,87,0.12), rgba(11,25,87,0.03))",
          borderRadius: "2px 0 0 2px",
          transform: "translateX(-3px)",
        }}
      />

      <motion.div
        animate={{
          rotateY: isHovered ? 6 : 0,
        }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        style={{ transformOrigin: "left center" }}
      >
        {src ? (
          <div
            className="relative h-[7.5rem] w-[5.25rem] overflow-hidden"
            style={coverStyle}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt={alt}
              className="h-full w-full object-cover"
              loading="lazy"
              onError={(e) => {
                const t = e.currentTarget;
                t.style.display = "none";
              }}
            />
            {/* Page peek on hover */}
            <motion.div
              aria-hidden
              className="absolute inset-y-0 left-0 w-2"
              style={{
                background: "linear-gradient(90deg, rgba(255,255,255,0.9), rgba(255,255,255,0.2))",
              }}
              animate={{ opacity: isHovered ? 1 : 0 }}
              transition={{ duration: 0.4 }}
            />
          </div>
        ) : (
          <div
            className="relative flex h-[7.5rem] w-[5.25rem] items-center justify-center"
            style={{
              background: COVER_GRADIENTS[idx],
              ...coverStyle,
              boxShadow:
                "0 4px 14px rgba(11,25,87,0.12), inset 0 1px 0 rgba(255,255,255,0.35), inset 0 -1px 0 rgba(11,25,87,0.08)",
            }}
            aria-label={alt}
          >
            <span
              className="font-display text-2xl font-normal italic"
              style={{
                color: "rgba(255,255,255,0.92)",
                letterSpacing: "-0.03em",
              }}
            >
              {inisial}
            </span>
            {/* Spine hairline */}
            <span
              aria-hidden
              className="absolute left-0 top-1 bottom-1 w-px"
              style={{ background: "rgba(255,255,255,0.25)" }}
            />
          </div>
        )}
      </motion.div>
    </div>
  );
}

/* ── Circular Progress Ring ───────────────────────────────────── */

function CircularProgress({
  value,
  size = 32,
}: {
  value: number;
  size?: number;
}) {
  const radius = (size - 6) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <svg
      width={size}
      height={size}
      className="progress-ring"
      style={{ filter: "drop-shadow(0 1px 3px rgba(11,25,87,0.08))" }}
    >
      <defs>
        <linearGradient id="progress-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="var(--blue-soft)" />
          <stop offset="100%" stopColor="var(--pink-soft)" />
        </linearGradient>
      </defs>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="rgba(255,255,255,0.8)"
        stroke="var(--paper-soft)"
        strokeWidth={2.5}
      />
      <motion.circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="url(#progress-gradient)"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeDasharray={circumference}
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
      />
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dy="0.35em"
        style={{
          fontSize: "7px",
          fontFamily: "var(--font-mono)",
          fontWeight: 600,
          fill: "var(--navy)",
        }}
      >
        {Math.round(value)}
      </text>
    </svg>
  );
}
