import { useContext } from "react";
import { AppContext } from "./provider";

export function useAppContext() {
  return useContext(AppContext);
}
