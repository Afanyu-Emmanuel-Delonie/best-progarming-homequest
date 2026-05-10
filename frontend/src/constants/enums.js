// ── Status styles ──────────────────────────────────────────────────────────
export const APPLICATION_STATUS = {
  PENDING:   { bg: "#FFF7ED", color: "#C2410C", label: "Pending"   },
  ACCEPTED:  { bg: "#F0FDF4", color: "#15803D", label: "Accepted"  },
  REJECTED:  { bg: "#FEF2F2", color: "#B91C1C", label: "Rejected"  },
  WITHDRAWN: { bg: "#F5F5F5", color: "#525252", label: "Withdrawn" },
  EXPIRED:   { bg: "#FAFAFA", color: "#737373", label: "Expired"   },
}

export const TRANSACTION_STATUS = {
  PENDING:   { bg: "#FFF7ED", color: "#C2410C", label: "Pending"   },
  COMPLETED: { bg: "#F0FDF4", color: "#15803D", label: "Completed" },
  CANCELLED: { bg: "#FEF2F2", color: "#B91C1C", label: "Cancelled" },
}

export const PROPERTY_STATUS = {
  AVAILABLE:   { bg: "#F0FDF4", color: "#15803D", label: "Available"   },
  UNDER_OFFER: { bg: "#FFF7ED", color: "#C2410C", label: "Under Offer" },
  SOLD:        { bg: "#EFF6FF", color: "#1D4ED8", label: "Sold"        },
  RENTED:      { bg: "#F5F3FF", color: "#6D28D9", label: "Rented"      },
  INACTIVE:    { bg: "#F5F5F5", color: "#737373", label: "Inactive"    },
}

export const USER_STATUS = {
  ACTIVE:    { bg: "#F0FDF4", color: "#15803D", label: "Active"    },
  PENDING:   { bg: "#FFF7ED", color: "#C2410C", label: "Pending"   },
  SUSPENDED: { bg: "#FEF2F2", color: "#B91C1C", label: "Suspended" },
}

export const DOCUMENT_STATUS = {
  PENDING:  { bg: "#FFF7ED", color: "#C2410C", label: "Pending"  },
  VERIFIED: { bg: "#F0FDF4", color: "#15803D", label: "Verified" },
  REJECTED: { bg: "#FEF2F2", color: "#B91C1C", label: "Rejected" },
}

// ── Role styles ────────────────────────────────────────────────────────────
export const ROLE_STYLES = {
  ROLE_ADMIN:    { bg: "#FEF9C3", color: "#92400E", label: "Admin"    },
  ROLE_AGENT:    { bg: "#EFF6FF", color: "#1D4ED8", label: "Agent"    },
  ROLE_CUSTOMER: { bg: "#F5F3FF", color: "#6D28D9", label: "Customer" },
  ROLE_OWNER:    { bg: "#FFF7ED", color: "#C2410C", label: "Owner"    },
}

export const ROLE_TABS = [
  { key: "ALL",           label: "All"       },
  { key: "ROLE_ADMIN",    label: "Admins"    },
  { key: "ROLE_AGENT",    label: "Agents"    },
  { key: "ROLE_CUSTOMER", label: "Customers" },
  { key: "ROLE_OWNER",    label: "Owners"    },
]

// ── Property labels ────────────────────────────────────────────────────────
export const PROPERTY_TYPE_LABELS = {
  APARTMENT:  "Apartment",
  HOUSE:      "House",
  VILLA:      "Villa",
  OFFICE:     "Office",
  LAND:       "Land",
  COMMERCIAL: "Commercial",
}

// ── Funding labels ─────────────────────────────────────────────────────────
export const FUNDING_LABELS = {
  CASH:          "Cash",
  BANK_MORTGAGE: "Bank Mortgage",
  PAYMENT_PLAN:  "Payment Plan",
}

// ── Document type labels ───────────────────────────────────────────────────
export const DOCUMENT_TYPE_LABELS = {
  CONTRACT:    "Contract",
  TITLE_DEED:  "Title Deed",
  ID_DOCUMENT: "ID Document",
  MORTGAGE:    "Mortgage",
  INSPECTION:  "Inspection",
  INVOICE:     "Invoice",
  FLOOR_PLAN:  "Floor Plan",
}

// ── Commission / payout status ────────────────────────────────────────────
export const COMMISSION_STATUS = {
  PAID:    { bg: "#F0FDF4", color: "#15803D", label: "Paid"    },
  PENDING: { bg: "#FFF7ED", color: "#C2410C", label: "Pending" },
}

// ── Agent role on a transaction ────────────────────────────────────────────
export const AGENT_ROLE_STYLES = {
  LISTING: { bg: "#EFF6FF", color: "#1D4ED8", label: "Listing" },
  SELLING: { bg: "#F5F3FF", color: "#6D28D9", label: "Selling" },
}

// ── Transaction type ───────────────────────────────────────────────────────
export const TRANSACTION_TYPE_STYLES = {
  SALE: { bg: "#EFF6FF", color: "#1D4ED8", label: "Sale" },
  RENT: { bg: "#F5F3FF", color: "#6D28D9", label: "Rent" },
}

// ── Avatar colors ──────────────────────────────────────────────────────────
export const AVATAR_COLORS = ["#FF4F00", "#1D4ED8", "#15803D", "#6D28D9", "#C2410C", "#0891B2"]
export const avatarColor   = (id) => AVATAR_COLORS[id % AVATAR_COLORS.length]
export const initials      = (u)  => `${u.firstName[0]}${u.lastName[0]}`.toUpperCase()

// ── Page size ──────────────────────────────────────────────────────────────
export const PAGE_SIZE = 8
