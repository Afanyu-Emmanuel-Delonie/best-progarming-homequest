import { useState, useMemo, useEffect, useRef } from "react"
import { Link, useSearchParams, useNavigate } from "react-router-dom"
import HowItWorks     from "../../components/landing/HowItWorks"
import WhyUs          from "../../components/landing/WhyUs"
import TopAgents      from "../../components/landing/TopAgents"
import AboutSection   from "../../components/landing/AboutSection"
import Testimonials   from "../../components/landing/Testimonials"
import ContactSection from "../../components/landing/ContactSection"
import CTASection     from "../../components/landing/CTASection"
import { BedDouble, Bath, Maximize2, MapPin, Search, Heart, X } from "lucide-react"
import { fmtCurrency } from "../../utils/formatters"
import { PROPERTY_STATUS, PROPERTY_TYPE_LABELS } from "../../constants/enums"
import { ROUTES } from "../../constants/routes"
import toast from "react-hot-toast"

const ALL_PROPERTIES = [
  { id: 1,  title: "Modern Apartment in Kiyovu",   city: "Kigali",    province: "Kigali City",      price: 85000000,  type: "APARTMENT",  status: "AVAILABLE",   bedrooms: 3, bathrooms: 2, areaSqm: 120,  image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&q=80" },
  { id: 2,  title: "Family Villa in Nyarutarama",  city: "Kigali",    province: "Kigali City",      price: 320000000, type: "VILLA",      status: "AVAILABLE",   bedrooms: 5, bathrooms: 4, areaSqm: 450,  image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80" },
  { id: 3,  title: "Commercial Space in CBD",      city: "Kigali",    province: "Kigali City",      price: 150000000, type: "COMMERCIAL", status: "AVAILABLE",   bedrooms: 0, bathrooms: 2, areaSqm: 280,  image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80" },
  { id: 4,  title: "Cozy House in Musanze",        city: "Musanze",   province: "Northern Province", price: 45000000,  type: "HOUSE",      status: "AVAILABLE",   bedrooms: 3, bathrooms: 2, areaSqm: 160,  image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600&q=80" },
  { id: 5,  title: "Lakeside Villa in Rubavu",     city: "Rubavu",    province: "Western Province",  price: 280000000, type: "VILLA",      status: "UNDER_OFFER", bedrooms: 4, bathrooms: 3, areaSqm: 380,  image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600&q=80" },
  { id: 6,  title: "Studio Apartment in Huye",     city: "Huye",      province: "Southern Province", price: 22000000,  type: "APARTMENT",  status: "AVAILABLE",   bedrooms: 1, bathrooms: 1, areaSqm: 48,   image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&q=80" },
  { id: 7,  title: "Office Block in Remera",       city: "Kigali",    province: "Kigali City",      price: 95000000,  type: "OFFICE",     status: "AVAILABLE",   bedrooms: 0, bathrooms: 3, areaSqm: 320,  image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&q=80" },
  { id: 8,  title: "Townhouse in Kimironko",       city: "Kigali",    province: "Kigali City",      price: 68000000,  type: "HOUSE",      status: "AVAILABLE",   bedrooms: 4, bathrooms: 3, areaSqm: 210,  image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600&q=80" },
  { id: 9,  title: "Penthouse in Gisozi",          city: "Kigali",    province: "Kigali City",      price: 195000000, type: "APARTMENT",  status: "AVAILABLE",   bedrooms: 3, bathrooms: 2, areaSqm: 180,  image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&q=80" },
  { id: 10, title: "Farm Land in Rwamagana",       city: "Rwamagana", province: "Eastern Province",  price: 12000000,  type: "LAND",       status: "AVAILABLE",   bedrooms: 0, bathrooms: 0, areaSqm: 5000, image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&q=80" },
  { id: 11, title: "Bungalow in Nyanza",           city: "Nyanza",    province: "Southern Province", price: 38000000,  type: "HOUSE",      status: "AVAILABLE",   bedrooms: 3, bathrooms: 2, areaSqm: 140,  image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80" },
  { id: 12, title: "Retail Space in Gisenyi",      city: "Rubavu",    province: "Western Province",  price: 55000000,  type: "COMMERCIAL", status: "AVAILABLE",   bedrooms: 0, bathrooms: 1, areaSqm: 120,  image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&q=80" },
]

const PROVINCES = ["All Provinces", "Kigali City", "Northern Province", "Southern Province", "Eastern Province", "Western Province"]
const TYPE_TABS = ["All", ...Object.keys(PROPERTY_TYPE_LABELS)]

const inputBase = {
  width: "100%", padding: "0.6rem 0.875rem", borderRadius: "8px",
  border: "1px solid var(--color-border)", backgroundColor: "#fff",
  fontSize: "0.8125rem", color: "var(--color-text)", fontFamily: "inherit",
  outline: "none", boxSizing: "border-box",
}

export default function PropertiesPage() {
  const [searchParams]          = useSearchParams()
  const [query,    setQuery]    = useState(searchParams.get("q") || "")
  const [type,     setType]     = useState(searchParams.get("type") || "All")
  const [province, setProvince] = useState("All Provinces")
  const [maxPrice, setMaxPrice] = useState("")
  const [saved,    setSaved]    = useState(new Set())
  const gridRef                 = useRef(null)

  const filtered = useMemo(() => ALL_PROPERTIES.filter(p => {
    if (type !== "All" && p.type !== type) return false
    if (province !== "All Provinces" && p.province !== province) return false
    if (maxPrice && p.price > Number(maxPrice)) return false
    if (query.trim()) {
      const q = query.toLowerCase()
      if (!p.title.toLowerCase().includes(q) && !p.city.toLowerCase().includes(q)) return false
    }
    return true
  }), [query, type, province, maxPrice])

  useEffect(() => {
    if (!gridRef.current) return
    const cards = gridRef.current.querySelectorAll(".prop-card")
    cards.forEach((c, i) => {
      c.style.opacity = "0"
      c.style.transform = "translateY(20px)"
      setTimeout(() => {
        c.style.transition = "opacity 0.4s ease, transform 0.4s ease"
        c.style.opacity = "1"
        c.style.transform = "translateY(0)"
      }, i * 60)
    })
  }, [filtered])

  const toggleSave = (id, e) => {
    e.preventDefault(); e.stopPropagation()
    setSaved(prev => {
      const next = new Set(prev)
      if (next.has(id)) { next.delete(id); toast("Removed from saved") }
      else              { next.add(id);    toast.success("Saved to your list!") }
      return next
    })
  }

  const clearFilters = () => { setType("All"); setProvince("All Provinces"); setMaxPrice(""); setQuery("") }
  const activeFilters = (type !== "All" ? 1 : 0) + (province !== "All Provinces" ? 1 : 0) + (maxPrice ? 1 : 0) + (query ? 1 : 0)

  return (
    <div style={{ paddingTop: 64, minHeight: "100vh", backgroundColor: "#FAFAFA" }}>

      {/* ── Small hero ── */}
      <div style={{ position: "relative", height: 260, overflow: "hidden" }}>
        <img
          src="https://images.unsplash.com/photo-1611348586804-61bf6c080437?w=1600&q=80"
          alt="Kigali"
          style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 60%" }}
        />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.65) 100%)" }} />
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "0 1.5rem" }}>
          <p style={{ margin: "0 0 0.5rem", fontSize: "0.72rem", fontWeight: 700, color: "var(--color-primary)", textTransform: "uppercase", letterSpacing: "0.12em" }}>Browse</p>
          <h1 style={{ margin: "0 0 0.5rem", fontWeight: 800, fontSize: "clamp(1.75rem, 4vw, 2.75rem)", color: "#fff", letterSpacing: "-0.025em", lineHeight: 1.1 }}>
            Properties in Rwanda
          </h1>
          <p style={{ margin: 0, fontSize: "0.9375rem", color: "rgba(255,255,255,0.65)" }}>
            {ALL_PROPERTIES.length} verified listings across all five provinces
          </p>
        </div>
      </div>

      {/* ── Mobile: scrolling tab bar ── */}
      <div className="mobile-tabs" style={{ backgroundColor: "#fff", borderBottom: "1px solid var(--color-border)", overflowX: "auto", display: "none" }}>
        <div style={{ display: "flex", padding: "0 1rem", minWidth: "max-content" }}>
          {TYPE_TABS.map(t => {
            const active = type === t
            return (
              <button key={t} onClick={() => setType(t)} style={{
                padding: "0.75rem 1rem", background: "none", border: "none",
                borderBottom: active ? "2px solid var(--color-primary)" : "2px solid transparent",
                color: active ? "var(--color-primary)" : "var(--color-text-muted)",
                fontWeight: active ? 600 : 400, fontSize: "0.8375rem",
                cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap",
                marginBottom: "-1px",
              }}>
                {t === "All" ? "All Types" : PROPERTY_TYPE_LABELS[t]}
              </button>
            )
          })}
        </div>
      </div>

      {/* ── Body: sidebar + grid ── */}
      <div className="props-body" style={{ maxWidth: 1280, margin: "0 auto", padding: "2rem 1.5rem", display: "flex", gap: "2rem", alignItems: "flex-start" }}>

        {/* ── Desktop sidebar ── */}
        <aside className="filter-sidebar" style={{ width: 260, flexShrink: 0, position: "sticky", top: 80, backgroundColor: "#fff", borderRadius: "14px", border: "1px solid var(--color-border)", padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontWeight: 700, fontSize: "0.9375rem", color: "var(--color-text)" }}>Filters</span>
            {activeFilters > 0 && (
              <button onClick={clearFilters} style={{ fontSize: "0.78rem", color: "var(--color-primary)", fontWeight: 600, background: "none", border: "none", cursor: "pointer", fontFamily: "inherit" }}>
                Clear all
              </button>
            )}
          </div>

          {/* Search */}
          <div>
            <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, color: "var(--color-text-muted)", marginBottom: "0.4rem", textTransform: "uppercase", letterSpacing: "0.06em" }}>Search</label>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", border: "1px solid var(--color-border)", borderRadius: "8px", padding: "0 0.75rem", backgroundColor: "#fff" }}>
              <Search size={13} style={{ color: "var(--color-text-muted)", flexShrink: 0 }} />
              <input value={query} onChange={e => setQuery(e.target.value)} placeholder="City, title…"
                style={{ border: "none", background: "none", outline: "none", fontSize: "0.8125rem", color: "var(--color-text)", fontFamily: "inherit", width: "100%", padding: "0.6rem 0" }}
              />
              {query && <button onClick={() => setQuery("")} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-text-muted)", display: "flex", padding: 0 }}><X size={12} /></button>}
            </div>
          </div>

          {/* Type */}
          <div>
            <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, color: "var(--color-text-muted)", marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "0.06em" }}>Property Type</label>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
              {TYPE_TABS.map(t => (
                <button key={t} onClick={() => setType(t)} style={{
                  textAlign: "left", padding: "0.5rem 0.75rem", borderRadius: "7px", border: "none",
                  backgroundColor: type === t ? "var(--color-primary)" : "transparent",
                  color: type === t ? "#fff" : "var(--color-text)",
                  fontWeight: type === t ? 600 : 400, fontSize: "0.8375rem",
                  cursor: "pointer", fontFamily: "inherit", transition: "background 0.15s, color 0.15s",
                }}>
                  {t === "All" ? "All Types" : PROPERTY_TYPE_LABELS[t]}
                </button>
              ))}
            </div>
          </div>

          {/* Province */}
          <div>
            <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, color: "var(--color-text-muted)", marginBottom: "0.4rem", textTransform: "uppercase", letterSpacing: "0.06em" }}>Province</label>
            <select value={province} onChange={e => setProvince(e.target.value)} style={{ ...inputBase, appearance: "none", backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236B6B6B' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 0.6rem center", paddingRight: "2rem" }}>
              {PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>

          {/* Max price */}
          <div>
            <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, color: "var(--color-text-muted)", marginBottom: "0.4rem", textTransform: "uppercase", letterSpacing: "0.06em" }}>Max Price (RWF)</label>
            <input type="number" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} placeholder="e.g. 100000000" style={inputBase} />
          </div>

          <div style={{ paddingTop: "0.5rem", borderTop: "1px solid var(--color-border)", fontSize: "0.8125rem", color: "var(--color-text-muted)" }}>
            {filtered.length} result{filtered.length !== 1 ? "s" : ""}
          </div>
        </aside>

        {/* ── Grid ── */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "5rem 0" }}>
              <p style={{ fontWeight: 700, fontSize: "1.125rem", color: "var(--color-text)", margin: "0 0 0.5rem" }}>No properties found</p>
              <p style={{ color: "var(--color-text-muted)", fontSize: "0.9rem", margin: 0 }}>Try adjusting your search or filters.</p>
            </div>
          ) : (
            <div ref={gridRef} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1.5rem" }}>
              {filtered.map(p => <PropertyCard key={p.id} p={p} saved={saved.has(p.id)} onSave={toggleSave} />)}
            </div>
          )}
        </div>
      </div>

      <div id="how-it-works"><HowItWorks /></div>
      <WhyUs />
      <TopAgents />
      <div id="about"><AboutSection /></div>
      <Testimonials />
      <div id="contact"><ContactSection /></div>
      <CTASection />

      <style>{`
        @media (max-width: 768px) {
          .filter-sidebar { display: none !important; }
          .mobile-tabs    { display: block !important; }
          .props-body     { padding: 1.25rem 1rem !important; }
        }
      `}</style>
    </div>
  )
}

