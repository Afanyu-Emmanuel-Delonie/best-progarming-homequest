import { useEffect, useRef } from "react"
import { useSelector } from "react-redux"
import { Client } from "@stomp/stompjs"
import { toast } from "react-toastify"

function wsBrokerURL(token) {
  const api = import.meta.env.VITE_API_URL ?? "http://localhost:8080"
  const url = new URL(api.startsWith("http") ? api : `http://${api}`)
  url.protocol = url.protocol === "https:" ? "wss:" : "ws:"
  return `${url.origin}/ws${token ? `?token=${token}` : ""}`
}

/**
 * STOMP subscription to backend `/topic/events` (applications, transactions, etc.).
 * Toasts when the event is addressed to the signed-in user; always dispatches `homequest:live`.
 */
export function useLiveUpdates() {
  const token    = useSelector((s) => s.auth.token)
  const publicId = useSelector((s) => s.auth.user?.publicId)
  const publicIdRef = useRef(publicId)
  publicIdRef.current = publicId

  useEffect(() => {
    if (!token) return
    const client = new Client({
      brokerURL: wsBrokerURL(token),
      reconnectDelay: 5000,
      onConnect: () => {
        client.subscribe("/topic/events", (message) => {
          try {
            const event = JSON.parse(message.body)
            const rid = event.recipientPublicId != null ? String(event.recipientPublicId) : null
            const mine = rid && publicIdRef.current && rid === String(publicIdRef.current)
            if (mine && (event.title || event.message)) {
              toast.info([event.title, event.message].filter(Boolean).join(" — "))
            }
            window.dispatchEvent(new CustomEvent("homequest:live", { detail: event }))
          } catch {
            /* ignore malformed frames */
          }
        })
      },
    })
    client.activate()
    return () => {
      client.deactivate()
    }
  }, [token])
}
