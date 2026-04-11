import { useState, useEffect } from "react";
import { useNakama } from "../hooks/useNakama";

interface Props {
  matchId: string;
  onExit: () => void;
}

export default function Game({ matchId, onExit }: Props) {
  const { session, socket } = useNakama();
  const [board, setBoard] = useState<string[]>(Array(9).fill(""));
  const [myTurn, setMyTurn] = useState(false);
  const [mySymbol, setMySymbol] = useState("");
  const [status, setStatus] = useState("Waiting for opponent...");
  const [gameOver, setGameOver] = useState(false);

useEffect(() => {
  if (!socket || !session) return;

  (async () => {
    await socket.joinMatch(matchId);
  })();

  (socket as any).onmatchdata = (data: any) => {
    const msg = JSON.parse(
      new TextDecoder().decode(data.data)
    );

const myId = session.user_id;

if (!myId) return;

if (msg.type === "game_start") {
  setMySymbol(msg.players[myId]);
  setBoard(msg.board);
  setMyTurn(msg.turn === myId);
  setStatus(msg.turn === myId ? "Your turn!" : "Opponent's turn");
}

    if (msg.type === "game_update") {
      setBoard(msg.board);
      setGameOver(msg.gameOver);

      if (msg.gameOver) {
        if (msg.winner === myId) setStatus("You win!");
        else if (msg.winner) setStatus("You lose!");
        else setStatus("It's a draw!");
        setMyTurn(false);
      } else {
        setMyTurn(msg.turn === myId);
        setStatus(msg.turn === myId ? "Your turn!" : "Opponent's turn");
      }
    }

    if (msg.type === "player_left") {
      setStatus("Opponent left the game.");
      setGameOver(true);
    }
  };

}, [socket, session, matchId]);

  const makeMove = (index: number) => {
    if (!myTurn || board[index] !== "" || gameOver || !socket) return;
    socket.sendMatchState(matchId, 1,
      JSON.stringify({ index })
    );
  };

  const cellStyle = (cell: string, i: number) => ({
    width: 100, height: 100, fontSize: 42, fontWeight: "bold" as const,
    display: "flex", alignItems: "center", justifyContent: "center",
    background: "white", border: "2px solid #e0e0e0",
    borderRadius: 12, cursor: myTurn && !cell ? "pointer" : "default",
    color: cell === "X" ? "#4F46E5" : "#E53E3E",
    transition: "background 0.15s",
  });

  return (
    <div style={{
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      minHeight: "100vh", background: "#f5f5f5",
      fontFamily: "sans-serif"
    }}>
      <h2 style={{ marginBottom: 4 }}>You are: {mySymbol}</h2>
      <p style={{
        fontSize: 18, marginBottom: 28,
        color: gameOver ? "#E53E3E" : "#4F46E5",
        fontWeight: 500
      }}>{status}</p>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 100px)",
        gap: 8, marginBottom: 32
      }}>
        {board.map((cell, i) => (
          <div key={i} style={cellStyle(cell, i)}
            onClick={() => makeMove(i)}>
            {cell}
          </div>
        ))}
      </div>

      {gameOver && (
        <button onClick={onExit} style={{
          padding: "12px 32px", fontSize: 15,
          background: "#4F46E5", color: "white",
          border: "none", borderRadius: 10, cursor: "pointer"
        }}>
          Play Again
        </button>
      )}
    </div>
  );
}