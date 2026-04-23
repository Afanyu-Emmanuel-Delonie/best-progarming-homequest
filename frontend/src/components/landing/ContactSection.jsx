import { useState, useEffect, useRef } from "react"
import { Mail, Phone, MapPin, Clock, Send } from "lucide-react"
import toast from "react-hot-toast"

function useReveal() {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current; if (!el) return
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { el.classList.add("visible"); obs.unobserve(el) } }, { threshold: 0.08 })
    obs.observe(el); return () => obs.disconnect()
  }, [])
  return ref
}

const CONTACT_INFO = [
  { icon: MapPin, value: "KG 123 St, Kiyovu, Kigali, Rwanda" },
  { icon: Phone,  value: "+250 788 000 000" },
  { icon: Mail,   value: "hello@homequest.rw" },
  { icon: Clock,  value: "Mon – Fri, 8:00 AM – 6:00 PM" },
]

const inp = {
  width: "100%", boxSizing: "border-box",
  padding: "0.7rem 1rem", borderRadius: "9px",
  border: "1px solid var(--color-border)",
  backgroundColor: "var(--color-bg-muted)", fontSize: "0.875rem",
  color: "var(--color-text)", fontFamily: "inherit",
  outline: "none", transition: "border-color 0.15s",
}

export default function ContactSection() {
  const ref               = useReveal()
  const [form, setForm]       = useState({ name: "", email: "", subject: "", message: "" })
  const [loading, setLoading] = useState(false)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      toast.error("Please fill in all required fields.")
      return
    }
    setLoading(true)
    await new Promise(r => setTimeout(r, 1000))
    setLoading(false)
    toast.success("Message sent! We'll get back to you within 24 hours.")
    setForm({ name: "", email: "", subject: "", message: "" })
  }

  return (
    <section style={{ backgroundColor: "#fff", padding: "6rem 1.5rem" }}>
      <div ref={ref} className="reveal contact-grid" style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1.6fr", gap: "6rem", alignItems: "start" }}>

        {/* Left */}
        <div>
          <span style={{ display: "inline-block", fontSize: "0.72rem", fontWeight: 700, color: "var(--color-primary)", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "0.875rem" }}>Contact</span>
          <h2 style={{ margin: "0 0 1rem", fontWeight: 800, fontSize: "clamp(1.6rem, 3vw, 2.25rem)", color: "var(--color-text)", letterSpacing: "-0.025em", lineHeight: 1.15 }}>
            Get in touch<br />with our team
          </h2>
          <p style={{ margin: "0 0 2.5rem", fontSize: "0.9375rem", color: "var(--color-text-muted)", lineHeight: 1.75 }}>
            Have a question about a listing, need help with your account, or want to partner with us? We're here.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}>
            {CONTACT_INFO.map(({ icon: Icon, value }) => (
              <div key={value} style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <Icon size={15} style={{ color: "var(--color-primary)", flexShrink: 0 }} />
                <span style={{ fontSize: "0.875rem", color: "var(--color-text-muted)" }}>{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right — form */}
        <div style={{ backgroundColor: "#FAFAFA", borderRadius: "16px", border: "1px solid var(--color-border)", padding: "2.5rem" }}>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.875rem" }}>
              <Field label="Full name">
                <input style={inp} value={form.name} onChange={e => set("name", e.target.value)} placeholder="Amina Uwase"
                  onFocus={e => e.target.style.borderColor = "var(--color-primary)"}
                  onBlur={e => e.target.style.borderColor = "var(--color-border)"}
                />
              </Field>
              <Field label="Email">
                <input style={inp} type="email" value={form.email} onChange={e => set("email", e.target.value)} placeholder="amina@example.com"
                  onFocus={e => e.target.style.borderColor = "var(--color-primary)"}
                  onBlur={e => e.target.style.borderColor = "var(--color-border)"}
                />
              </Field>
            </div>

            <Field label="Subject">
              <input style={inp} value={form.subject} onChange={e => set("subject", e.target.value)} placeholder="How can we help?"
                onFocus={e => e.target.style.borderColor = "var(--color-primary)"}
                onBlur={e => e.target.style.borderColor = "var(--color-border)"}
              />
            </Field>

            <Field label="Message">
              <textarea
                style={{ ...inp, resize: "vertical", minHeight: 130 }}
                value={form.message} onChange={e => set("message", e.target.value)}
                placeholder="Tell us more about your enquiry…"
                onFocus={e => e.target.style.borderColor = "var(--color-primary)"}
                onBlur={e => e.target.style.borderColor = "var(--color-border)"}
              />
            </Field>

            <button type="submit" disabled={loading} style={{
              display: "inline-flex", alignItems: "center", gap: "0.45rem",
              padding: "0.75rem 1.75rem", borderRadius: "9px", border: "none",
              backgroundColor: "var(--color-primary)", color: "#fff",
              fontWeight: 600, fontSize: "0.9rem", fontFamily: "inherit",
              cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1,
              alignSelf: "flex-start", marginTop: "0.25rem",
            }}>
              <Send size={15} />
              {loading ? "Sending…" : "Send Message"}
            </button>
          </form>
        </div>
      </div>

      <style>{`@media (max-width: 900px) { .contact-grid { grid-template-columns: 1fr !important; gap: 3rem !important; } }`}</style>
    </section>
  )
}

function Field({ label, children }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
      <label style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--color-text-muted)" }}>{label}</label>
      {children}
    </div>
  )
}
