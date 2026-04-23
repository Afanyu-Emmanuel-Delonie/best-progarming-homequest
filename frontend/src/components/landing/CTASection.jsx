import { useNavigate } from "react-router-dom"
import { ArrowRight } from "lucide-react"
import { ROUTES } from "../../constants/routes"

export default function CTASection() {
  const navigate = useNavigate()

  return (
    <section style={{ backgroundColor: "#fff", padding: "6rem 1.5rem" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ position: "relative", borderRadius: "20px", overflow: "hidden", minHeight: 420 }}>
          <img
            src="https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=1600&q=80"
            alt="Find your home"
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
          />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 60%, transparent 100%)" }} />
          <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "4rem 3.5rem", maxWidth: 560 }}>
            <span style={{ display: "inline-block", fontSize: "0.72rem", fontWeight: 700, color: "var(--color-primary)", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "1rem" }}>Get Started</span>
            <h2 style={{ margin: "0 0 1rem", fontWeight: 800, fontSize: "clamp(1.75rem, 3.5vw, 2.75rem)", color: "#fff", letterSpacing: "-0.025em", lineHeight: 1.12 }}>
              Find your next property in Rwanda
            </h2>
            <p style={{ margin: "0 0 2rem", fontSize: "1rem", color: "rgba(255,255,255,0.6)", lineHeight: 1.7 }}>
              Thousands of verified listings across all five provinces. Start your search today.
            </p>
            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
              <button onClick={() => navigate(ROUTES.PROPERTY_SEARCH)} style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", padding: "0.75rem 1.75rem", borderRadius: "9px", fontWeight: 600, fontSize: "0.9rem", border: "none", cursor: "pointer", fontFamily: "inherit", backgroundColor: "var(--color-primary)", color: "#fff" }}>
                Browse Properties <ArrowRight size={15} />
              </button>
              <button onClick={() => navigate(ROUTES.REGISTER)} style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", padding: "0.75rem 1.75rem", borderRadius: "9px", fontWeight: 600, fontSize: "0.9rem", border: "1px solid rgba(255,255,255,0.3)", cursor: "pointer", fontFamily: "inherit", backgroundColor: "transparent", color: "#fff" }}>
                Create Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
