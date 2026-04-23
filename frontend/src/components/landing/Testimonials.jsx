import { useEffect, useRef } from "react"

function useReveal() {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current; if (!el) return
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { el.classList.add("visible"); obs.unobserve(el) } }, { threshold: 0.08 })
    obs.observe(el); return () => obs.disconnect()
  }, [])
  return ref
}

const TESTIMONIALS = [
  { name: "Claudine Uwimana",  role: "First-time buyer · Kigali",   quote: "I found my apartment in Kiyovu within two weeks. The agent was professional and the process was clear. HomeQuest made it genuinely easy.", avatar: "CU", color: "#FF4F00" },
  { name: "Patrick Nzeyimana", role: "Property investor · Musanze", quote: "I have bought three properties through HomeQuest. The verification process gives me confidence that what I see is what I get. No surprises.", avatar: "PN", color: "#1D4ED8" },
  { name: "Diane Mukeshimana", role: "Homeowner · Rubavu",          quote: "Selling my lakeside villa felt daunting. The HomeQuest team handled everything — listings, negotiations. Sold in 3 weeks above asking price.", avatar: "DM", color: "#15803D" },
  { name: "Thierry Habimana",  role: "Business owner · Huye",       quote: "Finding commercial space in Huye used to mean endless phone calls. HomeQuest had exactly what I needed with a responsive agent. Signed in days.", avatar: "TH", color: "#6D28D9" },
]

function Stars() {
  return (
    <div style={{ display: "flex", gap: 3, marginBottom: "1rem" }}>
      {[1,2,3,4,5].map(i => (
        <svg key={i} width="13" height="13" viewBox="0 0 24 24" fill="var(--color-primary)">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  )
}

export default function Testimonials() {
  const ref = useReveal()
  return (
    <section style={{ backgroundColor: "#fff", padding: "6rem 1.5rem" }}>
      <div ref={ref} className="reveal" style={{ maxWidth: 1200, margin: "0 auto" }}>

        <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
          <span style={{ display: "inline-block", fontSize: "0.72rem", fontWeight: 700, color: "var(--color-primary)", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "0.75rem" }}>Testimonials</span>
          <h2 style={{ margin: "0 0 0.75rem", fontWeight: 800, fontSize: "clamp(1.6rem, 3vw, 2.25rem)", color: "var(--color-text)", letterSpacing: "-0.025em", lineHeight: 1.15 }}>What our clients say</h2>
          <p style={{ margin: "0 auto", fontSize: "0.9375rem", color: "var(--color-text-muted)", maxWidth: 420, lineHeight: 1.65 }}>
            Real stories from real Rwandans who found their property through HomeQuest.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1.25rem" }} className="testimonials-row">
          {TESTIMONIALS.map((t, i) => (
            <div key={t.name} style={{
              backgroundColor: i === 0 ? "#111" : "#FAFAFA",
              borderRadius: "16px",
              border: i === 0 ? "none" : "1px solid var(--color-border)",
              padding: "1.75rem",
              display: "flex", flexDirection: "column",
            }}>
              <Stars />
              <p style={{ margin: "0 0 auto", fontSize: "0.875rem", color: i === 0 ? "rgba(255,255,255,0.8)" : "var(--color-text)", lineHeight: 1.75, paddingBottom: "1.5rem" }}>
                "{t.quote}"
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", paddingTop: "1.25rem", borderTop: `1px solid ${i === 0 ? "rgba(255,255,255,0.1)" : "var(--color-border)"}` }}>
                <div style={{ width: 38, height: 38, borderRadius: "50%", backgroundColor: t.color, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.72rem", fontWeight: 700, flexShrink: 0 }}>{t.avatar}</div>
                <div>
                  <p style={{ margin: 0, fontWeight: 700, fontSize: "0.8375rem", color: i === 0 ? "#fff" : "var(--color-text)" }}>{t.name}</p>
                  <p style={{ margin: 0, fontSize: "0.72rem", color: i === 0 ? "rgba(255,255,255,0.45)" : "var(--color-text-muted)" }}>{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) { .testimonials-row { grid-template-columns: repeat(2, 1fr) !important; } }
        @media (max-width: 560px)  { .testimonials-row { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  )
}
