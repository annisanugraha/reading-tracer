import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/book/Navbar";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  style: ["normal", "italic"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Perpustakaan Pribadi — My Reading Lab",
  description:
    "Catat koleksi buku pribadi: yang sudah dibaca, sedang dibaca, mau dibaca, lengkap dengan review dan rating.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`h-full ${jakarta.variable}`}>
      <body className="min-h-full flex flex-col antialiased">
        <Navbar />
        <main className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 sm:px-8">
          {children}
        </main>
        <footer className="relative z-10 py-6 text-center">
          <p className="label-mono opacity-60">
            Perpustakaan Pribadi · data tersimpan di browser kamu
          </p>
        </footer>
      </body>
    </html>
  );
}