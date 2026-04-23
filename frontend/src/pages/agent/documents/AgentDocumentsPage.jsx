import StaffDocumentsPage from "../../../components/shared/StaffDocumentsPage"

const DOCUMENTS = [
  { id: 1,  name: "national_id_jean_paul.pdf",    type: "ID_DOCUMENT", relatedLabel: "Application #1 — Modern Apartment in Kiyovu",  uploadedBy: "Jean Paul H.",  mime: "application/pdf", status: "PENDING",  uploadedAt: "2025-07-10" },
  { id: 2,  name: "mortgage_approval_amina.pdf",  type: "MORTGAGE",    relatedLabel: "Application #2 — Family Villa in Nyarutarama", uploadedBy: "Amina K.",      mime: "application/pdf", status: "PENDING",  uploadedAt: "2025-07-09" },
  { id: 3,  name: "buyer_passport_david.jpg",     type: "ID_DOCUMENT", relatedLabel: "Application #3 — Townhouse in Kimironko",      uploadedBy: "David M.",      mime: "image/jpeg",      status: "VERIFIED", uploadedAt: "2025-07-05" },
  { id: 4,  name: "sale_agreement_penthouse.pdf", type: "CONTRACT",    relatedLabel: "Transaction #1 — Penthouse in Gisozi",         uploadedBy: "Jean Paul H.",  mime: "application/pdf", status: "VERIFIED", uploadedAt: "2025-06-10" },
  { id: 5,  name: "floor_plan_villa.png",         type: "FLOOR_PLAN",  relatedLabel: "Property — Family Villa in Nyarutarama",       uploadedBy: "Owner",         mime: "image/png",       status: "REJECTED", uploadedAt: "2025-07-06" },
]

const REQUESTS = [
  { id: 10, type: "ID_DOCUMENT", relatedLabel: "Application #4 — Studio Apartment in Huye",   requestedAt: "2025-07-11", note: "Please upload a clear copy of your national ID." },
  { id: 11, type: "MORTGAGE",    relatedLabel: "Application #5 — Cozy House in Musanze",       requestedAt: "2025-07-10" },
]

const RELATED_OPTIONS = [
  "Application #1 — Modern Apartment in Kiyovu",
  "Application #2 — Family Villa in Nyarutarama",
  "Application #3 — Townhouse in Kimironko",
  "Application #4 — Studio Apartment in Huye",
  "Application #5 — Cozy House in Musanze",
  "Transaction #1 — Penthouse in Gisozi",
  "Transaction #2 — Studio Apartment in Huye",
]

export default function AgentDocumentsPage() {
  return <StaffDocumentsPage documents={DOCUMENTS} requests={REQUESTS} relatedOptions={RELATED_OPTIONS} />
}
