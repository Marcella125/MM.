import { BoardCellValue, GameBoardState, GameContextValue } from "@tetris/context/game/types";
import { Shape, ShapeOther } from "@tetris/shared/constants/shape";
import { BOARD_SIZE } from "@tetris/shared/constants/board";
import { GameStatus } from "@tetris/shared/constants/game";

import { getRandomInitialRow } from "./get-random";
import { getShapeHint } from "./get-shape-hint";

export function getInitialCells(initialRows: number) {
  let result: BoardCellValue[] = [];
  const emptyRows = BOARD_SIZE.height - initialRows;
  const emptyLine = [ShapeOther.EDGE, ...Array(BOARD_SIZE.width).map(() => null), ShapeOther.EDGE];

  for (let emptyRowIndex = 0; emptyRowIndex < emptyRows; emptyRowIndex += 1) {
    result = result.concat(emptyLine);
  }

  for (let fullRowIndex = 0; fullRowIndex < initialRows; fullRowIndex += 1) {
    result = result.concat(getRandomInitialRow());
  }

  return result;
}

type Params = {
  countdown: boolean;
  initialRows: number;
  rotate: number;
  rotateNext: number;
  shape: Shape;
  shapeNext: Shape;
};

export function getInitialGame({
  countdown,
  initialRows,
  rotate,
  rotateNext,
  shape,
  shapeNext,
}: Params): GameContextValue {
  const cells = getInitialCells(initialRows);

  const boardWithoutHint: GameBoardState = {
    cells,
    hint: null,
    rotate,
    rotateNext,
    shape,
    shapeNext,
    x: 0,
    y: 0,
  };

  const hint = getShapeHint(boardWithoutHint);

  return {
    board: {
      ...boardWithoutHint,
      hint,
    },
    countdown,
    dropping: false,
    fullRowIndexes: null,
    status: GameStatus.IDLE,
    cleared: 0,
  };
}
