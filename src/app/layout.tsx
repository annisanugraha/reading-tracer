import type { Metadata } from "next";
import { Fraunces, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/book/Navbar";
import { CursorGlow } from "@/components/book/CursorGlow";
import { PageTransition } from "@/components/book/PageTransition";

const fraunces = Fraunces({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-fraunces",
  display: "swap",
  axes: ["SOFT", "opsz"],
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Perpustakaan Pribadi — Reading Atelier",
  description:
    "Sebuah atelier kecil untuk mencatat, merayakan, dan merawat setiap buku yang pernah kamu sentuh.",
};

const MARQUEE_ITEMS = [
  "Perpustakaan Pribadi",
  "✦",
  "Atelier of Books",
  "❋",
  "Reading is Dreaming",
  "·",
  "Kata-kata yang Bertahan",
  "✿",
  "One Page at a Time",
  "·",
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const marqueeText = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS].join("   ");

  return (
    <html
      lang="id"
      className={`${fraunces.variable} ${inter.variable} ${mono.variable}`}
    >
      <body className="min-h-screen flex flex-col antialiased">
        <CursorGlow />
        <Navbar />
        <main className="relative z-10 flex w-full flex-1 flex-col">
          <PageTransition>{children}</PageTransition>
        </main>
        <footer className="relative z-10 px-3 py-10 sm:px-6 overflow-hidden">
          <div className="mx-auto flex max-w-6xl flex-col items-center gap-5 text-center">
            {/* Ornamental gradient line */}
            <div className="ornament-line w-24" />

            {/* Marquee */}
            <div className="w-full overflow-hidden opacity-50">
              <div className="marquee-track">
                {[0, 1].map((copy) => (
                  <span
                    key={copy}
                    className="label-meta inline-block whitespace-nowrap px-4"
                    style={{
                      fontSize: "0.58rem",
                      letterSpacing: "0.25em",
                    }}
                  >
                    {MARQUEE_ITEMS.map((item, i) => (
                      <span key={i} className="mx-3">
                        {item === "✦" || item === "❋" || item === "✿" || item === "·" ? (
                          <span style={{ color: "var(--pink-soft)" }}>{item}</span>
                        ) : (
                          item
                        )}
                      </span>
                    ))}
                  </span>
                ))}
              </div>
            </div>

            <p
              className="label-meta opacity-40"
              style={{ fontSize: "0.55rem" }}
            >
              © {new Date().getFullYear()} · Handcrafted with care
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
