import { useState, useCallback } from "react"
import { documentsApi } from "../api"
import { toast } from "react-toastify"

export function useDocuments() {
  const [documents, setDocuments] = useState([])
  const [loading,   setLoading]   = useState(false)

  const fetchMy = useCallback(async () => {
    setLoading(true)
    try {
      const data = await documentsApi.getMy()
      setDocuments(data)
    } catch { /* error toasted by axios interceptor */ }
    finally { setLoading(false) }
  }, [])

  const fetchRequested = useCallback(async () => {
    setLoading(true)
    try {
      const data = await documentsApi.getMyRequested()
      setDocuments(data)
    } catch { }
    finally { setLoading(false) }
  }, [])

  const upload = useCallback(async (data) => {
    const doc = await documentsApi.upload(data)
    setDocuments(prev => [doc, ...prev])
    toast.success("Document uploaded successfully")
    return doc
  }, [])

  const request = useCallback(async (data) => {
    const doc = await documentsApi.request(data)
    toast.success("Document requested")
    return doc
  }, [])

  const verify = useCallback(async (id) => {
    const doc = await documentsApi.verify(id)
    setDocuments(prev => prev.map(d => d.id === id ? doc : d))
    toast.success("Document verified")
  }, [])

  const reject = useCallback(async (id) => {
    const doc = await documentsApi.reject(id)
    setDocuments(prev => prev.map(d => d.id === id ? doc : d))
    toast.info("Document rejected")
  }, [])

  return { documents, loading, fetchMy, fetchRequested, upload, request, verify, reject }
}
