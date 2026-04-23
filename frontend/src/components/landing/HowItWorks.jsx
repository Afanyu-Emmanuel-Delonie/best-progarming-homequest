import { useEffect, useRef } from "react"
import { Link } from "react-router-dom"
import { Search, FileText, KeyRound, ArrowRight } from "lucide-react"
import { ROUTES } from "../../constants/routes"

function useReveal(threshold = 0.12) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current; if (!el) return
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { el.classList.add("visible"); obs.unobserve(el) } }, { threshold })
    obs.observe(el); return () => obs.disconnect()
  }, [])
  return ref
}

const STEPS = [
  { icon: Search,   step: "01", title: "Search & Discover",  desc: "Browse thousands of verified listings across all five provinces. Filter by location, type, price and more." },
  { icon: FileText, step: "02", title: "Apply & Negotiate",  desc: "Submit your offer directly through the platform. Our agents handle the paperwork, negotiations and due diligence." },
  { icon: KeyRound, step: "03", title: "Move In",            desc: "Once your application is accepted and the transaction is complete, collect your keys and start your new chapter." },
]

export default function HowItWorks() {
  const ref = useReveal()
  return (
    <section style={{ backgroundColor: "#111", padding: "6rem 1.5rem" }}>
      <div ref={ref} className="reveal" style={{ maxWidth: 1200, margin: "0 auto" }}>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", marginBottom: "4rem" }}>
          <span style={{ display: "inline-block", fontSize: "0.72rem", fontWeight: 700, color: "var(--color-primary)", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "0.75rem" }}>Process</span>
          <h2 style={{ margin: "0 0 1rem", fontWeight: 800, fontSize: "clamp(1.6rem, 3vw, 2.25rem)", color: "#fff", letterSpacing: "-0.025em", lineHeight: 1.15 }}>How It Works</h2>
          <p style={{ margin: 0, fontSize: "0.9375rem", color: "rgba(255,255,255,0.5)", maxWidth: 460, lineHeight: 1.7 }}>
            From search to keys in hand — HomeQuest makes finding your property in Rwanda simple and transparent.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0", position: "relative" }} className="steps-grid">

          {/* Connecting line */}
          <div style={{ position: "absolute", top: 28, left: "calc(16.66% + 1rem)", right: "calc(16.66% + 1rem)", height: 1, backgroundColor: "rgba(255,255,255,0.1)", zIndex: 0 }} className="steps-line" />

          {STEPS.map((s, i) => {
            const Icon = s.icon
            return (
              <div key={s.step} style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", padding: "0 2rem", position: "relative", zIndex: 1 }}>
                {/* Circle */}
                <div style={{ width: 56, height: 56, borderRadius: "50%", backgroundColor: i === 1 ? "var(--color-primary)" : "#1E1E1E", border: `1px solid ${i === 1 ? "var(--color-primary)" : "rgba(255,255,255,0.12)"}`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.75rem", flexShrink: 0 }}>
                  <Icon size={22} color={i === 1 ? "#fff" : "rgba(255,255,255,0.5)"} />
                </div>

                <span style={{ display: "block", fontSize: "0.68rem", fontWeight: 700, color: "var(--color-primary)", letterSpacing: "0.1em", marginBottom: "0.5rem" }}>{s.step}</span>
                <p style={{ margin: "0 0 0.75rem", fontWeight: 700, fontSize: "1.0625rem", color: "#fff" }}>{s.title}</p>
                <p style={{ margin: 0, fontSize: "0.875rem", color: "rgba(255,255,255,0.45)", lineHeight: 1.7 }}>{s.desc}</p>
              </div>
            )
          })}
        </div>

        <div style={{ textAlign: "center", marginTop: "3.5rem" }}>
          <Link to={ROUTES.BUYING_GUIDE} style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.8rem 2rem", borderRadius: "10px", backgroundColor: "var(--color-primary)", color: "#fff", fontWeight: 600, fontSize: "0.9rem", textDecoration: "none" }}>
            See How It Works <ArrowRight size={15} />
          </Link>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .steps-grid { grid-template-columns: 1fr !important; gap: 2.5rem !important; }
          .steps-line { display: none !important; }
        }
      `}</style>
    </section>
  )
}
