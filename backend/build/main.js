"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InitModule = void 0;
/// <reference types="nakama-runtime" />
const match_handler_1 = require("./match_handler");
const InitModule = function (ctx, logger, nk, initializer) {
    initializer.registerMatch("tictactoe", {
        matchInit: match_handler_1.matchInit,
        matchJoinAttempt: match_handler_1.matchJoinAttempt,
        matchJoin: match_handler_1.matchJoin,
        matchLoop: match_handler_1.matchLoop,
        matchLeave: match_handler_1.matchLeave,
        matchTerminate: match_handler_1.matchTerminate,
        matchSignal: match_handler_1.matchSignal
    });
    initializer.registerMatchmakerMatched((ctx, logger, nk, matches) => {
        const matchId = nk.matchCreate("tictactoe", {});
        return matchId;
    });
    logger.info("TicTacToe loaded!");
};
exports.InitModule = InitModule;
