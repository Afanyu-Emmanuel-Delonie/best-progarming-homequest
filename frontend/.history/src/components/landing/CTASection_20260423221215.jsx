import { useNavigate } from "react-router-dom"
import { ArrowRight, Home, Briefcase } from "lucide-react"
import { ROUTES } from "../../constants/routes"

export default function CTASection() {
  const navigate = useNavigate()

  return (
    <section style={{ backgroundColor: "#fff", padding: "6rem 1.5rem" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gap: "1.25rem" }} className="cta-cards">

        <CTACard
          image="https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80"
          icon={<Home size={20} color="#fff" />}
          iconBg="rgba(255,255,255,0.15)"
          title="Find Your Home"
          desc="Browse verified listings across Rwanda. Filter by province, type and budget."
          cta="Browse Properties"
          onClick={() => navigate(ROUTES.PROPERTY_SEARCH)}
          ctaStyle={{ backgroundColor: "#fff", color: "var(--color-text)" }}
        />
      </div>

      <style>{`@media (max-width: 768px) { .cta-cards { grid-template-columns: 1fr !important; } }`}</style>
    </section>
  )
}

function CTACard({ image, icon, iconBg, title, desc, cta, onClick, ctaStyle }) {
  return (
    <div style={{ position: "relative", borderRadius: "20px", overflow: "hidden", minHeight: 360 }}>
      <img src={image} alt={title} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.12) 65%)" }} />
      <div style={{ position: "relative", zIndex: 1, height: "100%", display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "2.25rem" }}>
        <div style={{ width: 44, height: 44, borderRadius: "11px", backgroundColor: iconBg, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1rem" }}>
          {icon}
        </div>
        <p style={{ margin: "0 0 0.4rem", fontWeight: 800, fontSize: "1.375rem", color: "#fff", letterSpacing: "-0.02em" }}>{title}</p>
        <p style={{ margin: "0 0 1.5rem", fontSize: "0.9rem", color: "rgba(255,255,255,0.65)", lineHeight: 1.65 }}>{desc}</p>
        <button onClick={onClick} style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", padding: "0.7rem 1.5rem", borderRadius: "9px", fontWeight: 600, fontSize: "0.875rem", border: "none", cursor: "pointer", fontFamily: "inherit", alignSelf: "flex-start", ...ctaStyle }}>
          {cta} <ArrowRight size={14} />
        </button>
      </div>
    </div>
  )
}
