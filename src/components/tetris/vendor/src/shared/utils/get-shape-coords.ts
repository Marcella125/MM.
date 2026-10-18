import { GameBoardState, GameContextValue } from "@tetris/context/game/types";
import { BOARD_AREA_WITH_EDGES, BOARD_WIDTH_WITH_EDGES } from "@tetris/shared/constants/board";
import { Shape, SHAPES } from "@tetris/shared/constants/shape";

import { isEdge } from "./is-edge";

function isCoordsLegal(coords: number[], board?: GameContextValue["board"]) {
  for (const coord of coords) {
    // Coord crossed bottom edge
    if (coord > BOARD_AREA_WITH_EDGES) {
      return false;
    }
    // Coord already occupied
    if (board?.cells?.[coord]) {
      return false;
    }
    // Coord crossed edge
    if (!board?.cells && isEdge(coord)) {
      return false;
    }
  }
  return true;
}

type ChangeShapeCoordsPayload = {
  rotate?: number;
  shape?: Shape;
  x?: number;
  y?: number;
};

export function getShapeCoords(payload: ChangeShapeCoordsPayload, board: GameBoardState, checkIfLegal = true) {
  const shape = payload?.shape || board.shape;
  const x = typeof payload?.x === "number" ? payload.x : board.x;
  const y = typeof payload?.y === "number" ? payload.y : board.y;
  const rotate = typeof payload?.rotate === "number" ? payload.rotate : board.rotate;

  const coords = SHAPES[shape][rotate];
  const coordsModified = coords.map((coord) => coord + x + y * BOARD_WIDTH_WITH_EDGES);

  if (!checkIfLegal) return coordsModified;
  return isCoordsLegal(coordsModified, board) ? coordsModified : null;
}

export function getShapeCoordsAlways(payload: ChangeShapeCoordsPayload, board: GameBoardState) {
  return getShapeCoords(payload, board, false) as number[];
}
