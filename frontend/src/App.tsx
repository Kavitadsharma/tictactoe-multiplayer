import { useState } from "react";
import Lobby from "./pages/Lobby";
import Game from "./pages/Game";

function App() {
  const [matchId, setMatchId] = useState<string | null>(null);

  if (matchId) {
    return (
      <Game
        matchId={matchId}
        onExit={() => setMatchId(null)}
      />
    );
  }

  return <Lobby onMatchFound={(id) => setMatchId(id)} />;
}

export default App;