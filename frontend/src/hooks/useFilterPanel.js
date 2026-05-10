import { useRef, useState, useEffect } from "react"

export function useFilterPanel() {
  const filterRef = useRef(null)
  const [filterOpen, setFilterOpen] = useState(false)

  useEffect(() => {
    const h = (e) => { if (filterRef.current && !filterRef.current.contains(e.target)) setFilterOpen(false) }
    document.addEventListener("mousedown", h)
    return () => document.removeEventListener("mousedown", h)
  }, [])

  return { filterRef, filterOpen, setFilterOpen }
}
