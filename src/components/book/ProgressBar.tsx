"use client";

export interface ProgressBarProps {
  value: number;
  label?: string;
  className?: string;
}

/**
 * Progress bar halus dengan gradient fill biru→pink.
 */
export function ProgressBar({ value, label, className = "" }: ProgressBarProps) {
  const v = Math.max(0, Math.min(100, Math.round(value)));
  return (
    <div className={`w-full ${className}`}>
      {label !== undefined && (
        <div
          className="mb-1.5 flex items-center justify-between"
          style={{ fontSize: "0.68rem", fontWeight: 600, color: "var(--ink-mid)" }}
        >
          <span>Progress</span>
          <span style={{ color: "var(--blue-soft)", fontWeight: 700 }}>{v}%</span>
        </div>
      )}
      <div
        role="progressbar"
        aria-valuenow={v}
        aria-valuemin={0}
        aria-valuemax={100}
        style={{
          height: "6px",
          borderRadius: "9999px",
          background: "rgba(87,132,230,0.12)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${v}%`,
            borderRadius: "9999px",
            background: "linear-gradient(90deg, var(--blue-soft), var(--pink-hot))",
            transition: "width 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)",
          }}
        />
      </div>
    </div>
  );
}