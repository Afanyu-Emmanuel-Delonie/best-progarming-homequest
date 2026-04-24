import { useEffect, useState } from "react"
import StaffDocumentsPage from "../../../components/shared/StaffDocumentsPage"
import { documentsApi } from "../../../api/documents.api"
import { applicationsApi } from "../../../api/applications.api"
import { Loader2 } from "lucide-react"

export default function AgentDocumentsPage() {
  const [docs, setDocs]         = useState(null)
  const [relatedOpts, setRelated] = useState([])

  useEffect(() => {
    Promise.all([
      documentsApi.getMy(),
      applicationsApi.getMyListings({ page: 0, size: 100 }),
    ]).then(([documents, appsRes]) => {
      const apps = appsRes.content ?? appsRes ?? []
      setDocs(documents.map(d => ({
        id:           d.id,
        name:         d.name,
        type:         d.type,
        relatedLabel: d.applicationId ? `Application #${d.applicationId}` : d.propertyId ? `Property #${d.propertyId}` : "—",
        uploadedBy:   d.uploadedBy,
        mime:         d.name?.endsWith(".pdf") ? "application/pdf" : d.name?.match(/\.(jpg|jpeg|png)$/i) ? "image/jpeg" : "application/octet-stream",
        status:       d.status ?? "PENDING",
        uploadedAt:   d.createdAt ? d.createdAt.split("T")[0] : "—",
      })))
      setRelated(apps.map(a => `Application #${a.id} — Property #${a.propertyId}`))
    }).catch(() => setDocs([]))
  }, [])

  if (docs === null) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "60vh", gap: "0.75rem", color: "var(--color-text-muted)" }}>
      <Loader2 size={20} style={{ animation: "spin 1s linear infinite" }} /> Loading documents…
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )

  return (
    <StaffDocumentsPage
      documents={docs}
      requests={[]}
      relatedOptions={relatedOpts}
      onVerify={(id) => documentsApi.verify(id)}
      onReject={(id) => documentsApi.reject(id)}
    />
  )
}
