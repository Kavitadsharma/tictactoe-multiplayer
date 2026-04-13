const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }
});

// Matchmaking queue
let waitingPlayer = null;

// Active matches: matchId -> matchState
const matches = {};

function checkWinner(board) {
  const combos = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
  for (const [a,b,c] of combos) {
    if (board[a] && board[a] === board[b] && board[a] === board[c])
      return board[a];
  }
  return null;
}

io.on("connection", (socket) => {
  console.log("Player connected:", socket.id);

  socket.on("find_match", () => {
    if (waitingPlayer && waitingPlayer.id !== socket.id) {
      // Match the two players
      const matchId = `match_${Date.now()}`;
      const player1 = waitingPlayer;
      const player2 = socket;
      waitingPlayer = null;

      matches[matchId] = {
        board: Array(9).fill(""),
        players: {
          [player1.id]: "X",
          [player2.id]: "O"
        },
        turn: player1.id,
        gameOver: false,
        winner: null
      };

      player1.join(matchId);
      player2.join(matchId);

      io.to(matchId).emit("game_start", {
        matchId,
        board: matches[matchId].board,
        turn: matches[matchId].turn,
        players: matches[matchId].players
      });

    } else {
      waitingPlayer = socket;
      socket.emit("waiting");
    }
  });

  socket.on("make_move", ({ matchId, index }) => {
    const match = matches[matchId];
    if (!match || match.gameOver) return;
    if (match.turn !== socket.id) return;
    if (match.board[index] !== "") return;

    match.board[index] = match.players[socket.id];

    const winnerSymbol = checkWinner(match.board);
    if (winnerSymbol) {
      match.gameOver = true;
      match.winner = socket.id;
    } else if (match.board.every(c => c !== "")) {
      match.gameOver = true;
    } else {
      match.turn = Object.keys(match.players).find(id => id !== socket.id);
    }

    io.to(matchId).emit("game_update", {
      board: match.board,
      turn: match.turn,
      winner: match.winner,
      gameOver: match.gameOver
    });

    if (match.gameOver) delete matches[matchId];
  });

  socket.on("disconnect", () => {
    console.log("Player disconnected:", socket.id);

    // Remove from queue if waiting
    if (waitingPlayer?.id === socket.id) waitingPlayer = null;

    // Notify opponent in any active match
    for (const [matchId, match] of Object.entries(matches)) {
      if (match.players[socket.id]) {
        io.to(matchId).emit("player_left");
        delete matches[matchId];
      }
    }
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));