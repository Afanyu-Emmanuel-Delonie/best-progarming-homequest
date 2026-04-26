import { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Client } from "@stomp/stompjs";
import { toast } from "react-toastify";
import { addEvent } from "../store/slices/notificationSlice";

function wsBrokerURL(token) {
  const api = import.meta.env.VITE_API_URL ?? "http://localhost:8080";
  const url = new URL(api.startsWith("http") ? api : `http://${api}`);
  url.protocol = url.protocol === "https:" ? "wss:" : "ws:";
  // Spring servlet path is /api/v1, so WebSocket endpoint is under /api/v1/ws
  return `${url.origin}/api/v1/ws${token ? `?token=${token}` : ""}`;
}

export function useLiveUpdates() {
  const token = useSelector((s) => s.auth.token);
  const publicId = useSelector((s) => s.auth.user?.publicId);
  const dispatch = useDispatch();
  const publicIdRef = useRef(publicId);

  useEffect(() => {
    publicIdRef.current = publicId;
    if (!token) return;

    const client = new Client({
      brokerURL: wsBrokerURL(token),
      reconnectDelay: 10000,
      onConnect: () => {
        client.subscribe("/topic/events", (message) => {
          try {
            const event = JSON.parse(message.body);
            // dispatch to store for components listening to live events
            dispatch(addEvent(event));
            // fire browser event so any component can react
            window.dispatchEvent(
              new CustomEvent("homequest:live", { detail: event }),
            );
            // toast only if the event is addressed to this user
            const rid =
              event.recipientPublicId != null
                ? String(event.recipientPublicId)
                : null;
            const mine =
              rid && publicIdRef.current && rid === String(publicIdRef.current);
            if (mine && (event.title || event.message)) {
              toast.info(
                [event.title, event.message].filter(Boolean).join(" — "),
              );
            }
          } catch {
            /* ignore malformed frames */
          }
        });
      },
      onStompError: () => {
        /* suppress console errors */
      },
      onWebSocketError: () => {
        /* suppress console errors */
      },
    });

    client.activate();
    return () => {
      client.deactivate();
    };
  }, [token, dispatch]);
}
