import { MapPin, BedDouble, Bath, Maximize2, Heart, ArrowUpRight } from "lucide-react"
import { fmtCurrencyFull } from "../../../utils/formatters"
import { PROPERTY_STATUS, PROPERTY_TYPE_LABELS } from "../../../constants/enums"
import { useSaved } from "../../../hooks/useSaved"

export default function ClientSavedPage() {
  const { saved, remove } = useSaved()

  if (saved.length === 0) return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 360, gap: "1rem", color: "var(--color-text-muted)" }}>
      <Heart size={40} strokeWidth={1.5} />
      <p style={{ margin: 0, fontWeight: 600, fontSize: "1rem", color: "var(--color-text)" }}>No saved properties</p>
      <p style={{ margin: 0, fontSize: "0.875rem" }}>Properties you like will appear here.</p>
      <a href="/properties" style={{ marginTop: "0.5rem", padding: "0.65rem 1.5rem", borderRadius: "10px", backgroundColor: "var(--color-primary)", color: "#fff", fontWeight: 600, fontSize: "0.875rem", textDecoration: "none" }}>
        Browse Properties
      </a>
    </div>
  )

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>

      <p style={{ margin: 0, fontSize: "0.875rem", color: "var(--color-text-muted)" }}>
        {saved.length} saved propert{saved.length !== 1 ? "ies" : "y"}
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.25rem" }}>
        {saved.map(p => {
          const st = PROPERTY_STATUS[p.status] ?? { bg: "#F5F5F5", color: "#737373", label: p.status }
          const img = p.images?.[0] ?? p.imageUrl ?? p.image ?? "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&q=70"
          return (
            <div key={p.id} style={{ backgroundColor: "var(--color-surface)", borderRadius: "14px", border: "1px solid var(--color-border)", overflow: "hidden" }}>
              <div style={{ position: "relative", height: 180 }}>
                <img src={img} alt={p.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                <span style={{ position: "absolute", top: "0.75rem", left: "0.75rem", backgroundColor: st.bg, color: st.color, borderRadius: "6px", padding: "0.2rem 0.6rem", fontSize: "0.72rem", fontWeight: 700 }}>{st.label}</span>
                <span style={{ position: "absolute", top: "0.75rem", right: "0.75rem", backgroundColor: "rgba(0,0,0,0.45)", color: "#fff", borderRadius: "6px", padding: "0.2rem 0.6rem", fontSize: "0.72rem", fontWeight: 600 }}>{PROPERTY_TYPE_LABELS[p.type] ?? p.type}</span>
                <button
                  onClick={() => remove(p.id)}
                  title="Remove from saved"
                  style={{ position: "absolute", bottom: "0.75rem", right: "0.75rem", width: 32, height: 32, borderRadius: "50%", border: "none", backgroundColor: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 2px 8px #0000002a" }}
                >
                  <Heart size={15} fill="var(--color-primary)" color="var(--color-primary)" />
                </button>
              </div>
              <div style={{ padding: "1rem 1.25rem" }}>
                <p style={{ margin: "0 0 0.2rem", fontWeight: 700, fontSize: "0.9375rem", color: "var(--color-text)" }}>{p.title}</p>
                <p style={{ margin: "0 0 0.75rem", fontSize: "0.8rem", color: "var(--color-text-muted)", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                  <MapPin size={11} style={{ color: "var(--color-primary)" }} />{p.city}
                </p>
                <p style={{ margin: "0 0 0.875rem", fontWeight: 800, fontSize: "1.125rem", color: "var(--color-text)", letterSpacing: "-0.02em" }}>{fmtCurrencyFull(Number(p.price))}</p>
                <div style={{ display: "flex", gap: "1rem", fontSize: "0.78rem", color: "var(--color-text-muted)", paddingTop: "0.75rem", borderTop: "1px solid var(--color-border)", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", gap: "0.875rem" }}>
                    {p.bedrooms > 0 && <span style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}><BedDouble size={13} />{p.bedrooms}</span>}
                    <span style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}><Bath size={13} />{p.bathrooms}</span>
                    {p.areaSqm && <span style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}><Maximize2 size={13} />{p.areaSqm}m²</span>}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    {p.savedAt && <span style={{ fontSize: "0.7rem", color: "var(--color-text-muted)" }}>Saved {p.savedAt}</span>}
                    <a href={`/properties/${p.id}`} style={{ display: "inline-flex", alignItems: "center", gap: "0.2rem", fontSize: "0.75rem", color: "var(--color-primary)", textDecoration: "none", fontWeight: 600 }}>
                      View <ArrowUpRight size={12} />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
