import { useState, useEffect } from "react"
import { ArrowUp } from "lucide-react"

export default function BackToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  if (!visible) return null

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      title="Back to top"
      style={{
        position: "fixed", bottom: "2rem", right: "2rem", zIndex: 90,
        width: 44, height: 44, borderRadius: "50%",
        backgroundColor: "var(--color-primary)", color: "#fff",
        border: "none", cursor: "pointer",
        display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: "0 4px 16px rgba(255,79,0,0.35)",
        transition: "opacity 0.2s, transform 0.2s",
        animation: "bttFadeIn 0.25s ease",
      }}
      onMouseEnter={e => e.currentTarget.style.transform = "translateY(-3px)"}
      onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
    >
      <ArrowUp size={18} />
      <style>{`@keyframes bttFadeIn { from { opacity:0; transform:translateY(8px) } to { opacity:1; transform:translateY(0) } }`}</style>
    </button>
  )
}
