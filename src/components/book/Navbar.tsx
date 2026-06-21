"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/", label: "Dashboard" },
  { href: "/koleksi", label: "Koleksi" },
  { href: "/review", label: "Review" },
];

export function Navbar() {
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="fixed top-4 left-0 right-0 z-50 transition-all duration-300">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-8">
        <div
          className="flex h-16 w-full items-center justify-between px-4 sm:px-6 transition-all duration-300"
          style={{
            borderRadius: "9999px",
            background: "rgba(255, 255, 255, 0.35)",
          backdropFilter: "blur(24px) saturate(1.5)",
          WebkitBackdropFilter: "blur(24px) saturate(1.5)",
          border: "none",
          boxShadow: "0 12px 40px rgba(87, 132, 230, 0.08), inset 0 1px 0 rgba(255,255,255,1)",
        }}
      >
        {/* Logo */}
        <Link href="/" style={{ textDecoration: "none" }} className="flex items-center gap-3 group">
          <div
            className="flex h-9 w-9 items-center justify-center text-white text-xs font-bold transition-transform duration-300 group-hover:scale-105 group-hover:rotate-3"
            style={{
              background: "linear-gradient(135deg, #0B1957, #5784E6)",
              borderRadius: "12px",
              boxShadow: "0 4px 16px rgba(11, 25, 87, 0.3)",
              fontFamily: "var(--font-jakarta), sans-serif",
            }}
          >
            PP
          </div>
          <span
            className="hidden sm:block text-sm font-extrabold tracking-tight"
            style={{ color: "#0B1957" }}
          >
            Perpustakaan Pribadi
          </span>
        </Link>

        {/* Nav */}
        <nav aria-label="Navigasi utama">
          <ul className="flex items-center gap-1.5 sm:gap-2">
            {NAV_ITEMS.map((item) => {
              const active = isActive(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={`block px-4 py-2 text-sm font-bold transition-all duration-300 rounded-full`}
                    style={{
                      textDecoration: "none",
                      background: active ? "linear-gradient(135deg, #0B1957, #1E3A8A)" : "transparent",
                      color: active ? "#FFFFFF" : "#78848A",
                      boxShadow: active ? "0 6px 20px rgba(11, 25, 87, 0.25)" : "none",
                      transform: active ? "translateY(-1px)" : "none",
                    }}
                    onMouseEnter={(e) => {
                      if (!active) {
                        e.currentTarget.style.background = "rgba(87, 132, 230, 0.12)";
                        e.currentTarget.style.color = "#0B1957";
                        e.currentTarget.style.transform = "translateY(-1px)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!active) {
                        e.currentTarget.style.background = "transparent";
                        e.currentTarget.style.color = "#78848A";
                        e.currentTarget.style.transform = "none";
                      }
                    }}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
      </div>
    </header>
  );
}