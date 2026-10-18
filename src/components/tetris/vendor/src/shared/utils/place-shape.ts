import { BoardCellValue } from "@tetris/context/game/types";
import { Shape, ShapeOther } from "@tetris/shared/constants/shape";

export function placeShape(
  shapeToPlace: {
    shape: Shape | ShapeOther;
    coords: number[];
  },
  cells: BoardCellValue[],
  overwrite = false
): BoardCellValue[] {
  const { shape, coords } = shapeToPlace;
  return cells.map((cell, index) => {
    const isOccupied = Boolean(cell);
    if (isOccupied && !overwrite) return cell;

    const isShapeCoord = coords.includes(index);
    if (!isShapeCoord) return cell;

    if (!cell) return shape;
    return overwrite ? shape : cell;
  });
}
