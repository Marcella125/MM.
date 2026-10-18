import { DEFAULT_INITIAL_ROWS } from "@tetris/shared/constants/game";
import { getInitialGame } from "@tetris/shared/utils/get-initial";
import { getRandomRotate, getRandomShape } from "@tetris/shared/utils/get-random";

export function hydrate() {
  const shape = getRandomShape();
  const shapeNext = getRandomShape();
  return getInitialGame({
    countdown: false,
    initialRows: DEFAULT_INITIAL_ROWS,
    shape,
    shapeNext,
    rotate: getRandomRotate(shape),
    rotateNext: getRandomRotate(shapeNext),
  });
}
