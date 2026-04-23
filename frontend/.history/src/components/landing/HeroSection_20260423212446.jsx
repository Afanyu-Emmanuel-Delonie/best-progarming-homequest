import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Search, MapPin } from "lucide-react"
import { ROUTES } from "../../constants/routes"
import { PROPERTY_TYPE_LABELS } from "../../constants/enums"

const STATS = [
  { value: "2,400+", label: "Properties" },
  { value: "180+",   label: "Verified Agents" },
  { value: "RWF 4B+", label: "In Transactions" },
  { value: "98%",    label: "Client Satisfaction" },
]

export default function HeroSection() {
  const navigate = useNavigate()
  const [query, setQuery] = useState("")
  const [type, setType]   = useState("")

  const handleSearch = (e) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (query.trim()) params.set("q", query.trim())
    if (type)         params.set("type", type)
    navigate(`${ROUTES.PROPERTY_SEARCH}?${params.toString()}`)
  }

  return (
    <section style={{ position: "relative", minHeight: "90vh", display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>

      {/* Background image */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "url('https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=1400&q=80')",
        backgroundSize: "cover", backgroundPosition: "center",
        zIndex: 0,
      }} />

      {/* Dark gradient overlay */}
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(to top, rgba(5,10,20,0.90) 0%, rgba(10,18,35,0.60) 50%, rgba(10,18,35,0.25) 100%)",
        zIndex: 1,
      }} />

      {/* Content */}
      <div style={{ position: "relative", zIndex: 2, maxWidth: 1200, margin: "0 auto", width: "100%", padding: "0 1.5rem 3.5rem" }}>

        {/* Badge */}
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.18)",
          color: "#fff", fontSize: "0.72rem", fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase",
          padding: "5px 14px", borderRadius: 20, marginBottom: "1rem",
        }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--color-primary)", display: "inline-block" }} />
          Rwanda's #1 Property Platform
        </div>

        {/* Headline */}
        <h1 style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontWeight: 800, fontSize: "clamp(2.2rem, 5vw, 3.4rem)",
          color: "#fff", lineHeight: 1.12, letterSpacing: "-0.02em",
          margin: "0 0 1rem",
        }}>
          Find Your Perfect<br />
          <span style={{ color: "var(--color-primary)" }}>Property in Rwanda</span>
        </h1>

        <p style={{ color: "rgba(255,255,255,0.68)", fontSize: "1rem", lineHeight: 1.65, margin: "0 0 2rem", maxWidth: 500 }}>
          Browse thousands of verified listings — apartments, houses, villas and commercial spaces across all provinces.
        </p>

        {/* Search bar */}
        <form onSubmit={handleSearch} style={{
          display: "flex", gap: 0, alignItems: "center", flexWrap: "wrap",
          background: "rgba(255,255,255,0.08)", backdropFilter: "blur(14px)",
          border: "1px solid rgba(255,255,255,0.16)", borderRadius: 12,
          padding: "10px 10px 10px 18px", marginBottom: "2.5rem",
          maxWidth: 680,
        }}>
          {/* Location input */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, flex: "1 1 200px" }}>
            <MapPin size={15} style={{ color: "rgba(255,255,255,0.4)", flexShrink: 0 }} />
            <input
              value={query} onChange={e => setQuery(e.target.value)}
              placeholder="City, district or address…"
              style={{
                border: "none", background: "none", outline: "none",
                fontSize: "0.875rem", color: "#fff", fontFamily: "inherit", width: "100%",
              }}
            />
          </div>

          <div style={{ width: 1, height: 22, background: "rgba(255,255,255,0.2)", margin: "0 12px", flexShrink: 0 }} />

          {/* Type select */}
          <select
            value={type} onChange={e => setType(e.target.value)}
            style={{
              background: "none", border: "none", outline: "none",
              color: type ? "#fff" : "rgba(255,255,255,0.55)",
              fontSize: "0.875rem", fontFamily: "inherit", cursor: "pointer",
              flex: "0 1 130px", padding: "0 8px",
            }}
          >
            <option value="">All types</option>
            {Object.entries(PROPERTY_TYPE_LABELS).map(([k, v]) => (
              <option key={k} value={k} style={{ color: "#111", background: "#fff" }}>{v}</option>
            ))}
          </select>

          {/* Search button */}
          <button type="submit" style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "10px 20px", borderRadius: 8, border: "none",
            background: "var(--color-primary)", color: "#fff",
            fontWeight: 600, fontSize: "0.875rem", fontFamily: "inherit",
            cursor: "pointer", flexShrink: 0, marginLeft: 8,
          }}>
            <Search size={14} /> Search
          </button>
        </form>

        {/* Stats strip */}
        <div style={{
          display: "flex", flexWrap: "wrap",
          borderTop: "1px solid rgba(255,255,255,0.12)", paddingTop: "1.5rem",
          gap: 0,
        }}>
          {STATS.map((s, i) => (
            <div key={s.label} style={{
              paddingRight: "2.5rem", paddingLeft: i > 0 ? "2.5rem" : 0,
              borderLeft: i > 0 ? "1px solid rgba(255,255,255,0.15)" : "none",
            }}>
              <p style={{ margin: 0, fontWeight: 800, fontSize: "1.4rem", color: "#fff", letterSpacing: "-0.01em" }}>{s.value}</p>
              <p style={{ margin: 0, fontSize: "0.72rem", color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "0.06em" }}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}