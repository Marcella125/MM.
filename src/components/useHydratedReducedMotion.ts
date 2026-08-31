"use client";

import { useReducedMotion } from "framer-motion";
import { useSyncExternalStore } from "react";

function subscribeToHydration(onStoreChange: () => void) {
  const timeoutId = window.setTimeout(onStoreChange, 0);

  return () => {
    window.clearTimeout(timeoutId);
  };
}

function getHydratedSnapshot() {
  return true;
}

function getServerSnapshot() {
  return false;
}

export function useHydratedReducedMotion() {
  const prefersReducedMotion = useReducedMotion();
  const isHydrated = useSyncExternalStore(
    subscribeToHydration,
    getHydratedSnapshot,
    getServerSnapshot,
  );

  return isHydrated ? prefersReducedMotion : false;
}
