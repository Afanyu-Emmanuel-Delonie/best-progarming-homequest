import { useState, useEffect } from "react"
import { Star, Phone, Building2, X, Share2, Link2, MessageCircle, MapPin, UserRound, Loader2 } from "lucide-react"
import { agentsApi } from "../../api/agents.api"

function AgentCard({ a, onClick }) {
  const [hovered, setHovered] = useState(false)

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        textAlign: "left", background: "#fff", border: "1px solid var(--color-border)",
        borderRadius: "16px", overflow: "hidden", cursor: "pointer", padding: 0,
        fontFamily: "inherit", width: "100%",
        boxShadow: hovered ? "0 12px 32px rgba(0,0,0,0.12)" : "0 1px 4px rgba(0,0,0,0.04)",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        transition: "box-shadow 0.25s, transform 0.25s",
      }}
    >
      <div style={{ height: 200, overflow: "hidden", position: "relative", backgroundColor: "var(--color-bg-muted)" }}>
        <img
          src={a.profileImage || "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80"}
          alt={`${a.firstName} ${a.lastName}`}
          style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top", transform: hovered ? "scale(1.06)" : "scale(1)", transition: "transform 0.4s ease" }}
        />
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.1) 60%)",
          opacity: hovered ? 1 : 0,
          transition: "opacity 0.25s",
          display: "flex", alignItems: "flex-end", justifyContent: "center",
          paddingBottom: "1.1rem",
        }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", backgroundColor: "var(--color-primary)", color: "#fff", fontWeight: 600, fontSize: "0.8rem", padding: "0.45rem 1rem", borderRadius: "20px" }}>
            <UserRound size={13} /> View Profile
          </span>
        </div>
        <div style={{ position: "absolute", top: "0.75rem", right: "0.75rem", display: "flex", alignItems: "center", gap: "0.2rem", backgroundColor: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)", borderRadius: "6px", padding: "0.2rem 0.5rem" }}>
          <Star size={10} fill="#F97316" color="#F97316" />
          <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "#fff" }}>{a.rating}</span>
        </div>
      </div>

      <div style={{ padding: "1rem 1.1rem 1.1rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.4rem" }}>
          <div>
            <p style={{ margin: 0, fontWeight: 700, fontSize: "0.9rem", color: "var(--color-text)" }}>{a.firstName} {a.lastName}</p>
            <p style={{ margin: "0.15rem 0 0", fontSize: "0.72rem", color: "var(--color-text-muted)" }}>{a.companyName}</p>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: "0.65rem", borderTop: "1px solid var(--color-border)", marginTop: "0.65rem" }}>
          <span style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}><strong style={{ color: "var(--color-text)" }}>{a.listings}</strong> listings</span>
          <span style={{ fontSize: "0.72rem", fontWeight: 600, color: "var(--color-primary)" }}>View profile →</span>
        </div>
      </div>
    </button>
  )
}

