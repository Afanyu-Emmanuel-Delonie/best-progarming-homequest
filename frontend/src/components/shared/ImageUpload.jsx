import { useRef, useState } from "react"
import { UploadCloud, X } from "lucide-react"

/**
 * ImageUpload
 * Props:
 *   value    — File | null
 *   onChange — (File | null) => void
 *   error    — string | undefined
 */
export default function ImageUpload({ value, onChange, error }) {
  const inputRef          = useRef(null)
  const [dragging, setDragging] = useState(false)
  const preview = value ? URL.createObjectURL(value) : null

  const accept = (file) => {
    if (file && file.type.startsWith("image/")) onChange(file)
  }

  const onDrop = (e) => {
    e.preventDefault(); setDragging(false)
    accept(e.dataTransfer.files[0])
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
      <label style={{ fontSize: "0.72rem", fontWeight: 600, color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.04em" }}>
        Property Image
      </label>

      {preview ? (
        <div style={{ position: "relative", height: 180, borderRadius: "10px", overflow: "hidden", border: "1px solid var(--color-border)" }}>
          <img src={preview} alt="preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          <button
            onClick={() => onChange(null)}
            style={{ position: "absolute", top: "0.5rem", right: "0.5rem", width: 28, height: 28, borderRadius: "6px", border: "none", backgroundColor: "#00000080", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            <X size={14} />
          </button>
          <div style={{ position: "absolute", bottom: "0.5rem", left: "0.75rem", fontSize: "0.72rem", color: "#fff", backgroundColor: "#00000060", borderRadius: "4px", padding: "2px 8px" }}>
            {value.name}
          </div>
        </div>
      ) : (
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={e => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          style={{
            height: 140, borderRadius: "10px", border: `2px dashed ${dragging ? "var(--color-primary)" : "var(--color-border)"}`,
            backgroundColor: dragging ? "#FF4F0008" : "var(--color-bg-muted)",
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            gap: "0.5rem", cursor: "pointer", transition: "border-color 0.15s, background 0.15s",
          }}
        >
          <UploadCloud size={28} style={{ color: dragging ? "var(--color-primary)" : "var(--color-text-subtle)" }} />
          <p style={{ margin: 0, fontSize: "0.8125rem", color: "var(--color-text-muted)", fontWeight: 500 }}>
            Click or drag & drop to upload
          </p>
          <p style={{ margin: 0, fontSize: "0.72rem", color: "var(--color-text-subtle)" }}>
            PNG, JPG, WEBP — max 10 MB
          </p>
        </div>
      )}

      <input ref={inputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={e => accept(e.target.files[0])} />
      {error && <span style={{ fontSize: "0.72rem", color: "#B91C1C" }}>{error}</span>}
    </div>
  )
}
