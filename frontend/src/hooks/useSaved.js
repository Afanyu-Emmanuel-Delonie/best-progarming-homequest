import { useState, useCallback } from "react"
import { useSelector } from "react-redux"

function storageKey(userId) {
  return `hq_saved_${userId ?? "guest"}`
}

function load(userId) {
  try {
    return JSON.parse(localStorage.getItem(storageKey(userId)) || "[]")
  } catch {
    return []
  }
}

export function useSaved() {
  const userId = useSelector((s) => s.auth.user?.publicId ?? s.auth.user?.id)
  const [saved, setSaved] = useState(() => load(userId))

  const isSaved = useCallback((propertyId) => {
    return saved.some((p) => String(p.id) === String(propertyId))
  }, [saved])

  const toggle = useCallback((property) => {
    setSaved((prev) => {
      const exists = prev.some((p) => String(p.id) === String(property.id))
      const next = exists
        ? prev.filter((p) => String(p.id) !== String(property.id))
        : [...prev, { ...property, savedAt: new Date().toISOString().slice(0, 10) }]
      localStorage.setItem(storageKey(userId), JSON.stringify(next))
      return next
    })
  }, [userId])

  const remove = useCallback((propertyId) => {
    setSaved((prev) => {
      const next = prev.filter((p) => String(p.id) !== String(propertyId))
      localStorage.setItem(storageKey(userId), JSON.stringify(next))
      return next
    })
  }, [userId])

  return { saved, isSaved, toggle, remove }
}