function PropertyCard({ p, saved, onSave }) {
  const st      = PROPERTY_STATUS[p.status]
  const navigate = useNavigate()
  return (
    <div
      className="prop-card"
      style={{ display: "flex", flexDirection: "column", backgroundColor: "#fff", borderRadius: "16px", overflow: "hidden", boxShadow: "0 1px 4px #00000008, 0 4px 16px #00000008", transition: "box-shadow 0.25s, transform 0.25s", cursor: "pointer" }}
      onClick={() => navigate(ROUTES.PROPERTY_DETAIL.replace(":id", p.id))}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 12px 36px #00000018"; e.currentTarget.style.transform = "translateY(-5px)" }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 1px 4px #00000008, 0 4px 16px #00000008"; e.currentTarget.style.transform = "translateY(0)" }}
    >
      {/* Image */}
      <div style={{ position: "relative", height: 210, overflow: "hidden", backgroundColor: "var(--color-bg-muted)" }}>
        <img src={p.image} alt={p.title}
          style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.5s ease" }}
        />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.62) 0%, transparent 55%)" }} />
        <p style={{ position: "absolute", bottom: "0.875rem", left: "1rem", margin: 0, fontWeight: 800, fontSize: "1.125rem", color: "#fff", letterSpacing: "-0.01em" }}>{fmtCurrency(p.price)}</p>
        <span style={{ position: "absolute", top: "0.875rem", right: "0.875rem", backgroundColor: st.bg, color: st.color, borderRadius: "6px", padding: "0.2rem 0.6rem", fontSize: "0.7rem", fontWeight: 700 }}>{st.label}</span>
        <span style={{ position: "absolute", top: "0.875rem", left: "0.875rem", backgroundColor: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)", color: "#fff", borderRadius: "6px", padding: "0.2rem 0.6rem", fontSize: "0.7rem", fontWeight: 600 }}>{PROPERTY_TYPE_LABELS[p.type]}</span>
        <button
          onClick={e => onSave(p.id, e)}
          style={{ position: "absolute", bottom: "0.875rem", right: "0.875rem", width: 34, height: 34, borderRadius: "50%", border: "none", backgroundColor: saved ? "var(--color-primary)" : "rgba(255,255,255,0.92)", backdropFilter: "blur(4px)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "background 0.2s, transform 0.15s", boxShadow: "0 2px 8px rgba(0,0,0,0.15)" }}
          onMouseEnter={e => e.currentTarget.style.transform = "scale(1.15)"}
          onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
        >
          <Heart size={15} fill={saved ? "#fff" : "none"} color={saved ? "#fff" : "var(--color-primary)"} />
        </button>
      </div>

      {/* Body */}
      <div style={{ padding: "1.125rem 1.25rem 1.25rem", flex: 1, display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        <div>
          <p style={{ margin: "0 0 0.3rem", fontWeight: 700, fontSize: "0.9375rem", color: "var(--color-text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.title}</p>
          <p style={{ margin: 0, fontSize: "0.78rem", color: "var(--color-text-muted)", display: "flex", alignItems: "center", gap: "0.25rem" }}>
            <MapPin size={11} style={{ flexShrink: 0, color: "var(--color-primary)" }} />{p.city}, {p.province}
          </p>
        </div>

        <div style={{ display: "flex", gap: "1.25rem", fontSize: "0.78rem", color: "var(--color-text-muted)", borderTop: "1px solid var(--color-border)", paddingTop: "0.75rem" }}>
          {p.bedrooms > 0 && <span style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}><BedDouble size={13} />{p.bedrooms} bed</span>}
          <span style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}><Bath size={13} />{p.bathrooms} bath</span>
          <span style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}><Maximize2 size={13} />{p.areaSqm} m²</span>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: "0.5rem", marginTop: "auto" }}>
          <button
            onClick={e => { e.stopPropagation(); navigate(ROUTES.PROPERTY_DETAIL.replace(":id", p.id)) }}
            style={{ flex: 1, padding: "0.55rem 0", borderRadius: "8px", border: "1px solid var(--color-border)", backgroundColor: "transparent", fontSize: "0.8125rem", fontWeight: 600, color: "var(--color-text)", cursor: "pointer", fontFamily: "inherit", transition: "background 0.15s" }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = "var(--color-bg-muted)"}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}
          >
            View Details
          </button>
          <button
            onClick={e => { e.stopPropagation(); navigate(ROUTES.PROPERTY_DETAIL.replace(":id", p.id) + "?apply=1") }}
            style={{ flex: 1, padding: "0.55rem 0", borderRadius: "8px", border: "none", backgroundColor: "var(--color-primary)", fontSize: "0.8125rem", fontWeight: 600, color: "#fff", cursor: "pointer", fontFamily: "inherit", transition: "opacity 0.15s" }}
            onMouseEnter={e => e.currentTarget.style.opacity = "0.88"}
            onMouseLeave={e => e.currentTarget.style.opacity = "1"}
          >
            Apply Now
          </button>
        </div>
      </div>
    </div>
  )
}
