"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export interface ConfirmDialogProps {
  title: string;
  description?: string;
  konfirmasiLabel?: string;
  batalLabel?: string;
  variant?: "danger" | "primary";
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onConfirm: () => void;
  onCancel: () => void;
}

/**
 * Dialog konfirmasi modal dengan soft premium glassmorphism style.
 */
export function ConfirmDialog({
  title,
  description,
  konfirmasiLabel = "Hapus",
  batalLabel = "Batal",
  variant = "danger",
  open = true,
  onOpenChange,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const handleOpenChange = (next: boolean) => {
    if (onOpenChange) onOpenChange(next);
    if (!next) onCancel();
  };

  const btnConfirmClass = variant === "danger"
    ? "bg-[#E05555] text-white hover:bg-[#c94c4c] shadow-[0_4px_16px_rgba(224,85,85,0.3)]"
    : "bg-[var(--navy)] text-white hover:bg-[var(--blue-soft)] shadow-[0_4px_16px_rgba(11,25,87,0.25)]";

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className="sm:max-w-sm p-0 overflow-hidden border border-white/80"
        style={{
          background: "rgba(255, 255, 255, 0.85)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          borderRadius: "1.5rem",
          boxShadow: "0 20px 60px rgba(87, 132, 230, 0.15), 0 4px 20px rgba(0,0,0,0.08)",
        }}
      >
        <div className="p-6">
          <DialogHeader>
            <DialogTitle
              className="text-lg font-bold tracking-tight"
              style={{ color: "var(--navy)" }}
            >
              {title}
            </DialogTitle>
            {description && (
              <DialogDescription className="text-sm mt-2 leading-relaxed" style={{ color: "var(--ink-mid)" }}>
                {description}
              </DialogDescription>
            )}
          </DialogHeader>
          <DialogFooter className="mt-8 flex gap-3 sm:gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-2.5 text-sm font-semibold transition-all duration-200 rounded-full"
              style={{
                background: "rgba(87, 132, 230, 0.08)",
                color: "var(--navy)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(87, 132, 230, 0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(87, 132, 230, 0.08)";
              }}
            >
              {batalLabel}
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className={`flex-1 px-4 py-2.5 text-sm font-semibold transition-all duration-200 rounded-full ${btnConfirmClass}`}
            >
              {konfirmasiLabel}
            </button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}