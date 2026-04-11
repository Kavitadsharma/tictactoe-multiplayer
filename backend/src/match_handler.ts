/// <reference types="nakama-runtime" />
const WINNING_COMBOS = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];

interface MatchState {
  board: string[];
  players: {[userId: string]: string};
  turn: string;
  winner: string | null;
  gameOver: boolean;
}

function checkWinner(board: string[]): string | null {
  for (const [a,b,c] of WINNING_COMBOS) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  return null;
}

const matchInit: nkruntime.MatchInitFunction<MatchState> =
  (ctx, logger, nk, params) => {
    const state: MatchState = {
      board: Array(9).fill(""),
      players: {},
      turn: "",
      winner: null,
      gameOver: false
    };
    return { state, tickRate: 1, label: "tictactoe" };
  };

const matchJoinAttempt: nkruntime.MatchJoinAttemptFunction<MatchState> =
  (ctx, logger, nk, dispatcher, tick, state: MatchState, presence, metadata) => {
    if (Object.keys(state.players).length >= 2) {
      return { state, accept: false, rejectMessage: "Match full" };
    }
    return { state, accept: true };
  };

const matchJoin: nkruntime.MatchJoinFunction<MatchState> =
  (ctx, logger, nk, dispatcher, tick, state: MatchState, presences) => {
    for (const p of presences) {
      const symbol = Object.keys(state.players).length === 0 ? "X" : "O";
      state.players[p.userId] = symbol;
      if (symbol === "X") state.turn = p.userId;
    }
    if (Object.keys(state.players).length === 2) {
      dispatcher.broadcastMessage(1, JSON.stringify({
        type: "game_start",
        board: state.board,
        turn: state.turn,
        players: state.players
      }));
    }
    return { state };
  };

const matchLoop: nkruntime.MatchLoopFunction<MatchState> =
  (ctx, logger, nk, dispatcher, tick, state: MatchState, messages) => {
    for (const msg of messages) {
      if (state.gameOver) continue;

      if (msg.sender.userId !== state.turn) {
        dispatcher.broadcastMessage(2,
          JSON.stringify({ type: "error", message: "Not your turn" }),
          [msg.sender]);
        continue;
      }

      const data = JSON.parse(nk.binaryToString(msg.data));
      const index: number = data.index;

      if (index < 0 || index > 8 || state.board[index] !== "") {
        dispatcher.broadcastMessage(2,
          JSON.stringify({ type: "error", message: "Invalid move" }),
          [msg.sender]);
        continue;
      }

      state.board[index] = state.players[msg.sender.userId];

      const winner = checkWinner(state.board);
      if (winner) {
        state.winner = msg.sender.userId;
        state.gameOver = true;
      } else if (state.board.every(c => c !== "")) {
        state.gameOver = true;
      } else {
        const other = Object.keys(state.players)
          .find(id => id !== state.turn)!;
        state.turn = other;
      }

      dispatcher.broadcastMessage(1, JSON.stringify({
        type: "game_update",
        board: state.board,
        turn: state.turn,
        winner: state.winner,
        gameOver: state.gameOver
      }));
    }
    return { state };
  };

const matchLeave: nkruntime.MatchLeaveFunction<MatchState> =
  (ctx, logger, nk, dispatcher, tick, state: MatchState, presences) => {
    for (const p of presences) {
      delete state.players[p.userId];
    }
    if (Object.keys(state.players).length < 2 && !state.gameOver) {
      state.gameOver = true;
      dispatcher.broadcastMessage(1,
        JSON.stringify({ type: "player_left" }));
    }
    return { state };
  };

const matchTerminate: nkruntime.MatchTerminateFunction<MatchState> =
  (ctx, logger, nk, dispatcher, tick, state, graceSeconds) => {
    return { state };
  };

const matchSignal: nkruntime.MatchSignalFunction<MatchState> =
  (ctx, logger, nk, dispatcher, tick, state) => {
    return { state };
  };


  export {
  matchInit,
  matchJoinAttempt,
  matchJoin,
  matchLoop,
  matchLeave,
  matchTerminate,
  matchSignal
};