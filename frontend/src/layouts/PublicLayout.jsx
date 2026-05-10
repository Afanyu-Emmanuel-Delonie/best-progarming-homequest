import { Outlet } from "react-router-dom"
import LandingNavbar from "../components/landing/LandingNavbar"
import Footer        from "../components/landing/Footer"

export default function PublicLayout() {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#fff", display: "flex", flexDirection: "column" }}>
      <LandingNavbar />
      <div style={{ flex: 1 }}>
        <Outlet />
      </div>
      <Footer />
    </div>
  )
}
