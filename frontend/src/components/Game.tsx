import { useEffect, useState } from "react";
import { useSocket } from "../hooks/useSocket";

interface Props {
  matchId: string;
  players: Record<string, string>;
  initialTurn: string;
  onExit: () => void;
}

export default function Game({ matchId, players, initialTurn, onExit }: Props) {
  const { socket, id } = useSocket();
  const [board, setBoard] = useState<string[]>(Array(9).fill(""));
  const [turn, setTurn] = useState(initialTurn);
  const [winner, setWinner] = useState<string | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const [status, setStatus] = useState("");

  const mySymbol = id ? players[id] : "";
  const myTurn = id === turn;

  useEffect(() => {
    if (!gameOver) setStatus(myTurn ? "Your turn!" : "Opponent's turn");
  }, [turn, myTurn, gameOver]);

  useEffect(() => {
    if (!socket) return;

    socket.on("game_update", ({ board, turn, winner, gameOver }) => {
      setBoard(board);
      setTurn(turn);
      setGameOver(gameOver);
      if (gameOver) {
        if (winner === id) setStatus("🎉 You win!");
        else if (winner) setStatus("😞 You lose!");
        else setStatus("🤝 It's a draw!");
        setWinner(winner);
      }
    });

    socket.on("player_left", () => {
      setStatus("Opponent left the game.");
      setGameOver(true);
    });

    return () => {
      socket.off("game_update");
      socket.off("player_left");
    };
  }, [socket, id]);

  const makeMove = (index: number) => {
    if (!myTurn || board[index] !== "" || gameOver || !socket) return;
    socket.emit("make_move", { matchId, index });
  };

  return (
    <div style={{
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      minHeight: "100vh", background: "#f0f2ff",
      fontFamily: "'Segoe UI', sans-serif"
    }}>
      <div style={{ marginBottom: 32, textAlign: "center" }}>
        <div style={{
          display: "inline-block", padding: "6px 20px",
          background: mySymbol === "X" ? "#EEF2FF" : "#FFF5F5",
          borderRadius: 20, marginBottom: 12
        }}>
          <span style={{
            fontWeight: 700, fontSize: 15,
            color: mySymbol === "X" ? "#4F46E5" : "#E53E3E"
          }}>
            You are {mySymbol}
          </span>
        </div>
        <p style={{
          fontSize: 20, fontWeight: 600, margin: 0,
          color: gameOver ? (winner === id ? "#16a34a" : winner ? "#dc2626" : "#555") : "#4F46E5"
        }}>
          {status}
        </p>
      </div>

      <div style={{
        display: "grid", gridTemplateColumns: "repeat(3, 100px)",
        gap: 10, padding: 20, background: "white",
        borderRadius: 24, boxShadow: "0 8px 40px rgba(79,70,229,0.12)",
        marginBottom: 28
      }}>
        {board.map((cell, i) => (
          <div key={i} onClick={() => makeMove(i)} style={{
            width: 100, height: 100, display: "flex",
            alignItems: "center", justifyContent: "center",
            fontSize: 44, fontWeight: 800,
            background: myTurn && !cell && !gameOver ? "#f5f3ff" : "white",
            border: "2px solid #e8e5ff", borderRadius: 16,
            cursor: myTurn && !cell && !gameOver ? "pointer" : "default",
            color: cell === "X" ? "#4F46E5" : "#E53E3E",
            transition: "all 0.15s"
          }}>
            {cell}
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 16, marginBottom: 28 }}>
        {Object.entries(players).map(([pid, sym]) => (
          <div key={pid} style={{
            padding: "8px 20px", borderRadius: 20, fontSize: 14, fontWeight: 600,
            background: turn === pid && !gameOver ? (sym === "X" ? "#4F46E5" : "#E53E3E") : "#e5e7eb",
            color: turn === pid && !gameOver ? "white" : "#999",
            transition: "all 0.2s"
          }}>
            {sym} {pid === id ? "(You)" : "(Opponent)"}
          </div>
        ))}
      </div>

      {gameOver && (
        <button onClick={onExit} style={{
          padding: "14px 40px", fontSize: 15, fontWeight: 600,
          background: "linear-gradient(135deg, #4F46E5, #7C3AED)",
          color: "white", border: "none", borderRadius: 12,
          cursor: "pointer", boxShadow: "0 4px 16px rgba(79,70,229,0.3)"
        }}>
          Play Again
        </button>
      )}
    </div>
  );
}
