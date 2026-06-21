"use client";

function hashGenre(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.toLowerCase().charCodeAt(i)) >>> 0;
  return h;
}

const GENRE_PALETTE = [
  { bg: "rgba(194,225,252,0.65)", color: "#0B1957" },
  { bg: "rgba(244,209,255,0.65)", color: "#3a1a5c" },
  { bg: "rgba(150,203,252,0.60)", color: "#0B1957" },
  { bg: "rgba(255,194,217,0.65)", color: "#5a1a2a" },
  { bg: "rgba(87,132,230,0.18)",  color: "#0B1957" },
  { bg: "rgba(255,153,190,0.30)", color: "#5a1a2a" },
];

export interface GenreBadgeProps { nama: string; className?: string; }

export function GenreBadge({ nama, className = "" }: GenreBadgeProps) {
  const c = GENRE_PALETTE[hashGenre(nama) % GENRE_PALETTE.length];
  return (
    <span
      className={`inline-block px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide capitalize ${className}`}
      style={{
        background: c.bg,
        color: c.color,
        borderRadius: "9999px",
        border: "1px solid rgba(255,255,255,0.8)",
        backdropFilter: "blur(8px)",
        letterSpacing: "0.05em",
      }}
    >
      {nama}
    </span>
  );
}