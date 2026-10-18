import { GameBoardState } from "@tetris/context/game/types";
import { BOARD_AREA_WITH_EDGES, BOARD_SIZE, BOARD_WIDTH_WITH_EDGES } from "@tetris/shared/constants/board";

import { getShapeCoords } from "./get-shape-coords";

export function getShapeHint(game: GameBoardState) {
  const coords = getShapeCoords({}, game);
  if (!coords) return null;

  const remainingRows = BOARD_SIZE.height - game.y;
  const columnCoords = [...Array(remainingRows)]
    .map((_el, rowIndex) => coords.map((coord) => coord + rowIndex * BOARD_WIDTH_WITH_EDGES))
    .filter((coords) => !coords.find((coord) => coord > BOARD_AREA_WITH_EDGES));
  const columnCells = columnCoords.map((coords) => coords.map((coord) => game.cells[coord]));

  const hintRow = columnCells.findIndex((row, index) => {
    const isOccupied = row.filter(Boolean).length > 0;
    if (isOccupied) return false;

    const rowAfter = columnCells[index + 1];
    const isRowAfterOccupied = rowAfter?.filter(Boolean).length > 0;
    if (rowAfter && !isRowAfterOccupied) return false;

    const rowsBefore = columnCells.slice(0, index);
    const isAnyRowBeforeOccupied = Boolean(rowsBefore.find((r) => r.filter(Boolean).length > 0));
    if (isAnyRowBeforeOccupied) return false;

    return true;
  });

  return hintRow >= 0 ? columnCoords[hintRow] : null;
}
