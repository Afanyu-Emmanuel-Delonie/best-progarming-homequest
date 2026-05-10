import { useState, useEffect } from "react"
import { X, Home, Loader2, Search } from "lucide-react"
import { PROPERTY_TYPE_LABELS, PROPERTY_STATUS } from "../../constants/enums"
import { useLocationPicker } from "../../hooks/useLocation"
import LocationFields from "./LocationFields"
import ImageUpload from "./ImageUpload"
import { propertiesApi } from "../../api/properties.api"
import { ownerApi } from "../../api/owner.api"
import { toast } from "react-toastify"

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

// ── Owner Picker ───────────────────────────────────────────────────────────
function OwnerPicker({ onChange }) {
  const [mode, setMode]         = useState("system")
  const [owners, setOwners]     = useState([])
  const [search, setSearch]     = useState("")
  const [selected, setSelected] = useState(null)
  const [customId, setCustomId] = useState("")

  useEffect(() => { ownerApi.getAll().then(setOwners).catch(() => {}) }, [])

  const filtered = owners.filter(o =>
    search.trim() === "" ||
    `${o.firstName} ${o.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
    o.phone?.includes(search)
  )

  const select = (owner) => { setSelected(owner); onChange(owner.userPublicId); setSearch("") }
  const clear  = ()       => { setSelected(null);  onChange("") }
  const switchMode = (m)  => { setMode(m); setSelected(null); setCustomId(""); onChange("") }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
        {[{ key: "system", label: "Select from system" }, { key: "custom", label: "Enter manually" }].map(opt => (
          <button key={opt.key} type="button" onClick={() => switchMode(opt.key)} style={{
            padding: "0.45rem", borderRadius: "7px", cursor: "pointer", fontFamily: "inherit",
            fontWeight: 600, fontSize: "0.78rem", border: "1.5px solid",
            borderColor: mode === opt.key ? "var(--color-primary)" : "var(--color-border)",
            backgroundColor: mode === opt.key ? "#FFF5F0" : "var(--color-bg-muted)",
            color: mode === opt.key ? "var(--color-primary)" : "var(--color-text-muted)",
          }}>{opt.label}</button>
        ))}
      </div>

      {mode === "system" ? (
        selected ? (
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", padding: "0.55rem 0.875rem", borderRadius: "8px", border: "1.5px solid var(--color-primary)", backgroundColor: "#FFF5F0" }}>
            <div style={{ width: 28, height: 28, borderRadius: "50%", backgroundColor: "var(--color-primary)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.68rem", fontWeight: 700, flexShrink: 0 }}>
              {selected.firstName[0]}{selected.lastName[0]}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ margin: 0, fontWeight: 600, fontSize: "0.8375rem", color: "var(--color-text)" }}>{selected.firstName} {selected.lastName}</p>
              {selected.phone && <p style={{ margin: 0, fontSize: "0.72rem", color: "var(--color-text-muted)" }}>{selected.phone}</p>}
            </div>
            <button type="button" onClick={clear} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-text-muted)", display: "flex" }}>
              <X size={14} />
            </button>
          </div>
        ) : (
          <div style={{ position: "relative" }}>
            <Search size={13} style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "var(--color-text-muted)", pointerEvents: "none" }} />
            <input style={{ ...inputStyle, paddingLeft: "2.1rem" }} placeholder="Search by name or phone…"
              value={search} onChange={e => setSearch(e.target.value)} />
            {search.trim() && (
              <div style={{ position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, backgroundColor: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: "8px", boxShadow: "0 8px 24px #0000001a", zIndex: 20, maxHeight: 180, overflowY: "auto" }}>
                {filtered.length === 0
                  ? <p style={{ margin: 0, padding: "0.75rem 1rem", fontSize: "0.8125rem", color: "var(--color-text-muted)" }}>No owners found</p>
                  : filtered.map(o => (
                    <button key={o.userPublicId} type="button" onClick={() => select(o)}
                      style={{ display: "flex", alignItems: "center", gap: "0.6rem", width: "100%", padding: "0.55rem 0.875rem", border: "none", background: "none", cursor: "pointer", textAlign: "left", fontFamily: "inherit" }}>
                      <div style={{ width: 26, height: 26, borderRadius: "50%", backgroundColor: "var(--color-primary)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.65rem", fontWeight: 700, flexShrink: 0 }}>
                        {o.firstName[0]}{o.lastName[0]}
                      </div>
                      <div>
                        <p style={{ margin: 0, fontWeight: 600, fontSize: "0.8125rem", color: "var(--color-text)" }}>{o.firstName} {o.lastName}</p>
                        {o.phone && <p style={{ margin: 0, fontSize: "0.72rem", color: "var(--color-text-muted)" }}>{o.phone}</p>}
                      </div>
                    </button>
                  ))
                }
              </div>
            )}
          </div>
        )
      ) : (
        <input style={inputStyle} placeholder="Paste owner public ID (UUID)"
          value={customId} onChange={e => { setCustomId(e.target.value); onChange(e.target.value.trim()) }} />
      )}
    </div>
  )
}

export default function ListingFormModal({ onClose, onSubmit, initial }) {
  const [form, setForm]       = useState(initial ?? { title: "", address: "", price: "", type: "APARTMENT", status: "AVAILABLE", bedrooms: "", bathrooms: "", areaSqm: "", description: "", ownerPublicId: "" })
  const [image, setImage]     = useState(null)
  const [errors, setErrors]   = useState({})
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
      const locationCode = location.villageCode || location.cellCode || location.sectorCode || location.districtCode || location.provinceCode
      const created = await propertiesApi.create({
        title:       form.title,
        description: form.description,
        address:     form.address,
        city:        location.districtCode ?? "",
        country:     "Rwanda",
        price:       Number(form.price),
        type:        form.type,
        bedrooms:    Number(form.bedrooms)  || 0,
        bathrooms:   Number(form.bathrooms),
        areaSqm:     Number(form.areaSqm),
        locationCode,
        ...(form.ownerPublicId && { ownerPublicId: form.ownerPublicId }),
      })
      toast.success("Listing created successfully")
      onSubmit(created)
    } catch (err) {
      const backendErrors = err?.response?.data?.errors
      if (Array.isArray(backendErrors)) toast.error(backendErrors.join(" · "))
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

          <div>
            <p style={{ margin: "0 0 0.75rem", fontWeight: 700, fontSize: "0.8125rem", color: "var(--color-text)" }}>Location</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <Field label="Street Address" error={errors.address}>
                <input style={inputStyle} value={form.address} onChange={e => set("address", e.target.value)} placeholder="KG 123 St" />
              </Field>
              <LocationFields location={location} provinces={provinces} districts={districts}
                sectors={sectors} cells={cells} villages={villages} pick={pick} errors={errors} />
            </div>
          </div>

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

          <ImageUpload value={image} onChange={setImage} error={errors.image} />

          <Field label="Description" error={errors.description}>
            <textarea style={{ ...inputStyle, resize: "vertical", minHeight: 80 }} value={form.description}
              onChange={e => set("description", e.target.value)} placeholder="Describe the property…" />
          </Field>

          <div>
            <p style={{ margin: "0 0 0.5rem", fontWeight: 700, fontSize: "0.8125rem", color: "var(--color-text)" }}>Property Owner <span style={{ fontWeight: 400, color: "var(--color-text-muted)" }}>(optional)</span></p>
            <OwnerPicker onChange={v => set("ownerPublicId", v)} />
          </div>
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
