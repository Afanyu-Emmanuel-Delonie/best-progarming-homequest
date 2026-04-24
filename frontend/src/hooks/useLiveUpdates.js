import { useEffect, useRef } from "react"
import { useSelector } from "react-redux"
import { Client } from "@stomp/stompjs"
import { toast } from "react-toastify"

function wsBrokerURL() {
  const api = import.meta.env.VITE_API_URL ?? "http://localhost:8080"
  const url = new URL(api.startsWith("http") ? api : `http://${api}`)
  url.protocol = url.protocol === "https:" ? "wss:" : "ws:"
  return `${url.origin}/ws`
}

/**
 * STOMP subscription to backend `/topic/events` (applications, transactions, etc.).
 * Toasts when the event is addressed to the signed-in user; always dispatches `homequest:live`.
 */
export function useLiveUpdates() {
  const publicId = useSelector((s) => s.auth.user?.publicId)
  const publicIdRef = useRef(publicId)
  publicIdRef.current = publicId

  useEffect(() => {
    const client = new Client({
      brokerURL: wsBrokerURL(),
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
  }, [])
}
