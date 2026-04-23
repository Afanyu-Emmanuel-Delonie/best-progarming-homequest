import DocumentsPage from "../../../components/shared/DocumentsPage"

const REQUESTS = [
  { id: 1, type: "TITLE_DEED",  relatedLabel: "Transaction #3 — Family Villa in Nyarutarama", requestedAt: "2025-07-09", note: "Original title deed required to proceed with the sale." },
  { id: 2, type: "INSPECTION",  relatedLabel: "Property — Townhouse in Kimironko",             requestedAt: "2025-07-05", note: "Recent inspection report (within 6 months)." },
]

const UPLOADED = [
  { id: 20, name: "title_deed_penthouse.pdf",    type: "TITLE_DEED",  relatedLabel: "Transaction #1 — Penthouse in Gisozi",         mime: "application/pdf", size: "1.2 MB", status: "VERIFIED",  uploadedAt: "2025-06-08" },
  { id: 21, name: "sale_agreement_studio.pdf",   type: "CONTRACT",    relatedLabel: "Transaction #2 — Studio Apartment in Huye",    mime: "application/pdf", size: "245 KB", status: "VERIFIED",  uploadedAt: "2025-04-20" },
  { id: 22, name: "floor_plan_villa.png",        type: "FLOOR_PLAN",  relatedLabel: "Property — Family Villa in Nyarutarama",       mime: "image/png",       size: "3.1 MB", status: "PENDING",   uploadedAt: "2025-07-06" },
  { id: 23, name: "inspection_apartment.pdf",    type: "INSPECTION",  relatedLabel: "Property — Modern Apartment in Kiyovu",        mime: "application/pdf", size: "2.4 MB", status: "REJECTED",  uploadedAt: "2025-06-30" },
]

export default function OwnerDocumentsPage() {
  return <DocumentsPage requests={REQUESTS} uploaded={UPLOADED} />
}
