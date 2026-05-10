import { useState, useMemo, useEffect } from "react"
import { PAGE_SIZE } from "../constants/enums"

/**
 * @param {Array}    data        - full dataset
 * @param {Function} filterFn   - (row, filters) => boolean
 * @param {Object}   filters    - active filter values (watched for page reset)
 * @param {string}   defaultSort
 */
export function useTableData(data, filterFn, filters, defaultSort = "createdAt") {
  const [sortKey, setSortKey] = useState(defaultSort)
  const [sortDir, setSortDir] = useState("desc")
  const [page, setPage]       = useState(0)

  const filterValues = Object.values(filters)

  // Reset to page 0 whenever any filter changes
  useEffect(() => { setPage(0) }, filterValues) // eslint-disable-line react-hooks/exhaustive-deps

  const filtered = useMemo(() => {
    const rows = data.filter(row => filterFn(row, filters))
    return [...rows].sort((a, b) => {
      let av = a[sortKey] ?? "", bv = b[sortKey] ?? ""
      if (typeof av === "string") { av = av.toLowerCase(); bv = bv.toLowerCase() }
      return sortDir === "asc" ? (av > bv ? 1 : -1) : (av < bv ? 1 : -1)
    })
  }, [data, sortKey, sortDir, ...filterValues]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleSort = (key) => {
    if (sortKey === key) setSortDir(d => d === "asc" ? "desc" : "asc")
    else { setSortKey(key); setSortDir("asc") }
    setPage(0)
  }

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const pageRows   = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)

  return { filtered, pageRows, sortKey, sortDir, handleSort, page, setPage, totalPages }
}
