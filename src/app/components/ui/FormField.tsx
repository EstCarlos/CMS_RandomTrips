import { useState } from "react";

interface FormFieldProps {
  label: string;
  required?: boolean;
  helper?: string;
  error?: string;
  children: React.ReactNode;
}

export function FormField({ label, required, helper, error, children }: FormFieldProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4, fontFamily: "Inter, sans-serif" }}>
      <label style={{ fontSize: 12, fontWeight: 600, color: "#0F172A" }}>
        {label}
        {required && <span style={{ color: "#F13540", marginLeft: 2 }}>*</span>}
      </label>
      <div>{children}</div>
      {error && <p style={{ fontSize: 11, color: "#F13540", margin: 0 }}>{error}</p>}
      {!error && helper && <p style={{ fontSize: 11, color: "#94A3B8", margin: 0 }}>{helper}</p>}
    </div>
  );
}

interface InputProps {
  value?: string;
  onChange?: (v: string) => void;
  placeholder?: string;
  type?: string;
  error?: boolean;
  disabled?: boolean;
}

export function Input({ value, onChange, placeholder, type = "text", error, disabled }: InputProps) {
  const [focused, setFocused] = useState(false);
  return (
    <input
      type={type}
      value={value}
      onChange={e => onChange?.(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{
        width: "100%",
        padding: "8px 12px",
        borderRadius: 6,
        border: `1px solid ${error ? "#F13540" : focused ? "#006CFE" : "#E5E7EB"}`,
        fontSize: 13,
        color: "#0F172A",
        background: disabled ? "#F7F8FA" : "#FFFFFF",
        outline: "none",
        fontFamily: "Inter, sans-serif",
        boxSizing: "border-box",
      }}
    />
  );
}

interface TextareaProps {
  value?: string;
  onChange?: (v: string) => void;
  placeholder?: string;
  rows?: number;
  error?: boolean;
}

export function Textarea({ value, onChange, placeholder, rows = 4, error }: TextareaProps) {
  const [focused, setFocused] = useState(false);
  return (
    <textarea
      value={value}
      onChange={e => onChange?.(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{
        width: "100%",
        padding: "8px 12px",
        borderRadius: 6,
        border: `1px solid ${error ? "#F13540" : focused ? "#006CFE" : "#E5E7EB"}`,
        fontSize: 13,
        color: "#0F172A",
        background: "#FFFFFF",
        outline: "none",
        fontFamily: "Inter, sans-serif",
        resize: "vertical",
        boxSizing: "border-box",
      }}
    />
  );
}

interface SelectFieldProps {
  value?: string;
  onChange?: (v: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
  error?: boolean;
}

export function SelectField({ value, onChange, options, placeholder = "Seleccionar...", error }: SelectFieldProps) {
  const [focused, setFocused] = useState(false);
  return (
    <select
      value={value}
      onChange={e => onChange?.(e.target.value)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{
        width: "100%",
        padding: "8px 12px",
        borderRadius: 6,
        border: `1px solid ${error ? "#F13540" : focused ? "#006CFE" : "#E5E7EB"}`,
        fontSize: 13,
        color: value ? "#0F172A" : "#94A3B8",
        background: "#FFFFFF",
        outline: "none",
        fontFamily: "Inter, sans-serif",
        appearance: "none",
        boxSizing: "border-box",
        cursor: "pointer",
      }}
    >
      <option value="">{placeholder}</option>
      {options.map(o => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  );
}

interface BilingualFieldProps {
  labelES?: string;
  labelEN?: string;
  valueES?: string;
  valueEN?: string;
  onChangeES?: (v: string) => void;
  onChangeEN?: (v: string) => void;
  multiline?: boolean;
  rows?: number;
  placeholder?: string;
}

export function BilingualField({
  labelES = "Español",
  labelEN = "English",
  valueES = "",
  valueEN = "",
  onChangeES,
  onChangeEN,
  multiline = false,
  rows = 3,
  placeholder = "",
}: BilingualFieldProps) {
  const [tab, setTab] = useState<"es" | "en">("es");

  const tabStyle = (active: boolean): React.CSSProperties => ({
    padding: "5px 12px",
    borderRadius: "6px 6px 0 0",
    border: "none",
    background: active ? "#FFFFFF" : "transparent",
    borderBottom: active ? "2px solid #006CFE" : "2px solid transparent",
    fontSize: 12,
    fontWeight: active ? 600 : 400,
    color: active ? "#006CFE" : "#94A3B8",
    cursor: "pointer",
    fontFamily: "Inter, sans-serif",
  });

  return (
    <div style={{ border: "1px solid #E5E7EB", borderRadius: 6, overflow: "hidden" }}>
      <div style={{ display: "flex", background: "#F7F8FA", borderBottom: "1px solid #E5E7EB", padding: "4px 8px 0" }}>
        <button style={tabStyle(tab === "es")} onClick={() => setTab("es")}>🇩🇴 {labelES}</button>
        <button style={tabStyle(tab === "en")} onClick={() => setTab("en")}>🇺🇸 {labelEN}</button>
      </div>
      <div style={{ padding: 8 }}>
        {multiline ? (
          <Textarea
            value={tab === "es" ? valueES : valueEN}
            onChange={tab === "es" ? onChangeES : onChangeEN}
            placeholder={placeholder}
            rows={rows}
          />
        ) : (
          <Input
            value={tab === "es" ? valueES : valueEN}
            onChange={tab === "es" ? onChangeES : onChangeEN}
            placeholder={placeholder}
          />
        )}
      </div>
    </div>
  );
}
