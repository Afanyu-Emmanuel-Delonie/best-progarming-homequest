import { useEffect, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Client } from "@stomp/stompjs"
import { addEvent } from "../store/slices/notificationSlice"

function buildBrokerURL(token) {
  const api = import.meta.env.VITE_API_URL ?? "http://localhost:8080"
  const url  = new URL(api.startsWith("http") ? api : `http://${api}`)
  url.protocol = url.protocol === "https:" ? "wss:" : "ws:"
  return `${url.origin}/ws?token=${token}`
}

export function useWebSocket() {
  const dispatch  = useDispatch()
  const token     = useSelector(s => s.auth.token)
  const clientRef = useRef(null)

  useEffect(() => {
    if (!token) return

    const stomp = new Client({
      brokerURL:      buildBrokerURL(token),
      reconnectDelay: 5000,
      onConnect: () => {
        stomp.subscribe("/topic/events", (message) => {
          try {
            const event = JSON.parse(message.body)
            dispatch(addEvent(event))
            window.dispatchEvent(new CustomEvent("homequest:live", { detail: event }))
          } catch { /* ignore malformed frames */ }
        })
      },
    })

    stomp.activate()
    clientRef.current = stomp

    return () => { stomp.deactivate() }
  }, [token, dispatch])

  return clientRef
}
