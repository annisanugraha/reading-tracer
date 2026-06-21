"use client";

function hashGenre(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++)
    h = (h * 31 + str.toLowerCase().charCodeAt(i)) >>> 0;
  return h;
}

const GENRE_PALETTE = [
  { icon: "ri-price-tag-3-line", variant: "pill-blue" },
  { icon: "ri-heart-2-line",     variant: "pill-pink" },
  { icon: "ri-leaf-line",        variant: "pill-pale" },
  { icon: "ri-star-smile-line",  variant: "pill-mauve" },
  { icon: "ri-sparkling-2-line", variant: "pill-blue" },
];

export interface GenreBadgeProps {
  nama: string;
  className?: string;
}

/**
 * GenreBadge — hairline pill dengan icon yang berbeda per genre.
 */
export function GenreBadge({ nama, className = "" }: GenreBadgeProps) {
  const idx = hashGenre(nama) % GENRE_PALETTE.length;
  const p = GENRE_PALETTE[idx];
  return (
    <span className={`pill ${p.variant} ${className}`}>
      <i className={p.icon} style={{ fontSize: "0.72rem" }} />
      <span style={{ letterSpacing: "0.06em" }}>{nama}</span>
    </span>
  );
}
