import DocumentsPage from "../../../components/shared/DocumentsPage"

const REQUESTS = [
  { id: 1, type: "ID_DOCUMENT", relatedLabel: "Application #1 — Modern Apartment in Kiyovu",  requestedAt: "2025-07-10", note: "Please upload a clear copy of your national ID or passport." },
  { id: 2, type: "MORTGAGE",    relatedLabel: "Application #2 — Family Villa in Nyarutarama", requestedAt: "2025-07-08", note: "Bank pre-approval letter required before we can proceed." },
  { id: 3, type: "ID_DOCUMENT", relatedLabel: "Application #3 — Townhouse in Kimironko",      requestedAt: "2025-07-01" },
]

const UPLOADED = [
  { id: 10, name: "national_id_scan.pdf",       type: "ID_DOCUMENT", relatedLabel: "Application #5 — Penthouse in Gisozi",  mime: "application/pdf", size: "890 KB", status: "VERIFIED",  uploadedAt: "2025-06-16" },
  { id: 11, name: "mortgage_approval.pdf",       type: "MORTGAGE",    relatedLabel: "Application #2 — Family Villa",         mime: "application/pdf", size: "320 KB", status: "PENDING",   uploadedAt: "2025-07-09" },
  { id: 12, name: "proof_of_funds.jpg",          type: "ID_DOCUMENT", relatedLabel: "Application #6 — Cozy House in Musanze",mime: "image/jpeg",      size: "650 KB", status: "REJECTED",  uploadedAt: "2025-06-11" },
]

export default function ClientDocumentsPage() {
  return <DocumentsPage requests={REQUESTS} uploaded={UPLOADED} />
}
