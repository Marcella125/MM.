import { Shape } from "@tetris/shared/constants/shape";
import { getNextRotateIndex } from "@tetris/shared/utils/get-next-rotate-index";
import { getShapeCoords } from "@tetris/shared/utils/get-shape-coords";
import { getShapeHint } from "@tetris/shared/utils/get-shape-hint";
import { GameContextValue } from "../types";

export function rotate(state: GameContextValue, payload: 1 | -1): GameContextValue {
  if (!state.board) {
    throw new Error("Board not created");
  }

  const rotateCurrent = getNextRotateIndex({
    shape: state.board.shape,
    rotate: state.board.rotate,
    direction: payload,
  });
  const rotated = getShapeCoords({ rotate: rotateCurrent }, state.board);
  if (rotated) {
    const boardWithRotate = {
      ...state.board,
      rotate: rotateCurrent,
    };
    return {
      ...state,
      board: {
        ...boardWithRotate,
        hint: getShapeHint(boardWithRotate),
      },
    };
  }

  const altX = state.board.x < 0 ? state.board.x + 1 : state.board.x - 1;
  const rotatedAndMoved = getShapeCoords({ rotate: rotateCurrent, x: altX }, state.board);
  if (rotatedAndMoved) {
    const boardWithRotate = {
      ...state.board,
      rotate: rotateCurrent,
      x: altX,
    };
    return {
      ...state,
      board: {
        ...boardWithRotate,
        hint: getShapeHint(boardWithRotate),
      },
    };
  }

  if (state.board.shape === Shape.I && state.board.x > 0) {
    const altXDoubled = state.board.x - 2;
    const rotatedAndMovedDouble = getShapeCoords({ rotate: rotateCurrent, x: altXDoubled }, state.board);
    if (rotatedAndMovedDouble) {
      const boardWithRotate = {
        ...state.board,
        rotate: rotateCurrent,
        x: altXDoubled,
      };
      return {
        ...state,
        board: {
          ...boardWithRotate,
          hint: getShapeHint(boardWithRotate),
        },
      };
    }
  }

  return state;
}
