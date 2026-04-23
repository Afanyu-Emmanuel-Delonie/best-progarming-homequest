import { useEffect, useRef } from "react"
import { CheckCircle, ArrowRight } from "lucide-react"
import { Link } from "react-router-dom"
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

const POINTS = [
  { title: "Verified listings only",         desc: "Every property reviewed and confirmed before going live. No ghost listings." },
  { title: "Licensed agents nationwide",     desc: "All agents are licensed and background-checked across all five provinces." },
  { title: "End-to-end transaction support", desc: "From first search to title deed — we handle the paperwork and legal process." },
  { title: "Transparent pricing",            desc: "No hidden fees. Full cost breakdown on every listing." },
  { title: "Rwanda-first platform",          desc: "Built for the Rwandan market — local regulations, local currency, local expertise." },
]

export default function WhyUs() {
  const ref = useReveal()
  return (
    <section style={{ backgroundColor: "#fff", padding: "6rem 1.5rem" }}>
      <div ref={ref} className="reveal" style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6rem", alignItems: "center" }} className="why-grid reveal">

        {/* Image */}
        <div style={{ position: "relative" }}>
          <div style={{ borderRadius: "20px", overflow: "hidden", height: 520 }}>
            <img src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80" alt="HomeQuest agent" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
          {/* Floating card — inside the image boundary */}
          <div style={{ position: "absolute", bottom: "1.75rem", left: "1.75rem", right: "1.75rem", backgroundColor: "#fff", borderRadius: "14px", padding: "1.25rem 1.5rem", boxShadow: "0 8px 32px rgba(0,0,0,0.14)", display: "flex", alignItems: "center", gap: "1.25rem" }}>
            <div>
              <p style={{ margin: "0 0 0.1rem", fontWeight: 900, fontSize: "2rem", color: "var(--color-primary)", lineHeight: 1, letterSpacing: "-0.03em" }}>98%</p>
              <p style={{ margin: 0, fontSize: "0.78rem", color: "var(--color-text-muted)" }}>Client satisfaction · 2024</p>
            </div>
            <div style={{ width: 1, height: 40, backgroundColor: "var(--color-border)", flexShrink: 0 }} />
            <div>
              <p style={{ margin: "0 0 0.1rem", fontWeight: 900, fontSize: "2rem", color: "var(--color-text)", lineHeight: 1, letterSpacing: "-0.03em" }}>180+</p>
              <p style={{ margin: 0, fontSize: "0.78rem", color: "var(--color-text-muted)" }}>Verified agents</p>
            </div>
            <div style={{ width: 1, height: 40, backgroundColor: "var(--color-border)", flexShrink: 0 }} />
            <div>
              <p style={{ margin: "0 0 0.1rem", fontWeight: 900, fontSize: "2rem", color: "var(--color-text)", lineHeight: 1, letterSpacing: "-0.03em" }}>5</p>
              <p style={{ margin: 0, fontSize: "0.78rem", color: "var(--color-text-muted)" }}>Provinces covered</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div>
          <span style={{ display: "inline-block", fontSize: "0.72rem", fontWeight: 700, color: "var(--color-primary)", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "0.75rem" }}>Why HomeQuest</span>
          <h2 style={{ margin: "0 0 1rem", fontWeight: 800, fontSize: "clamp(1.6rem, 3vw, 2.25rem)", color: "var(--color-text)", lineHeight: 1.15, letterSpacing: "-0.025em" }}>
            The smarter way to find<br />property in Rwanda
          </h2>
          <p style={{ margin: "0 0 2.25rem", fontSize: "0.9375rem", color: "var(--color-text-muted)", lineHeight: 1.75 }}>
            We built HomeQuest because finding property in Rwanda was too complicated, too opaque and too risky. We fixed that.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "2.5rem" }}>
            {POINTS.map(p => (
              <div key={p.title} style={{ display: "flex", gap: "0.875rem", alignItems: "flex-start", padding: "1rem 1.125rem", borderRadius: "10px", backgroundColor: "#FAFAFA", border: "1px solid var(--color-border)" }}>
                <CheckCircle size={17} style={{ color: "var(--color-primary)", flexShrink: 0, marginTop: 1 }} />
                <div>
                  <p style={{ margin: "0 0 0.15rem", fontWeight: 600, fontSize: "0.875rem", color: "var(--color-text)" }}>{p.title}</p>
                  <p style={{ margin: 0, fontSize: "0.8125rem", color: "var(--color-text-muted)", lineHeight: 1.55 }}>{p.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <Link to={ROUTES.REGISTER} style={{ display: "inline-flex", alignItems: "center", gap: "0.45rem", padding: "0.75rem 1.75rem", borderRadius: "9px", backgroundColor: "var(--color-primary)", color: "#fff", fontWeight: 600, fontSize: "0.9rem", textDecoration: "none" }}>
            Start for free <ArrowRight size={15} />
          </Link>
        </div>
      </div>

      <style>{`@media (max-width: 900px) { .why-grid { grid-template-columns: 1fr !important; gap: 3rem !important; } }`}</style>
    </section>
  )
}
