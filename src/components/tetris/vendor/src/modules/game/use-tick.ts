import { useEffect, useRef } from "react";

import { useGameCallbacks, useGameContext } from "@tetris/context/game";
import { GameStatus } from "@tetris/shared/constants/game";
import { useSpeed } from "@tetris/shared/hooks/use-speed";

export function useTick() {
  const {
    state: { status },
  } = useGameContext();
  const { onTick } = useGameCallbacks();

  const speedMs = useSpeed();

  const interval = useRef<NodeJS.Timeout | undefined>(undefined);
  const isPlaying = status === GameStatus.PLAYING;
  useEffect(() => {
    if (interval.current) {
      clearInterval(interval.current);
    }

    if (isPlaying && onTick) {
      interval.current = setInterval(onTick, speedMs);
    }

    return () => {
      clearInterval(interval.current);
    };
  }, [onTick, speedMs, isPlaying]);
}
