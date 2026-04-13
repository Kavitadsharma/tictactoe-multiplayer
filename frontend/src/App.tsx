import { useState } from "react";
import Lobby from "./components/Lobby";
import Game from "./components/Game";

interface GameState {
  matchId: string;
  players: Record<string, string>;
  turn: string;
}

export default function App() {
  const [gameState, setGameState] = useState<GameState | null>(null);

  if (gameState) {
    return (
      <Game
        matchId={gameState.matchId}
        players={gameState.players}
        initialTurn={gameState.turn}
        onExit={() => setGameState(null)}
      />
    );
  }

  return (
    <Lobby
      onMatchFound={(matchId: string, players: Record<string, string>, turn: string) =>
        setGameState({ matchId, players, turn })
      }
    />
  );
}
