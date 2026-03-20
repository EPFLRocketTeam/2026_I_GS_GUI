import { useEffect, useRef, useState, useCallback } from "react";

function useRadioSocket(url) {
  const ws = useRef(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [lastReceived, setLastReceived] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const reconnectAttempts = useRef(0);
  const reconnectTimeout = useRef(null);

  useEffect(() => {
    let closed = false; // ✅ track if cleanup already ran

    const connectWebSocket = () => {
      if (closed) return; // ✅ don't reconnect if unmounted

      try {
        ws.current = new WebSocket(url);

        ws.current.onopen = () => {
          if (closed) { ws.current.close(); return; }
          console.log("Radio WS connected");
          setIsConnected(true);
          reconnectAttempts.current = 0;
        };

        ws.current.onmessage = (event) => {
          if (closed) return;
          try {
            const data = JSON.parse(event.data);
            const point = data.received ?? data;
            setLastUpdated(data.last_updated ?? new Date().toLocaleTimeString());
            setLastReceived(point);
          } catch (e) {
            console.error("Failed to parse radio WS message:", e);
          }
        };

        ws.current.onerror = (e) => {
          if (closed) return;
          console.error("Radio WS error:", e);
          setIsConnected(false);
        };

        ws.current.onclose = () => {
          if (closed) return;
          console.log("Radio WS disconnected");
          setIsConnected(false);
          if (reconnectAttempts.current < 5) {
            reconnectAttempts.current += 1;
            reconnectTimeout.current = setTimeout(connectWebSocket, 3000);
          }
        };
      } catch (e) {
        console.error("Failed to create WebSocket:", e);
      }
    };

    connectWebSocket();

    return () => {
      closed = true;
      if (reconnectTimeout.current) clearTimeout(reconnectTimeout.current);
      ws.current?.close();
    };
  }, [url]);

  const sendConfig = useCallback((config) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(config));
    } else {
      console.warn("Radio WS not open, state:", ws.current?.readyState);
    }
  }, []);

  return { lastUpdated, lastReceived, isConnected, sendConfig };
}

export default useRadioSocket;