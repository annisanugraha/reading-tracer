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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
        <footer className="relative z-10 px-6 py-10">
          <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 text-center">
            <div className="hairline w-32" />
            <p className="label-meta opacity-70">
              Perpustakaan Pribadi · Atelier of Books
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
