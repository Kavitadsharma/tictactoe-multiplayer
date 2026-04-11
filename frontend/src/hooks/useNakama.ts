import { Client, Session, Socket } from "@heroiclabs/nakama-js";
import { useState, useEffect, useRef } from "react";

const client = new Client(
  "defaultkey",
  "opulent-dollop-6q6pg75j6jxf4r67-7350.app.github.dev",
  "443",
  true
);

export function useNakama() {
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    (async () => {
      let deviceId = localStorage.getItem("deviceId");
      if (!deviceId) {
        deviceId = Math.random().toString(36).substring(2);
        localStorage.setItem("deviceId", deviceId);
      }
      const s = await client.authenticateDevice(deviceId, true);
      setSession(s);
      const socket = client.createSocket(false, false);
      await socket.connect(s, true);
      socketRef.current = socket;
      setReady(true);
    })();
  }, []);

  return { client, session, socket: socketRef.current, ready };
}