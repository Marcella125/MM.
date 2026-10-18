import { BOARD_SIZE } from "@tetris/shared/constants/board";

export function isEdge(coord: number) {
  const modulor = BOARD_SIZE.width + 2;
  return coord % modulor === 0 || (coord + 1) % modulor === 0;
}
