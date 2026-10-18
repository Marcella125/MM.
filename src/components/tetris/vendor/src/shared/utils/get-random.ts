import { BOARD_SIZE } from "@tetris/shared/constants/board";
import { INITIAL_ROW_MAX_VALUES, INITIAL_ROW_MIN_VALUES } from "@tetris/shared/constants/initial";
import { Shape, ShapeOther, SHAPES_SMALL } from "@tetris/shared/constants/shape";

function getShuffledArray<T>(array: T[]): T[] {
  const result = [...array];

  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
}

function getRandomNumberInRange(min = 0, max = 10) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomValue<T>(array: T[]) {
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
}

export function getRandomShape() {
  return getRandomValue(Object.values(Shape));
}

export function getRandomRotate(shape: Shape) {
  const shapeConfig = SHAPES_SMALL[shape];
  const validRotates = shapeConfig
    .map((value, index) => (value ? index : null))
    .filter((index) => typeof index === "number");
  return getRandomValue(validRotates);
}

export function getRandomInitialRow() {
  const occupiedNumber = getRandomNumberInRange(INITIAL_ROW_MIN_VALUES, INITIAL_ROW_MAX_VALUES);
  const freeNumber = BOARD_SIZE.width - occupiedNumber;
  return [
    ShapeOther.EDGE,
    ...getShuffledArray([...Array(occupiedNumber).fill(ShapeOther.INITIAL), ...Array(freeNumber).fill(null)]),
    ShapeOther.EDGE,
  ];
}
