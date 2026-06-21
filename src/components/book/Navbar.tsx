"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
  AnimatePresence,
} from "framer-motion";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/", label: "Atelier", icon: "ri-home-5-line", iconFilled: "ri-home-5-fill" },
  { href: "/koleksi", label: "Koleksi", icon: "ri-book-2-line", iconFilled: "ri-book-2-fill" },
  { href: "/review", label: "Review", icon: "ri-quill-pen-line", iconFilled: "ri-quill-pen-fill" },
];

function getGreeting(): { text: string; icon: string } {
  const h = new Date().getHours();
  if (h < 5) return { text: "Selamat malam", icon: "ri-moon-foggy-line" };
  if (h < 11) return { text: "Selamat pagi", icon: "ri-sun-foggy-line" };
  if (h < 15) return { text: "Selamat siang", icon: "ri-sun-line" };
  if (h < 18) return { text: "Selamat sore", icon: "ri-sun-cloudy-line" };
  return { text: "Selamat malam", icon: "ri-moon-foggy-line" };
}

/* Magnetic hover hook */
function useMagnetic(strength = 0.3) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 250, damping: 20 });
  const sy = useSpring(y, { stiffness: 250, damping: 20 });
  const ref = useRef<HTMLElement>(null);

  const handleMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    x.set((e.clientX - cx) * strength);
    y.set((e.clientY - cy) * strength);
  };

  const handleLeave = () => {
    x.set(0);
    y.set(0);
  };

  return { ref, sx, sy, handleMove, handleLeave };
}

export function Navbar() {
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === "/"
      ? pathname === "/"
      : pathname === href || pathname.startsWith(`${href}/`);

  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    return scrollY.on("change", (v) => {
      setScrolled(v > 60);
    });
  }, [scrollY]);

  const greeting = getGreeting();

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
      className="fixed top-0 left-0 right-0 z-40 px-3 sm:px-6"
      style={{ paddingTop: scrolled ? "0.6rem" : "1.1rem" }}
    >
      <motion.div
        className="mx-auto"
        animate={{
          maxWidth: scrolled ? "32rem" : "72rem",
        }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.nav
          className={cn(
            "flex items-center justify-between transition-all duration-700",
            scrolled ? "px-2 sm:px-3" : "px-3 sm:px-4"
          )}
          style={{
            height: scrolled ? "3rem" : "3.75rem",
            background: scrolled
              ? "rgba(255, 255, 255, 0.72)"
              : "rgba(250, 251, 255, 0.85)",
            backdropFilter: "blur(24px) saturate(1.5)",
            WebkitBackdropFilter: "blur(24px) saturate(1.5)",
            border: "1px solid rgba(255, 255, 255, 0.8)",
            borderRadius: scrolled ? "9999px" : "1rem",
            boxShadow: scrolled
              ? "0 4px 20px rgba(11,25,87,0.08), inset 0 1px 0 rgba(255,255,255,0.9)"
              : "0 2px 12px rgba(11,25,87,0.05), inset 0 1px 0 rgba(255,255,255,0.9)",
            transition: "height 0.7s cubic-bezier(0.22,1,0.36,1), background 0.7s, border-radius 0.7s cubic-bezier(0.22,1,0.36,1), box-shadow 0.7s, padding 0.7s",
          }}
          aria-label="Navigasi utama"
        >
          {/* Logo — wordmark */}
          <Link href="/" className="group flex items-baseline gap-1.5 leading-none shrink-0">
            <motion.span
              className="font-display font-medium italic tracking-tight"
              style={{
                color: "var(--navy)",
                fontSize: scrolled ? "18px" : "21px",
                transition: "font-size 0.7s cubic-bezier(0.22,1,0.36,1)",
              }}
            >
              Atelier
            </motion.span>
            <motion.span
              aria-hidden
              animate={{
                rotate: [0, 14, -10, 0],
                scale: [1, 1.2, 0.9, 1],
              }}
              transition={{
                duration: 5.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              style={{
                color: "var(--pink-soft)",
                fontSize: scrolled ? "9px" : "11px",
                transition: "font-size 0.7s",
              }}
            >
              ✦
            </motion.span>

            {/* Greeting — hidden on scroll or small screens */}
            <AnimatePresence>
              {!scrolled && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="hidden lg:inline-flex items-center gap-1.5 overflow-hidden ml-2"
                >
                  <span className="hairline-v h-3 inline-block" />
                  <i
                    className={greeting.icon}
                    style={{ fontSize: "0.72rem", color: "var(--ink-light)" }}
                  />
                  <span
                    className="label-meta whitespace-nowrap"
                    style={{ fontSize: "0.55rem", letterSpacing: "0.15em" }}
                  >
                    {greeting.text}
                  </span>
                </motion.span>
              )}
            </AnimatePresence>
          </Link>

          {/* Nav links */}
          <ul className="relative flex items-center gap-0.5">
            {NAV_ITEMS.map((item) => {
              const active = isActive(item.href);
              return (
                <li key={item.href} className="relative">
                  <NavLink item={item} active={active} compact={scrolled} />
                </li>
              );
            })}
          </ul>
        </motion.nav>
      </motion.div>
    </motion.header>
  );
}

/* Individual nav link with magnetic effect */
function NavLink({
  item,
  active,
  compact,
}: {
  item: (typeof NAV_ITEMS)[number];
  active: boolean;
  compact: boolean;
}) {
  const { ref, sx, sy, handleMove, handleLeave } = useMagnetic(0.25);

  return (
    <Link
      href={item.href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "relative inline-flex items-center gap-1.5 rounded-full",
        "text-[0.78rem] font-medium transition-colors duration-500",
        active ? "text-white" : "text-(--ink-mid) hover:text-(--navy)"
      )}
      style={{
        padding: compact ? "0.35rem 0.7rem" : "0.45rem 0.9rem",
        transition: "padding 0.7s cubic-bezier(0.22,1,0.36,1)",
      }}
      onMouseMove={handleMove as any}
      onMouseLeave={handleLeave}
    >
      {active && (
        <motion.span
          layoutId="nav-active"
          className="absolute inset-0 rounded-full"
          style={{
            background: "var(--navy)",
            boxShadow:
              "0 4px 14px rgba(11,25,87,0.25), inset 0 1px 0 rgba(255,255,255,0.15)",
          }}
          transition={{
            type: "spring",
            stiffness: 380,
            damping: 30,
          }}
        />
      )}
      {/* Subtle glow under active item */}
      {active && (
        <motion.span
          layoutId="nav-glow"
          className="absolute -bottom-2 left-1/2 -translate-x-1/2 h-4 w-12 rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(ellipse, rgba(87,132,230,0.2), transparent 70%)",
            filter: "blur(6px)",
          }}
          transition={{ type: "spring", stiffness: 380, damping: 30 }}
        />
      )}
      <motion.span
        ref={ref as any}
        style={{ x: sx, y: sy }}
        className="relative z-10 inline-flex items-center gap-1.5"
      >
        <i
          className={cn(
            active ? item.iconFilled : item.icon,
            "leading-none"
          )}
          style={{
            fontSize: compact ? "0.92rem" : "1rem",
            transition: "font-size 0.5s",
          }}
        />
        <span
          className={cn(
            compact ? "hidden sm:inline" : "hidden sm:inline"
          )}
          style={{ fontSize: compact ? "0.72rem" : "0.78rem", transition: "font-size 0.5s" }}
        >
          {item.label}
        </span>
      </motion.span>
    </Link>
  );
}
