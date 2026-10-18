import { GameStatus } from "@tetris/shared/constants/game";
import { Shape, ShapeOther } from "@tetris/shared/constants/shape";

import { GameAction } from "./action-types";

export type BoardCellValue = Shape | ShapeOther | null;

export type GameBoardState = {
  cells: BoardCellValue[];
  hint: number[] | null;
  rotate: number;
  rotateNext: number;
  shape: Shape;
  shapeNext: Shape;
  y: number;
  x: number;
};

export type GameContextValue = {
  board: GameBoardState | null;
  cleared: number;
  countdown: boolean;
  dropping: boolean;
  fullRowIndexes: number[] | null;
  status: GameStatus;
};

export type GameDispatch = React.Dispatch<GameAction>;