export default function TopAgents() {
  const [agents, setAgents]   = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)
  const agent = agents.find((a) => a.id === selected)
  const social = agent?.social ?? { twitter: "#", linkedin: "#", instagram: "#" }

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    agentsApi.getTop(8)
      .then((rows) => { if (!cancelled) setAgents(Array.isArray(rows) ? rows : []) })
      .catch(() => { if (!cancelled) setAgents([]) })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [])

  const onLive = () => {
    agentsApi.getTop(8).then((rows) => setAgents(Array.isArray(rows) ? rows : [])).catch(() => {})
  }

  useEffect(() => {
    window.addEventListener("homequest:live", onLive)
    return () => window.removeEventListener("homequest:live", onLive)
  }, [])

  return (
    <section id="agents" style={{ padding: "5rem 1.5rem", backgroundColor: "#FAFAFA" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>

        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--color-primary)", textTransform: "uppercase", letterSpacing: "0.12em" }}>Our Team</span>
          <h2 style={{ margin: "0.5rem 0 0.75rem", fontWeight: 800, fontSize: "clamp(1.6rem, 3vw, 2.25rem)", color: "var(--color-text)", letterSpacing: "-0.025em" }}>
            Meet Our Top Agents
          </h2>
          <p style={{ margin: 0, color: "var(--color-text-muted)", fontSize: "0.9375rem", maxWidth: 440, marginInline: "auto" }}>
            Verified professionals with deep local knowledge ready to guide you.
          </p>
        </div>

        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", padding: "3rem", color: "var(--color-text-muted)" }}>
            <Loader2 size={28} style={{ animation: "spin 0.9s linear infinite" }} />
          </div>
        ) : agents.length === 0 ? (
          <p style={{ textAlign: "center", color: "var(--color-text-muted)" }}>No agents to show yet.</p>
        ) : (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "1.25rem", justifyContent: "center" }}>
            {agents.map((a) => (
              <div key={a.id} style={{ width: "calc(25% - 1rem)", minWidth: 200, maxWidth: 260, flex: "1 1 200px" }}>
                <AgentCard a={a} onClick={() => setSelected(a.id)} />
              </div>
            ))}
          </div>
        )}
      </div>

      {agent && (
        <div
          style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.55)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}
          onClick={() => setSelected(null)}
        >
          <div
            style={{ backgroundColor: "#fff", borderRadius: "20px", width: "100%", maxWidth: 460, overflow: "hidden" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ height: 210, overflow: "hidden", position: "relative" }}>
              <img src={agent.profileImage || "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80"} alt={agent.firstName} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 55%)" }} />
              <button onClick={() => setSelected(null)} style={{ position: "absolute", top: "1rem", right: "1rem", width: 32, height: 32, borderRadius: "50%", border: "none", backgroundColor: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <X size={15} />
              </button>
              <div style={{ position: "absolute", bottom: "1rem", left: "1.25rem" }}>
                <p style={{ margin: 0, fontWeight: 800, fontSize: "1.2rem", color: "#fff" }}>{agent.firstName} {agent.lastName}</p>
                <p style={{ margin: "0.15rem 0 0", fontSize: "0.78rem", color: "rgba(255,255,255,0.7)" }}>{agent.licenseNumber}</p>
              </div>
              <div style={{ position: "absolute", bottom: "1rem", right: "1rem", display: "flex", alignItems: "center", gap: "0.25rem", backgroundColor: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)", borderRadius: "8px", padding: "0.3rem 0.6rem" }}>
                <Star size={12} fill="#F97316" color="#F97316" />
                <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "#fff" }}>{agent.rating}</span>
              </div>
            </div>

            <div style={{ padding: "1.5rem" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem", fontSize: "0.8125rem", color: "var(--color-text-muted)", marginBottom: "1rem" }}>
                <span style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}><Building2 size={13} style={{ color: "var(--color-primary)" }} />{agent.companyName}</span>
                <span style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}><MapPin size={13} style={{ color: "var(--color-primary)" }} />{agent.location}</span>
              </div>

              <p style={{ margin: "0 0 1.25rem", fontSize: "0.8375rem", color: "var(--color-text-muted)", lineHeight: 1.75 }}>{agent.bio}</p>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: "1rem", borderTop: "1px solid var(--color-border)" }}>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  {[["twitter", Share2, "#1DA1F2"], ["linkedin", Link2, "#0A66C2"], ["instagram", MessageCircle, "#E1306C"]].map(([key, Icon, color]) => (
                    <a key={key} href={social[key] || "#"} target="_blank" rel="noreferrer"
                      style={{ width: 34, height: 34, borderRadius: "8px", border: "1px solid var(--color-border)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-text-muted)", textDecoration: "none", transition: "border-color 0.15s, color 0.15s" }}
                      onMouseEnter={(e) => { e.currentTarget.style.borderColor = color; e.currentTarget.style.color = color }}
                      onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--color-border)"; e.currentTarget.style.color = "var(--color-text-muted)" }}
                    >
                      <Icon size={15} />
                    </a>
                  ))}
                </div>
                <a href={`tel:${agent.phone}`}
                  style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", padding: "0.55rem 1.25rem", borderRadius: "8px", backgroundColor: "var(--color-primary)", color: "#fff", fontWeight: 600, fontSize: "0.8375rem", textDecoration: "none" }}
                >
                  <Phone size={13} /> {agent.phone}
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 640px) {
          #agents .agent-grid > div { min-width: calc(50% - 0.625rem) !important; }
        }
      `}</style>
    </section>
  )
}
