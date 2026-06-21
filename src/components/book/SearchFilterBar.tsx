"use client";

import type { BookStatus } from "@/lib/types";
import { BOOK_STATUSES, STATUS_LABELS } from "@/lib/types";
import { Search } from "lucide-react";

export type SortOption = "terbaru" | "rating" | "judul";

export interface SearchFilterBarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;

  filterStatus: BookStatus[];
  onFilterStatusChange: (status: BookStatus[]) => void;

  filterGenre: string[];
  onFilterGenreChange: (genre: string[]) => void;

  genreOptions: string[];

  sort: SortOption;
  onSortChange: (sort: SortOption) => void;

  className?: string;
}

const SORT_LABELS: Record<SortOption, string> = {
  terbaru: "Terbaru",
  rating: "Rating Tertinggi",
  judul: "Judul A–Z",
};

/**
 * Bar pencarian + filter + sort dengan soft premium glassmorphism style.
 */
export function SearchFilterBar({
  searchValue,
  onSearchChange,
  filterStatus,
  onFilterStatusChange,
  filterGenre,
  onFilterGenreChange,
  genreOptions,
  sort,
  onSortChange,
  className = "",
}: SearchFilterBarProps) {
  const toggleStatus = (s: BookStatus) => {
    if (filterStatus.includes(s)) {
      onFilterStatusChange(filterStatus.filter((x) => x !== s));
    } else {
      onFilterStatusChange([...filterStatus, s]);
    }
  };

  const toggleGenre = (g: string) => {
    if (filterGenre.includes(g)) {
      onFilterGenreChange(filterGenre.filter((x) => x !== g));
    } else {
      onFilterGenreChange([...filterGenre, g]);
    }
  };

  return (
    <div
      className={`flex flex-col gap-6 p-6 ${className}`}
      style={{
        background: "rgba(255, 255, 255, 0.65)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: "1px solid rgba(255, 255, 255, 0.9)",
        borderRadius: "2rem",
        boxShadow: "0 4px 24px rgba(87, 132, 230, 0.08)",
      }}
    >
      {/* Search + Sort */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-[var(--ink-light)]" />
          </div>
          <input
            type="search"
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Cari judul atau penulis…"
            className="w-full bg-white/70 py-3 pl-10 pr-4 text-sm font-medium placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-[var(--blue-soft)] transition-all"
            style={{
              color: "var(--navy)",
              borderRadius: "9999px",
              boxShadow: "inset 0 2px 4px rgba(0,0,0,0.02)",
              border: "1px solid rgba(87, 132, 230, 0.15)",
            }}
            aria-label="Cari buku"
          />
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <label
            htmlFor="sort-select"
            className="text-xs font-semibold uppercase tracking-wider text-[var(--ink-mid)] whitespace-nowrap"
          >
            Urutkan
          </label>
          <select
            id="sort-select"
            value={sort}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            className="bg-white/70 px-4 py-2.5 text-sm font-semibold text-[var(--navy)] focus:outline-none focus:ring-2 focus:ring-[var(--blue-soft)] cursor-pointer transition-all"
            style={{
              borderRadius: "9999px",
              border: "1px solid rgba(87, 132, 230, 0.15)",
              boxShadow: "0 2px 8px rgba(0,0,0,0.02)",
            }}
          >
            {(Object.keys(SORT_LABELS) as SortOption[]).map((opt) => (
              <option key={opt} value={opt}>
                {SORT_LABELS[opt]}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Filters Container */}
      <div className="flex flex-col gap-4">
        {/* Status */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:gap-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-[var(--ink-mid)] w-14 shrink-0">
            Status
          </span>
          <div className="flex flex-wrap gap-2">
            {BOOK_STATUSES.map((s) => {
              const active = filterStatus.includes(s);
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => toggleStatus(s)}
                  className="inline-flex items-center px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-200"
                  style={{
                    backgroundColor: active ? "#0B1957" : "rgba(255, 255, 255, 0.7)",
                    color: active ? "#FFFFFF" : "var(--ink-mid)",
                    border: active ? "1.5px solid #0B1957" : "1.5px solid rgba(87, 132, 230, 0.2)",
                    boxShadow: active ? "0 2px 8px rgba(11,25,87,0.2)" : "none",
                  }}
                  onMouseEnter={(e) => {
                    if (!active) {
                      e.currentTarget.style.backgroundColor = "rgba(194, 225, 252, 0.5)";
                      e.currentTarget.style.color = "#0B1957";
                      e.currentTarget.style.borderColor = "rgba(87, 132, 230, 0.4)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!active) {
                      e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.7)";
                      e.currentTarget.style.color = "var(--ink-mid)";
                      e.currentTarget.style.borderColor = "rgba(87, 132, 230, 0.2)";
                    }
                  }}
                  aria-pressed={active}
                >
                  {STATUS_LABELS[s]}
                </button>
              );
            })}
            {filterStatus.length > 0 && (
              <button
                type="button"
                onClick={() => onFilterStatusChange([])}
                className="text-xs font-semibold text-[var(--ink-light)] hover:text-[var(--pink-hot)] px-2 transition-colors"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Genre */}
        {genreOptions.length > 0 && (
          <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:gap-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--ink-mid)] w-14 shrink-0">
              Genre
            </span>
            <div className="flex flex-wrap gap-2">
              {genreOptions.map((g) => {
                const active = filterGenre.includes(g);
                return (
                  <button
                    key={g}
                    type="button"
                    onClick={() => toggleGenre(g)}
                    className="inline-flex items-center px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide capitalize transition-all duration-200"
                    style={{
                      backgroundColor: active ? "#0B1957" : "rgba(255, 255, 255, 0.7)",
                      color: active ? "#FFFFFF" : "var(--ink-mid)",
                      border: active ? "1.5px solid #0B1957" : "1.5px solid rgba(87, 132, 230, 0.2)",
                      boxShadow: active ? "0 2px 8px rgba(11,25,87,0.2)" : "none",
                    }}
                    onMouseEnter={(e) => {
                      if (!active) {
                        e.currentTarget.style.backgroundColor = "rgba(194, 225, 252, 0.5)";
                        e.currentTarget.style.color = "#0B1957";
                        e.currentTarget.style.borderColor = "rgba(87, 132, 230, 0.4)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!active) {
                        e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.7)";
                        e.currentTarget.style.color = "var(--ink-mid)";
                        e.currentTarget.style.borderColor = "rgba(87, 132, 230, 0.2)";
                      }
                    }}
                    aria-pressed={active}
                  >
                    {g}
                  </button>
                );
              })}
              {filterGenre.length > 0 && (
                <button
                  type="button"
                  onClick={() => onFilterGenreChange([])}
                  className="text-xs font-semibold text-[var(--ink-light)] hover:text-[var(--pink-hot)] px-2 transition-colors"
                >
                  Reset
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}