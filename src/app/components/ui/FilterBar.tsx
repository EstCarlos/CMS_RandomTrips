import { Search, X, SlidersHorizontal } from "lucide-react";
import { useState } from "react";

interface FilterOption {
  key: string;
  label: string;
  type: "select" | "text" | "date-range";
  options?: { value: string; label: string }[];
}

interface FilterBarProps {
  filters: FilterOption[];
  values: Record<string, string>;
  onChange: (key: string, value: string) => void;
  onClear: () => void;
  searchPlaceholder?: string;
  onSearch?: (query: string) => void;
  searchValue?: string;
}

export function FilterBar({ filters, values, onChange, onClear, searchPlaceholder = "Buscar...", onSearch, searchValue = "" }: FilterBarProps) {
  const hasActiveFilters = Object.values(values).some(v => v !== "") || searchValue !== "";

  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: 8,
      flexWrap: "wrap",
      fontFamily: "Inter, sans-serif",
    }}>
      {/* Search */}
      {onSearch !== undefined && (
        <div style={{
          display: "flex", alignItems: "center", gap: 6,
          border: "1px solid #E5E7EB",
          borderRadius: 6,
          padding: "6px 12px",
          background: "#FFFFFF",
          minWidth: 200,
        }}>
          <Search size={14} color="#94A3B8" />
          <input
            value={searchValue}
            onChange={e => onSearch(e.target.value)}
            placeholder={searchPlaceholder}
            style={{
              border: "none", outline: "none",
              fontSize: 13, color: "#0F172A",
              background: "transparent", width: "100%",
            }}
          />
          {searchValue && (
            <button onClick={() => onSearch("")} style={{ border: "none", background: "transparent", cursor: "pointer", padding: 0 }}>
              <X size={12} color="#94A3B8" />
            </button>
          )}
        </div>
      )}

      {/* Filter selects */}
      {filters.map(f => (
        <div key={f.key} style={{ position: "relative" }}>
          {f.type === "select" && f.options && (
            <select
              value={values[f.key] || ""}
              onChange={e => onChange(f.key, e.target.value)}
              style={{
                border: `1px solid ${values[f.key] ? "#006CFE" : "#E5E7EB"}`,
                borderRadius: 6,
                padding: "6px 28px 6px 12px",
                fontSize: 13,
                color: values[f.key] ? "#006CFE" : "#475569",
                background: values[f.key] ? "#EFF6FF" : "#FFFFFF",
                cursor: "pointer",
                outline: "none",
                appearance: "none",
                fontFamily: "Inter, sans-serif",
                fontWeight: values[f.key] ? 600 : 400,
              }}
            >
              <option value="">{f.label}</option>
              {f.options.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          )}
          {f.type === "text" && (
            <input
              value={values[f.key] || ""}
              onChange={e => onChange(f.key, e.target.value)}
              placeholder={f.label}
              style={{
                border: `1px solid ${values[f.key] ? "#006CFE" : "#E5E7EB"}`,
                borderRadius: 6,
                padding: "6px 12px",
                fontSize: 13,
                color: "#0F172A",
                background: "#FFFFFF",
                outline: "none",
                fontFamily: "Inter, sans-serif",
              }}
            />
          )}
        </div>
      ))}

      {/* Clear filters */}
      {hasActiveFilters && (
        <button
          onClick={onClear}
          style={{
            display: "flex", alignItems: "center", gap: 4,
            padding: "6px 10px",
            borderRadius: 6,
            border: "1px solid #E5E7EB",
            background: "#FFFFFF",
            fontSize: 12, color: "#475569",
            cursor: "pointer",
          }}
        >
          <X size={12} />
          Limpiar filtros
        </button>
      )}
    </div>
  );
}
