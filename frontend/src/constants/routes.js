export const ROUTES = {
  // Auth
  LOGIN:             "/login",
  REGISTER:          "/register",

  // Public
  HOME:              "/",
  ABOUT:             "/about",
  CONTACT:           "/contact",

  BUYING_GUIDE:      "/buying-guide",
  APPLY:             "/apply",

  // Booking / property browsing
  PROPERTY_SEARCH:   "/properties",
  PROPERTY_DETAIL:   "/properties/:id",
  BOOKING_FORM:      "/booking/:id",
  BOOKING_CONFIRM:   "/booking/:id/confirm",

  // Admin
  ADMIN:             "/admin",
  ADMIN_CLIENTS:        "/admin/clients",
  ADMIN_USERS:       "/admin/users",
  ADMIN_PROPERTIES:  "/admin/properties",
  ADMIN_APPLICATIONS:"/admin/applications",
  ADMIN_TRANSACTIONS:"/admin/transactions",
  ADMIN_DOCUMENTS:   "/admin/documents",
  ADMIN_SETTINGS:    "/admin/settings",

  // Agent
  AGENT:             "/agent",
  AGENT_CLIENTS:        "/agent/clients",
  AGENT_LISTINGS:    "/agent/listings",
  AGENT_LISTING_NEW: "/agent/listings/new",
  AGENT_APPLICATIONS:"/agent/applications",
  AGENT_TRANSACTIONS:"/agent/transactions",
  AGENT_COMMISSIONS: "/agent/commissions",
  AGENT_PROFILE:     "/agent/profile",

  // Client
  CLIENT:            "/client",
  CLIENT_APPLICATIONS:"/client/applications",

  // Owner
  OWNER:             "/owner",
  OWNER_PROPERTIES:  "/owner/properties",
  OWNER_TRANSACTIONS:"/owner/transactions",

}
