import { useState, useEffect } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { Home, Menu, X } from "lucide-react"
import { ROUTES } from "../../constants/routes"

const LINKS = [
  { label: "Home",        href: ROUTES.HOME },
  { label: "Properties",  href: ROUTES.PROPERTY_SEARCH },
  { label: "How It Works",href: "/#how-it-works", section: "how-it-works" },
  { label: "Agents",      href: "/#agents",       section: "agents" },
  { label: "About",       href: "/#about",        section: "about" },
  { label: "Contact",     href: "/#contact",      section: "contact" },
]

const SECTIONS = LINKS.filter(l => l.section).map(l => l.section)

export default function LandingNavbar() {
  const { pathname }            = useLocation()
  const navigate                = useNavigate()
  const [open, setOpen]         = useState(false)
  const [scrollY, setScrollY]   = useState(0)
  const [activeSection, setActiveSection] = useState(null)

  // Scroll listener for solid/transparent state
  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  // Scroll spy — only active on pages that have these sections
  useEffect(() => {
    if (pathname !== "/" && pathname !== "/properties") {
      setActiveSection(null)
      return
    }
    const observers = []
    SECTIONS.forEach(id => {
      const el = document.getElementById(id)
      if (!el) return
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(id) },
        { rootMargin: "-50% 0px -45% 0px", threshold: 0 }
      )
      obs.observe(el)
      observers.push(obs)
    })
    return () => observers.forEach(o => o.disconnect())
  }, [pathname])

  const isHome    = pathname === "/"
  const scrolling = scrollY > 40
  const solid     = !isHome || scrolling || open

  const shadow     = scrolling ? "0 2px 10px rgba(0,0,0,0.08)" : "none"
  const textColor  = solid ? "var(--color-text)"       : "#fff"
  const mutedColor = solid ? "var(--color-text-muted)" : "rgba(255,255,255,0.7)"

  const isActive = (l) => {
    if (l.section) return activeSection === l.section
    if (l.href === "/") return pathname === "/" && !activeSection
    return pathname.startsWith(l.href)
  }

  const handleNavClick = (e, l) => {
    if (!l.section) return
    e.preventDefault()
    setOpen(false)
    const scroll = () => document.getElementById(l.section)?.scrollIntoView({ behavior: "smooth", block: "start" })
    if (pathname !== "/" && pathname !== "/properties") {
      navigate("/")
      setTimeout(scroll, 300)
    } else {
      scroll()
    }
  }

  return (
    <>
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
        height: 64,
        backgroundColor: solid ? "#fff" : "transparent",
        borderBottom: solid ? "1px solid var(--color-border)" : "1px solid rgba(255,255,255,0.1)",
        backdropFilter: solid ? "none" : "blur(6px)",
        boxShadow: shadow,
        transition: "background-color 0.25s, border-color 0.25s, box-shadow 0.25s",
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 1.5rem", height: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1.5rem" }}>

          {/* Logo */}
          <Link to={ROUTES.HOME} style={{ display: "flex", alignItems: "center", gap: "0.55rem", textDecoration: "none", flexShrink: 0 }}>
            <div style={{ width: 32, height: 32, borderRadius: "8px", backgroundColor: "var(--color-primary)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Home size={16} color="#fff" />
            </div>
            <span style={{ fontWeight: 700, fontSize: "1rem", color: textColor, transition: "color 0.25s" }}>HomeQuest</span>
          </Link>

          {/* Desktop links */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.25rem", flex: 1, justifyContent: "center" }} className="nav-links">
            {LINKS.map(l => {
              const active = isActive(l)
              return (
                <Link
                  key={l.href} to={l.href}
                  className={`nav-link${active ? " active" : ""}`}
                  style={{ color: active ? "var(--color-primary)" : mutedColor, position: "relative" }}
                  onClick={e => handleNavClick(e, l)}
                >
                  {l.label}
                  {active && (
                    <span style={{ position: "absolute", bottom: -2, left: "50%", transform: "translateX(-50%)", width: 4, height: 4, borderRadius: "50%", backgroundColor: "var(--color-primary)" }} />
                  )}
                </Link>
              )
            })}
          </div>

          {/* Auth buttons */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexShrink: 0 }} className="nav-auth">
            <Link to={ROUTES.LOGIN} style={{
              padding: "0.45rem 1rem", borderRadius: "7px", fontSize: "0.875rem", fontWeight: 600,
              textDecoration: "none", transition: "all 0.25s", color: textColor,
              border: `1px solid ${solid ? "var(--color-border)" : "rgba(255,255,255,0.35)"}`,
              backgroundColor: "transparent",
            }}>
              Sign in
            </Link>
            <Link to={ROUTES.REGISTER} style={{ padding: "0.45rem 1rem", borderRadius: "7px", fontSize: "0.875rem", fontWeight: 600, textDecoration: "none", color: "#fff", backgroundColor: "var(--color-primary)" }}>
              Get started
            </Link>
          </div>

          {/* Hamburger */}
          <button onClick={() => setOpen(v => !v)} className="nav-hamburger"
            style={{ display: "none", alignItems: "center", justifyContent: "center", width: 36, height: 36, borderRadius: "7px", border: `1px solid ${solid ? "var(--color-border)" : "rgba(255,255,255,0.35)"}`, background: "none", cursor: "pointer", color: textColor, flexShrink: 0, transition: "all 0.25s" }}>
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      {open && (
        <div style={{ position: "fixed", top: 64, left: 0, right: 0, backgroundColor: "#fff", borderBottom: "1px solid var(--color-border)", zIndex: 49, padding: "1rem 1.5rem", display: "flex", flexDirection: "column", gap: "0.25rem" }}>
          {LINKS.map(l => {
            const active = isActive(l)
            return (
              <Link key={l.href} to={l.href} onClick={e => { handleNavClick(e, l); if (!l.section) setOpen(false) }} style={{
                padding: "0.65rem 0.75rem", borderRadius: "8px", fontSize: "0.9rem", fontWeight: active ? 600 : 500,
                textDecoration: "none",
                color: active ? "var(--color-primary)" : "var(--color-text)",
                backgroundColor: active ? "#FFF5F0" : "transparent",
              }}>
                {l.label}
              </Link>
            )
          })}
          <div style={{ display: "flex", gap: "0.6rem", marginTop: "0.75rem", paddingTop: "0.75rem", borderTop: "1px solid var(--color-border)" }}>
            <Link to={ROUTES.LOGIN} onClick={() => setOpen(false)} style={{ flex: 1, padding: "0.6rem", borderRadius: "8px", fontSize: "0.875rem", fontWeight: 600, textDecoration: "none", color: "var(--color-text)", border: "1px solid var(--color-border)", textAlign: "center" }}>
              Sign in
            </Link>
            <Link to={ROUTES.REGISTER} onClick={() => setOpen(false)} style={{ flex: 1, padding: "0.6rem", borderRadius: "8px", fontSize: "0.875rem", fontWeight: 600, textDecoration: "none", color: "#fff", backgroundColor: "var(--color-primary)", textAlign: "center" }}>
              Get started
            </Link>
          </div>
        </div>
      )}

      <style>{`
        .nav-link {
          padding: 0.4rem 0.65rem;
          border-radius: 7px;
          font-size: 0.875rem;
          font-weight: 500;
          text-decoration: none;
          transition: color 0.2s, background-color 0.2s;
          white-space: nowrap;
        }
        .nav-link:hover { background-color: rgba(128,128,128,0.08); }
        .nav-link.active { font-weight: 600; }
        @media (max-width: 768px) {
          .nav-links     { display: none !important; }
          .nav-auth      { display: none !important; }
          .nav-hamburger { display: flex !important; }
        }
      `}</style>
    </>
  )
}
