export function downloadBlob(blob, filename) {
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()
  window.URL.revokeObjectURL(url)
}

export function filenameFromDisposition(disposition, fallback) {
  if (!disposition) return fallback
  const match = disposition.match(/filename\*?=(?:UTF-8''|")?([^";]+)"?/i)
  return match?.[1] ? decodeURIComponent(match[1].trim()) : fallback
}
