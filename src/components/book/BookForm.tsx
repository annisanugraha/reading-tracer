"use client";

import { useState, type FormEvent } from "react";
import type { Book, BookInput, BookStatus } from "@/lib/types";
import { BOOK_STATUSES, STATUS_LABELS } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface BookFormProps {
  /** Data awal untuk mode edit. Kalau tidak diisi, mode tambah. */
  initialData?: Partial<Book>;
  /** Genre yang sudah ada di koleksi (untuk autocomplete datalist). */
  existingGenres?: string[];
  /** Dipanggil saat submit dengan data valid. */
  onSubmit: (data: BookInput) => void;
  /** Dipanggil saat user klik tombol batal. */
  onCancel?: () => void;
  /** Label tombol submit. Default "Simpan". */
  submitLabel?: string;
}

/**
 * Form untuk tambah/edit buku. Validasi sederhana client-side:
 * judul & penulis wajib, totalHalaman harus angka positif.
 *
 * Genre ditulis sebagai tag: input teks + Enter / koma untuk menambah ke list.
 *
 * Implementasi: Compose di atas primitif shadcn (Input, Label, Textarea,
 * Select, Button). Props publik TIDAK berubah — halaman yang sudah pakai
 * komponen ini tidak perlu diubah.
 */
export function BookForm({
  initialData,
  existingGenres = [],
  onSubmit,
  onCancel,
  submitLabel = "Simpan",
}: BookFormProps) {
  const [judul, setJudul] = useState(initialData?.judul ?? "");
  const [penulis, setPenulis] = useState(initialData?.penulis ?? "");
  const [genreInput, setGenreInput] = useState("");
  const [genreList, setGenreList] = useState<string[]>(initialData?.genre ?? []);
  const [totalHalaman, setTotalHalaman] = useState<string>(
    initialData?.totalHalaman?.toString() ?? ""
  );
  const [status, setStatus] = useState<BookStatus>(
    initialData?.status ?? "mau-dibaca"
  );
  const [coverUrl, setCoverUrl] = useState(initialData?.coverUrl ?? "");
  const [tanggalMulai, setTanggalMulai] = useState<string>(
    initialData?.tanggalMulaiBaca?.slice(0, 10) ?? ""
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  function addGenre(raw: string) {
    const g = raw.trim().toLowerCase();
    if (!g) return;
    if (genreList.includes(g)) return;
    setGenreList([...genreList, g]);
    setGenreInput("");
  }

  function removeGenre(g: string) {
    setGenreList(genreList.filter((x) => x !== g));
  }

  function handleGenreKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addGenre(genreInput);
    } else if (e.key === "Backspace" && !genreInput && genreList.length > 0) {
      // Hapus tag terakhir kalau input kosong dan user tekan backspace
      removeGenre(genreList[genreList.length - 1]);
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    if (!judul.trim()) newErrors.judul = "Judul wajib diisi";
    if (!penulis.trim()) newErrors.penulis = "Penulis wajib diisi";
    const pages = Number(totalHalaman);
    if (!totalHalaman || Number.isNaN(pages) || pages <= 0) {
      newErrors.totalHalaman = "Jumlah halaman harus angka positif";
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});

    const payload: BookInput = {
      judul: judul.trim(),
      penulis: penulis.trim(),
      genre: genreList,
      totalHalaman: pages,
      status,
      coverUrl: coverUrl.trim() || undefined,
      tanggalMulaiBaca: tanggalMulai ? new Date(tanggalMulai).toISOString() : undefined,
    };

    onSubmit(payload);
  }

  // Datalist opsi genre: gabungan existing + sudah dipilih.
  const genreOptions = Array.from(new Set([...existingGenres, ...genreList]));

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Field label="Judul" required error={errors.judul}>
        <Input
          type="text"
          value={judul}
          onChange={(e) => setJudul(e.target.value)}
          aria-invalid={!!errors.judul}
          placeholder="Contoh: Laskar Pelangi"
        />
      </Field>

      <Field label="Penulis" required error={errors.penulis}>
        <Input
          type="text"
          value={penulis}
          onChange={(e) => setPenulis(e.target.value)}
          aria-invalid={!!errors.penulis}
          placeholder="Nama penulis"
        />
      </Field>

      <Field label="Genre" hint="Tekan Enter atau koma untuk menambah">
        <div
          className={cn(
            "flex flex-wrap items-center gap-2 rounded-lg border border-input bg-transparent px-2.5 py-1.5",
            "focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50"
          )}
        >
          {genreList.map((g) => (
            <span
              key={g}
              className="inline-flex items-center gap-1 rounded-full bg-secondary px-2 py-0.5 text-xs capitalize text-secondary-foreground"
            >
              {g}
              <button
                type="button"
                onClick={() => removeGenre(g)}
                aria-label={`Hapus genre ${g}`}
                className="text-muted-foreground hover:text-foreground"
              >
                ×
              </button>
            </span>
          ))}
          <input
            type="text"
            value={genreInput}
            onChange={(e) => setGenreInput(e.target.value)}
            onKeyDown={handleGenreKeyDown}
            onBlur={() => addGenre(genreInput)}
            list="genre-options"
            className="flex-1 min-w-[8rem] bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            placeholder={genreList.length === 0 ? "fiksi, teknologi…" : ""}
          />
          <datalist id="genre-options">
            {genreOptions.map((g) => (
              <option key={g} value={g} />
            ))}
          </datalist>
        </div>
      </Field>

      <Field label="Jumlah Halaman" required error={errors.totalHalaman}>
        <Input
          type="number"
          min={1}
          value={totalHalaman}
          onChange={(e) => setTotalHalaman(e.target.value)}
          aria-invalid={!!errors.totalHalaman}
          placeholder="320"
        />
      </Field>

      <Field label="Status Awal">
        <Select value={status} onValueChange={(v) => setStatus(v as BookStatus)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Pilih status" />
          </SelectTrigger>
          <SelectContent>
            {BOOK_STATUSES.map((s) => (
              <SelectItem key={s} value={s}>
                {STATUS_LABELS[s]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>

      <Field label="URL Cover" hint="Opsional. Kosongkan untuk placeholder otomatis.">
        <Input
          type="url"
          value={coverUrl}
          onChange={(e) => setCoverUrl(e.target.value)}
          placeholder="https://…"
        />
      </Field>

      <Field label="Tanggal Mulai Baca" hint="Opsional">
        <Input
          type="date"
          value={tanggalMulai}
          onChange={(e) => setTanggalMulai(e.target.value)}
        />
      </Field>

      <div className="mt-2 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Batal
          </Button>
        )}
        <Button type="submit">{submitLabel}</Button>
      </div>
    </form>
  );
}

interface FieldProps {
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}

function Field({ label, required, hint, error, children }: FieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label className="text-zinc-700 dark:text-zinc-300">
        {label}
        {required && <span className="ml-0.5 text-rose-500">*</span>}
      </Label>
      {children}
      {error ? (
        <span className="text-xs text-destructive">{error}</span>
      ) : hint ? (
        <span className="text-xs text-muted-foreground">{hint}</span>
      ) : null}
    </div>
  );
}