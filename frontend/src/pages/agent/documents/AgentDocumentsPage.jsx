import { useEffect, useState } from "react"
import StaffDocumentsPage from "../../../components/shared/StaffDocumentsPage"
import { documentsApi } from "../../../api/documents.api"
import { applicationsApi } from "../../../api/applications.api"
import { propertiesApi } from "../../../api/properties.api"
import { clientsApi, usersApi } from "../../../api/users.api"
import client from "../../../api/client"
import { Loader2 } from "lucide-react"

export default function AgentDocumentsPage() {
  const [docs, setDocs]       = useState(null)
  const [clients, setClients] = useState([])
  const [owners, setOwners]   = useState([])

  useEffect(() => {
    // First resolve the agent's own companyId, then fetch everything in parallel
    client.get("/agents/me").then(r => r.data).catch(() => null).then(async (agentProfile) => {
      const companyId = agentProfile?.companyId

      const [documents, appsRes, listingsRes, clientList] = await Promise.all([
        documentsApi.getMy(),
        applicationsApi.getMyListings({ page: 0, size: 100 }),
        propertiesApi.getMyListings({ page: 0, size: 100 }),
        companyId ? clientsApi.getByCompany(companyId) : Promise.resolve([]),
      ])

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

      setClients(clientList ?? [])

      // Resolve unique owner profiles from listings
      const listings = listingsRes.content ?? listingsRes ?? []
      const uniqueOwnerIds = [...new Set(listings.map(p => p.ownerPublicId).filter(Boolean))]
      const ownerProfiles = await Promise.all(uniqueOwnerIds.map(pid => usersApi.getOwnerByPublicId(pid)))
      setOwners(ownerProfiles.filter(Boolean))
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
      clients={clients}
      owners={owners}
      onVerify={(id) => documentsApi.verify(id)}
      onReject={(id) => documentsApi.reject(id)}
    />
  )
}
