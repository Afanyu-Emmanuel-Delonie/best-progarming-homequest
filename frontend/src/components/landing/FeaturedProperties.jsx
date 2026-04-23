import { useState, useEffect, useRef } from "react"
import { Link } from "react-router-dom"
import { BedDouble, Bath, Maximize2, MapPin, ArrowRight, Heart } from "lucide-react"
import { fmtCurrency } from "../../utils/formatters"
import { PROPERTY_STATUS, PROPERTY_TYPE_LABELS } from "../../constants/enums"
import { ROUTES } from "../../constants/routes"
import toast from "react-hot-toast"

function useReveal() {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current; if (!el) return
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { el.classList.add("visible"); obs.unobserve(el) } }, { threshold: 0.08 })
    obs.observe(el); return () => obs.disconnect()
  }, [])
  return ref
}

const PROPERTIES = [
  { id: 1, title: "Modern Apartment in Kiyovu",   city: "Kigali",  province: "Kigali City",      price: 85000000,  type: "APARTMENT",  status: "AVAILABLE",   bedrooms: 3, bathrooms: 2, areaSqm: 120, image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&q=80" },
  { id: 2, title: "Family Villa in Nyarutarama",  city: "Kigali",  province: "Kigali City",      price: 320000000, type: "VILLA",      status: "AVAILABLE",   bedrooms: 5, bathrooms: 4, areaSqm: 450, image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80" },
  { id: 3, title: "Commercial Space in CBD",      city: "Kigali",  province: "Kigali City",      price: 150000000, type: "COMMERCIAL", status: "AVAILABLE",   bedrooms: 0, bathrooms: 2, areaSqm: 280, image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80" },
  { id: 4, title: "Cozy House in Musanze",        city: "Musanze", province: "Northern Province", price: 45000000,  type: "HOUSE",      status: "AVAILABLE",   bedrooms: 3, bathrooms: 2, areaSqm: 160, image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600&q=80" },
  { id: 5, title: "Lakeside Villa in Rubavu",     city: "Rubavu",  province: "Western Province",  price: 280000000, type: "VILLA",      status: "UNDER_OFFER", bedrooms: 4, bathrooms: 3, areaSqm: 380, image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600&q=80" },
  { id: 6, title: "Studio Apartment in Huye",     city: "Huye",    province: "Southern Province", price: 22000000,  type: "APARTMENT",  status: "AVAILABLE",   bedrooms: 1, bathrooms: 1, areaSqm: 48,  image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&q=80" },
]

const TABS = ["All", "Apartment", "House", "Villa", "Commercial"]

export default function FeaturedProperties() {
  const ref    = useReveal()
  const [active, setActive] = useState("All")
  const [saved, setSaved]   = useState(new Set())

  const filtered = active === "All" ? PROPERTIES : PROPERTIES.filter(p => PROPERTY_TYPE_LABELS[p.type] === active)

  const toggleSave = (id, e) => {
    e.preventDefault(); e.stopPropagation()
    setSaved(prev => {
      const next = new Set(prev)
      if (next.has(id)) { next.delete(id); toast("Removed from saved") }
      else              { next.add(id);    toast.success("Saved to your list!") }
      return next
    })
  }

  return (
    <section style={{ backgroundColor: "#FAFAFA", padding: "6rem 1.5rem" }}>
      <div ref={ref} className="reveal" style={{ maxWidth: 1200, margin: "0 auto" }}>

        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: "1.5rem", marginBottom: "3rem" }}>
          <div>
            <span style={{ display: "inline-block", fontSize: "0.72rem", fontWeight: 700, color: "var(--color-primary)", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "0.6rem" }}>Listings</span>
            <h2 style={{ margin: 0, fontWeight: 800, fontSize: "clamp(1.6rem, 3vw, 2.25rem)", color: "var(--color-text)", letterSpacing: "-0.025em", lineHeight: 1.15 }}>Featured Properties</h2>
          </div>
          <Link to={ROUTES.PROPERTY_SEARCH} style={{ display: "flex", alignItems: "center", gap: "0.35rem", fontSize: "0.875rem", fontWeight: 600, color: "var(--color-primary)", textDecoration: "none", whiteSpace: "nowrap" }}>
            View all listings <ArrowRight size={14} />
          </Link>
        </div>

        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "2.5rem" }}>
          {TABS.map(t => (
            <button key={t} onClick={() => setActive(t)} style={{
              padding: "0.45rem 1.1rem", borderRadius: "999px", fontSize: "0.8125rem", fontWeight: 500,
              border: `1.5px solid ${active === t ? "var(--color-primary)" : "var(--color-border)"}`,
              backgroundColor: active === t ? "var(--color-primary)" : "#fff",
              color: active === t ? "#fff" : "var(--color-text-muted)",
              cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s",
            }}>{t}</button>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1.5rem" }}>
          {filtered.map(p => <PropertyCard key={p.id} p={p} saved={saved.has(p.id)} onSave={toggleSave} />)}
        </div>
      </div>
    </section>
  )
}

function PropertyCard({ p, saved, onSave }) {
  const st = PROPERTY_STATUS[p.status]
  return (
    <Link
      to={ROUTES.PROPERTY_DETAIL.replace(":id", p.id)}
      style={{ textDecoration: "none", display: "flex", flexDirection: "column", backgroundColor: "#fff", borderRadius: "16px", overflow: "hidden", boxShadow: "0 1px 4px #00000008, 0 4px 16px #00000008", transition: "box-shadow 0.2s, transform 0.2s" }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 8px 32px #00000016"; e.currentTarget.style.transform = "translateY(-4px)" }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 1px 4px #00000008, 0 4px 16px #00000008"; e.currentTarget.style.transform = "translateY(0)" }}
    >
      <div style={{ position: "relative", height: 210, overflow: "hidden", backgroundColor: "var(--color-bg-muted)" }}>
        <img src={p.image} alt={p.title} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.5s ease" }}
          onMouseEnter={e => e.currentTarget.style.transform = "scale(1.06)"}
          onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
        />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 55%)" }} />
        <p style={{ position: "absolute", bottom: "0.875rem", left: "1rem", margin: 0, fontWeight: 800, fontSize: "1.125rem", color: "#fff", letterSpacing: "-0.01em" }}>{fmtCurrency(p.price)}</p>
        <span style={{ position: "absolute", top: "0.875rem", right: "0.875rem", backgroundColor: st.bg, color: st.color, borderRadius: "6px", padding: "0.2rem 0.6rem", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.02em" }}>{st.label}</span>
        <span style={{ position: "absolute", top: "0.875rem", left: "0.875rem", backgroundColor: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)", color: "#fff", borderRadius: "6px", padding: "0.2rem 0.6rem", fontSize: "0.7rem", fontWeight: 600 }}>{PROPERTY_TYPE_LABELS[p.type]}</span>

        {/* Save button */}
        <button
          onClick={e => onSave(p.id, e)}
          style={{ position: "absolute", bottom: "0.875rem", right: "0.875rem", width: 34, height: 34, borderRadius: "50%", border: "none", backgroundColor: saved ? "var(--color-primary)" : "rgba(255,255,255,0.9)", backdropFilter: "blur(4px)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "background 0.2s, transform 0.15s", boxShadow: "0 2px 8px rgba(0,0,0,0.15)" }}
          onMouseEnter={e => e.currentTarget.style.transform = "scale(1.1)"}
          onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
        >
          <Heart size={15} fill={saved ? "#fff" : "none"} color={saved ? "#fff" : "var(--color-primary)"} />
        </button>
      </div>

      <div style={{ padding: "1.125rem 1.25rem 1.25rem", flex: 1, display: "flex", flexDirection: "column" }}>
        <p style={{ margin: "0 0 0.35rem", fontWeight: 700, fontSize: "0.9375rem", color: "var(--color-text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.title}</p>
        <p style={{ margin: "0 0 auto", fontSize: "0.78rem", color: "var(--color-text-muted)", display: "flex", alignItems: "center", gap: "0.25rem" }}>
          <MapPin size={11} style={{ flexShrink: 0, color: "var(--color-primary)" }} />{p.city}, {p.province}
        </p>
        <div style={{ display: "flex", gap: "1.25rem", fontSize: "0.78rem", color: "var(--color-text-muted)", borderTop: "1px solid var(--color-border)", paddingTop: "0.875rem", marginTop: "0.875rem" }}>
          {p.bedrooms > 0 && <span style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}><BedDouble size={13} />{p.bedrooms} bed</span>}
          <span style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}><Bath size={13} />{p.bathrooms} bath</span>
          <span style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}><Maximize2 size={13} />{p.areaSqm} m²</span>
        </div>
      </div>
    </Link>
  )
}
