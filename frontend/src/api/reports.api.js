import client from "./client"
import { downloadBlob, filenameFromDisposition } from "../utils/download"

async function downloadReport(endpoint, fallbackFilename) {
  const res = await client.get(endpoint, { responseType: "blob" })
  const filename = filenameFromDisposition(res.headers?.["content-disposition"], fallbackFilename)
  downloadBlob(res.data, filename)
  return filename
}

export const reportsApi = {
  downloadUsers: () => downloadReport("/reports/users", "users-report.csv"),
  downloadClients: () => downloadReport("/reports/clients", "clients-report.csv"),
  downloadAgent: (publicId) => downloadReport(`/reports/agent/me`, `agent-report-${publicId ?? "me"}.csv`),
  downloadOwner: (publicId) => downloadReport(`/reports/owner/me`, `owner-report-${publicId ?? "me"}.csv`),
  downloadClient: (publicId) => downloadReport(`/reports/client/me`, `client-report-${publicId ?? "me"}.csv`),
  downloadCompany: (companyId) => downloadReport(`/reports/company/${companyId}`, `company-report-${companyId}.csv`),
}
