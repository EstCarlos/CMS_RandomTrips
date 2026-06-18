import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface KPICardProps {
  label: string;
  value: string;
  delta?: number;
  deltaLabel?: string;
  icon: React.ReactNode;
  iconBg?: string;
  prefix?: string;
  suffix?: string;
}

export function KPICard({ label, value, delta, deltaLabel = "vs mes anterior", icon, iconBg = "#EFF6FF", prefix, suffix }: KPICardProps) {
  const isPositive = delta !== undefined && delta > 0;
  const isNegative = delta !== undefined && delta < 0;
  const isNeutral = delta === 0;

  return (
    <div style={{
      background: "#FFFFFF",
      border: "1px solid #E5E7EB",
      borderRadius: 8,
      padding: "20px 24px",
      display: "flex",
      flexDirection: "column",
      gap: 12,
      boxShadow: "0 1px 3px rgba(0,0,0,.05)",
      fontFamily: "Inter, sans-serif",
    }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontSize: 12, color: "#475569", fontWeight: 500, marginBottom: 4 }}>{label}</div>
          <div style={{
            fontSize: 28,
            fontWeight: 700,
            color: "#0F172A",
            lineHeight: 1.1,
            fontVariantNumeric: "tabular-nums",
            letterSpacing: "-0.02em",
          }}>
            {prefix && <span style={{ fontSize: 16, fontWeight: 500 }}>{prefix}</span>}
            {value}
            {suffix && <span style={{ fontSize: 14, fontWeight: 500, color: "#475569", marginLeft: 2 }}>{suffix}</span>}
          </div>
        </div>
        <div style={{
          width: 40, height: 40, borderRadius: 8,
          background: iconBg,
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0,
        }}>
          {icon}
        </div>
      </div>

      {delta !== undefined && (
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 3,
            fontSize: 11, fontWeight: 600,
            color: isPositive ? "#16A34A" : isNegative ? "#F13540" : "#94A3B8",
          }}>
            {isPositive ? <TrendingUp size={12} /> : isNegative ? <TrendingDown size={12} /> : <Minus size={12} />}
            {isPositive ? "+" : ""}{delta}%
          </span>
          <span style={{ fontSize: 11, color: "#94A3B8" }}>{deltaLabel}</span>
        </div>
      )}
    </div>
  );
}
