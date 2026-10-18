import { useContext } from "react";

import { GameContext } from "./provider";

export function useGameContext() {
  const appContext = useContext(GameContext);
  if (!appContext) throw new Error("Missing GameProvider");
  return appContext;
}
