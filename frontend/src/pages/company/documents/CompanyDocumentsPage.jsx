import StaffDocumentsPage from "../../../components/shared/StaffDocumentsPage"

const DOCUMENTS = [
  { id: 1,  name: "sale_agreement_kiyovu.pdf",      type: "CONTRACT",    relatedLabel: "Transaction #1 — Modern Apartment in Kiyovu",  uploadedBy: "Agent Sarah J.", mime: "application/pdf", status: "VERIFIED", uploadedAt: "2025-07-10" },
  { id: 2,  name: "title_deed_villa.pdf",           type: "TITLE_DEED",  relatedLabel: "Property — Family Villa in Nyarutarama",        uploadedBy: "Owner",          mime: "application/pdf", status: "PENDING",  uploadedAt: "2025-07-08" },
  { id: 3,  name: "inspection_penthouse.pdf",       type: "INSPECTION",  relatedLabel: "Property — Penthouse in Gisozi",                uploadedBy: "Agent Mark T.",  mime: "application/pdf", status: "VERIFIED", uploadedAt: "2025-07-05" },
  { id: 4,  name: "buyer_id_jean_paul.jpg",         type: "ID_DOCUMENT", relatedLabel: "Application #1 — Modern Apartment in Kiyovu",  uploadedBy: "Jean Paul H.",   mime: "image/jpeg",      status: "PENDING",  uploadedAt: "2025-07-11" },
  { id: 5,  name: "mortgage_letter_amina.pdf",      type: "MORTGAGE",    relatedLabel: "Application #2 — Family Villa in Nyarutarama", uploadedBy: "Amina K.",       mime: "application/pdf", status: "REJECTED", uploadedAt: "2025-07-09" },
  { id: 6,  name: "commission_invoice_005.pdf",     type: "INVOICE",     relatedLabel: "Transaction #3 — Townhouse in Kimironko",       uploadedBy: "Agent Sarah J.", mime: "application/pdf", status: "VERIFIED", uploadedAt: "2025-07-03" },
  { id: 7,  name: "floor_plan_commercial_cbd.png",  type: "FLOOR_PLAN",  relatedLabel: "Property — Commercial Space in CBD",            uploadedBy: "Agent Mark T.",  mime: "image/png",       status: "PENDING",  uploadedAt: "2025-07-12" },
]

const REQUESTS = [
  { id: 20, type: "TITLE_DEED",  relatedLabel: "Property — Townhouse in Kimironko",             requestedAt: "2025-07-12", note: "Original title deed required before listing." },
  { id: 21, type: "INSPECTION",  relatedLabel: "Property — Commercial Space in CBD",             requestedAt: "2025-07-11" },
  { id: 22, type: "ID_DOCUMENT", relatedLabel: "Application #4 — Studio Apartment in Huye",     requestedAt: "2025-07-10", note: "Passport or national ID — both sides." },
]

const RELATED_OPTIONS = [
  "Transaction #1 — Modern Apartment in Kiyovu",
  "Transaction #2 — Family Villa in Nyarutarama",
  "Transaction #3 — Townhouse in Kimironko",
  "Application #1 — Modern Apartment in Kiyovu",
  "Application #2 — Family Villa in Nyarutarama",
  "Application #3 — Townhouse in Kimironko",
  "Application #4 — Studio Apartment in Huye",
  "Property — Family Villa in Nyarutarama",
  "Property — Penthouse in Gisozi",
  "Property — Commercial Space in CBD",
  "Property — Townhouse in Kimironko",
]

export default function CompanyDocumentsPage() {
  return <StaffDocumentsPage documents={DOCUMENTS} requests={REQUESTS} relatedOptions={RELATED_OPTIONS} />
}
