import React, { PropsWithChildren } from "react";

import { DEFAULT_INITIAL_LEVEL, DEFAULT_INITIAL_ROWS } from "@tetris/shared/constants/game";
import { AppContextValue, AppDispatch } from "./types";

const initialState: AppContextValue = {
  initialLevel: DEFAULT_INITIAL_LEVEL,
  initialRows: DEFAULT_INITIAL_ROWS,
};

export const AppContext = React.createContext<{ state: AppContextValue; dispatch: AppDispatch }>({
  state: initialState,
  dispatch: null,
});

export function AppProvider(props: PropsWithChildren) {
  return <AppContext.Provider value={{ state: initialState, dispatch: null }}>{props.children}</AppContext.Provider>;
}
