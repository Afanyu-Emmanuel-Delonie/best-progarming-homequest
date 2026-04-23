import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Eye, EyeOff, Home, Loader2 } from "lucide-react"
import { useDispatch } from "react-redux"
import { setCredentials } from "../../store/slices/authSlice"
import toast from "react-hot-toast"
import { authService } from "../../services/authService"
import { ROUTES } from "../../constants/routes"

const ROLE_REDIRECT = {
  ROLE_ADMIN:         ROUTES.ADMIN,
  ROLE_AGENT:         ROUTES.AGENT,
  ROLE_CLIENT:        ROUTES.CLIENT,
  ROLE_OWNER:         ROUTES.OWNER,
  ROLE_COMPANY_ADMIN: ROUTES.COMPANY,
  ROLE_MANAGER:       ROUTES.COMPANY,
}

export default function Login() {
  const dispatch  = useDispatch()
  const navigate  = useNavigate()
  const [form, setForm]       = useState({ email: "", password: "" })
  const [showPw, setShowPw]   = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState("")

  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setError("") }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.email.trim() || !form.password) { setError("Please fill in all fields"); return }
    setLoading(true)
    try {
      const data = await authService.login(form)
      dispatch(setCredentials({ user: data, token: data.token, role: data.role }))
      toast.success(`Welcome back!`)
      navigate(ROLE_REDIRECT[data.role] ?? ROUTES.AGENT)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--color-bg-muted)", display: "flex", alignItems: "center", justifyContent: "center", padding: "1.5rem" }} className="auth-page">
      <div style={{ width: "100%", maxWidth: 400, backgroundColor: "#fff", borderRadius: "14px", border: "1px solid var(--color-border)", padding: "2.5rem", boxShadow: "0 2px 12px #0000000a" }} className="auth-card">

        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.55rem", marginBottom: "2rem" }}>
          <div style={{ width: 32, height: 32, borderRadius: "8px", backgroundColor: "var(--color-primary)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Home size={16} color="#fff" />
          </div>
          <span style={{ fontWeight: 700, fontSize: "1rem", color: "var(--color-text)" }}>HomeQuest</span>
        </div>

        <p style={{ margin: "0 0 0.25rem", fontWeight: 700, fontSize: "1.25rem", color: "var(--color-text)" }}>Sign in</p>
        <p style={{ margin: "0 0 1.75rem", fontSize: "0.875rem", color: "var(--color-text-muted)" }}>Enter your credentials to continue</p>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>

          <Field label="Email">
            <input style={input} type="email" placeholder="you@example.com"
              value={form.email} onChange={e => set("email", e.target.value)} autoComplete="email" />
          </Field>

          <Field label="Password">
            <div style={{ position: "relative" }}>
              <input style={{ ...input, paddingRight: "2.75rem" }}
                type={showPw ? "text" : "password"} placeholder="••••••••"
                value={form.password} onChange={e => set("password", e.target.value)} autoComplete="current-password" />
              <button type="button" onClick={() => setShowPw(v => !v)} style={eyeBtn}>
                {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </Field>

          {error && <p style={errStyle}>{error}</p>}

          <button type="submit" disabled={loading} style={{ ...submitBtn, opacity: loading ? 0.7 : 1, cursor: loading ? "not-allowed" : "pointer" }}>
            {loading && <Loader2 size={15} style={{ animation: "spin 1s linear infinite" }} />}
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <p style={{ margin: "1.5rem 0 0", fontSize: "0.8375rem", color: "var(--color-text-muted)", textAlign: "center" }}>
          No account?{" "}
          <Link to={ROUTES.REGISTER} style={{ color: "var(--color-primary)", fontWeight: 600, textDecoration: "none" }}>Create one</Link>
        </p>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg) } } @media (max-width: 480px) { .auth-page { align-items: flex-start !important; padding-top: 2rem !important; } .auth-card { padding: 1.75rem 1.25rem !important; border-radius: 10px !important; } }`}</style>
    </div>
  )
}

function Field({ label, children }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
      <label style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--color-text-muted)" }}>{label}</label>
      {children}
    </div>
  )
}

const input = {
  padding: "0.6rem 0.85rem", borderRadius: "8px", border: "1px solid var(--color-border)",
  backgroundColor: "var(--color-bg-muted)", fontSize: "0.875rem", color: "var(--color-text)",
  outline: "none", fontFamily: "inherit", width: "100%", boxSizing: "border-box",
}
const eyeBtn = {
  position: "absolute", right: "0.75rem", top: "50%", transform: "translateY(-50%)",
  background: "none", border: "none", cursor: "pointer", color: "var(--color-text-muted)",
  display: "flex", alignItems: "center", padding: 0,
}
const submitBtn = {
  display: "flex", alignItems: "center", justifyContent: "center", gap: "0.45rem",
  padding: "0.65rem", borderRadius: "8px", border: "none",
  backgroundColor: "var(--color-primary)", color: "#fff",
  fontWeight: 600, fontSize: "0.9rem", fontFamily: "inherit", marginTop: "0.25rem",
}
const errStyle = {
  margin: 0, padding: "0.6rem 0.85rem", borderRadius: "8px",
  backgroundColor: "#FEF2F2", border: "1px solid #FECACA",
  fontSize: "0.8125rem", color: "#B91C1C",
}
