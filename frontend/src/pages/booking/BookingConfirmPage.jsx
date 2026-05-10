import { useNavigate, useParams } from "react-router-dom"
import { CheckCircle } from "lucide-react"
import { ROUTES } from "../../constants/routes"

export default function BookingConfirmPage() {
  const navigate = useNavigate()
  const { id }   = useParams()

  return (
    <div style={{ paddingTop: 64, minHeight: "100vh", backgroundColor: "#FAFAFA", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
      <div style={{ backgroundColor: "#fff", borderRadius: "20px", border: "1px solid var(--color-border)", padding: "3rem 2.5rem", maxWidth: 460, width: "100%", textAlign: "center" }}>

        <div style={{ width: 64, height: 64, borderRadius: "50%", backgroundColor: "#F0FDF4", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.25rem" }}>
          <CheckCircle size={32} style={{ color: "#15803D" }} />
        </div>

        <p style={{ margin: "0 0 0.5rem", fontWeight: 800, fontSize: "1.375rem", color: "var(--color-text)" }}>Application Submitted!</p>
        <p style={{ margin: "0 0 2rem", fontSize: "0.9rem", color: "var(--color-text-muted)", lineHeight: 1.7 }}>
          Your application has been received. Our team will review it and get back to you within <strong>24 hours</strong>.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          <button
            onClick={() => navigate(`/properties/${id}`)}
            style={btnPrimary}
          >
            Back to Property
          </button>
          <button
            onClick={() => navigate(ROUTES.PROPERTY_SEARCH)}
            style={btnSecondary}
          >
            Browse More Properties
          </button>
        </div>
      </div>
    </div>
  )
}

const btnPrimary   = { padding: "0.75rem", borderRadius: "10px", border: "none", backgroundColor: "var(--color-primary)", color: "#fff", fontWeight: 700, fontSize: "0.9375rem", cursor: "pointer", fontFamily: "inherit" }
const btnSecondary = { padding: "0.75rem", borderRadius: "10px", border: "1px solid var(--color-border)", backgroundColor: "#fff", color: "var(--color-text)", fontWeight: 600, fontSize: "0.9rem", cursor: "pointer", fontFamily: "inherit" }
