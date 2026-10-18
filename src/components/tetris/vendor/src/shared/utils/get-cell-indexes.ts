import { BOARD_WIDTH_WITH_EDGES } from "@tetris/shared/constants/board";

export function getFirstCellIndexByRow(row: number) {
  const result = row * BOARD_WIDTH_WITH_EDGES;
  return result;
}

export function getLastCellIndexByRow(row: number) {
  const result = getFirstCellIndexByRow(row) + BOARD_WIDTH_WITH_EDGES;
  return result;
}

export function getCellIndexesByRow(row: number) {
  const firstIndex = getFirstCellIndexByRow(row);
  return [...Array(BOARD_WIDTH_WITH_EDGES)].map((_value, index) => firstIndex + index);
}
