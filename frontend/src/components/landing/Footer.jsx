import { Link } from "react-router-dom"
import { Home, Mail, Phone, MapPin, ArrowRight } from "lucide-react"
import { useState } from "react"
import { ROUTES } from "../../constants/routes"

const COLUMNS = [
  {
    heading: "Properties",
    links: [
      { label: "Browse All",        href: ROUTES.PROPERTY_SEARCH },
      { label: "Apartments",        href: `${ROUTES.PROPERTY_SEARCH}?type=APARTMENT` },
      { label: "Houses",            href: `${ROUTES.PROPERTY_SEARCH}?type=HOUSE` },
      { label: "Villas",            href: `${ROUTES.PROPERTY_SEARCH}?type=VILLA` },
      { label: "Commercial",        href: `${ROUTES.PROPERTY_SEARCH}?type=COMMERCIAL` },
    ],
  },
  {
    heading: "About",
    links: [
      { label: "About Us",          href: ROUTES.ABOUT },
      { label: "How It Works",      href: `${ROUTES.HOME}#how-it-works` },
      { label: "Contact",           href: ROUTES.CONTACT },
      { label: "Careers",           href: "#" },
      { label: "Press",             href: "#" },
    ],
  },
  {
    heading: "Account",
    links: [
      { label: "Sign In",           href: ROUTES.LOGIN },
      { label: "Register",          href: ROUTES.REGISTER },
      { label: "Agent Portal",      href: ROUTES.AGENT },
      { label: "Owner Portal",      href: ROUTES.OWNER },
    ],
  },
]

const PROVINCES = ["Kigali City", "Northern Province", "Southern Province", "Eastern Province", "Western Province"]

export default function Footer() {
  const [email, setEmail]   = useState("")
  const [sent, setSent]     = useState(false)

  const handleSubscribe = (e) => {
    e.preventDefault()
    if (email.trim()) { setSent(true); setEmail("") }
  }

  return (
    <footer style={{ backgroundColor: "#0D0D0D", color: "#fff" }}>

      {/* ── Main grid ── */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "5rem 1.5rem 4rem", display: "grid", gridTemplateColumns: "1.6fr 1fr 1fr 1fr", gap: "3rem" }} className="footer-grid">

        {/* Brand column */}
        <div>
          <Link to={ROUTES.HOME} style={{ display: "inline-flex", alignItems: "center", gap: "0.6rem", textDecoration: "none", marginBottom: "1.5rem" }}>
            <div style={{ width: 34, height: 34, borderRadius: "9px", backgroundColor: "var(--color-primary)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Home size={16} color="#fff" />
            </div>
            <span style={{ fontWeight: 800, fontSize: "1.0625rem", color: "#fff", letterSpacing: "0.02em" }}>HomeQuest</span>
          </Link>

          <p style={{ margin: "0 0 1.75rem", fontSize: "0.875rem", color: "rgba(255,255,255,0.45)", lineHeight: 1.75, maxWidth: 280 }}>
            Rwanda's most trusted property platform. Connecting buyers, sellers, owners and agents across all five provinces.
          </p>

          {/* Contact */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem", marginBottom: "2rem" }}>
            {[
              { icon: MapPin, text: "KG 123 St, Kiyovu, Kigali, Rwanda" },
              { icon: Phone,  text: "+250 788 000 000" },
              { icon: Mail,   text: "hello@homequest.rw" },
            ].map(({ icon: Icon, text }) => (
              <div key={text} style={{ display: "flex", alignItems: "flex-start", gap: "0.6rem" }}>
                <Icon size={14} style={{ color: "var(--color-primary)", flexShrink: 0, marginTop: 2 }} />
                <span style={{ fontSize: "0.8125rem", color: "rgba(255,255,255,0.45)", lineHeight: 1.5 }}>{text}</span>
              </div>
            ))}
          </div>

          {/* Newsletter */}
          <p style={{ margin: "0 0 0.75rem", fontSize: "0.8125rem", fontWeight: 600, color: "rgba(255,255,255,0.7)" }}>
            Get new listings in your inbox
          </p>
          {sent ? (
            <p style={{ fontSize: "0.8125rem", color: "var(--color-primary)", fontWeight: 500 }}>You're subscribed!</p>
          ) : (
            <form onSubmit={handleSubscribe} style={{ display: "flex", gap: "0.5rem" }}>
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                style={{ flex: 1, padding: "0.6rem 0.875rem", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.12)", backgroundColor: "rgba(255,255,255,0.06)", color: "#fff", fontSize: "0.8125rem", fontFamily: "inherit", outline: "none", minWidth: 0 }}
              />
              <button type="submit" style={{ padding: "0.6rem 0.875rem", borderRadius: "8px", border: "none", backgroundColor: "var(--color-primary)", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", flexShrink: 0 }}>
                <ArrowRight size={15} />
              </button>
            </form>
          )}
        </div>

        {/* Nav columns */}
        {COLUMNS.map(col => (
          <div key={col.heading}>
            <p style={{ margin: "0 0 1.25rem", fontSize: "0.72rem", fontWeight: 700, color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: "0.1em" }}>{col.heading}</p>
            <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: "0.7rem" }}>
              {col.links.map(l => (
                <li key={l.label}>
                  <Link to={l.href} style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.5)", textDecoration: "none", transition: "color 0.15s" }}
                    onMouseEnter={e => e.currentTarget.style.color = "#fff"}
                    onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.5)"}
                  >{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* ── Provinces strip ── */}
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "1rem 1.5rem", display: "flex", gap: "0", flexWrap: "wrap", alignItems: "center" }}>
          <span style={{ fontSize: "0.72rem", fontWeight: 600, color: "rgba(255,255,255,0.25)", textTransform: "uppercase", letterSpacing: "0.08em", marginRight: "1.5rem", flexShrink: 0 }}>Serving</span>
          {PROVINCES.map((p, i) => (
            <div key={p} style={{ display: "flex", alignItems: "center" }}>
              {i > 0 && <span style={{ width: 1, height: 12, backgroundColor: "rgba(255,255,255,0.1)", margin: "0 1rem", display: "inline-block" }} />}
              <span style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.4)", fontWeight: 400 }}>{p}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "1.5rem 1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
        <p style={{ margin: 0, fontSize: "0.8rem", color: "rgba(255,255,255,0.25)" }}>
          © {new Date().getFullYear()} HomeQuest Rwanda Ltd. All rights reserved.
        </p>
        <div style={{ display: "flex", gap: "1.5rem" }}>
          {["Privacy Policy", "Terms of Service", "Cookie Policy"].map(l => (
            <Link key={l} to="#" style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.25)", textDecoration: "none", transition: "color 0.15s" }}
              onMouseEnter={e => e.currentTarget.style.color = "rgba(255,255,255,0.6)"}
              onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.25)"}
            >{l}</Link>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .footer-grid { grid-template-columns: 1fr 1fr !important; gap: 2.5rem !important; }
        }
        @media (max-width: 560px) {
          .footer-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </footer>
  )
}
