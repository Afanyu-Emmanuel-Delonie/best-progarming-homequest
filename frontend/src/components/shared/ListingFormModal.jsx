import { useState } from "react"
import { X, Home, Loader2 } from "lucide-react"
import { PROPERTY_TYPE_LABELS, PROPERTY_STATUS } from "../../constants/enums"
import { useLocationPicker } from "../../hooks/useLocation"
import LocationFields from "./LocationFields"
import ImageUpload from "./ImageUpload"
import { propertiesApi } from "../../api/properties.api"
import { toast } from "react-toastify"

const EMPTY = {
  title: "", address: "",
  price: "", type: "APARTMENT", status: "AVAILABLE",
  bedrooms: "", bathrooms: "", areaSqm: "", description: "",
}

const inputStyle = {
  padding: "0.55rem 0.85rem", borderRadius: "8px", border: "1px solid var(--color-border)",
  backgroundColor: "var(--color-bg-muted)", fontSize: "0.875rem", color: "var(--color-text)",
  outline: "none", fontFamily: "inherit", width: "100%", boxSizing: "border-box",
}

function Field({ label, error, children }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
      <label style={{ fontSize: "0.72rem", fontWeight: 600, color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.04em" }}>{label}</label>
      {children}
      {error && <span style={{ fontSize: "0.72rem", color: "#B91C1C" }}>{error}</span>}
    </div>
  )
}

export default function ListingFormModal({ onClose, onSubmit, initial }) {
  const [form, setForm]     = useState(initial ?? EMPTY)
  const [image, setImage]   = useState(null)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const { location, provinces, districts, sectors, cells, villages, pick } = useLocationPicker()

  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setErrors(e => ({ ...e, [k]: "" })) }

  const validate = () => {
    const e = {}
    if (!form.title.trim())       e.title       = "Required"
    if (!form.description.trim()) e.description = "Required"
    if (!form.address.trim())     e.address     = "Required"
    if (!location.provinceCode)   e.province    = "Required"
    if (!location.districtCode)   e.district    = "Required"
    if (!location.cellCode)       e.cell        = "Required"
    if (!location.villageCode)    e.village     = "Required"
    if (!form.price || isNaN(Number(form.price)) || Number(form.price) <= 0) e.price = "Enter a valid price"
    if (form.bathrooms === "" || isNaN(Number(form.bathrooms))) e.bathrooms = "Required"
    if (form.areaSqm   === "" || isNaN(Number(form.areaSqm)))  e.areaSqm   = "Required"
    return e
  }

  const handleSubmit = async () => {
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    setLoading(true)
    try {
      const payload = {
        title:       form.title,
        description: form.description,
        address:     form.address,
        city:        location.districtName ?? "",
        country:     "Rwanda",
        price:       Number(form.price),
        type:        form.type,
        bedrooms:    Number(form.bedrooms)  || 0,
        bathrooms:   Number(form.bathrooms),
        areaSqm:     Number(form.areaSqm),
        ownerPublicId: form.ownerPublicId ?? null,
      }
      const created = await propertiesApi.create(payload)
      toast.success("Listing created successfully")
      onSubmit(created)
    } catch (err) {
      toast.error(err.message ?? "Failed to create listing")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, backgroundColor: "#00000050", zIndex: 80 }} />
      <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: "min(580px, calc(100vw - 2rem))", maxHeight: "90vh", backgroundColor: "var(--color-surface)", borderRadius: "16px", boxShadow: "0 24px 64px #00000030", zIndex: 90, display: "flex", flexDirection: "column", overflow: "hidden" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1.25rem 1.5rem", borderBottom: "1px solid var(--color-border)", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
            <div style={{ width: 36, height: 36, borderRadius: "9px", backgroundColor: "#FF4F0015", color: "var(--color-primary)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Home size={17} />
            </div>
            <div>
              <p style={{ margin: 0, fontWeight: 700, fontSize: "0.9375rem", color: "var(--color-text)" }}>New Listing</p>
              <p style={{ margin: 0, fontSize: "0.75rem", color: "var(--color-text-muted)" }}>Fill in the property details</p>
            </div>
          </div>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: "7px", border: "1px solid var(--color-border)", background: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-text-muted)" }}>
            <X size={15} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: "1.5rem", overflowY: "auto", display: "flex", flexDirection: "column", gap: "1.25rem" }}>

          {/* Basic */}
          <Field label="Title" error={errors.title}>
            <input style={inputStyle} value={form.title} onChange={e => set("title", e.target.value)} placeholder="Modern Downtown Apartment" />
          </Field>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
            <Field label="Type">
              <select style={inputStyle} value={form.type} onChange={e => set("type", e.target.value)}>
                {Object.entries(PROPERTY_TYPE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </Field>
            <Field label="Status">
              <select style={inputStyle} value={form.status} onChange={e => set("status", e.target.value)}>
                {Object.entries(PROPERTY_STATUS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
            </Field>
          </div>

          <Field label="Price (RWF)" error={errors.price}>
            <input style={inputStyle} type="number" min="0" value={form.price} onChange={e => set("price", e.target.value)} placeholder="485000" />
          </Field>

          {/* Location */}
          <div>
            <p style={{ margin: "0 0 0.75rem", fontWeight: 700, fontSize: "0.8125rem", color: "var(--color-text)" }}>Location</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <Field label="Street Address" error={errors.address}>
                <input style={inputStyle} value={form.address} onChange={e => set("address", e.target.value)} placeholder="KG 123 St" />
              </Field>
              <LocationFields
                location={location} provinces={provinces} districts={districts}
                sectors={sectors} cells={cells} villages={villages}
                pick={pick} errors={errors}
              />
            </div>
          </div>

          {/* Specs */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.75rem" }}>
            <Field label="Bedrooms">
              <input style={inputStyle} type="number" min="0" value={form.bedrooms} onChange={e => set("bedrooms", e.target.value)} placeholder="2" />
            </Field>
            <Field label="Bathrooms" error={errors.bathrooms}>
              <input style={inputStyle} type="number" min="0" value={form.bathrooms} onChange={e => set("bathrooms", e.target.value)} placeholder="1" />
            </Field>
            <Field label="Area (m²)" error={errors.areaSqm}>
              <input style={inputStyle} type="number" min="0" value={form.areaSqm} onChange={e => set("areaSqm", e.target.value)} placeholder="85" />
            </Field>
          </div>

          {/* Image */}
          <ImageUpload value={image} onChange={setImage} error={errors.image} />

          {/* Description — required */}
          <Field label="Description" error={errors.description}>
            <textarea style={{ ...inputStyle, resize: "vertical", minHeight: 80 }} value={form.description} onChange={e => set("description", e.target.value)} placeholder="Describe the property — location highlights, features, condition…" />
          </Field>
        </div>

        {/* Footer */}
        <div style={{ display: "flex", gap: "0.65rem", justifyContent: "flex-end", padding: "1rem 1.5rem", borderTop: "1px solid var(--color-border)", flexShrink: 0 }}>
          <button onClick={onClose} style={{ padding: "0.55rem 1.1rem", borderRadius: "9px", border: "1px solid var(--color-border)", background: "none", color: "var(--color-text-muted)", fontWeight: 500, fontSize: "0.8375rem", cursor: "pointer", fontFamily: "inherit" }}>Cancel</button>
          <button onClick={handleSubmit} disabled={loading} style={{ display: "flex", alignItems: "center", gap: "0.4rem", padding: "0.55rem 1.25rem", borderRadius: "9px", border: "none", backgroundColor: "var(--color-primary)", color: "#fff", fontWeight: 600, fontSize: "0.8375rem", cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.75 : 1, fontFamily: "inherit" }}>
            {loading && <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} />}
            {loading ? "Creating…" : "Create Listing"}
          </button>
          <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
        </div>
      </div>
    </>
  )
}
