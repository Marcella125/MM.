export const BOARD_SIZE = {
  width: 10,
  height: 20,
};

export const BOARD_SIZE_SMALL = {
  width: 4,
  height: 2,
};

export const BOARD_WIDTH_WITH_EDGES = BOARD_SIZE.width + 2;

export const BOARD_AREA = BOARD_SIZE.width * BOARD_SIZE.height;

export const BOARD_AREA_WITH_EDGES = BOARD_WIDTH_WITH_EDGES * BOARD_SIZE.height;

export const BOARD_AREA_SMALL = BOARD_SIZE_SMALL.width * BOARD_SIZE_SMALL.height;

export const MAX_X = Math.ceil(BOARD_SIZE.width / 2);
