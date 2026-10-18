import { useMemo } from "react";

import { useGameContext } from "@tetris/context/game";
import { SPEED_DROPPING_MS, SPEED_INCREASE_MS, SPEED_INITIAL_MS } from "@tetris/shared/constants/score";

import { useLevel } from "./use-level";

export function useSpeed() {
  const {
    state: { dropping },
  } = useGameContext();

  const level = useLevel();

  return useMemo(() => {
    let result = Math.max(80, SPEED_INITIAL_MS - level * SPEED_INCREASE_MS);
    if (dropping && result > SPEED_DROPPING_MS) {
      result = SPEED_DROPPING_MS;
    }
    return result;
  }, [level, dropping]);
}
