import { useState, useEffect } from "react";
import { useNakama } from "../hooks/useNakama";

interface Props {
  onMatchFound: (matchId: string) => void;
}

export default function Lobby({ onMatchFound }: Props) {
  const { socket, ready } = useNakama();
  const [searching, setSearching] = useState(false);
  const [status, setStatus] = useState("Click below to find a match");

  useEffect(() => {
    if (!socket) return;
    socket.onmatchmakermatched = (matched) => {
      setStatus("Opponent found! Starting game...");
      onMatchFound(matched.match_id);
    };
  }, [socket, onMatchFound]);

  const findMatch = async () => {
    if (!socket) return;
    setSearching(true);
    setStatus("Searching for opponent...");
    await socket.addMatchmaker("*", 2, 2, {}, {});
  };

  return (
    <div style={{
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      minHeight: "100vh", fontFamily: "sans-serif",
      background: "#f5f5f5"
    }}>
      <h1 style={{ fontSize: 32, marginBottom: 8 }}>
        Tic-Tac-Toe
      </h1>
      <p style={{ color: "#666", marginBottom: 32 }}>
        Multiplayer — powered by Nakama
      </p>
      <div style={{
        background: "white", padding: 40, borderRadius: 16,
        boxShadow: "0 2px 16px rgba(0,0,0,0.08)", textAlign: "center"
      }}>
        <p style={{ marginBottom: 24, color: "#444" }}>{status}</p>
        <button
          onClick={findMatch}
          disabled={searching || !ready}
          style={{
            padding: "14px 40px", fontSize: 16,
            background: searching ? "#ccc" : "#4F46E5",
            color: "white", border: "none", borderRadius: 10,
            cursor: searching ? "default" : "pointer"
          }}
        >
          {!ready ? "Connecting..." : searching ? "Searching..." : "Find Match"}
        </button>
      </div>
    </div>
  );
}