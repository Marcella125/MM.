import { useGameContext } from "@tetris/context/game";
import { useLevel } from "./use-level";

export function useScore() {
  const {
    state: { cleared },
  } = useGameContext();
  const level = useLevel();

  return cleared * level * 100;
}
