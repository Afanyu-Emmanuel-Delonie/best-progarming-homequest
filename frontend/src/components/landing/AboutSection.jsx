import { useEffect, useRef } from "react"
import { Link } from "react-router-dom"
import { ArrowRight } from "lucide-react"
import { ROUTES } from "../../constants/routes"

function useReveal() {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current; if (!el) return
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { el.classList.add("visible"); obs.unobserve(el) } }, { threshold: 0.1 })
    obs.observe(el); return () => obs.disconnect()
  }, [])
  return ref
}

export default function AboutSection() {
  const ref = useReveal()
  return (
    <section style={{ backgroundColor: "#111", padding: "6rem 1.5rem" }}>
      <div ref={ref} className="reveal about-sec-grid" style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5rem", alignItems: "center" }}>

        {/* Left — text */}
        <div>
          <span style={{ display: "inline-block", fontSize: "0.72rem", fontWeight: 700, color: "var(--color-primary)", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "0.875rem" }}>About HomeQuest</span>
          <h2 style={{ margin: "0 0 1.5rem", fontWeight: 800, fontSize: "clamp(1.6rem, 3vw, 2.5rem)", color: "#fff", lineHeight: 1.12, letterSpacing: "-0.025em" }}>
            Rwanda's most trusted<br />property platform
          </h2>
          <p style={{ margin: "0 0 1.25rem", fontSize: "0.9375rem", color: "rgba(255,255,255,0.5)", lineHeight: 1.8 }}>
            Founded in Kigali, HomeQuest connects buyers, sellers, owners and agents across all five provinces of Rwanda. We believe everyone deserves a transparent, stress-free path to their next property.
          </p>
          <p style={{ margin: "0 0 2.25rem", fontSize: "0.9375rem", color: "rgba(255,255,255,0.5)", lineHeight: 1.8 }}>
            Since launch we have facilitated over RWF 4 billion in transactions, listed 2,400+ properties and built a network of 180+ verified agents — and we are just getting started.
          </p>
          <Link to={ROUTES.ABOUT} style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", fontSize: "0.9rem", fontWeight: 600, color: "var(--color-primary)", textDecoration: "none" }}>
            Our full story <ArrowRight size={15} />
          </Link>
        </div>

        {/* Right — image */}
        <div style={{ borderRadius: "20px", overflow: "hidden", height: 460 }}>
          <img
            src="https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80"
            alt="Kigali"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>
      </div>

      <style>{`@media (max-width: 900px) { .about-sec-grid { grid-template-columns: 1fr !important; gap: 3rem !important; } }`}</style>
    </section>
  )
}
