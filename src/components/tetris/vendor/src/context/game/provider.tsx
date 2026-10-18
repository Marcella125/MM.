import React, { PropsWithChildren, useEffect, useReducer } from "react";

import { GameStatus } from "@tetris/shared/constants/game";

import { GameActionType } from "./action-types";
import { gameReducer } from "./reducer";
import { GameContextValue, GameDispatch } from "./types";

const initialState: GameContextValue = {
  board: null,
  cleared: 0,
  countdown: false,
  dropping: false,
  fullRowIndexes: null,
  status: GameStatus.IDLE,
};

export const GameContext = React.createContext<{
  state: GameContextValue;
  dispatch: GameDispatch | null;
}>({ state: initialState, dispatch: null });

export function GameProvider(props: PropsWithChildren) {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  useEffect(() => {
    dispatch({ type: GameActionType.HYDRATE });
  }, [dispatch]);

  return <GameContext.Provider value={{ state, dispatch }}>{props.children}</GameContext.Provider>;
}
