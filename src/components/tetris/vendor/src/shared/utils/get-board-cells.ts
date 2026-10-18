import { GameContextValue } from "@tetris/context/game/types";
import { ShapeOther } from "@tetris/shared/constants/shape";

import { getCellIndexesByRow } from "./get-cell-indexes";
import { getShapeCoords } from "./get-shape-coords";
import { placeShape } from "./place-shape";

export function getBoardCells(state: GameContextValue) {
  if (!state.board) return [];

  let result = state.board.cells;

  // Place hint
  if (state.board.hint) {
    result = placeShape(
      {
        shape: ShapeOther.HINT,
        coords: state.board.hint,
      },
      result,
      false
    );
  }

  // Place current shape
  const currentShapeCoords = getShapeCoords({}, state.board);
  if (currentShapeCoords) {
    result = placeShape(
      {
        shape: state.board.shape,
        coords: currentShapeCoords,
      },
      result,
      true
    );
  }

  // Mark full rows
  if (state.fullRowIndexes) {
    const fullCellIndexes = state.fullRowIndexes.map((rowIndex) => getCellIndexesByRow(rowIndex)).flat();
    result = placeShape(
      {
        shape: ShapeOther.FULL,
        coords: fullCellIndexes,
      },
      result,
      true
    );
  }

  return result;
}
