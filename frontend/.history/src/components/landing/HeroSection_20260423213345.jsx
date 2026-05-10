import { useState, useEffect, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import { Search, MapPin, ChevronLeft, ChevronRight } from "lucide-react"
import { ROUTES } from "../../constants/routes"
import { PROPERTY_TYPE_LABELS } from "../../constants/enums"

const SLIDES = [
  {
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1600&q=80",
    tag:   "Beverly Hills, CA",
    title: "Find Your Dream\nHome in Rwanda",
    sub:   "Browse thousands of verified listings — apartments, houses, villas and commercial spaces across all provinces.",
  },
  {
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1600&q=80",
    tag:   "Los Angeles, CA",
    title: "Luxury Living\nStarts Here",
    sub:   "Discover premium properties with verified agents ready to guide you through every step of the process.",
  },
  {
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1600&q=80",
    tag:   "Miami, FL",
    title: "Invest in Your\nFuture Today",
    sub:   "From starter homes to commercial spaces — find the right property at the right price, right now.",
  },
]

const STATS = [
  { value: "2,400+",  label: "Properties"         },
  { value: "180+",    label: "Verified Agents"     },
  { value: "RWF 4B+", label: "In Transactions"     },
  { value: "98%",     label: "Client Satisfaction" },
]

export default function HeroSection() {
  const navigate          = useNavigate()
  const [cur, setCur]     = useState(0)
  const [query, setQuery] = useState("")
  const [type, setType]   = useState("")

  const next = useCallback(() => setCur(c => (c + 1) % SLIDES.length), [])
  const prev = ()  => setCur(c => (c - 1 + SLIDES.length) % SLIDES.length)

  useEffect(() => {
    const t = setInterval(next, 5000)
    return () => clearInterval(t)
  }, [next])

  const handleSearch = (e) => {
    e.preventDefault()
    const p = new URLSearchParams()
    if (query.trim()) p.set("q", query.trim())
    if (type)         p.set("type", type)
    navigate(`${ROUTES.PROPERTY_SEARCH}?${p.toString()}`)
  }

  const slide = SLIDES[cur]

  return (
    <section style={{ position: "relative", minHeight: "100vh", display: "flex", flexDirection: "column", overflow: "hidden" }}>

      {/* Slides */}
      {SLIDES.map((s, i) => (
        <div key={i} style={{
          position: "absolute", inset: 0,
          backgroundImage: `url(${s.image})`,
          backgroundSize: "cover", backgroundPosition: "center",
          opacity: i === cur ? 1 : 0,
          transition: "opacity 0.9s ease",
          zIndex: 0,
        }} />
      ))}

      {/* Overlay */}
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.52) 0%, rgba(0,0,0,0.65) 100%)", zIndex: 1 }} />

      {/* Content */}
      <div style={{ position: "relative", zIndex: 2, flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "6rem 1.5rem 3rem" }}>

        {/* Location tag */}
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "rgba(255,255,255,0.75)", fontSize: "0.8rem", marginBottom: "1.25rem", transition: "opacity 0.4s" }}>
          <MapPin size={13} style={{ color: "var(--color-primary)" }} />
          {slide.tag}
        </div>

        {/* Headline */}
        <h1 style={{ fontWeight: 800, fontSize: "clamp(2.2rem, 5.5vw, 3.75rem)", color: "#fff", lineHeight: 1.12, letterSpacing: "-0.02em", margin: "0 0 1.25rem", maxWidth: 700, whiteSpace: "pre-line" }}>
          {slide.title.split("\n")[0]}<br />
          <span style={{ color: "var(--color-primary)" }}>{slide.title.split("\n")[1]}</span>
        </h1>

        {/* Subtitle */}
        <p style={{ color: "rgba(255,255,255,0.65)", fontSize: "0.975rem", lineHeight: 1.7, maxWidth: 500, margin: "0 0 2.5rem" }}>
          {slide.sub}
        </p>

        {/* Search bar */}
        <form onSubmit={handleSearch} style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap", justifyContent: "center", width: "100%", maxWidth: 640, marginBottom: "2.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flex: "1 1 220px", backgroundColor: "rgba(255,255,255,0.12)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: "10px", padding: "0 1rem" }}>
            <MapPin size={15} style={{ color: "rgba(255,255,255,0.6)", flexShrink: 0 }} />
            <input
              value={query} onChange={e => setQuery(e.target.value)}
              placeholder="City, district or address…"
              style={{ border: "none", background: "none", outline: "none", fontSize: "0.875rem", color: "#fff", fontFamily: "inherit", width: "100%", padding: "0.75rem 0" }}
            />
          </div>
          <select
            value={type} onChange={e => setType(e.target.value)}
            style={{ flex: "0 1 150px", padding: "0.75rem 1rem", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.2)", backgroundColor: "rgba(255,255,255,0.12)", backdropFilter: "blur(8px)", fontSize: "0.875rem", color: type ? "#fff" : "rgba(255,255,255,0.6)", fontFamily: "inherit", outline: "none", cursor: "pointer" }}
          >
            <option value="" style={{ color: "#1A1A1A" }}>All types</option>
            {Object.entries(PROPERTY_TYPE_LABELS).map(([k, v]) => <option key={k} value={k} style={{ color: "#1A1A1A" }}>{v}</option>)}
          </select>
          <button type="submit" style={{ display: "flex", alignItems: "center", gap: "0.45rem", padding: "0.75rem 1.5rem", borderRadius: "10px", border: "none", backgroundColor: "var(--color-primary)", color: "#fff", fontWeight: 600, fontSize: "0.875rem", fontFamily: "inherit", cursor: "pointer", flexShrink: 0 }}>
            <Search size={15} /> Search
          </button>
        </form>

        {/* Dots */}
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {SLIDES.map((_, i) => (
            <button key={i} onClick={() => setCur(i)} style={{ width: i === cur ? 24 : 8, height: 8, borderRadius: 4, border: "none", cursor: "pointer", padding: 0, backgroundColor: i === cur ? "var(--color-primary)" : "rgba(255,255,255,0.35)", transition: "width 0.3s, background 0.3s" }} />
          ))}
        </div>
      </div>

      {/* Prev / Next arrows */}
      <button onClick={prev} style={{ position: "absolute", left: "1.25rem", top: "50%", transform: "translateY(-50%)", zIndex: 3, width: 40, height: 40, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.25)", backgroundColor: "rgba(0,0,0,0.3)", backdropFilter: "blur(4px)", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <ChevronLeft size={18} />
      </button>
      <button onClick={next} style={{ position: "absolute", right: "1.25rem", top: "50%", transform: "translateY(-50%)", zIndex: 3, width: 40, height: 40, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.25)", backgroundColor: "rgba(0,0,0,0.3)", backdropFilter: "blur(4px)", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <ChevronRight size={18} />
      </button>


    </section>
  )
}
