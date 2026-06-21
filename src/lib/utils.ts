import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { GENRE_COLOR_PALETTE, type Book, type BookStatus } from "./types";

/**
 * cn() helper dari shadcn — dipakai untuk merge Tailwind classes
 * dengan benar (override yang sama-sama ada di kondisi berbeda).
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format tanggal ISO ke string yang enak dibaca orang Indonesia.
 * Contoh: "21 Jun 2026"
 */
export function formatTanggal(iso?: string): string {
  if (!iso) return "-";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/**
 * Format angka dengan separator ribuan (id-ID).
 * Contoh: 12345 -> "12.345"
 */
export function formatAngka(n: number): string {
  return n.toLocaleString("id-ID");
}

/**
 * Hitung progress persen (0..100). Kalau totalHalaman 0, kembalikan 0.
 */
export function hitungProgress(book: Pick<Book, "halamanTerbaca" | "totalHalaman">): number {
  if (!book.totalHalaman || book.totalHalaman <= 0) return 0;
  const pct = (book.halamanTerbaca / book.totalHalaman) * 100;
  if (Number.isNaN(pct)) return 0;
  return Math.min(100, Math.max(0, Math.round(pct)));
}

/**
 * String inisial dari judul (1-2 huruf besar). Dipakai placeholder cover.
 */
export function inisialJudul(judul: string): string {
  const words = judul.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "?";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

/**
 * Pilih warna palette yang konsisten untuk satu nama genre.
 * Algoritma: hash sederhana (sum char codes) lalu modulo palette length.
 */
export function warnaUntukGenre(genre: string): (typeof GENRE_COLOR_PALETTE)[number] {
  const key = genre.trim().toLowerCase();
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = (hash * 31 + key.charCodeAt(i)) >>> 0;
  }
  const idx = hash % GENRE_COLOR_PALETTE.length;
  return GENRE_COLOR_PALETTE[idx];
}

/**
 * Generate id sederhana. Tidak butuh cryptographic strength;
 * cukup unik dalam scope localStorage satu user.
 */
export function buatId(): string {
  return `b_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

/**
 * Tanggal "hari ini" dalam ISO string.
 */
export function hariIniIso(): string {
  return new Date().toISOString();
}

/**
 * Warna untuk status badge, konsisten dengan STATUS_COLOR_CLASSES di types.ts.
 * Dipisah ke sini supaya komponen tidak perlu import internal const types.
 */
export function warnaUntukStatus(status: BookStatus): {
  bg: string;
  text: string;
  ring: string;
} {
  switch (status) {
    case "mau-dibaca":
      return {
        bg: "bg-slate-100 dark:bg-slate-800",
        text: "text-slate-700 dark:text-slate-200",
        ring: "ring-slate-200 dark:ring-slate-700",
      };
    case "sedang-dibaca":
      return {
        bg: "bg-blue-100 dark:bg-blue-950",
        text: "text-blue-700 dark:text-blue-300",
        ring: "ring-blue-200 dark:ring-blue-800",
      };
    case "selesai":
      return {
        bg: "bg-emerald-100 dark:bg-emerald-950",
        text: "text-emerald-700 dark:text-emerald-300",
        ring: "ring-emerald-200 dark:ring-emerald-800",
      };
    case "berhenti":
      return {
        bg: "bg-rose-100 dark:bg-rose-950",
        text: "text-rose-700 dark:text-rose-300",
        ring: "ring-rose-200 dark:ring-rose-800",
      };
  }
}

/**
 * Sanitasi teks bebas untuk atribut alt agar tidak pecah.
 */
export function escapeAlt(text: string): string {
  return text.replace(/["<>]/g, "");
}