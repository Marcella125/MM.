import { GameStatus } from "@tetris/shared/constants/game";
import { ShapeOther } from "@tetris/shared/constants/shape";
import { clearFullRows } from "@tetris/shared/utils/clear-full-rows";
import { getFullRowIndexes } from "@tetris/shared/utils/get-full-row-indexes";
import { getShapeCoords, getShapeCoordsAlways } from "@tetris/shared/utils/get-shape-coords";
import { placeShape } from "@tetris/shared/utils/place-shape";

import { getRandomRotate, getRandomShape } from "@tetris/shared/utils/get-random";
import { getShapeHint } from "@tetris/shared/utils/get-shape-hint";
import { GameContextValue } from "../types";

export function tick(state: GameContextValue): GameContextValue {
  if (!state.board) {
    throw new Error("Board not created");
  }

  // Clearing rows
  if (state.fullRowIndexes) {
    return {
      ...state,
      board: {
        ...state.board,
        cells: clearFullRows(state.fullRowIndexes, state.board.cells),
        hint: null,
      },
      cleared: state.cleared + state.fullRowIndexes.length,
      dropping: false,
      fullRowIndexes: null,
    };
  }

  // Falls to next row
  const yCurrent = state.board.y + 1;
  const movedCoords = getShapeCoords({ y: yCurrent }, state.board);

  if (movedCoords) {
    return {
      ...state,
      board: {
        ...state.board,
        hint: getShapeHint(state.board),
        y: yCurrent,
      },
    };
  }

  const shape = state.board.shapeNext;
  const shapeNext = getRandomShape();
  const rotate = getRandomRotate(shape);
  const rotateNext = getRandomRotate(shapeNext);
  const currentCoordsValid = getShapeCoords({}, state.board);

  // Placing valid
  if (currentCoordsValid) {
    const cells = placeShape(
      {
        shape: state.board.shape,
        coords: currentCoordsValid,
      },
      state.board.cells
    );
    return {
      ...state,
      board: {
        cells,
        hint: null,
        shape,
        shapeNext,
        rotate,
        rotateNext,
        x: 0,
        y: 0,
      },
      fullRowIndexes: getFullRowIndexes(cells),
      dropping: false,
    };
  }

  // Placing invalid
  const currentCoordsInvalid = getShapeCoordsAlways({}, state.board);
  const cells = placeShape(
    {
      shape: ShapeOther.INITIAL,
      coords: currentCoordsInvalid,
    },
    state.board.cells,
    true
  );

  return {
    ...state,
    board: {
      cells,
      hint: null,
      shape,
      shapeNext,
      rotate,
      rotateNext,
      x: 0,
      y: 0,
    },
    status: GameStatus.FINISHED,
  };
}
