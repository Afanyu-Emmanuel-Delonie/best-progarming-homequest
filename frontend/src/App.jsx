import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import AdminLayout        from "./layouts/AdminLayout"
import AdminDashboard     from "./pages/admin/AdminDashboard"
import AdminUsers         from "./pages/admin/AdminUsers"
import AdminProperties    from "./pages/admin/AdminProperties"
import AdminApplications  from "./pages/admin/AdminApplications"
import AdminTransactions  from "./pages/admin/AdminTransactions"
import AdminDocuments     from "./pages/admin/AdminDocuments"
import AdminSettings      from "./pages/admin/AdminSettings"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AdminLayout />}>
          <Route path="/admin"              element={<AdminDashboard />} />
          <Route path="/admin/users"        element={<AdminUsers />} />
          <Route path="/admin/properties"   element={<AdminProperties />} />
          <Route path="/admin/applications" element={<AdminApplications />} />
          <Route path="/admin/transactions" element={<AdminTransactions />} />
          <Route path="/admin/documents"    element={<AdminDocuments />} />
          <Route path="/admin/settings"     element={<AdminSettings />} />
        </Route>
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
