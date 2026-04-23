import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { ArrowLeft, MapPin, BedDouble, Bath, Maximize2, Heart, Check } from "lucide-react"
import { fmtCurrencyFull } from "../../utils/formatters"
import { PROPERTY_STATUS, PROPERTY_TYPE_LABELS } from "../../constants/enums"
import { ROUTES } from "../../constants/routes"
import { ALL_PROPERTIES } from "../../constants/properties"
import toast from "react-hot-toast"

const FEATURES = ["Secure parking", "24/7 security", "Backup generator", "Water storage", "Fiber internet", "Tiled floors"]

export default function PropertyDetailPage() {
  const { id }                    = useParams()
  const navigate                  = useNavigate()
  const [activeImg, setActiveImg] = useState(0)
  const [saved, setSaved]         = useState(false)

  const p = ALL_PROPERTIES.find(x => x.id === Number(id))

  useEffect(() => { window.scrollTo({ top: 0 }) }, [id])

  if (!p) return (
    <div style={{ paddingTop: 64, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "1rem" }}>
      <p style={{ fontWeight: 700, fontSize: "1.25rem" }}>Property not found</p>
      <button onClick={() => navigate(ROUTES.PROPERTY_SEARCH)} style={{ padding: "0.6rem 1.5rem", borderRadius: "8px", border: "none", backgroundColor: "var(--color-primary)", color: "#fff", fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Back to listings</button>
    </div>
  )

  const st = PROPERTY_STATUS[p.status]

  return (
    <div style={{ paddingTop: 64, minHeight: "100vh", backgroundColor: "#FAFAFA" }}>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "1.5rem 1.5rem 0" }}>
        <button onClick={() => navigate(-1)} style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", fontSize: "0.875rem", fontWeight: 600, color: "var(--color-text-muted)", padding: 0 }}>
          <ArrowLeft size={15} /> Back
        </button>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "1.25rem 1.5rem 4rem", display: "flex", gap: "2.5rem", alignItems: "flex-start" }} className="detail-body">

        {/* Left */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ borderRadius: "16px", overflow: "hidden", height: 420, backgroundColor: "var(--color-bg-muted)", position: "relative" }} className="detail-main-img">
            <img src={p.images[activeImg]} alt={p.title} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "opacity 0.3s" }} />
            <span style={{ position: "absolute", top: "1rem", left: "1rem", backgroundColor: st.bg, color: st.color, borderRadius: "6px", padding: "0.25rem 0.7rem", fontSize: "0.75rem", fontWeight: 700 }}>{st.label}</span>
            <span style={{ position: "absolute", top: "1rem", right: "1rem", backgroundColor: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)", color: "#fff", borderRadius: "6px", padding: "0.25rem 0.7rem", fontSize: "0.75rem", fontWeight: 600 }}>{PROPERTY_TYPE_LABELS[p.type]}</span>
          </div>

          {p.images.length > 1 && (
            <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.75rem", overflowX: "auto" }}>
              {p.images.map((img, i) => (
                <button key={i} onClick={() => setActiveImg(i)} style={{ flexShrink: 0, width: 88, height: 64, borderRadius: "10px", overflow: "hidden", border: `2px solid ${i === activeImg ? "var(--color-primary)" : "transparent"}`, padding: 0, cursor: "pointer", transition: "border-color 0.2s" }}>
                  <img src={img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </button>
              ))}
            </div>
          )}

          <div style={{ marginTop: "2rem" }}>
            <h2 style={{ margin: "0 0 0.75rem", fontWeight: 700, fontSize: "1rem", color: "var(--color-text)" }}>About this property</h2>
            <p style={{ margin: 0, fontSize: "0.9rem", color: "var(--color-text-muted)", lineHeight: 1.75 }}>{p.description}</p>
          </div>

          <div style={{ marginTop: "2rem" }}>
            <h2 style={{ margin: "0 0 0.75rem", fontWeight: 700, fontSize: "1rem", color: "var(--color-text)" }}>Features & Amenities</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: "0.5rem" }}>
              {FEATURES.map(f => (
                <div key={f} style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.8375rem", color: "var(--color-text-muted)" }}>
                  <Check size={14} style={{ color: "var(--color-primary)", flexShrink: 0 }} />{f}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right — sticky panel */}
        <aside style={{ width: 320, flexShrink: 0, position: "sticky", top: 80 }} className="detail-aside">
          <div style={{ backgroundColor: "#fff", borderRadius: "16px", border: "1px solid var(--color-border)", padding: "1.75rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <div>
              <p style={{ margin: "0 0 0.25rem", fontWeight: 800, fontSize: "1.625rem", color: "var(--color-text)", letterSpacing: "-0.02em" }}>{fmtCurrencyFull(p.price)}</p>
              <p style={{ margin: 0, fontWeight: 600, fontSize: "1rem", color: "var(--color-text)" }}>{p.title}</p>
              <p style={{ margin: "0.3rem 0 0", fontSize: "0.8125rem", color: "var(--color-text-muted)", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                <MapPin size={12} style={{ color: "var(--color-primary)" }} />{p.city}, {p.province}
              </p>
            </div>

            <div style={{ display: "flex", gap: "1.5rem", fontSize: "0.8125rem", color: "var(--color-text-muted)", paddingTop: "1rem", borderTop: "1px solid var(--color-border)" }}>
              {p.bedrooms > 0 && <span style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}><BedDouble size={14} />{p.bedrooms} bed</span>}
              <span style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}><Bath size={14} />{p.bathrooms} bath</span>
              <span style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}><Maximize2 size={14} />{p.areaSqm} m²</span>
            </div>

            <button
              onClick={() => navigate(ROUTES.BOOKING_FORM.replace(":id", p.id))}
              disabled={p.status !== "AVAILABLE"}
              style={{ width: "100%", padding: "0.8rem", borderRadius: "10px", border: "none", backgroundColor: p.status === "AVAILABLE" ? "var(--color-primary)" : "var(--color-bg-muted)", color: p.status === "AVAILABLE" ? "#fff" : "var(--color-text-muted)", fontWeight: 700, fontSize: "0.9375rem", cursor: p.status === "AVAILABLE" ? "pointer" : "not-allowed", fontFamily: "inherit", transition: "opacity 0.15s" }}
              onMouseEnter={e => { if (p.status === "AVAILABLE") e.currentTarget.style.opacity = "0.88" }}
              onMouseLeave={e => e.currentTarget.style.opacity = "1"}
            >
              {p.status === "AVAILABLE" ? "Apply Now" : st.label}
            </button>

            <button
              onClick={() => { setSaved(v => !v); toast(saved ? "Removed from saved" : "Saved to your list!") }}
              style={{ width: "100%", padding: "0.7rem", borderRadius: "10px", border: "1px solid var(--color-border)", backgroundColor: "transparent", fontWeight: 600, fontSize: "0.875rem", cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.4rem", color: saved ? "var(--color-primary)" : "var(--color-text)" }}
            >
              <Heart size={15} fill={saved ? "var(--color-primary)" : "none"} color={saved ? "var(--color-primary)" : "currentColor"} />
              {saved ? "Saved" : "Save property"}
            </button>
          </div>
        </aside>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .detail-body      { flex-direction: column !important; padding-bottom: 6rem !important; }
          .detail-aside     { width: 100% !important; position: static !important; }
          .detail-main-img  { height: 260px !important; }
        }
      `}</style>
    </div>
  )
}
