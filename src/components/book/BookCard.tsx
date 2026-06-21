"use client";

import Link from "next/link";
import { useRef, type MouseEvent } from "react";
import { motion } from "framer-motion";
import type { BookStatus } from "@/lib/types";
import { StatusBadge } from "./StatusBadge";
import { RatingStars } from "./RatingStars";
import { ProgressBar } from "./ProgressBar";
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

/**
 * BookCard — neumorphism card dengan 3D tilt on hover (mouse-tracking).
 * Subtle scale, soft shadow elevation, dan ink shimmer on hover.
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

  const onMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.setProperty("--tilt-x", `${y * -4}deg`);
    el.style.setProperty("--tilt-y", `${x * 6}deg`);
    el.style.setProperty("--mx", `${(x + 0.5) * 100}%`);
    el.style.setProperty("--my", `${(y + 0.5) * 100}%`);
  };

  const onMouseLeave = () => {
    const el = cardRef.current;
    if (!el) return;
    el.style.setProperty("--tilt-x", `0deg`);
    el.style.setProperty("--tilt-y", `0deg`);
  };

  const inner = (
    <motion.div
      ref={cardRef}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      whileHover={{ y: -3 }}
      transition={{ type: "spring", stiffness: 220, damping: 22 }}
      className={`book-tilt group relative flex gap-5 p-4 ${className}`}
      style={{
        background: "var(--surface)",
        border: "1px solid var(--hairline)",
        borderRadius: "1.5rem",
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
        className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
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

      <CoverImage src={cover} judul={judul} />

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
          {typeof rating === "number" && rating > 0 && (
            <RatingStars value={rating} readOnly size="sm" />
          )}
        </div>

        {typeof progress === "number" && progress > 0 && (
          <div className="mt-1">
            <ProgressBar value={progress} label={`Progress ${progress}%`} />
          </div>
        )}
      </div>

      {/* Hover-only corner arrow */}
      <span
        aria-hidden
        className="pointer-events-none absolute right-4 top-4 opacity-0 transition-all duration-500 group-hover:opacity-100 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
        style={{ color: "var(--ink-light)" }}
      >
        <i className="ri-arrow-up-right-line" style={{ fontSize: "0.95rem" }} />
      </span>
    </motion.div>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="block focus:outline-none"
        style={{ borderRadius: "1.5rem" }}
      >
        {inner}
      </Link>
    );
  }
  return inner;
}

// ─── Cover image ────────────────────────────────────────────────

const COVER_GRADIENTS = [
  "linear-gradient(135deg, #C2E1FC 0%, #5784E6 100%)",
  "linear-gradient(135deg, #F4D1FF 0%, #FA9EBC 100%)",
  "linear-gradient(135deg, #96CBFC 0%, #4E8BC4 100%)",
  "linear-gradient(135deg, #FFC2D9 0%, #FF99BE 100%)",
  "linear-gradient(135deg, #C2E1FC 0%, #F4D1FF 100%)",
];

function CoverImage({ src, judul }: { src?: string; judul: string }) {
  const alt = escapeAlt(`Cover buku ${judul}`);
  const inisial = inisialJudul(judul);
  const idx = inisial.charCodeAt(0) % COVER_GRADIENTS.length;

  if (src) {
    return (
      <div
        className="relative h-[7.5rem] w-[5.25rem] flex-shrink-0 overflow-hidden"
        style={{
          borderRadius: "0.75rem",
          boxShadow:
            "0 4px 14px rgba(11,25,87,0.10), inset 0 1px 0 rgba(255,255,255,0.3)",
        }}
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
      </div>
    );
  }

  return (
    <div
      className="relative flex h-[7.5rem] w-[5.25rem] flex-shrink-0 items-center justify-center"
      style={{
        background: COVER_GRADIENTS[idx],
        borderRadius: "0.75rem",
        boxShadow:
          "0 4px 14px rgba(11,25,87,0.12), inset 0 1px 0 rgba(255,255,255,0.35), inset 0 -1px 0 rgba(11,25,87,0.08)",
      }}
      aria-label={alt}
    >
      <span
        className="font-display text-2xl font-normal italic"
        style={{ color: "rgba(255,255,255,0.92)", letterSpacing: "-0.03em" }}
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
  );
}
