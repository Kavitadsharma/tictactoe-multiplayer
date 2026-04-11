"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.matchSignal = exports.matchTerminate = exports.matchLeave = exports.matchLoop = exports.matchJoin = exports.matchJoinAttempt = exports.matchInit = void 0;
/// <reference types="nakama-runtime" />
const WINNING_COMBOS = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];
function checkWinner(board) {
    for (const [a, b, c] of WINNING_COMBOS) {
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return board[a];
        }
    }
    return null;
}
const matchInit = (ctx, logger, nk, params) => {
    const state = {
        board: Array(9).fill(""),
        players: {},
        turn: "",
        winner: null,
        gameOver: false
    };
    return { state, tickRate: 1, label: "tictactoe" };
};
exports.matchInit = matchInit;
const matchJoinAttempt = (ctx, logger, nk, dispatcher, tick, state, presence, metadata) => {
    if (Object.keys(state.players).length >= 2) {
        return { state, accept: false, rejectMessage: "Match full" };
    }
    return { state, accept: true };
};
exports.matchJoinAttempt = matchJoinAttempt;
const matchJoin = (ctx, logger, nk, dispatcher, tick, state, presences) => {
    for (const p of presences) {
        const symbol = Object.keys(state.players).length === 0 ? "X" : "O";
        state.players[p.userId] = symbol;
        if (symbol === "X")
            state.turn = p.userId;
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
exports.matchJoin = matchJoin;
const matchLoop = (ctx, logger, nk, dispatcher, tick, state, messages) => {
    for (const msg of messages) {
        if (state.gameOver)
            continue;
        if (msg.sender.userId !== state.turn) {
            dispatcher.broadcastMessage(2, JSON.stringify({ type: "error", message: "Not your turn" }), [msg.sender]);
            continue;
        }
        const data = JSON.parse(nk.binaryToString(msg.data));
        const index = data.index;
        if (index < 0 || index > 8 || state.board[index] !== "") {
            dispatcher.broadcastMessage(2, JSON.stringify({ type: "error", message: "Invalid move" }), [msg.sender]);
            continue;
        }
        state.board[index] = state.players[msg.sender.userId];
        const winner = checkWinner(state.board);
        if (winner) {
            state.winner = msg.sender.userId;
            state.gameOver = true;
        }
        else if (state.board.every(c => c !== "")) {
            state.gameOver = true;
        }
        else {
            const other = Object.keys(state.players)
                .find(id => id !== state.turn);
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
exports.matchLoop = matchLoop;
const matchLeave = (ctx, logger, nk, dispatcher, tick, state, presences) => {
    for (const p of presences) {
        delete state.players[p.userId];
    }
    if (Object.keys(state.players).length < 2 && !state.gameOver) {
        state.gameOver = true;
        dispatcher.broadcastMessage(1, JSON.stringify({ type: "player_left" }));
    }
    return { state };
};
exports.matchLeave = matchLeave;
const matchTerminate = (ctx, logger, nk, dispatcher, tick, state, graceSeconds) => {
    return { state };
};
exports.matchTerminate = matchTerminate;
const matchSignal = (ctx, logger, nk, dispatcher, tick, state) => {
    return { state };
};
exports.matchSignal = matchSignal;
