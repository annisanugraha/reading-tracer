"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { motion } from "framer-motion";

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
 * ConfirmDialog — neumorphic dialog dengan animated icon dan pill buttons.
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

  const isDanger = variant === "danger";
  const iconClass = isDanger ? "ri-delete-bin-3-line" : "ri-question-line";
  const accentColor = isDanger ? "#E05555" : "var(--blue-soft)";

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className="sm:max-w-sm p-0 overflow-hidden"
        style={{
          background: "rgba(255,255,255,0.85)",
          backdropFilter: "blur(28px) saturate(1.5)",
          WebkitBackdropFilter: "blur(28px) saturate(1.5)",
          border: "1px solid rgba(255,255,255,0.95)",
          borderRadius: "1.25rem",
          boxShadow:
            "0 24px 70px rgba(11,25,87,0.18), 0 6px 24px rgba(11,25,87,0.08)",
        }}
      >
        <div className="p-7">
          <DialogHeader>
            {/* Animated icon bubble */}
            <motion.div
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="mb-4 inline-flex h-11 w-11 items-center justify-center"
              style={{
                background: "var(--paper-soft)",
                border: "1px solid var(--hairline)",
                borderRadius: "9999px",
                boxShadow:
                  "inset 2px 2px 4px rgba(11,25,87,0.04), inset -1px -1px 3px rgba(255,255,255,0.8)",
              }}
            >
              <i
                className={iconClass}
                style={{ fontSize: "1.25rem", color: accentColor }}
              />
            </motion.div>

            <DialogTitle
              className="font-display text-[1.15rem] font-normal tracking-tight"
              style={{ color: "var(--navy)" }}
            >
              {title}
            </DialogTitle>
            {description && (
              <DialogDescription
                className="font-display italic text-[0.88rem] leading-relaxed mt-2"
                style={{ color: "var(--ink-mid)" }}
              >
                {description}
              </DialogDescription>
            )}
          </DialogHeader>

          <DialogFooter className="mt-7 flex gap-2.5 sm:gap-3 p-0 bg-transparent border-0">
            <button
              type="button"
              onClick={onCancel}
              className="btn btn-ghost flex-1"
              style={{ padding: "0.7rem 1rem" }}
            >
              {batalLabel}
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className="btn flex-1"
              style={{
                padding: "0.7rem 1rem",
                background: isDanger ? "#E05555" : "var(--navy)",
                color: "var(--white)",
                boxShadow: isDanger
                  ? "0 4px 14px rgba(224,85,85,0.25)"
                  : "0 4px 14px rgba(11,25,87,0.25)",
              }}
            >
              {isDanger && (
                <i
                  className="ri-delete-bin-3-line"
                  style={{ fontSize: "0.95rem" }}
                />
              )}
              {konfirmasiLabel}
            </button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
