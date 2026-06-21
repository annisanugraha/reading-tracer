/**
 * Tipe data inti untuk aplikasi perpustakaan pribadi.
 * Dipakai bersama oleh hook useBooks(), komponen, dan halaman.
 */

export type BookStatus =
  | "mau-dibaca"
  | "sedang-dibaca"
  | "selesai"
  | "berhenti";

export const BOOK_STATUSES: BookStatus[] = [
  "mau-dibaca",
  "sedang-dibaca",
  "selesai",
  "berhenti",
];

export const STATUS_LABELS: Record<BookStatus, string> = {
  "mau-dibaca": "Mau Dibaca",
  "sedang-dibaca": "Sedang Dibaca",
  selesai: "Selesai",
  berhenti: "Berhenti di Tengah Jalan",
};

export interface Review {
  /** Rating 1..5, hanya diisi ketika buku berstatus "selesai". */
  rating: number;
  /** Teks review bebas, boleh kosong. */
  text: string;
  /** ISO date string, kapan review ditulis/diubah. */
  updatedAt: string;
}

export interface Book {
  id: string;
  judul: string;
  penulis: string;
  /** Disimpan lowercase sebagai key; tampilan tetap pakai kapital. */
  genre: string[];
  totalHalaman: number;
  /** Halaman terakhir yang sudah dibaca, 0 jika belum mulai. */
  halamanTerbaca: number;
  status: BookStatus;
  /** URL cover opsional. Kalau kosong, UI pakai placeholder otomatis. */
  coverUrl?: string;
  /** ISO date string, kapan buku ditambahkan ke koleksi. */
  tanggalDitambahkan: string;
  tanggalMulaiBaca?: string;
  tanggalSelesai?: string;
  review?: Review;
}

/** Bentuk input saat menambah atau mengedit buku (tanpa id & tanggalDitambahkan). */
export type BookInput = Omit<
  Book,
  "id" | "tanggalDitambahkan" | "halamanTerbaca" | "review"
> & {
  halamanTerbaca?: number;
  review?: Review;
};

/**
 * Palette warna stabil untuk genre. Dipakai GenreBadge.
 * Daftar warna di sini yang menentukan variasi warna yang tersedia;
 * genre lain akan di-hash ke salah satu warna ini.
 */
export const GENRE_COLOR_PALETTE = [
  { bg: "bg-rose-100", text: "text-rose-700", ring: "ring-rose-200" },
  { bg: "bg-amber-100", text: "text-amber-700", ring: "ring-amber-200" },
  { bg: "bg-emerald-100", text: "text-emerald-700", ring: "ring-emerald-200" },
  { bg: "bg-sky-100", text: "text-sky-700", ring: "ring-sky-200" },
  { bg: "bg-violet-100", text: "text-violet-700", ring: "ring-violet-200" },
  { bg: "bg-fuchsia-100", text: "text-fuchsia-700", ring: "ring-fuchsia-200" },
  { bg: "bg-teal-100", text: "text-teal-700", ring: "ring-teal-200" },
  { bg: "bg-orange-100", text: "text-orange-700", ring: "ring-orange-200" },
] as const;

/** Dipakai oleh status badge, konsisten antar UI. */
export const STATUS_COLOR_CLASSES: Record<
  BookStatus,
  { bg: string; text: string; ring: string }
> = {
  "mau-dibaca": {
    bg: "bg-slate-100 dark:bg-slate-800",
    text: "text-slate-700 dark:text-slate-200",
    ring: "ring-slate-200 dark:ring-slate-700",
  },
  "sedang-dibaca": {
    bg: "bg-blue-100 dark:bg-blue-950",
    text: "text-blue-700 dark:text-blue-300",
    ring: "ring-blue-200 dark:ring-blue-800",
  },
  selesai: {
    bg: "bg-emerald-100 dark:bg-emerald-950",
    text: "text-emerald-700 dark:text-emerald-300",
    ring: "ring-emerald-200 dark:ring-emerald-800",
  },
  berhenti: {
    bg: "bg-rose-100 dark:bg-rose-950",
    text: "text-rose-700 dark:text-rose-300",
    ring: "ring-rose-200 dark:ring-rose-800",
  },
};