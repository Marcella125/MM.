import { GameStatus } from "@tetris/shared/constants/game";
import { getInitialGame } from "@tetris/shared/utils/get-initial";

import { getRandomRotate, getRandomShape } from "@tetris/shared/utils/get-random";
import { GameContextValue } from "../types";

export function pause(state: GameContextValue) {
  return {
    ...state,
    status: GameStatus.PAUSED,
  };
}

export function unpause(state: GameContextValue) {
  return {
    ...state,
    countdown: true,
  };
}

export function drop(state: GameContextValue, payload: boolean) {
  return {
    ...state,
    dropping: payload,
  };
}

export function countdownFinished(state: GameContextValue) {
  return {
    ...state,
    countdown: false,
    status: GameStatus.PLAYING,
  };
}

export function restart(state: GameContextValue, payload: { initialRows: number }) {
  const shape = state.board ? state.board.shapeNext : getRandomShape();
  const shapeNext = getRandomShape();

  return {
    ...state,
    ...getInitialGame({
      countdown: true,
      initialRows: payload.initialRows,
      rotate: getRandomRotate(shape),
      rotateNext: getRandomRotate(shapeNext),
      shape,
      shapeNext,
    }),
    countdown: true,
  };
}
