import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowLeft, Home } from "lucide-react"
import { PROPERTY_TYPE_LABELS, PROPERTY_STATUS } from "../../../constants/enums"
import { ROUTES } from "../../../constants/routes"
import { useLocationPicker } from "../../../hooks/useLocation"
import LocationFields from "../../../components/shared/LocationFields"
import ImageUpload from "../../../components/shared/ImageUpload"

const EMPTY = {
  title: "", address: "",
  price: "", type: "APARTMENT", status: "AVAILABLE",
  bedrooms: "", bathrooms: "", areaSqm: "", description: "",
}

const inputStyle = {
  padding: "0.6rem 0.9rem", borderRadius: "9px", border: "1px solid var(--color-border)",
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

function Section({ label, children }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
      <p style={{ margin: 0, fontWeight: 700, fontSize: "0.8125rem", color: "var(--color-text)" }}>{label}</p>
      {children}
    </div>
  )
}

function Divider() {
  return <div style={{ height: 1, backgroundColor: "var(--color-border)" }} />
}

export default function ListingFormPage() {
  const navigate    = useNavigate()
  const [form, setForm]     = useState(EMPTY)
  const [image, setImage]   = useState(null)
  const [errors, setErrors] = useState({})
  const { location, provinces, districts, sectors, cells, villages, pick } = useLocationPicker()

  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setErrors(e => ({ ...e, [k]: "" })) }

  const validate = () => {
    const e = {}
    if (!form.title.trim())   e.title   = "Required"
    if (!form.address.trim()) e.address = "Required"
    if (!location.provinceCode) e.province = "Required"
    if (!location.districtCode) e.district = "Required"
    if (!location.cellCode)     e.cell     = "Required"
    if (!location.villageCode)  e.village  = "Required"
    if (!form.price || isNaN(Number(form.price)) || Number(form.price) <= 0) e.price = "Enter a valid price"
    if (form.bathrooms === "" || isNaN(Number(form.bathrooms))) e.bathrooms = "Required"
    if (form.areaSqm   === "" || isNaN(Number(form.areaSqm)))  e.areaSqm   = "Required"
    return e
  }

  const handleSubmit = () => {
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    // TODO: call API — send as FormData when imageFile is present
    console.log("New listing:", { ...form, ...location, imageFile: image, price: Number(form.price), bedrooms: Number(form.bedrooms) || 0, bathrooms: Number(form.bathrooms), areaSqm: Number(form.areaSqm) })
    navigate(ROUTES.AGENT_LISTINGS)
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", maxWidth: 680, margin: "0 auto" }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
        <button onClick={() => navigate(ROUTES.AGENT_LISTINGS)} style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 34, height: 34, borderRadius: "8px", border: "1px solid var(--color-border)", background: "none", cursor: "pointer", color: "var(--color-text-muted)", flexShrink: 0 }}>
          <ArrowLeft size={16} />
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
          <div style={{ width: 36, height: 36, borderRadius: "9px", backgroundColor: "#FF4F0015", color: "var(--color-primary)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Home size={17} />
          </div>
          <div>
            <p style={{ margin: 0, fontWeight: 700, fontSize: "1rem", color: "var(--color-text)" }}>New Listing</p>
            <p style={{ margin: 0, fontSize: "0.75rem", color: "var(--color-text-muted)" }}>Fill in the property details below</p>
          </div>
        </div>
      </div>

      {/* Form card */}
      <div style={{ backgroundColor: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: "14px", padding: "1.75rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>

        <Section label="Basic Info">
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
        </Section>

        <Divider />

        <Section label="Location">
          <Field label="Street Address" error={errors.address}>
            <input style={inputStyle} value={form.address} onChange={e => set("address", e.target.value)} placeholder="KG 123 St" />
          </Field>
          <LocationFields
            location={location} provinces={provinces} districts={districts}
            sectors={sectors} cells={cells} villages={villages}
            pick={pick} errors={errors}
          />
        </Section>

        <Divider />

        <Section label="Specifications">
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
        </Section>

        <Divider />

        <Section label="Media & Description">
          <ImageUpload value={image} onChange={setImage} error={errors.image} />
          <Field label="Description (optional)">
            <textarea style={{ ...inputStyle, resize: "vertical", minHeight: 88 }} value={form.description} onChange={e => set("description", e.target.value)} placeholder="Brief description of the property…" />
          </Field>
        </Section>
      </div>

      {/* Actions */}
      <div style={{ display: "flex", gap: "0.65rem", justifyContent: "flex-end" }}>
        <button onClick={() => navigate(ROUTES.AGENT_LISTINGS)} style={{ padding: "0.6rem 1.25rem", borderRadius: "9px", border: "1px solid var(--color-border)", background: "none", color: "var(--color-text-muted)", fontWeight: 500, fontSize: "0.875rem", cursor: "pointer", fontFamily: "inherit" }}>
          Cancel
        </button>
        <button onClick={handleSubmit} style={{ padding: "0.6rem 1.5rem", borderRadius: "9px", border: "none", backgroundColor: "var(--color-primary)", color: "#fff", fontWeight: 600, fontSize: "0.875rem", cursor: "pointer", fontFamily: "inherit" }}>
          Create Listing
        </button>
      </div>
    </div>
  )
}
