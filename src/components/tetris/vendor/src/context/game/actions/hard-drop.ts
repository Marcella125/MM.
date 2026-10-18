import { getShapeCoords } from "@tetris/shared/utils/get-shape-coords";
import { tick } from "./tick";
import { GameContextValue } from "../types";

export function hardDrop(state: GameContextValue): GameContextValue {
  if (!state.board || state.fullRowIndexes) return tick(state);

  let landingY = state.board.y;
  while (getShapeCoords({ y: landingY + 1 }, state.board)) landingY += 1;

  return tick({ ...state, board: { ...state.board, y: landingY } });
}
