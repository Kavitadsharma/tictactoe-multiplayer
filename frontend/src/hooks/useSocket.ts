import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

const SERVER_URL = process.env.REACT_APP_SERVER_URL || "http://localhost:4000";

let globalSocket: Socket | null = null;

export function useSocket() {
  const [connected, setConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (globalSocket) {
      socketRef.current = globalSocket;
      setConnected(true);
      return;
    }

    const socket = io(SERVER_URL);
    globalSocket = socket;
    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("Connected:", socket.id);
      setConnected(true);
    });

    socket.on("disconnect", () => setConnected(false));
  }, []);

  return { socket: socketRef.current, connected, id: globalSocket?.id };
}
