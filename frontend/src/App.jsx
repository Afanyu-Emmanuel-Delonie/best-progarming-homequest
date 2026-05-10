import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"

import PublicLayout    from "./layouts/PublicLayout"
import LandingPage     from "./pages/landing/LandingPage"
import PropertiesPage  from "./pages/booking/PropertySearchPage"
import PropertyDetail  from "./pages/booking/PropertyDetailPage"
import Login           from "./pages/auth/Login"
import Register        from "./pages/auth/Register"

import AdminLayout       from "./layouts/AdminLayout"
import AdminDashboard    from "./pages/admin/AdminDashboard"
import AdminUsers        from "./pages/admin/AdminUsers"
import AdminClients      from "./pages/admin/AdminClients"
import AdminProperties   from "./pages/admin/AdminProperties"
import AdminApplications from "./pages/admin/AdminApplications"
import AdminTransactions from "./pages/admin/AdminTransactions"
import AdminDocuments    from "./pages/admin/AdminDocuments"
import AdminSettings     from "./pages/admin/AdminSettings"

import AgentLayout           from "./layouts/AgentLayout"
import AgentDashboard        from "./pages/agent/dashboard/AgentDashboard"
import AgentListingsPage     from "./pages/agent/listings/AgentListingsPage"
import ListingFormPage       from "./pages/agent/listings/ListingFormPage"
import AgentClientsPage      from "./pages/agent/clients/AgentClientsPage"
import AgentApplicationsPage from "./pages/agent/applications/AgentApplicationsPage"
import AgentTransactionsPage from "./pages/agent/transactions/AgentTransactionsPage"
import CommissionsPage       from "./pages/agent/transactions/CommissionsPage"
import AgentProfilePage      from "./pages/agent/profile/AgentProfilePage"
import AgentDocumentsPage    from "./pages/agent/documents/AgentDocumentsPage"

import BuyingGuide       from "./pages/landing/BuyingGuidePage"
import BookingFormPage   from "./pages/booking/BookingFormPage"
import BookingConfirmPage from "./pages/booking/BookingConfirmPage"

import ClientLayout           from "./layouts/ClientLayout"
import ClientDashboard        from "./pages/client/dashboard/ClientDashboard"
import ClientApplicationsPage from "./pages/client/applications/ClientApplicationsPage"
import ClientSavedPage        from "./pages/client/saved/ClientSavedPage"
import ClientDocumentsPage    from "./pages/client/documents/ClientDocumentsPage"

import OwnerLayout           from "./layouts/OwnerLayout"
import OwnerDashboard        from "./pages/owner/dashboard/OwnerDashboard"
import OwnerPropertiesPage   from "./pages/owner/properties/OwnerPropertiesPage"
import OwnerTransactionsPage from "./pages/owner/transactions/OwnerTransactionsPage"
import OwnerDocumentsPage    from "./pages/owner/documents/OwnerDocumentsPage"

import PrivateRoute from "./guards/PrivateRoute"
import RoleGuard    from "./guards/RoleGuard"
import { useLiveUpdates } from "./hooks/useLiveUpdates"

function AppShell() {
  useLiveUpdates()
  return (
      <Routes>

        {/* Public */}
        <Route element={<PublicLayout />}>
          <Route path="/"               element={<LandingPage />} />
          <Route path="/properties"     element={<PropertiesPage />} />
          <Route path="/properties/:id" element={<PropertyDetail />} />
        </Route>

        {/* Standalone */}
        <Route path="/buying-guide" element={<BuyingGuide />} />

        {/* Booking — requires login */}
        <Route element={<PrivateRoute />}>
          <Route path="/booking/:id"         element={<BookingFormPage />} />
          <Route path="/booking/:id/confirm" element={<BookingConfirmPage />} />
        </Route>

        {/* Auth */}
        <Route path="/login"    element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Admin */}
        <Route element={<PrivateRoute />}>
          <Route element={<RoleGuard roles={["ROLE_ADMIN"]} />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin"              element={<AdminDashboard />} />
              <Route path="/admin/users"        element={<AdminUsers />} />
              <Route path="/admin/clients"      element={<AdminClients />} />
              <Route path="/admin/properties"   element={<AdminProperties />} />
              <Route path="/admin/applications" element={<AdminApplications />} />
              <Route path="/admin/transactions" element={<AdminTransactions />} />
              <Route path="/admin/documents"    element={<AdminDocuments />} />
              <Route path="/admin/settings"     element={<AdminSettings />} />
            </Route>
          </Route>
        </Route>

        {/* Agent */}
        <Route element={<PrivateRoute />}>
          <Route element={<RoleGuard roles={["ROLE_AGENT"]} />}>
            <Route element={<AgentLayout />}>
              <Route path="/agent"              element={<AgentDashboard />} />
              <Route path="/agent/listings"     element={<AgentListingsPage />} />
              <Route path="/agent/listings/new" element={<ListingFormPage />} />
              <Route path="/agent/clients"      element={<AgentClientsPage />} />
              <Route path="/agent/applications" element={<AgentApplicationsPage />} />
              <Route path="/agent/transactions" element={<AgentTransactionsPage />} />
              <Route path="/agent/documents"    element={<AgentDocumentsPage />} />
              <Route path="/agent/commissions"  element={<CommissionsPage />} />
              <Route path="/agent/profile"      element={<AgentProfilePage />} />
            </Route>
          </Route>
        </Route>

        {/* Client */}
        <Route element={<PrivateRoute />}>
          <Route element={<RoleGuard roles={["ROLE_CUSTOMER"]} />}>
            <Route element={<ClientLayout />}>
              <Route path="/client"              element={<ClientDashboard />} />
              <Route path="/client/applications" element={<ClientApplicationsPage />} />
              <Route path="/client/documents"    element={<ClientDocumentsPage />} />
              <Route path="/client/saved"        element={<ClientSavedPage />} />
            </Route>
          </Route>
        </Route>

        {/* Owner */}
        <Route element={<PrivateRoute />}>
          <Route element={<RoleGuard roles={["ROLE_OWNER"]} />}>
            <Route element={<OwnerLayout />}>
              <Route path="/owner"              element={<OwnerDashboard />} />
              <Route path="/owner/properties"   element={<OwnerPropertiesPage />} />
              <Route path="/owner/transactions" element={<OwnerTransactionsPage />} />
              <Route path="/owner/documents"    element={<OwnerDocumentsPage />} />
            </Route>
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  )
}
