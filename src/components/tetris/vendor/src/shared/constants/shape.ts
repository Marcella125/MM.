export enum Shape {
  I = "I",
  J = "J",
  L = "L",
  O = "O",
  S = "S",
  T = "T",
  Z = "Z",
}

export enum ShapeOther {
  EDGE = "EDGE",
  HINT = "HINT",
  INITIAL = "INITIAL",
  FULL = "FULL",
}

export const SHAPES = {
  [Shape.I]: [
    [4, 5, 6, 7],
    [5, 17, 29, 41],
  ],
  [Shape.J]: [
    [4, 16, 17, 18],
    [5, 6, 17, 29],
    [4, 5, 6, 18],
    [5, 17, 28, 29],
  ],
  [Shape.L]: [
    [6, 16, 17, 18],
    [5, 17, 29, 30],
    [5, 6, 7, 17],
    [5, 6, 18, 30],
  ],
  [Shape.O]: [[5, 6, 17, 18]],
  [Shape.S]: [
    [6, 7, 17, 18],
    [5, 17, 18, 30],
  ],
  [Shape.T]: [
    [5, 16, 17, 18],
    [5, 17, 18, 29],
    [4, 5, 6, 17],
    [5, 16, 17, 29],
  ],
  [Shape.Z]: [
    [5, 6, 18, 19],
    [6, 17, 18, 29],
  ],
};

export const SHAPES_SMALL = {
  [Shape.I]: [[4, 5, 6, 7]],
  [Shape.J]: [[1, 5, 6, 7], null, [1, 2, 3, 7], null],
  [Shape.L]: [[3, 5, 6, 7], null, [1, 2, 3, 5], null],
  [Shape.O]: [[1, 2, 5, 6]],
  [Shape.S]: [[2, 3, 5, 6], null],
  [Shape.T]: [[1, 2, 3, 6], null, [2, 5, 6, 7], null],
  [Shape.Z]: [[1, 2, 6, 7], null],
};

export const SHAPES_CLASSNAMES = {
  [Shape.I]: "bg-shape_i",
  [Shape.J]: "bg-shape_j",
  [Shape.L]: "bg-shape_l",
  [Shape.O]: "bg-shape_o",
  [Shape.S]: "bg-shape_s",
  [Shape.T]: "bg-shape_t",
  [Shape.Z]: "bg-shape_z",
  [ShapeOther.INITIAL]: "",
  [ShapeOther.FULL]: "bg-shape_full opacity-50",
  [ShapeOther.EDGE]: "bg-shape_edge",
  [ShapeOther.HINT]: "touch:bg-shape_full opacity-50",
} as const;
