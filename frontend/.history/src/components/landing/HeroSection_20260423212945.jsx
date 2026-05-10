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
  const [activeSlide, setActiveSlide] = useState(0)

  const handleSearch = (e) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (query.trim()) params.set("q", query.trim())
    if (type)         params.set("type", type)
    navigate(`${ROUTES.PROPERTY_SEARCH}?${params.toString()}`)
  }

  return (
    <section style={{
      position: "relative",
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
    }}>

      {/* ── Background image slot ── */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "url('/your-hero-image.jpg')", /* ← swap your image here */
        backgroundSize: "cover", backgroundPosition: "center",
        zIndex: 0,
      }} />

      {/* ── Dark overlay ── */}
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(to bottom, rgba(5,10,25,0.55) 0%, rgba(5,10,25,0.70) 100%)",
        zIndex: 1,
      }} />

      {/* ── Navbar ── */}
      <nav style={{
        position: "relative", zIndex: 10,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "18px 48px",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        background: "rgba(5,10,25,0.45)",
        backdropFilter: "blur(8px)",
      }}>
        <span style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          color: "#fff", fontSize: "1.3rem", fontWeight: 700,
        }}>
          Veedoo
        </span>

        <div style={{ display: "flex", gap: "2rem" }}>
          {["Home", "Pages", "Real Estate", "News", "Contact Us"].map((link, i) => (
            <a key={link} href="#" style={{
              color: i === 0 ? "#fff" : "rgba(255,255,255,0.65)",
              fontSize: "0.82rem", fontWeight: i === 0 ? 600 : 400,
              textDecoration: "none",
            }}>
              {link}
            </a>
          ))}
        </div>

        <button style={{
          background: "var(--color-primary)", color: "#fff",
          border: "none", padding: "9px 20px", borderRadius: "7px",
          fontSize: "0.8rem", fontWeight: 600, cursor: "pointer",
          fontFamily: "inherit",
        }}>
          Login / Register
        </button>
      </nav>

      {/* ── Hero content — vertically centered ── */}
      <div style={{
        position: "relative", zIndex: 2,
        flex: 1, display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        textAlign: "center",
        padding: "4rem 1.5rem 3rem",
      }}>

        {/* Location tag */}
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          color: "rgba(255,255,255,0.75)", fontSize: "0.78rem",
          marginBottom: "1.25rem",
        }}>
          <MapPin size={13} style={{ color: "var(--color-primary)" }} />
          317 Timeless Blvd, South Gate, CA 90280, United States
        </div>

        {/* Headline */}
        <h1 style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontWeight: 800,
          fontSize: "clamp(2.4rem, 5.5vw, 3.8rem)",
          color: "#fff", lineHeight: 1.1,
          letterSpacing: "-0.02em",
          margin: "0 0 1.25rem",
          maxWidth: 700,
        }}>
          Welcome to Your<br />
          <span style={{ color: "var(--color-primary)" }}>Next Adventure</span>
        </h1>

        {/* Subtitle */}
        <p style={{
          color: "rgba(255,255,255,0.65)", fontSize: "0.95rem",
          lineHeight: 1.7, maxWidth: 520, margin: "0 0 2.25rem",
        }}>
          Discover your dream home with us. Explore our curated listings of luxury
          properties, perfectly suited for modern living and your aspirations.
        </p>

        {/* CTA buttons */}
        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", marginBottom: "3rem" }}>
          <button style={{
            background: "var(--color-primary)", color: "#fff", border: "none",
            padding: "13px 28px", borderRadius: "8px",
            fontSize: "0.9rem", fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
          }}>
            Take A Tour
          </button>
          <button style={{
            background: "transparent", color: "#fff",
            border: "1px solid rgba(255,255,255,0.35)",
            padding: "13px 28px", borderRadius: "8px",
            fontSize: "0.9rem", fontWeight: 500, cursor: "pointer", fontFamily: "inherit",
          }}>
            Get A Quote
          </button>
        </div>

        {/* Slider dots */}
        <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
          {[0, 1, 2].map(i => (
            <button
              key={i}
              onClick={() => setActiveSlide(i)}
              style={{
                width: i === activeSlide ? 24 : 8,
                height: 8, borderRadius: 4,
                background: i === activeSlide ? "var(--color-primary)" : "rgba(255,255,255,0.3)",
                border: "none", cursor: "pointer", padding: 0,
                transition: "width 0.25s ease, background 0.25s ease",
              }}
            />
          ))}
        </div>
      </div>

      {/* ── Stats strip at bottom ── */}
      <div style={{
        position: "relative", zIndex: 2,
        display: "flex", flexWrap: "wrap",
        background: "rgba(5,10,25,0.6)",
        backdropFilter: "blur(10px)",
        borderTop: "1px solid rgba(255,255,255,0.1)",
      }}>
        {STATS.map((s, i) => (
          <div key={s.label} style={{
            flex: "1 1 160px",
            padding: "1.25rem 2rem",
            borderRight: i < STATS.length - 1 ? "1px solid rgba(255,255,255,0.1)" : "none",
            textAlign: "center",
          }}>
            <p style={{ margin: 0, fontWeight: 800, fontSize: "1.35rem", color: "#fff", letterSpacing: "-0.01em" }}>
              {s.value}
            </p>
            <p style={{ margin: "3px 0 0", fontSize: "0.7rem", color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "0.07em" }}>
              {s.label}
            </p>
          </div>
        ))}
      </div>

    </section>
  )
}