import { useState } from "react"
import { MapPin, BedDouble, Bath, Maximize2, ArrowUpRight } from "lucide-react"
import { fmtCurrencyFull } from "../../../utils/formatters"
import { PROPERTY_STATUS, PROPERTY_TYPE_LABELS } from "../../../constants/enums"

const PROPERTIES = [
  { id: 1,  title: "Modern Apartment in Kiyovu",   city: "Kigali",  province: "Kigali City",      price: 85000000,  type: "APARTMENT", status: "AVAILABLE",   bedrooms: 3, bathrooms: 2, areaSqm: 120,  bids: 3, image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&q=70" },
  { id: 2,  title: "Family Villa in Nyarutarama",  city: "Kigali",  province: "Kigali City",      price: 320000000, type: "VILLA",     status: "UNDER_OFFER", bedrooms: 5, bathrooms: 4, areaSqm: 450,  bids: 1, image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=70" },
  { id: 8,  title: "Townhouse in Kimironko",       city: "Kigali",  province: "Kigali City",      price: 68000000,  type: "HOUSE",     status: "AVAILABLE",   bedrooms: 4, bathrooms: 3, areaSqm: 210,  bids: 2, image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600&q=70" },
  { id: 9,  title: "Penthouse in Gisozi",          city: "Kigali",  province: "Kigali City",      price: 195000000, type: "APARTMENT", status: "SOLD",        bedrooms: 3, bathrooms: 2, areaSqm: 180,  bids: 0, image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&q=70" },
]

const TABS = ["ALL", "AVAILABLE", "UNDER_OFFER", "SOLD"]

export default function OwnerPropertiesPage() {
  const [tab, setTab] = useState("ALL")

  const rows = tab === "ALL" ? PROPERTIES : PROPERTIES.filter(p => p.status === tab)

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
        {TABS.map(t => {
          const active = tab === t
          const label  = t === "ALL" ? "All" : PROPERTY_STATUS[t]?.label ?? t
          const count  = t === "ALL" ? PROPERTIES.length : PROPERTIES.filter(p => p.status === t).length
          return (
            <button key={t} onClick={() => setTab(t)} style={{
              padding: "0.4rem 1rem", borderRadius: "999px", border: "1px solid",
              borderColor: active ? "var(--color-primary)" : "var(--color-border)",
              backgroundColor: active ? "var(--color-primary)" : "#fff",
              color: active ? "#fff" : "var(--color-text-muted)",
              fontWeight: 600, fontSize: "0.8rem", cursor: "pointer", fontFamily: "inherit",
            }}>
              {label} <span style={{ marginLeft: "0.3rem", opacity: 0.8, fontSize: "0.7rem" }}>{count}</span>
            </button>
          )
        })}
      </div>

      {/* Cards grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.25rem" }}>
        {rows.map(p => {
          const st = PROPERTY_STATUS[p.status]
          return (
            <div key={p.id} style={{ backgroundColor: "var(--color-surface)", borderRadius: "14px", border: "1px solid var(--color-border)", overflow: "hidden" }}>
              <div style={{ position: "relative", height: 180 }}>
                <img src={p.image} alt={p.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                <span style={{ position: "absolute", top: "0.75rem", left: "0.75rem", backgroundColor: st.bg, color: st.color, borderRadius: "6px", padding: "0.2rem 0.6rem", fontSize: "0.72rem", fontWeight: 700 }}>{st.label}</span>
                <span style={{ position: "absolute", top: "0.75rem", right: "0.75rem", backgroundColor: "rgba(0,0,0,0.45)", color: "#fff", borderRadius: "6px", padding: "0.2rem 0.6rem", fontSize: "0.72rem", fontWeight: 600 }}>{PROPERTY_TYPE_LABELS[p.type]}</span>
              </div>
              <div style={{ padding: "1rem 1.25rem" }}>
                <p style={{ margin: "0 0 0.2rem", fontWeight: 700, fontSize: "0.9375rem", color: "var(--color-text)" }}>{p.title}</p>
                <p style={{ margin: "0 0 0.75rem", fontSize: "0.8rem", color: "var(--color-text-muted)", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                  <MapPin size={11} style={{ color: "var(--color-primary)" }} />{p.city}, {p.province}
                </p>
                <p style={{ margin: "0 0 0.875rem", fontWeight: 800, fontSize: "1.125rem", color: "var(--color-text)", letterSpacing: "-0.02em" }}>{fmtCurrencyFull(p.price)}</p>
                <div style={{ display: "flex", gap: "1rem", fontSize: "0.78rem", color: "var(--color-text-muted)", paddingTop: "0.75rem", borderTop: "1px solid var(--color-border)", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", gap: "0.875rem" }}>
                    {p.bedrooms > 0 && <span style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}><BedDouble size={13} />{p.bedrooms}</span>}
                    <span style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}><Bath size={13} />{p.bathrooms}</span>
                    <span style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}><Maximize2 size={13} />{p.areaSqm}m²</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <span style={{ fontSize: "0.72rem", fontWeight: 600, color: p.bids > 0 ? "var(--color-primary)" : "var(--color-text-muted)" }}>
                      {p.bids} bid{p.bids !== 1 ? "s" : ""}
                    </span>
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
