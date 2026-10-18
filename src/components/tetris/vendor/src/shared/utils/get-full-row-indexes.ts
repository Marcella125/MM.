import { BoardCellValue } from "@tetris/context/game/types";
import { BOARD_SIZE, BOARD_WIDTH_WITH_EDGES } from "@tetris/shared/constants/board";

export function getFullRowIndexes(cells: BoardCellValue[]) {
  let result: number[] = [];
  for (let rowIndex = 0; rowIndex < BOARD_SIZE.height; rowIndex += 1) {
    const start = rowIndex * BOARD_WIDTH_WITH_EDGES;
    const end = start + BOARD_WIDTH_WITH_EDGES;
    const isFull = cells.slice(start, end).filter(Boolean).length === BOARD_WIDTH_WITH_EDGES;
    if (isFull) result = [...result, rowIndex];
  }
  return result.length > 0 ? result : null;
}
