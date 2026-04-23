import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Eye, EyeOff, Home, Loader2 } from "lucide-react"
import { useDispatch } from "react-redux"
import { setCredentials } from "../../store/slices/authSlice"
import toast from "react-hot-toast"
import { authService } from "../../services/authService"
import { ROUTES } from "../../constants/routes"

export default function Register() {
  const dispatch  = useDispatch()
  const navigate  = useNavigate()
  const [role, setRole]       = useState("ROLE_CLIENT")
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
      const data = await authService.register(payload)
      dispatch(setCredentials({ user: data, token: data.token, role: data.role }))
      toast.success("Account created! Welcome to HomeQuest.")
      navigate(role === "ROLE_AGENT" ? ROUTES.AGENT : ROUTES.CLIENT)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--color-bg-muted)", display: "flex", alignItems: "center", justifyContent: "center", padding: "1.5rem" }} className="auth-page">
      <div style={{ width: "100%", maxWidth: 440, backgroundColor: "#fff", borderRadius: "14px", border: "1px solid var(--color-border)", padding: "2.5rem", boxShadow: "0 2px 12px #0000000a" }} className="auth-card">

        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.55rem", marginBottom: "2rem" }}>
          <div style={{ width: 32, height: 32, borderRadius: "8px", backgroundColor: "var(--color-primary)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Home size={16} color="#fff" />
          </div>
          <span style={{ fontWeight: 700, fontSize: "1rem", color: "var(--color-text)" }}>HomeQuest</span>
        </div>

        <p style={{ margin: "0 0 0.25rem", fontWeight: 700, fontSize: "1.25rem", color: "var(--color-text)" }}>Create account</p>
        <p style={{ margin: "0 0 1.75rem", fontSize: "0.875rem", color: "var(--color-text-muted)" }}>Fill in the details below to get started</p>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>

          <Field label="Account type">
            <select style={inp} value={role} onChange={e => setRole(e.target.value)}>
              <option value="ROLE_CLIENT">Client — Browse &amp; purchase properties</option>
              <option value="ROLE_AGENT">Agent — List &amp; manage properties</option>
            </select>
          </Field>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.65rem" }}>
            <Field label="First name" error={errors.firstName}>
              <input style={inp} value={form.firstName} onChange={e => set("firstName", e.target.value)} placeholder="John" />
            </Field>
            <Field label="Last name" error={errors.lastName}>
              <input style={inp} value={form.lastName} onChange={e => set("lastName", e.target.value)} placeholder="Doe" />
            </Field>
          </div>

          <Field label="Email" error={errors.email}>
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

          {/* Agent-only */}
          {role === "ROLE_AGENT" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", padding: "1rem", borderRadius: "8px", border: "1px solid var(--color-border)", backgroundColor: "var(--color-bg-muted)" }}>
              <p style={{ margin: 0, fontSize: "0.75rem", fontWeight: 600, color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.04em" }}>Agent details</p>
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

          <button type="submit" disabled={loading} style={{ ...submitBtn, opacity: loading ? 0.7 : 1, cursor: loading ? "not-allowed" : "pointer" }}>
            {loading && <Loader2 size={15} style={{ animation: "spin 1s linear infinite" }} />}
            {loading ? "Creating account…" : "Create account"}
          </button>
        </form>

        <p style={{ margin: "1.5rem 0 0", fontSize: "0.8375rem", color: "var(--color-text-muted)", textAlign: "center" }}>
          Already have an account?{" "}
          <Link to={ROUTES.LOGIN} style={{ color: "var(--color-primary)", fontWeight: 600, textDecoration: "none" }}>Sign in</Link>
        </p>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg) } } @media (max-width: 480px) { .auth-page { align-items: flex-start !important; padding-top: 2rem !important; } .auth-card { padding: 1.75rem 1.25rem !important; border-radius: 10px !important; } }`}</style>
    </div>
  )
}

function Field({ label, error, children }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
      <label style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--color-text-muted)" }}>{label}</label>
      {children}
      {error && <span style={{ fontSize: "0.72rem", color: "#B91C1C" }}>{error}</span>}
    </div>
  )
}

const inp = {
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
