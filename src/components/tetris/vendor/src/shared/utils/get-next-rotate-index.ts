import { Shape, SHAPES } from "@tetris/shared/constants/shape";

type Params = { shape: Shape; rotate: number; direction?: 1 | -1 };

export function getNextRotateIndex({ shape, rotate, direction }: Params) {
  const newRotate = typeof direction === "number" ? rotate + direction : rotate + 1;
  return newRotate > 0 && SHAPES[shape][newRotate] ? newRotate : 0;
}
