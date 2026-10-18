import { BoardCellValue } from "@tetris/context/game/types";
import { BOARD_AREA_WITH_EDGES, BOARD_SIZE } from "@tetris/shared/constants/board";
import { ShapeOther } from "@tetris/shared/constants/shape";

import { getFirstCellIndexByRow, getLastCellIndexByRow } from "./get-cell-indexes";

export function clearFullRows(fullRowIndexes: number[], placed: BoardCellValue[]) {
  const emptyRow: BoardCellValue[] = [ShapeOther.EDGE, ...Array(BOARD_SIZE.width).map(() => null), ShapeOther.EDGE];

  let newCells = placed;
  for (const rowIndex of fullRowIndexes) {
    const before = newCells.slice(0, getLastCellIndexByRow(rowIndex - 1));
    const after = newCells.slice(getFirstCellIndexByRow(rowIndex + 1), BOARD_AREA_WITH_EDGES);
    newCells = [...emptyRow, ...before, ...after];
  }

  return newCells;
}
