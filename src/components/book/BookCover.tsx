"use client";

import { useRef, type MouseEvent } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { escapeAlt, inisialJudul } from "@/lib/utils";

const COVER_GRADIENTS = [
  "linear-gradient(135deg, #C2E1FC 0%, #5784E6 100%)",
  "linear-gradient(135deg, #F4D1FF 0%, #FA9EBC 100%)",
  "linear-gradient(135deg, #96CBFC 0%, #4E8BC4 100%)",
  "linear-gradient(135deg, #FFC2D9 0%, #FF99BE 100%)",
  "linear-gradient(135deg, #C2E1FC 0%, #F4D1FF 100%)",
];

export interface BookCoverProps {
  src?: string;
  judul: string;
  /** Ukuran cover; default "md" */
  size?: "sm" | "md" | "lg" | "xl";
  /** Aspect ratio default 2:3 (book) */
  aspect?: "2/3" | "3/4" | "1/1";
  className?: string;
}

const SIZE_DIMENSIONS = {
  sm: { w: "5rem", h: "7.5rem" },
  md: { w: "7rem", h: "10.5rem" },
  lg: { w: "10rem", h: "15rem" },
  xl: { w: "14rem", h: "21rem" },
} as const;

/**
 * BookCover — interactive 3D book cover dengan parallax tilt.
 * Cover mengikuti cursor dengan rotateX/Y, soft specular highlight,
 * dan shadow yang bereaksi terhadap elevasi.
 */
export function BookCover({
  src,
  judul,
  size = "md",
  aspect = "2/3",
  className = "",
}: BookCoverProps) {
  const ref = useRef<HTMLDivElement>(null);
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const glareX = useMotionValue(50);
  const glareY = useMotionValue(50);
  const sRx = useSpring(rx, { stiffness: 180, damping: 18 });
  const sRy = useSpring(ry, { stiffness: 180, damping: 18 });

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    rx.set(y * -10);
    ry.set(x * 12);
    glareX.set((x + 0.5) * 100);
    glareY.set((y + 0.5) * 100);
  };

  const onLeave = () => {
    rx.set(0);
    ry.set(0);
  };

  const alt = escapeAlt(`Cover buku ${judul}`);
  const inisial = inisialJudul(judul);
  const idx = inisial.charCodeAt(0) % COVER_GRADIENTS.length;
  const dim = SIZE_DIMENSIONS[size];
  const aspectClass =
    aspect === "2/3"
      ? "aspect-[2/3]"
      : aspect === "3/4"
      ? "aspect-[3/4]"
      : "aspect-square";

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{
        perspective: "1000px",
        width: dim.w,
      }}
      className={`relative ${className}`}
    >
      <motion.div
        style={{
          rotateX: sRx,
          rotateY: sRy,
          transformStyle: "preserve-3d",
        }}
        className={`relative ${aspectClass} w-full overflow-hidden`}
      >
        {src ? (
          <div
            className="h-full w-full"
            style={{
              borderRadius: "0.75rem",
              boxShadow:
                "0 18px 40px rgba(11,25,87,0.20), inset 0 1px 0 rgba(255,255,255,0.3)",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt={alt}
              className="h-full w-full object-cover"
              loading="lazy"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = "none";
              }}
              style={{ borderRadius: "inherit" }}
            />
          </div>
        ) : (
          <div
            className="flex h-full w-full items-center justify-center"
            style={{
              background: COVER_GRADIENTS[idx],
              borderRadius: "0.75rem",
              boxShadow:
                "0 18px 40px rgba(11,25,87,0.22), inset 0 1px 0 rgba(255,255,255,0.35), inset 0 -1px 0 rgba(11,25,87,0.08)",
            }}
            aria-label={alt}
          >
            <span
              className="font-display font-normal italic"
              style={{
                color: "rgba(255,255,255,0.94)",
                letterSpacing: "-0.04em",
                fontSize: size === "xl" ? "3.5rem" : size === "lg" ? "2.5rem" : "1.75rem",
              }}
            >
              {inisial}
            </span>
            {/* Spine hairline */}
            <span
              aria-hidden
              className="absolute left-0 top-2 bottom-2 w-px"
              style={{ background: "rgba(255,255,255,0.25)" }}
            />
          </div>
        )}

        {/* Cursor-following glare highlight */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background: `radial-gradient(circle 120px at ${glareX.get()}% ${glareY.get()}%, rgba(255,255,255,0.4), transparent 65%)`,
            borderRadius: "inherit",
            mixBlendMode: "soft-light",
          }}
        />

        {/* Subtle gloss reflection at top */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(160deg, rgba(255,255,255,0.18) 0%, transparent 35%)",
            borderRadius: "inherit",
          }}
        />
      </motion.div>

      {/* Soft floor shadow under cover */}
      <span
        aria-hidden
        className="pointer-events-none absolute -bottom-3 left-1/2 -z-10 h-6 w-3/4 -translate-x-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(11,25,87,0.18) 0%, transparent 70%)",
          filter: "blur(8px)",
        }}
      />
    </motion.div>
  );
}
