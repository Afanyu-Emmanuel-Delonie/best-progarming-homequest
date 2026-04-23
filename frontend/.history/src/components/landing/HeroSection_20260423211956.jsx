import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Search, MapPin } from "lucide-react"
import { ROUTES } from "../../constants/routes"
import { PROPERTY_TYPE_LABELS } from "../../constants/enums"

const STATS = [
  { value: "2,400+", label: "Properties" },
  { value: "180+",   label: "Verified agents" },
  { value: "RWF 4B+",label: "In transactions" },
  { value: "98%",    label: "Client satisfaction" },
]

export default function HeroSection() {
  const navigate = useNavigate()
  const [query, setQuery]   = useState("")
  const [type, setType]     = useState("")

  const handleSearch = (e) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (query.trim()) params.set("q", query.trim())
    if (type)         params.set("type", type)
    navigate(`${ROUTES.PROPERTY_SEARCH}?${params.toString()}`)
  }

  return (
    <section style={{ backgroundColor: "#fff", borderBottom: "1px solid var(--color-border)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "5rem 1.5rem 4rem" }}>

        {/* Headline */}
        <div style={{ maxWidth: 640, marginBottom: "2.5rem" }}>
          <p style={{ margin: "0 0 1rem", fontWeight: 800, fontSize: "clamp(2rem, 5vw, 3rem)", color: "var(--color-text)", lineHeight: 1.15, letterSpacing: "-0.02em" }}>
            Find your perfect<br />
            <span style={{ color: "var(--color-primary)" }}>property in Rwanda</span>
          </p>
          <p style={{ margin: 0, fontSize: "1.0625rem", color: "var(--color-text-muted)", lineHeight: 1.65, maxWidth: 520 }}>
            Browse thousands of verified listings — apartments, houses, villas and commercial spaces across all provinces.
          </p>
        </div>

        {/* Search bar */}
        <form onSubmit={handleSearch} style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", marginBottom: "3.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flex: "1 1 280px", backgroundColor: "var(--color-bg-muted)", border: "1px solid var(--color-border)", borderRadius: "10px", padding: "0 1rem" }}>
            <MapPin size={16} style={{ color: "var(--color-text-muted)", flexShrink: 0 }} />
            <input
              value={query} onChange={e => setQuery(e.target.value)}
              placeholder="City, district or address…"
              style={{ border: "none", background: "none", outline: "none", fontSize: "0.9rem", color: "var(--color-text)", fontFamily: "inherit", width: "100%", padding: "0.75rem 0" }}
            />
          </div>

          <select
            value={type} onChange={e => setType(e.target.value)}
            style={{ flex: "0 1 160px", padding: "0.75rem 1rem", borderRadius: "10px", border: "1px solid var(--color-border)", backgroundColor: "var(--color-bg-muted)", fontSize: "0.9rem", color: type ? "var(--color-text)" : "var(--color-text-muted)", fontFamily: "inherit", outline: "none", cursor: "pointer" }}
          >
            <option value="">All types</option>
            {Object.entries(PROPERTY_TYPE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>

          <button type="submit" style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.75rem 1.5rem", borderRadius: "10px", border: "none", backgroundColor: "var(--color-primary)", color: "#fff", fontWeight: 600, fontSize: "0.9rem", fontFamily: "inherit", cursor: "pointer", flexShrink: 0 }}>
            <Search size={16} /> Search
          </button>
        </form>

        {/* Stats strip */}
        <div style={{ display: "flex", gap: "2.5rem", flexWrap: "wrap" }}>
          {STATS.map((s, i) => (
            <div key={s.label} style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              {i > 0 && <div style={{ width: 1, height: 32, backgroundColor: "var(--color-border)" }} />}
              <div>
                <p style={{ margin: 0, fontWeight: 800, fontSize: "1.25rem", color: "var(--color-text)" }}>{s.value}</p>
                <p style={{ margin: 0, fontSize: "0.78rem", color: "var(--color-text-muted)" }}>{s.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
