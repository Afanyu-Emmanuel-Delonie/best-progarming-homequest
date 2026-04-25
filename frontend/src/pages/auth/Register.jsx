import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Eye, EyeOff, Home, Loader2, Building2, UserCheck, ArrowLeft } from "lucide-react"
import { useDispatch } from "react-redux"
import { setCredentials, decodeToken } from "../../store/slices/authSlice"
import { useToast } from '../../components/common/Toast'
import { authApi } from "../../api"
import { ROUTES } from "../../constants/routes"

const ROLES = [
  { value: "ROLE_CUSTOMER", label: "Client",  desc: "Browse & purchase properties", icon: <UserCheck size={18} /> },
  { value: "ROLE_AGENT",    label: "Agent",   desc: "List & manage properties",     icon: <Building2 size={18} /> },
]

export default function Register() {
  const toast    = useToast()
  const dispatch  = useDispatch()
  const navigate  = useNavigate()
  const [role, setRole] = useState("ROLE_CUSTOMER")
  const [showPw, setShowPw]   = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState("")
  const [errors, setErrors]   = useState({})
  const [form, setForm]       = useState({
    firstName: "", lastName: "", email: "", password: "", confirmPassword: "",
    licenseNumber: "", companyId: "",
  })

  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setErrors(e => ({ ...e, [k]: "" })); setError("") }

  const validate = () => {
    const e = {}
    if (!form.firstName.trim()) e.firstName = "Required"
    if (!form.lastName.trim())  e.lastName  = "Required"
    if (!form.email.trim())     e.email     = "Required"
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Invalid email"
    if (!form.password)         e.password  = "Required"
    else if (form.password.length < 8) e.password = "Minimum 8 characters"
    if (form.password !== form.confirmPassword) e.confirmPassword = "Passwords do not match"
    if (role === "ROLE_AGENT") {
      if (!form.licenseNumber.trim()) e.licenseNumber = "Required"
      if (!form.companyId.trim())     e.companyId     = "Required"
    }
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setLoading(true)
    try {
      const payload = {
        firstName: form.firstName, lastName: form.lastName,
        email: form.email, password: form.password, role,
        ...(role === "ROLE_AGENT" && { licenseNumber: form.licenseNumber, companyId: Number(form.companyId) }),
      }
      const data = await authApi.register(payload)
      const token = data.token ?? data.accessToken ?? data.jwt
      dispatch(setCredentials({ user: data, token }))
      const decodedRole = decodeToken(token)?.role
      toast.success("Account created! Welcome to HomeQuest.")
      const ROLE_REDIRECT = {
        ROLE_ADMIN:    ROUTES.ADMIN,
        ROLE_AGENT:    ROUTES.AGENT,
        ROLE_OWNER:    ROUTES.OWNER,
        ROLE_CUSTOMER: ROUTES.CLIENT,
      }
      navigate(ROLE_REDIRECT[decodedRole] ?? ROUTES.CLIENT)
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
        flex: "0 0 44%", position: "relative", overflow: "hidden",
        background: "linear-gradient(160deg, #0f0f0f 0%, #1a1a1a 50%, #0d1117 100%)",
        display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "2.5rem",
      }}>
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "url(https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&q=80)",
          backgroundSize: "cover", backgroundPosition: "center",
          opacity: 0.18,
        }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.75) 100%)" }} />

        {/* Logo */}
        <div style={{ position: "relative", display: "flex", alignItems: "center", gap: "0.65rem" }}>
          <div style={{ width: 38, height: 38, borderRadius: "10px", backgroundColor: "var(--color-primary)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 16px #FF4F0060" }}>
            <Home size={18} color="#fff" />
          </div>
          <span style={{ fontWeight: 800, fontSize: "1.125rem", color: "#fff", letterSpacing: "-0.01em" }}>HomeQuest</span>
        </div>

        {/* Copy */}
        <div style={{ position: "relative" }}>
          <p style={{ margin: "0 0 0.75rem", fontSize: "0.8rem", fontWeight: 600, color: "var(--color-primary)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Join thousands of users</p>
          <h1 style={{ margin: "0 0 1rem", fontWeight: 800, fontSize: "clamp(1.625rem, 2.5vw, 2.25rem)", color: "#fff", lineHeight: 1.2, letterSpacing: "-0.02em" }}>
            Start your property<br />journey today
          </h1>
          <p style={{ margin: 0, fontSize: "0.9rem", color: "rgba(255,255,255,0.6)", lineHeight: 1.75, maxWidth: 340 }}>
            Whether you're buying your first home or listing a property, HomeQuest gives you the tools to do it right.
          </p>
        </div>

        {/* Testimonial */}
        <div style={{ position: "relative", backgroundColor: "rgba(255,255,255,0.07)", backdropFilter: "blur(8px)", borderRadius: "14px", border: "1px solid rgba(255,255,255,0.1)", padding: "1.25rem 1.5rem" }}>
          <p style={{ margin: "0 0 0.875rem", fontSize: "0.9rem", color: "rgba(255,255,255,0.85)", lineHeight: 1.7, fontStyle: "italic" }}>
            "Found my dream apartment in Kiyovu within a week. The process was seamless from search to signing."
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
            <div style={{ width: 34, height: 34, borderRadius: "50%", backgroundColor: "var(--color-primary)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "0.8rem", color: "#fff", flexShrink: 0 }}>JH</div>
            <div>
              <p style={{ margin: 0, fontWeight: 600, fontSize: "0.8375rem", color: "#fff" }}>Jean Habimana</p>
              <p style={{ margin: 0, fontSize: "0.72rem", color: "rgba(255,255,255,0.5)" }}>Client · Kigali</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Right panel — form ── */}
      <div className="auth-right" style={{ flex: 1, display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "2.5rem 2rem", backgroundColor: "#fff", overflowY: "auto", height: "100vh" }}>
        <div className="auth-form" style={{ width: "100%", maxWidth: 420, paddingTop: "2rem", paddingBottom: "2rem" }}>

          <Link to={ROUTES.HOME} style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", fontSize: "0.8125rem", fontWeight: 600, color: "var(--color-text-muted)", textDecoration: "none", marginBottom: "1.75rem" }}>
            <ArrowLeft size={14} /> Back to home
          </Link>
          <p style={{ margin: "0 0 0.375rem", fontWeight: 800, fontSize: "1.5rem", color: "var(--color-text)", letterSpacing: "-0.02em" }}>Create your account</p>
          <p style={{ margin: "0 0 1.75rem", fontSize: "0.9rem", color: "var(--color-text-muted)" }}>Fill in the details below to get started</p>

          {/* Role picker */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.65rem", marginBottom: "1.5rem" }}>
            {ROLES.map(r => (
              <button key={r.value} type="button" onClick={() => setRole(r.value)} style={{
                display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "0.35rem",
                padding: "0.875rem 1rem", borderRadius: "10px", cursor: "pointer", fontFamily: "inherit", textAlign: "left",
                border: `1.5px solid ${role === r.value ? "var(--color-primary)" : "var(--color-border)"}`,
                backgroundColor: role === r.value ? "#FFF5F0" : "#fff",
                transition: "all 0.15s",
              }}>
                <div style={{ color: role === r.value ? "var(--color-primary)" : "var(--color-text-muted)" }}>{r.icon}</div>
                <p style={{ margin: 0, fontWeight: 700, fontSize: "0.875rem", color: role === r.value ? "var(--color-primary)" : "var(--color-text)" }}>{r.label}</p>
                <p style={{ margin: 0, fontSize: "0.72rem", color: "var(--color-text-muted)", lineHeight: 1.4 }}>{r.desc}</p>
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "0.9rem" }}>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.65rem" }}>
              <Field label="First name" error={errors.firstName}>
                <input style={inp} value={form.firstName} onChange={e => set("firstName", e.target.value)} placeholder="Jean" />
              </Field>
              <Field label="Last name" error={errors.lastName}>
                <input style={inp} value={form.lastName} onChange={e => set("lastName", e.target.value)} placeholder="Habimana" />
              </Field>
            </div>

            <Field label="Email address" error={errors.email}>
              <input style={inp} type="email" value={form.email} onChange={e => set("email", e.target.value)} placeholder="you@example.com" autoComplete="email" />
            </Field>

            <Field label="Password" error={errors.password}>
              <div style={{ position: "relative" }}>
                <input style={{ ...inp, paddingRight: "2.75rem" }}
                  type={showPw ? "text" : "password"} placeholder="Min. 8 characters"
                  value={form.password} onChange={e => set("password", e.target.value)} autoComplete="new-password" />
                <button type="button" onClick={() => setShowPw(v => !v)} style={eyeBtn}>
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </Field>

            <Field label="Confirm password" error={errors.confirmPassword}>
              <input style={inp} type="password" placeholder="Repeat password"
                value={form.confirmPassword} onChange={e => set("confirmPassword", e.target.value)} autoComplete="new-password" />
            </Field>

            {/* Agent-only fields */}
            {role === "ROLE_AGENT" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", padding: "1rem", borderRadius: "10px", border: "1.5px solid var(--color-border)", backgroundColor: "var(--color-bg-muted)" }}>
                <p style={{ margin: 0, fontSize: "0.72rem", fontWeight: 700, color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Agent details</p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.65rem" }}>
                  <Field label="License number" error={errors.licenseNumber}>
                    <input style={inp} value={form.licenseNumber} onChange={e => set("licenseNumber", e.target.value)} placeholder="LIC-001" />
                  </Field>
                  <Field label="Company ID" error={errors.companyId}>
                    <input style={inp} type="number" min="1" value={form.companyId} onChange={e => set("companyId", e.target.value)} placeholder="1" />
                  </Field>
                </div>
              </div>
            )}

            {error && <p style={errStyle}>{error}</p>}

            <button type="submit" disabled={loading} style={{ ...submitBtn, opacity: loading ? 0.75 : 1, cursor: loading ? "not-allowed" : "pointer" }}>
              {loading && <Loader2 size={15} style={{ animation: "spin 1s linear infinite" }} />}
              {loading ? "Creating account…" : "Create account"}
            </button>
          </form>

          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", margin: "1.25rem 0" }}>
            <div style={{ flex: 1, height: 1, backgroundColor: "var(--color-border)" }} />
            <span style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>or</span>
            <div style={{ flex: 1, height: 1, backgroundColor: "var(--color-border)" }} />
          </div>

          <p style={{ margin: 0, fontSize: "0.875rem", color: "var(--color-text-muted)", textAlign: "center" }}>
            Already have an account?{" "}
            <Link to={ROUTES.LOGIN} style={{ color: "var(--color-primary)", fontWeight: 700, textDecoration: "none" }}>Sign in</Link>
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

function Field({ label, error, children }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
      <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--color-text)" }}>{label}</label>
      {children}
      {error && <span style={{ fontSize: "0.72rem", color: "#B91C1C" }}>{error}</span>}
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
