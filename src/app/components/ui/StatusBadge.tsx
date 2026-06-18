interface StatusBadgeProps {
  variant: "success" | "warning" | "danger" | "neutral" | "info" | "primary";
  label: string;
  dot?: boolean;
}

const variants = {
  success: { bg: "#DCFCE7", color: "#15803D", dot: "#16A34A" },
  warning: { bg: "#FFFBEB", color: "#92400E", dot: "#FEDA40" },
  danger: { bg: "#FEF2F2", color: "#B91C1C", dot: "#F13540" },
  neutral: { bg: "#F1F5F9", color: "#475569", dot: "#94A3B8" },
  info: { bg: "#E0F2FE", color: "#0369A1", dot: "#88D1F2" },
  primary: { bg: "#EFF6FF", color: "#1D4ED8", dot: "#006CFE" },
};

export function StatusBadge({ variant, label, dot = true }: StatusBadgeProps) {
  const v = variants[variant];
  return (
    <span style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 5,
      padding: "2px 8px",
      borderRadius: 20,
      background: v.bg,
      fontSize: 11,
      fontWeight: 600,
      color: v.color,
      letterSpacing: "0.01em",
      whiteSpace: "nowrap",
      fontFamily: "Inter, sans-serif",
    }}>
      {dot && (
        <span style={{
          width: 6, height: 6, borderRadius: "50%",
          background: v.dot, flexShrink: 0,
        }} />
      )}
      {label}
    </span>
  );
}
