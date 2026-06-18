import { useState, useMemo } from "react";
import { ChevronUp, ChevronDown, ChevronsUpDown, ChevronLeft, ChevronRight } from "lucide-react";

export interface Column<T> {
  key: keyof T | string;
  label: string;
  sortable?: boolean;
  width?: number | string;
  render?: (row: T) => React.ReactNode;
  align?: "left" | "center" | "right";
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  rowKey: keyof T;
  pageSize?: number;
  selectable?: boolean;
  onRowClick?: (row: T) => void;
  emptyMessage?: string;
  loading?: boolean;
}

export function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  rowKey,
  pageSize = 10,
  selectable = false,
  onRowClick,
  emptyMessage = "No hay registros",
  loading = false,
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Set<unknown>>(new Set());

  const sorted = useMemo(() => {
    if (!sortKey) return data;
    return [...data].sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      if (av === bv) return 0;
      const cmp = String(av) < String(bv) ? -1 : 1;
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [data, sortKey, sortDir]);

  const totalPages = Math.ceil(sorted.length / pageSize);
  const paged = sorted.slice((page - 1) * pageSize, page * pageSize);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir(d => d === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
    setPage(1);
  };

  const toggleAll = () => {
    if (selected.size === paged.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(paged.map(r => r[rowKey])));
    }
  };

  const toggleRow = (id: unknown) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelected(next);
  };

  if (loading) {
    return (
      <div style={{ background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 8, overflow: "hidden" }}>
        {[...Array(5)].map((_, i) => (
          <div key={i} style={{
            height: 52, borderBottom: "1px solid #F1F5F9",
            background: i % 2 === 0 ? "#FFFFFF" : "#FAFAFA",
            display: "flex", alignItems: "center", padding: "0 20px", gap: 16,
          }}>
            {columns.map((col, ci) => (
              <div key={ci} style={{
                flex: col.width ? `0 0 ${col.width}` : 1,
                height: 12, borderRadius: 4,
                background: "linear-gradient(90deg, #F1F5F9 25%, #E5E7EB 50%, #F1F5F9 75%)",
                backgroundSize: "200% 100%",
                animation: "shimmer 1.5s infinite",
              }} />
            ))}
          </div>
        ))}
        <style>{`@keyframes shimmer { 0% { background-position: -200% 0 } 100% { background-position: 200% 0 } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 8, overflow: "hidden", fontFamily: "Inter, sans-serif" }}>
      {/* Bulk action bar */}
      {selectable && selected.size > 0 && (
        <div style={{
          padding: "10px 20px",
          background: "#EFF6FF",
          borderBottom: "1px solid #BFDBFE",
          display: "flex", alignItems: "center", gap: 12,
          fontSize: 13,
        }}>
          <span style={{ fontWeight: 600, color: "#1D4ED8" }}>{selected.size} seleccionados</span>
          <button style={{
            padding: "4px 12px", borderRadius: 6, border: "1px solid #BFDBFE",
            background: "#FFFFFF", fontSize: 12, cursor: "pointer", color: "#F13540",
          }}>
            Eliminar selección
          </button>
          <button
            onClick={() => setSelected(new Set())}
            style={{
              padding: "4px 10px", borderRadius: 6, border: "none",
              background: "transparent", fontSize: 12, cursor: "pointer", color: "#475569",
            }}
          >
            Cancelar
          </button>
        </div>
      )}

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#F7F8FA", borderBottom: "1px solid #E5E7EB" }}>
              {selectable && (
                <th style={{ width: 44, padding: "10px 16px", textAlign: "center" }}>
                  <input
                    type="checkbox"
                    checked={paged.length > 0 && selected.size === paged.length}
                    onChange={toggleAll}
                    style={{ cursor: "pointer", accentColor: "#006CFE" }}
                  />
                </th>
              )}
              {columns.map(col => (
                <th
                  key={String(col.key)}
                  style={{
                    padding: "10px 16px",
                    textAlign: col.align || "left",
                    fontSize: 11,
                    fontWeight: 600,
                    color: "#94A3B8",
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    cursor: col.sortable ? "pointer" : "default",
                    userSelect: "none",
                    whiteSpace: "nowrap",
                    width: col.width,
                  }}
                  onClick={() => col.sortable && handleSort(String(col.key))}
                >
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                    {col.label}
                    {col.sortable && (
                      <span style={{ opacity: 0.5 }}>
                        {sortKey === String(col.key)
                          ? sortDir === "asc" ? <ChevronUp size={12} /> : <ChevronDown size={12} />
                          : <ChevronsUpDown size={12} />}
                      </span>
                    )}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paged.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (selectable ? 1 : 0)}
                  style={{ padding: "48px 20px", textAlign: "center", color: "#94A3B8", fontSize: 13 }}
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              paged.map((row, ri) => {
                const id = row[rowKey];
                const isSelected = selected.has(id);
                return (
                  <tr
                    key={String(id)}
                    onClick={() => onRowClick?.(row)}
                    style={{
                      borderBottom: ri < paged.length - 1 ? "1px solid #F1F5F9" : "none",
                      background: isSelected ? "#F0F7FF" : "#FFFFFF",
                      cursor: onRowClick ? "pointer" : "default",
                      transition: "background 0.08s",
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) (e.currentTarget as HTMLElement).style.background = "#F7F8FA";
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) (e.currentTarget as HTMLElement).style.background = "#FFFFFF";
                    }}
                  >
                    {selectable && (
                      <td style={{ padding: "12px 16px", textAlign: "center" }} onClick={e => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleRow(id)}
                          style={{ cursor: "pointer", accentColor: "#006CFE" }}
                        />
                      </td>
                    )}
                    {columns.map(col => (
                      <td
                        key={String(col.key)}
                        style={{
                          padding: "12px 16px",
                          fontSize: 13,
                          color: "#0F172A",
                          textAlign: col.align || "left",
                          verticalAlign: "middle",
                        }}
                      >
                        {col.render
                          ? col.render(row)
                          : String(row[String(col.key)] ?? "—")}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "12px 20px",
          borderTop: "1px solid #E5E7EB",
          fontSize: 12, color: "#475569",
        }}>
          <span>
            Mostrando {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, sorted.length)} de {sorted.length}
          </span>
          <div style={{ display: "flex", gap: 4 }}>
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              style={{
                width: 28, height: 28, borderRadius: 6,
                border: "1px solid #E5E7EB", background: "#FFFFFF",
                cursor: page === 1 ? "not-allowed" : "pointer",
                opacity: page === 1 ? 0.4 : 1,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              <ChevronLeft size={14} />
            </button>
            {[...Array(Math.min(5, totalPages))].map((_, i) => {
              const p = i + 1;
              return (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  style={{
                    width: 28, height: 28, borderRadius: 6,
                    border: `1px solid ${page === p ? "#006CFE" : "#E5E7EB"}`,
                    background: page === p ? "#006CFE" : "#FFFFFF",
                    color: page === p ? "#FFFFFF" : "#475569",
                    cursor: "pointer",
                    fontSize: 12, fontWeight: page === p ? 600 : 400,
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}
                >
                  {p}
                </button>
              );
            })}
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              style={{
                width: 28, height: 28, borderRadius: 6,
                border: "1px solid #E5E7EB", background: "#FFFFFF",
                cursor: page === totalPages ? "not-allowed" : "pointer",
                opacity: page === totalPages ? 0.4 : 1,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
