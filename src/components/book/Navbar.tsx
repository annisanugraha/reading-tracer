"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/", label: "Atelier", icon: "ri-home-5-line" },
  { href: "/koleksi", label: "Koleksi", icon: "ri-book-2-line" },
  { href: "/review", label: "Review", icon: "ri-quill-pen-line" },
];

export function Navbar() {
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === "/"
      ? pathname === "/"
      : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
      className="fixed top-5 left-0 right-0 z-50 px-4 sm:px-8"
    >
      <div className="mx-auto w-full max-w-6xl">
        <nav
          className="surface-nm flex h-16 items-center justify-between px-3 sm:px-4"
          aria-label="Navigasi utama"
        >
          {/* Logo — wordmark only */}
          <Link href="/" className="group flex items-baseline gap-2 leading-none">
            <span
              className="font-display text-[23px] font-medium italic tracking-tight"
              style={{ color: "var(--navy)" }}
            >
              Atelier
            </span>
            <motion.span
              aria-hidden
              animate={{ rotate: [0, 14, -10, 0], scale: [1, 1.1, 0.95, 1] }}
              transition={{
                duration: 5.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="text-[11px]"
              style={{ color: "var(--pink-soft)" }}
            >
              ✦
            </motion.span>
            <span
              className="label-meta ml-1"
              style={{ fontSize: "9px", letterSpacing: "0.22em" }}
            >
              Vol · 01
            </span>
          </Link>

          {/* Nav links */}
          <ul className="relative flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const active = isActive(item.href);
              return (
                <li key={item.href} className="relative">
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "relative inline-flex items-center gap-2 px-4 py-2 rounded-full",
                      "text-[0.8rem] font-medium transition-colors duration-500",
                      active ? "text-white" : "text-(--ink-mid) hover:text-(--navy)"
                    )}
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
                    <span className="relative z-10 inline-flex items-center gap-2">
                      <i className={cn(item.icon, "text-[1rem] leading-none")} />
                      <span className="hidden sm:inline">{item.label}</span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Right side intentionally minimal */}
        </nav>
      </div>
    </motion.header>
  );
}
