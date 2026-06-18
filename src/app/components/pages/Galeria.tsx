import { useState } from "react";
import { Upload, Search, X, Trash2, Tag, Check, Image } from "lucide-react";
import { FormField } from "../ui/FormField";
import { MEDIA_ASSETS } from "../../data/realData";

type Asset = typeof MEDIA_ASSETS[0];

const ASSOC_LABELS: Record<string, string> = {
  tour: "Tour", destino: "Destino", experiencia: "Experiencia", "sin-asociar": "Sin asociar",
};

/* ── Confirm delete ───────────────────────────────────── */
function ConfirmDeleteModal({ count, onConfirm, onClose }: { count: number; onConfirm: () => void; onClose: () => void }) {
  const [typed, setTyped] = useState("");
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 300, display: "flex", alignItems: "center", justifyContent: "center" }} onClick={onClose}>
      <div style={{ position: "absolute", inset: 0, background: "rgba(15,23,42,.5)" }} />
      <div style={{ position: "relative", background: "#FFFFFF", borderRadius: 8, padding: "24px", width: 400, boxShadow: "0 20px 60px rgba(0,0,0,.2)", fontFamily: "Inter, sans-serif" }} onClick={e => e.stopPropagation()}>
        <div style={{ width: 44, height: 44, borderRadius: 12, background: "#FEF2F2", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
          <Trash2 size={20} color="#F13540" />
        </div>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: "#0F172A", margin: "0 0 6px" }}>Eliminar {count} archivo{count > 1 ? "s" : ""}</h3>
        <p style={{ fontSize: 13, color: "#475569", margin: "0 0 16px", lineHeight: 1.5 }}>
          Esta acción no se puede deshacer. Escribe <strong>ELIMINAR</strong> para confirmar.
        </p>
        <input value={typed} onChange={e => setTyped(e.target.value)} placeholder="ELIMINAR"
          style={{ width: "100%", padding: "8px 12px", border: `1px solid ${typed === "ELIMINAR" ? "#F13540" : "#E5E7EB"}`, borderRadius: 6, fontSize: 13, outline: "none", fontFamily: "Inter, sans-serif", boxSizing: "border-box", marginBottom: 16 }} />
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <button onClick={onClose} style={{ padding: "8px 16px", borderRadius: 6, border: "1px solid #E5E7EB", background: "#FFFFFF", cursor: "pointer", fontSize: 13 }}>Cancelar</button>
          <button onClick={() => { if (typed === "ELIMINAR") { onConfirm(); onClose(); } }}
            disabled={typed !== "ELIMINAR"}
            style={{ padding: "8px 16px", borderRadius: 6, border: "none", background: typed === "ELIMINAR" ? "#F13540" : "#E5E7EB", color: typed === "ELIMINAR" ? "#FFFFFF" : "#94A3B8", cursor: typed === "ELIMINAR" ? "pointer" : "not-allowed", fontSize: 13, fontWeight: 600 }}>
            Eliminar definitivamente
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Asset Drawer ─────────────────────────────────────── */
function AssetDrawer({ asset, onClose }: { asset: Asset; onClose: () => void }) {
  const [altES, setAltES] = useState(asset.altES);
  const [altEN, setAltEN] = useState(asset.altEN);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <>
      {showConfirm && <ConfirmDeleteModal count={1} onConfirm={() => { setShowConfirm(false); onClose(); }} onClose={() => setShowConfirm(false)} />}
      <div style={{ position: "fixed", inset: 0, zIndex: 200, display: "flex", justifyContent: "flex-end" }}>
        <div style={{ position: "absolute", inset: 0, background: "rgba(15,23,42,.3)" }} onClick={onClose} />
        <div style={{ position: "relative", width: 380, background: "#FFFFFF", boxShadow: "-8px 0 32px rgba(0,0,0,.12)", display: "flex", flexDirection: "column", fontFamily: "Inter, sans-serif" }}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid #E5E7EB", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: "#0F172A" }}>Detalle del archivo</span>
            <button onClick={onClose} style={{ border: "1px solid #E5E7EB", background: "#FFFFFF", borderRadius: 6, width: 28, height: 28, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <X size={13} color="#94A3B8" />
            </button>
          </div>
          <div style={{ flex: 1, overflowY: "auto", padding: "16px" }}>
            {/* Preview */}
            <div style={{ height: 180, borderRadius: 8, overflow: "hidden", marginBottom: 16, background: asset.color }}>
              {asset.url ? (
                <img src={asset.url} alt={asset.altES} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8 }}>
                  <span style={{ fontSize: 48 }}>{asset.emoji}</span>
                  <span style={{ fontSize: 11, color: "#475569" }}>{asset.altES}</span>
                </div>
              )}
            </div>

            {/* Meta */}
            <div style={{ background: "#F7F8FA", borderRadius: 6, padding: "10px 12px", marginBottom: 16, fontSize: 12 }}>
              <div style={{ fontWeight: 600, color: "#0F172A", marginBottom: 6, wordBreak: "break-all" }}>{asset.nombre}</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, color: "#475569" }}>
                {asset.dimensiones !== "—" && <span>📐 {asset.dimensiones}</span>}
                {asset.peso !== "—" && <span>📦 {asset.peso}</span>}
                <span>📅 {asset.subido}</span>
                <span style={{ textTransform: "capitalize" }}>🏷️ {asset.tipo}</span>
              </div>
            </div>

            {/* Alt texts */}
            <FormField label="Alt text ES" helper="SEO y accesibilidad">
              <textarea value={altES} onChange={e => setAltES(e.target.value)} rows={2}
                style={{ width: "100%", padding: "8px 10px", border: "1px solid #E5E7EB", borderRadius: 6, fontSize: 12, outline: "none", resize: "none", fontFamily: "Inter, sans-serif", boxSizing: "border-box" }} />
            </FormField>
            <div style={{ marginTop: 10 }}>
              <FormField label="Alt text EN">
                <textarea value={altEN} onChange={e => setAltEN(e.target.value)} rows={2}
                  style={{ width: "100%", padding: "8px 10px", border: "1px solid #E5E7EB", borderRadius: 6, fontSize: 12, outline: "none", resize: "none", fontFamily: "Inter, sans-serif", boxSizing: "border-box" }} />
              </FormField>
            </div>

            <div style={{ marginTop: 14 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "#0F172A", marginBottom: 6 }}>Asociación</div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 12px", background: "#F7F8FA", borderRadius: 6, border: "1px solid #E5E7EB" }}>
                <Tag size={13} color="#94A3B8" />
                <span style={{ fontSize: 12, color: "#475569" }}>{ASSOC_LABELS[asset.asociacion]}: <strong>{asset.asociadoA}</strong></span>
              </div>
            </div>

            <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 8 }}>
              <button style={{ width: "100%", padding: "8px", borderRadius: 6, border: "1px solid #E5E7EB", background: "#FFFFFF", fontSize: 13, color: "#475569", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                <Upload size={13} /> Reemplazar archivo
              </button>
              <button onClick={() => setShowConfirm(true)} style={{ width: "100%", padding: "8px", borderRadius: 6, border: "1px solid #FEE2E2", background: "#FEF2F2", fontSize: 13, color: "#F13540", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                <Trash2 size={13} /> Eliminar archivo
              </button>
            </div>
          </div>
          <div style={{ padding: "14px 16px", borderTop: "1px solid #E5E7EB" }}>
            <button style={{ width: "100%", padding: "9px", borderRadius: 6, border: "none", background: "#006CFE", color: "#FFFFFF", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
              Guardar cambios
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

/* ── Upload zone ──────────────────────────────────────── */
function UploadZone({ onClose }: { onClose: () => void }) {
  const [dragging, setDragging] = useState(false);
  const [files, setFiles]       = useState<string[]>([]);
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center" }} onClick={onClose}>
      <div style={{ position: "absolute", inset: 0, background: "rgba(15,23,42,.4)" }} />
      <div style={{ position: "relative", width: 540, background: "#FFFFFF", borderRadius: 8, padding: "24px", boxShadow: "0 20px 60px rgba(0,0,0,.2)", fontFamily: "Inter, sans-serif" }} onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <span style={{ fontSize: 15, fontWeight: 700, color: "#0F172A" }}>Subir archivos</span>
          <button onClick={onClose} style={{ border: "1px solid #E5E7EB", background: "#FFFFFF", borderRadius: 6, width: 28, height: 28, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <X size={13} color="#94A3B8" />
          </button>
        </div>
        <div
          onDragOver={e => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={e => { e.preventDefault(); setDragging(false); setFiles(prev => [...prev, ...Array.from(e.dataTransfer.files).map(f => f.name)]); }}
          style={{ border: `2px dashed ${dragging ? "#006CFE" : "#CBD5E1"}`, borderRadius: 8, padding: "40px", textAlign: "center", background: dragging ? "#EFF6FF" : "#F7F8FA", transition: "all 0.15s", marginBottom: 16 }}>
          <Upload size={32} color={dragging ? "#006CFE" : "#CBD5E1"} style={{ margin: "0 auto 12px" }} />
          <div style={{ fontSize: 14, fontWeight: 600, color: "#0F172A", marginBottom: 4 }}>{dragging ? "Suelta los archivos aquí" : "Arrastra tus archivos aquí"}</div>
          <div style={{ fontSize: 12, color: "#94A3B8", marginBottom: 12 }}>JPG, PNG, WebP, MP4 · Máx. 100MB</div>
          <button style={{ padding: "7px 16px", borderRadius: 6, border: "none", background: "#006CFE", color: "#FFFFFF", fontSize: 13, cursor: "pointer" }}>Seleccionar archivos</button>
        </div>
        {files.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 16 }}>
            {files.map((f, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", background: "#F0FDF4", borderRadius: 6, border: "1px solid #86EFAC" }}>
                <Check size={13} color="#16A34A" /><span style={{ fontSize: 12, flex: 1 }}>{f}</span>
                <button onClick={() => setFiles(prev => prev.filter((_, j) => j !== i))} style={{ border: "none", background: "transparent", cursor: "pointer" }}><X size={11} color="#94A3B8" /></button>
              </div>
            ))}
          </div>
        )}
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <button onClick={onClose} style={{ padding: "8px 16px", borderRadius: 6, border: "1px solid #E5E7EB", background: "#FFFFFF", cursor: "pointer", fontSize: 13 }}>Cancelar</button>
          <button onClick={onClose} style={{ padding: "8px 16px", borderRadius: 6, border: "none", background: "#006CFE", color: "#FFFFFF", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
            Subir {files.length > 0 ? `${files.length} archivo${files.length > 1 ? "s" : ""}` : "archivos"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Main Galeria ─────────────────────────────────────── */
export function Galeria() {
  const [search, setSearch]         = useState("");
  const [filterTipo, setFilterTipo] = useState("");
  const [selected, setSelected]     = useState<Set<string>>(new Set());
  const [activeAsset, setActiveAsset] = useState<Asset | null>(null);
  const [showUpload, setShowUpload] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const filtered = MEDIA_ASSETS.filter(a => {
    const q = search.toLowerCase();
    return (!q || a.nombre.toLowerCase().includes(q) || a.altES.toLowerCase().includes(q) || a.asociadoA.toLowerCase().includes(q))
      && (!filterTipo || a.tipo === filterTipo);
  });

  const toggleSel  = (id: string) => { const n = new Set(selected); n.has(id) ? n.delete(id) : n.add(id); setSelected(n); };
  const someChecked = selected.size > 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20, fontFamily: "Inter, sans-serif" }}>
      {showUpload   && <UploadZone onClose={() => setShowUpload(false)} />}
      {showConfirm  && <ConfirmDeleteModal count={selected.size} onConfirm={() => setSelected(new Set())} onClose={() => setShowConfirm(false)} />}
      {activeAsset  && <AssetDrawer asset={activeAsset} onClose={() => setActiveAsset(null)} />}

      {/* Toolbar */}
      <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, border: "1px solid #E5E7EB", borderRadius: 6, padding: "6px 12px", background: "#FFFFFF", flex: 1, minWidth: 200 }}>
          <Search size={14} color="#94A3B8" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar por nombre o alt text..."
            style={{ border: "none", outline: "none", fontSize: 13, color: "#0F172A", background: "transparent", width: "100%" }} />
        </div>
        <select value={filterTipo} onChange={e => setFilterTipo(e.target.value)}
          style={{ padding: "6px 12px", border: `1px solid ${filterTipo ? "#006CFE" : "#E5E7EB"}`, borderRadius: 6, fontSize: 13, background: filterTipo ? "#EFF6FF" : "#FFFFFF", color: filterTipo ? "#006CFE" : "#475569", outline: "none", cursor: "pointer" }}>
          <option value="">Tipo</option>
          <option value="foto">📷 Fotos</option>
          <option value="video">🎬 Videos</option>
        </select>
        {(search || filterTipo) && (
          <button onClick={() => { setSearch(""); setFilterTipo(""); }} style={{ padding: "6px 10px", borderRadius: 6, border: "1px solid #E5E7EB", background: "#FFFFFF", fontSize: 12, color: "#94A3B8", cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
            <X size={11} /> Limpiar
          </button>
        )}
        <button onClick={() => setShowUpload(true)}
          style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 6, border: "none", background: "#006CFE", fontSize: 13, color: "#FFFFFF", cursor: "pointer", fontWeight: 500, marginLeft: "auto" }}>
          <Upload size={14} /> Subir
        </button>
      </div>

      {/* Bulk bar */}
      {someChecked && (
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 16px", background: "#EFF6FF", border: "1px solid #BFDBFE", borderRadius: 8, fontSize: 13 }}>
          <span style={{ fontWeight: 600, color: "#1D4ED8" }}>{selected.size} seleccionados</span>
          <button style={{ display: "flex", alignItems: "center", gap: 5, padding: "4px 12px", borderRadius: 6, border: "1px solid #BFDBFE", background: "#FFFFFF", fontSize: 12, cursor: "pointer", color: "#475569" }}>
            <Tag size={11} /> Asociar
          </button>
          <button onClick={() => setShowConfirm(true)} style={{ display: "flex", alignItems: "center", gap: 5, padding: "4px 12px", borderRadius: 6, border: "1px solid #FCA5A5", background: "#FEF2F2", fontSize: 12, cursor: "pointer", color: "#F13540" }}>
            <Trash2 size={11} /> Eliminar
          </button>
          <button onClick={() => setSelected(new Set())} style={{ marginLeft: "auto", border: "none", background: "transparent", fontSize: 12, color: "#94A3B8", cursor: "pointer" }}>Cancelar</button>
        </div>
      )}

      <div style={{ fontSize: 12, color: "#94A3B8" }}>{filtered.length} archivos · {filtered.filter(a => !!a.url).length} con URL real · {filtered.filter(a => !a.url).length} pendientes de subir</div>

      {/* Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12 }}>
        {filtered.map(a => {
          const isSel = selected.has(a.id);
          return (
            <div key={a.id}
              style={{ position: "relative", borderRadius: 8, overflow: "hidden", border: `2px solid ${isSel ? "#006CFE" : "transparent"}`, cursor: "pointer", background: "#FFFFFF", boxShadow: "0 1px 4px rgba(0,0,0,.08)", transition: "transform 0.1s, box-shadow 0.1s" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 16px rgba(0,0,0,.12)"; (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = "0 1px 4px rgba(0,0,0,.08)"; (e.currentTarget as HTMLElement).style.transform = "none"; }}
            >
              <div style={{ position: "absolute", top: 8, left: 8, zIndex: 2 }} onClick={ev => { ev.stopPropagation(); toggleSel(a.id); }}>
                <div style={{ width: 18, height: 18, borderRadius: 4, border: `2px solid ${isSel ? "#006CFE" : "rgba(255,255,255,.8)"}`, background: isSel ? "#006CFE" : "rgba(255,255,255,.6)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {isSel && <Check size={10} color="#FFFFFF" />}
                </div>
              </div>
              {!a.url && (
                <div style={{ position: "absolute", top: 8, right: 8, zIndex: 2, background: "rgba(0,0,0,.5)", color: "#FFFFFF", fontSize: 9, padding: "2px 5px", borderRadius: 4 }}>PENDIENTE</div>
              )}
              <div onClick={() => setActiveAsset(a)}
                style={{ height: 130, background: a.color, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                {a.url ? (
                  <img src={a.url} alt={a.altES} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <span style={{ fontSize: 40 }}>{a.emoji}</span>
                )}
              </div>
              <div style={{ padding: "8px 10px" }}>
                <div style={{ fontSize: 11, fontWeight: 500, color: "#0F172A", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.nombre}</div>
                <div style={{ fontSize: 10, color: "#94A3B8", marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.altES}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
