import { useEffect, useRef, useState, useCallback } from "react";

export default function useTelemetrySocket(url) {
  const [data, setData] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef(null);

  useEffect(() => {
    console.log("Trying to connect to:", url);

    let closed = false;
    const socket = new WebSocket(url);
    socketRef.current = socket;

    socket.onopen = () => {
      console.log("WebSocket connected");
    };

    socket.onmessage = (event) => {
      if (closed) return;
      try {
          const point = JSON.parse(event.data);
          setData((prev) => [...prev.slice(-49), point]);
        } catch (e) {
          console.error("Failed to parse message:", e);
        }
      };

    socket.onclose = (event) => {
      if (closed) return;
        console.log("WebSocket disconnected", event);
        setIsConnected(false);
      };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    return () => {
      socket.close();
    };
  }, [url]);

  const sendMessage = useCallback((messageObject) => {
    console.log("Socket readyState:", socketRef.current?.readyState);

    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(messageObject));
      console.log("Sent:", messageObject);
    } else {
      console.log("WebSocket is not open");
    }
  }, []);

  return { data, sendMessage };
}