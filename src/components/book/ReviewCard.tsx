"use client";

import Link from "next/link";
import { RatingStars } from "./RatingStars";
import { escapeAlt, formatTanggal, inisialJudul } from "@/lib/utils";
import { motion } from "framer-motion";

export interface ReviewCardProps {
  cover?: string;
  judul: string;
  rating: number;
  teksReview: string;
  tanggal: string;
  penulis?: string;
  href?: string;
  cuplikanMaks?: number;
  className?: string;
}

const COVER_GRADIENTS = [
  "linear-gradient(135deg, #C2E1FC 0%, #5784E6 100%)",
  "linear-gradient(135deg, #F4D1FF 0%, #FA9EBC 100%)",
  "linear-gradient(135deg, #96CBFC 0%, #4E8BC4 100%)",
  "linear-gradient(135deg, #FFC2D9 0%, #FF99BE 100%)",
];

/**
 * Kartu review buku dengan soft premium glassmorphism style.
 */
export function ReviewCard({
  cover,
  judul,
  rating,
  teksReview,
  tanggal,
  penulis,
  href,
  cuplikanMaks = 220,
  className = "",
}: ReviewCardProps) {
  const cuplikan =
    teksReview.length > cuplikanMaks
      ? teksReview.slice(0, cuplikanMaks).trimEnd() + "…"
      : teksReview;

  const inisial = inisialJudul(judul);
  const bgIdx = inisial.charCodeAt(0) % COVER_GRADIENTS.length;

  const inner = (
    <motion.article
      whileHover={{ y: -4, boxShadow: "0 16px 48px rgba(87,132,230,0.18), 0 4px 16px rgba(0,0,0,0.07)" }}
      whileTap={{ y: 0 }}
      transition={{ type: "spring", stiffness: 380, damping: 22 }}
      className={`flex gap-5 p-5 ${className}`}
      style={{
        background: "rgba(255,255,255,0.72)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        border: "1px solid rgba(255,255,255,0.92)",
        borderRadius: "1.5rem",
        boxShadow: "0 4px 24px rgba(87,132,230,0.10), 0 1px 6px rgba(0,0,0,0.05)",
      }}
    >
      <div className="flex-shrink-0">
        {cover ? (
          <div className="h-24 w-16 overflow-hidden rounded-xl shadow-sm">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={cover}
              alt={escapeAlt(`Cover ${judul}`)}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </div>
        ) : (
          <div
            className="flex h-24 w-16 items-center justify-center rounded-xl shadow-sm"
            style={{ background: COVER_GRADIENTS[bgIdx] }}
          >
            <span
              className="text-lg font-extrabold text-white/90 tracking-tight"
            >
              {inisial}
            </span>
          </div>
        )}
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-2.5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3
              className="line-clamp-1 text-base font-bold leading-tight"
              style={{ color: "var(--navy)" }}
            >
              {judul}
            </h3>
            {penulis && (
              <p className="line-clamp-1 text-xs font-medium mt-0.5" style={{ color: "var(--ink-mid)" }}>
                {penulis}
              </p>
            )}
          </div>
          <time
            className="shrink-0 text-[10px] font-semibold uppercase tracking-wider px-2 py-1 rounded-full"
            style={{
              color: "var(--navy)",
              background: "var(--blue-pale)",
            }}
          >
            {formatTanggal(tanggal)}
          </time>
        </div>
        <RatingStars value={rating} readOnly size="sm" />
        {cuplikan && (
          <p className="line-clamp-3 text-sm leading-relaxed" style={{ color: "var(--ink)" }}>
            {cuplikan}
          </p>
        )}
      </div>
    </motion.article>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--blue-soft)]"
        style={{ borderRadius: "1.5rem" }}
      >
        {inner}
      </Link>
    );
  }
  return inner;
}