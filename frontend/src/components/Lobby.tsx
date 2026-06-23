import { useSocket } from "../hooks/useSocket";
import { useEffect, useState } from "react";

interface Props {
  onMatchFound: (matchId: string, players: Record<string, string>, turn: string) => void;
}

export default function Lobby({ onMatchFound }: Props) {
  const { socket, connected } = useSocket();
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    if (!socket) return;

    socket.on("waiting", () => setSearching(true));
    socket.on("game_start", ({ matchId, players, turn }) => {
      onMatchFound(matchId, players, turn);
    });

    return () => {
      socket.off("waiting");
      socket.off("game_start");
    };
  }, [socket]);

  const findMatch = () => {
    if (!socket || searching) return;
    socket.emit("find_match");
  };

  return (
    <div style={{
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      minHeight: "100vh", background: "#f0f2ff",
      fontFamily: "'Segoe UI', sans-serif"
    }}>
      <h1 style={{ fontSize: 42, fontWeight: 800, marginBottom: 8, color: "#1a1a2e" }}>
        Tic-Tac-Toe
      </h1>
      <p style={{ color: "#666", marginBottom: 48, fontSize: 16 }}>
        Real-time multiplayer
      </p>

      <div style={{
        background: "white", padding: "48px 56px",
        borderRadius: 24, boxShadow: "0 8px 40px rgba(79,70,229,0.12)",
        textAlign: "center", minWidth: 340
      }}>
        {!connected ? (
          <p style={{ color: "#999" }}>Connecting to server...</p>
        ) : !searching ? (
          <>
            <p style={{ color: "#444", marginBottom: 28, fontSize: 15 }}>
              Find a random opponent and play instantly
            </p>
            <button onClick={findMatch} style={{
              padding: "14px 0", fontSize: 16, fontWeight: 600,
              background: "linear-gradient(135deg, #4F46E5, #7C3AED)",
              color: "white", border: "none", borderRadius: 12,
              cursor: "pointer", width: "100%",
              boxShadow: "0 4px 16px rgba(79,70,229,0.3)"
            }}>
              Find Match
            </button>
          </>
        ) : (
          <>
            <div style={{
              width: 48, height: 48, border: "4px solid #4F46E5",
              borderTopColor: "transparent", borderRadius: "50%",
              margin: "0 auto 20px", animation: "spin 0.8s linear infinite"
            }} />
            <p style={{ color: "#4F46E5", fontWeight: 600, fontSize: 16 }}>
              Searching for opponent...
            </p>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </>
        )}
      </div>
    </div>
  );
}
