import { useAppContext } from "@tetris/context/app";
import { useGameContext } from "@tetris/context/game";
import { CLEARED_FOR_LEVEL } from "@tetris/shared/constants/score";

export function useLevel() {
  const {
    state: { cleared },
  } = useGameContext();
  const {
    state: { initialLevel },
  } = useAppContext();

  return Math.floor(cleared / CLEARED_FOR_LEVEL) + initialLevel;
}
