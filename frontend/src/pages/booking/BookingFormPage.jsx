import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { ArrowLeft, MapPin, BedDouble, Bath, Maximize2, Loader2 } from "lucide-react"
import BidForm from "../../components/booking/BidForm"
import { applicationsApi } from "../../api"
import { propertiesApi } from "../../api/properties.api"
import { fmtCurrencyFull } from "../../utils/formatters"
import { PROPERTY_TYPE_LABELS } from "../../constants/enums"
import { ROUTES } from "../../constants/routes"
import { useToast } from "../../components/common/Toast"

export default function BookingFormPage() {
  const { id }       = useParams()
  const navigate     = useNavigate()
  const toast        = useToast()
  const [p, setP]           = useState(null)
  const [propLoading, setPropLoading] = useState(true)
  const [loading, setLoading]         = useState(false)

  useEffect(() => {
    propertiesApi.getById(id)
      .then(setP)
      .catch(() => setP(null))
      .finally(() => setPropLoading(false))
  }, [id])

  const handleSubmit = async (data) => {
    setLoading(true)
    try {
      await applicationsApi.submit({ ...data, propertyId: Number(id) })
      toast.success("Application submitted!")
      navigate(ROUTES.BOOKING_CONFIRM.replace(":id", id))
    } catch (err) {
      toast.error(err?.message || "Submission failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (propLoading) return (
    <div style={{ paddingTop: 64, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.75rem", color: "var(--color-text-muted)" }}>
      <Loader2 size={20} style={{ animation: "spin 1s linear infinite" }} /> Loading…
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )

  if (!p) return (
    <div style={{ paddingTop: 64, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "1rem" }}>
      <p style={{ fontWeight: 700 }}>Property not found</p>
      <button onClick={() => navigate(ROUTES.PROPERTY_SEARCH)} style={btnStyle}>Back to listings</button>
    </div>
  )

  const img = p.images?.[0] ?? p.imageUrl ?? "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&q=80"

  return (
    <div style={{ paddingTop: 64, minHeight: "100vh", backgroundColor: "#FAFAFA" }}>
      <div className="booking-wrap" style={{ maxWidth: 1000, margin: "0 auto", padding: "1.5rem 1.5rem 4rem" }}>

        <button onClick={() => navigate(`/properties/${p.id}`)} style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", fontSize: "0.875rem", fontWeight: 600, color: "var(--color-text-muted)", padding: 0, marginBottom: "1.5rem" }}>
          <ArrowLeft size={15} /> Back to property
        </button>

        <div style={{ display: "flex", gap: "2rem", alignItems: "flex-start" }} className="booking-body">

          <div className="booking-form" style={{ flex: 1, backgroundColor: "#fff", borderRadius: "16px", border: "1px solid var(--color-border)", padding: "2rem" }}>
            <p style={{ margin: "0 0 0.25rem", fontWeight: 800, fontSize: "1.25rem", color: "var(--color-text)" }}>Submit Your Application</p>
            <p style={{ margin: "0 0 2rem", fontSize: "0.875rem", color: "var(--color-text-muted)" }}>Complete the steps below to apply for this property.</p>
            <BidForm property={p} onSubmit={handleSubmit} loading={loading} />
          </div>

          <aside style={{ width: 280, flexShrink: 0, position: "sticky", top: 80 }} className="booking-aside">
            <div style={{ backgroundColor: "#fff", borderRadius: "16px", border: "1px solid var(--color-border)", overflow: "hidden" }}>
              <img src={img} alt={p.title} style={{ width: "100%", height: 160, objectFit: "cover" }} />
              <div style={{ padding: "1.25rem" }}>
                <p style={{ margin: "0 0 0.2rem", fontWeight: 700, fontSize: "0.9375rem", color: "var(--color-text)" }}>{p.title}</p>
                <p style={{ margin: "0 0 0.75rem", fontSize: "0.8rem", color: "var(--color-text-muted)", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                  <MapPin size={11} style={{ color: "var(--color-primary)" }} />{p.city}
                </p>
                <p style={{ margin: "0 0 0.875rem", fontWeight: 800, fontSize: "1.25rem", color: "var(--color-text)", letterSpacing: "-0.02em" }}>{fmtCurrencyFull(Number(p.price))}</p>
                <div style={{ display: "flex", gap: "1rem", fontSize: "0.8rem", color: "var(--color-text-muted)", paddingTop: "0.875rem", borderTop: "1px solid var(--color-border)" }}>
                  {p.bedrooms > 0 && <span style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}><BedDouble size={13} />{p.bedrooms} bed</span>}
                  <span style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}><Bath size={13} />{p.bathrooms} bath</span>
                  {p.areaSqm && <span style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}><Maximize2 size={13} />{p.areaSqm} m²</span>}
                </div>
                <div style={{ marginTop: "0.75rem" }}>
                  <span style={{ fontSize: "0.75rem", fontWeight: 600, backgroundColor: "var(--color-bg-muted)", color: "var(--color-text-muted)", borderRadius: "6px", padding: "0.2rem 0.6rem" }}>
                    {PROPERTY_TYPE_LABELS[p.type] ?? p.type}
                  </span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      <style>{`
        @media (max-width: 700px) {
          .booking-wrap  { padding: 1rem 1rem 3rem !important; }
          .booking-body  { flex-direction: column !important; }
          .booking-aside { width: 100% !important; position: static !important; }
          .booking-form  { padding: 1.25rem !important; }
        }
      `}</style>
    </div>
  )
}

const btnStyle = { padding: "0.6rem 1.5rem", borderRadius: "8px", border: "none", backgroundColor: "var(--color-primary)", color: "#fff", fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }
