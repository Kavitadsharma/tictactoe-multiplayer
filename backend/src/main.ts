/// <reference types="nakama-runtime" />
import {
  matchInit,
  matchJoinAttempt,
  matchJoin,
  matchLoop,
  matchLeave,
  matchTerminate,
  matchSignal
} from "./match_handler";

const InitModule: nkruntime.InitModule = function (
  ctx,
  logger,
  nk,
  initializer
) {
  initializer.registerMatch("tictactoe", {
    matchInit,
    matchJoinAttempt,
    matchJoin,
    matchLoop,
    matchLeave,
    matchTerminate,
    matchSignal
  });

  initializer.registerMatchmakerMatched(
    (ctx, logger, nk, matches) => {
      const matchId = nk.matchCreate("tictactoe", {});
      return matchId;
    }
  );

  logger.info("TicTacToe loaded!");
};

export { InitModule };