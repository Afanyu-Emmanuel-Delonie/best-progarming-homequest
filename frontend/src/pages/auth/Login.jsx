import { useState } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { Eye, EyeOff, Home, Loader2, ArrowLeft } from "lucide-react"
import { useDispatch } from "react-redux"
import { setCredentials, decodeToken } from "../../store/slices/authSlice"
import { useToast } from '../../components/common/Toast'
import { authApi } from "../../api"
import { ROUTES } from "../../constants/routes"

const ROLE_REDIRECT = {
  ROLE_ADMIN:    ROUTES.ADMIN,
  ROLE_AGENT:    ROUTES.AGENT,
  ROLE_OWNER:    ROUTES.OWNER,
  ROLE_CUSTOMER: ROUTES.CLIENT,
}

export default function Login() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const toast    = useToast()
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
      const data = await authApi.login(form)
      const token = data.token ?? data.accessToken ?? data.jwt
      const decoded = decodeToken(token)
      dispatch(setCredentials({ user: data, token }))
      const role = decoded?.role ?? decoded?.roles?.[0] ?? data.role
      toast.success("Welcome back!")
      const returnTo = location.state?.from?.pathname
      navigate(returnTo ?? ROLE_REDIRECT[role] ?? ROUTES.CLIENT)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ height: "100vh", display: "flex", overflow: "hidden" }}>

      {/* ── Left panel ── */}
      <div className="auth-panel" style={{
        flex: "0 0 52%", position: "relative", overflow: "hidden",
        background: "linear-gradient(160deg, #0f0f0f 0%, #1a1a1a 50%, #0d1117 100%)",
        display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "2.5rem",
      }}>
        {/* Background image */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "url(https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1400&q=80)",
          backgroundSize: "cover", backgroundPosition: "center",
          opacity: 0.18,
        }} />

        {/* Gradient overlay */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.7) 100%)" }} />

        {/* Logo */}
        <div style={{ position: "relative", display: "flex", alignItems: "center", gap: "0.65rem" }}>
          <div style={{ width: 38, height: 38, borderRadius: "10px", backgroundColor: "var(--color-primary)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 16px #FF4F0060" }}>
            <Home size={18} color="#fff" />
          </div>
          <span style={{ fontWeight: 800, fontSize: "1.125rem", color: "#fff", letterSpacing: "-0.01em" }}>HomeQuest</span>
        </div>

        <div style={{ flex: 1 }} />

        {/* Center copy */}
        <div style={{ position: "relative" }}>
          <p style={{ margin: "0 0 0.75rem", fontSize: "0.8rem", fontWeight: 600, color: "var(--color-primary)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Rwanda's #1 Property Platform</p>
          <h1 style={{ margin: "0 0 1rem", fontWeight: 800, fontSize: "clamp(1.75rem, 3vw, 2.5rem)", color: "#fff", lineHeight: 1.2, letterSpacing: "-0.02em" }}>
            Find your perfect<br />home in Rwanda
          </h1>
          <p style={{ margin: 0, fontSize: "0.9375rem", color: "rgba(255,255,255,0.65)", lineHeight: 1.7, maxWidth: 380 }}>
            Browse thousands of verified properties across Kigali and beyond. Connect with trusted agents and make your move with confidence.
          </p>
        </div>
      </div>

      {/* ── Right panel — form ── */}
      <div className="auth-right" style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem", backgroundColor: "#fff", overflowY: "auto", height: "100vh" }}>
        <div className="auth-form" style={{ width: "100%", maxWidth: 400 }}>

          <Link to={ROUTES.HOME} style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", fontSize: "0.8125rem", fontWeight: 600, color: "var(--color-text-muted)", textDecoration: "none", marginBottom: "1.75rem" }}>
            <ArrowLeft size={14} /> Back to home
          </Link>
          <p style={{ margin: "0 0 0.375rem", fontWeight: 800, fontSize: "1.625rem", color: "var(--color-text)", letterSpacing: "-0.02em" }}>Welcome back</p>
          <p style={{ margin: "0 0 2rem", fontSize: "0.9rem", color: "var(--color-text-muted)" }}>Sign in to your HomeQuest account</p>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}>

            <Field label="Email address">
              <input style={inp} type="email" placeholder="you@example.com"
                value={form.email} onChange={e => set("email", e.target.value)} autoComplete="email" />
            </Field>

            <Field label="Password">
              <div style={{ position: "relative" }}>
                <input style={{ ...inp, paddingRight: "2.75rem" }}
                  type={showPw ? "text" : "password"} placeholder="••••••••"
                  value={form.password} onChange={e => set("password", e.target.value)} autoComplete="current-password" />
                <button type="button" onClick={() => setShowPw(v => !v)} style={eyeBtn}>
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </Field>

            {error && <p style={errStyle}>{error}</p>}

            <button type="submit" disabled={loading} style={{ ...submitBtn, opacity: loading ? 0.75 : 1, cursor: loading ? "not-allowed" : "pointer" }}>
              {loading && <Loader2 size={15} style={{ animation: "spin 1s linear infinite" }} />}
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>

          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", margin: "1.5rem 0" }}>
            <div style={{ flex: 1, height: 1, backgroundColor: "var(--color-border)" }} />
            <span style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>or</span>
            <div style={{ flex: 1, height: 1, backgroundColor: "var(--color-border)" }} />
          </div>

          <p style={{ margin: 0, fontSize: "0.875rem", color: "var(--color-text-muted)", textAlign: "center" }}>
            Don't have an account?{" "}
            <Link to={ROUTES.REGISTER} style={{ color: "var(--color-primary)", fontWeight: 700, textDecoration: "none" }}>Create one free</Link>
          </p>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg) } }
        @media (max-width: 768px) {
          .auth-panel { display: none !important; }
          .auth-right  { padding: 1.5rem 1.25rem !important; align-items: flex-start !important; }
          .auth-form   { padding-top: 1rem !important; }
        }
      `}</style>
    </div>
  )
}

function Field({ label, children }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
      <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--color-text)" }}>{label}</label>
      {children}
    </div>
  )
}

const inp = {
  padding: "0.7rem 0.9rem", borderRadius: "9px", border: "1.5px solid var(--color-border)",
  backgroundColor: "#fff", fontSize: "0.9rem", color: "var(--color-text)",
  outline: "none", fontFamily: "inherit", width: "100%", boxSizing: "border-box",
  transition: "border-color 0.15s",
}
const eyeBtn = {
  position: "absolute", right: "0.75rem", top: "50%", transform: "translateY(-50%)",
  background: "none", border: "none", cursor: "pointer", color: "var(--color-text-muted)",
  display: "flex", alignItems: "center", padding: 0,
}
const submitBtn = {
  display: "flex", alignItems: "center", justifyContent: "center", gap: "0.45rem",
  padding: "0.75rem", borderRadius: "9px", border: "none",
  backgroundColor: "var(--color-primary)", color: "#fff",
  fontWeight: 700, fontSize: "0.9375rem", fontFamily: "inherit",
  boxShadow: "0 4px 16px #FF4F0030",
}
const errStyle = {
  margin: 0, padding: "0.65rem 0.9rem", borderRadius: "8px",
  backgroundColor: "#FEF2F2", border: "1px solid #FECACA",
  fontSize: "0.8125rem", color: "#B91C1C",
}
