"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Pause, Play, Volume2, VolumeX } from "lucide-react";
import type { PointerEvent as ReactPointerEvent } from "react";
import { AppProvider } from "./vendor/src/context/app/provider";
import { useGameCallbacks, useOnPlay } from "./vendor/src/context/game/callbacks";
import { useGameContext } from "./vendor/src/context/game/hooks";
import { GameProvider } from "./vendor/src/context/game/provider";
import { GameStatus } from "./vendor/src/shared/constants/game";
import { BOARD_SIZE, BOARD_WIDTH_WITH_EDGES } from "./vendor/src/shared/constants/board";
import { Shape, SHAPES_SMALL } from "./vendor/src/shared/constants/shape";
import { getBoardCells } from "./vendor/src/shared/utils/get-board-cells";
import { useLevel } from "./vendor/src/shared/hooks/use-level";
import { useScore } from "./vendor/src/shared/hooks/use-score";
import { useTick } from "./vendor/src/modules/game/use-tick";
import styles from "./TetrisGame.module.css";

const shapes = Object.values(Shape);

function readBestScore() {
  try {
    return typeof window === "undefined" ? 0 : Number(window.localStorage.getItem("portfolio-tetris-best")) || 0;
  } catch {
    return 0;
  }
}

export default function TetrisGame() {
  return (
    <AppProvider>
      <GameProvider>
        <GameSurface />
      </GameProvider>
    </AppProvider>
  );
}

function GameSurface() {
  const { state } = useGameContext();
  const actions = useGameCallbacks();
  const play = useOnPlay();
  const score = useScore();
  const level = useLevel();
  const boardCells = useMemo(() => getBoardCells(state), [state]);
  const [best, setBest] = useState(readBestScore);
  const [motivation, setMotivation] = useState<{ id: number; text: string } | null>(null);
  const [moves, setMoves] = useState(0);
  const [victory, setVictory] = useState(false);
  const [boardSize, setBoardSize] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const active = state.status === GameStatus.PLAYING;
  const paused = state.status === GameStatus.PAUSED;
  const finished = state.status === GameStatus.FINISHED;
  const gameRef = useRef<HTMLDivElement>(null);
  const boardColumnRef = useRef<HTMLElement>(null);
  const bestRef = useRef(best);
  const recordMessageShownRef = useRef(false);
  const victoryRef = useRef(false);
  const progressRef = useRef({ lines: 0, level: 1 });
  const messageQueueRef = useRef<string[]>([]);
  const messageTimerRef = useRef<number | null>(null);
  const messageIdRef = useRef(0);
  const gestureRef = useRef<{ pointerId: number; startX: number; startY: number; lastX: number; lastY: number; startedAt: number; moved: boolean } | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const soundStateRef = useRef({ status: state.status, x: state.board?.x, rotate: state.board?.rotate, shape: state.board?.shape, cleared: state.cleared });

  const unlockAudio = useCallback(() => {
    if (typeof window === "undefined") return;
    const AudioContextClass = window.AudioContext;
    if (!AudioContextClass) return;
    const context = audioContextRef.current ?? new AudioContextClass();
    audioContextRef.current = context;
    if (context.state === "suspended") void context.resume().catch(() => {});
  }, []);

  const playSound = useCallback((kind: "move" | "rotate" | "lock" | "line" | "pause" | "start" | "over") => {
    const context = audioContextRef.current;
    if (!soundEnabled || !context || context.state !== "running") return;
    const now = context.currentTime;
    const notes: Record<typeof kind, [number, number, number]> = {
      move: [300, 0.045, 0.025], rotate: [510, 0.075, 0.04], lock: [180, 0.09, 0.05],
      line: [760, 0.2, 0.06], pause: [240, 0.1, 0.045], start: [440, 0.18, 0.05], over: [130, 0.28, 0.055],
    };
    const [frequency, duration, volume] = notes[kind];
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = kind === "line" || kind === "start" ? "square" : "triangle";
    oscillator.frequency.setValueAtTime(frequency, now);
    if (kind === "line" || kind === "start") oscillator.frequency.exponentialRampToValueAtTime(frequency * 1.5, now + duration);
    if (kind === "over") oscillator.frequency.exponentialRampToValueAtTime(70, now + duration);
    gain.gain.setValueAtTime(volume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start(now);
    oscillator.stop(now + duration);
  }, [soundEnabled]);

  useEffect(() => {
    const previous = soundStateRef.current;
    const current = { status: state.status, x: state.board?.x, rotate: state.board?.rotate, shape: state.board?.shape, cleared: state.cleared };
    soundStateRef.current = current;
    if (!soundEnabled || !audioContextRef.current || audioContextRef.current.state !== "running") return;
    if (current.cleared > previous.cleared) playSound("line");
    else if (current.status === GameStatus.PLAYING && previous.status !== GameStatus.PLAYING) playSound("start");
    else if (current.status === GameStatus.PAUSED && previous.status !== GameStatus.PAUSED) playSound("pause");
    else if (current.status === GameStatus.FINISHED && previous.status !== GameStatus.FINISHED) playSound("over");
    else if (current.shape !== previous.shape && previous.shape !== undefined) playSound("lock");
    else if (current.rotate !== previous.rotate && current.shape === previous.shape) playSound("rotate");
    else if (current.x !== previous.x && current.shape === previous.shape) playSound("move");
  }, [playSound, soundEnabled, state.board?.rotate, state.board?.shape, state.board?.x, state.cleared, state.status]);

  useEffect(() => () => { void audioContextRef.current?.close(); }, []);

  useTick();

  const runAction = useCallback((action?: () => void) => {
    if (!active || !action) return;
    action();
    setMoves((current) => current + 1);
  }, [active]);

  useEffect(() => {
    const column = boardColumnRef.current;
    if (!column) return;
    const updateSize = () => {
      if (!window.matchMedia("(max-width: 700px)").matches) {
        setBoardSize(0);
        return;
      }
      const { width, height } = column.getBoundingClientRect();
      const size = Math.floor(Math.max(0, Math.min(width, (height - 18) / 2)));
      setBoardSize((previous) => previous === size ? previous : size);
    };
    const observer = new ResizeObserver(updateSize);
    observer.observe(column);
    window.addEventListener("resize", updateSize);
    window.visualViewport?.addEventListener("resize", updateSize);
    updateSize();
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateSize);
      window.visualViewport?.removeEventListener("resize", updateSize);
    };
  }, []);

  useEffect(() => {
    gameRef.current?.focus();
  }, []);

  const queueMessage = useCallback((text: string) => {
    messageQueueRef.current.push(text);
    if (messageTimerRef.current !== null) return;

    const showNext = () => {
      const next = messageQueueRef.current.shift();
      if (!next) {
        setMotivation(null);
        messageTimerRef.current = null;
        return;
      }
      setMotivation({ id: ++messageIdRef.current, text: next });
      messageTimerRef.current = window.setTimeout(() => {
        setMotivation(null);
        messageTimerRef.current = window.setTimeout(showNext, 220);
      }, 2300);
    };
    showNext();
  }, []);

  const clearMessages = useCallback(() => {
    messageQueueRef.current = [];
    if (messageTimerRef.current !== null) window.clearTimeout(messageTimerRef.current);
    messageTimerRef.current = null;
    setMotivation(null);
  }, []);

  useEffect(() => {
    if (score <= bestRef.current) return;
    bestRef.current = score;
    const timeout = window.setTimeout(() => {
      try {
        window.localStorage.setItem("portfolio-tetris-best", String(score));
      } catch {
        // Keep the current session playable if storage is unavailable.
      }
      setBest(score);
      if (!recordMessageShownRef.current) {
        recordMessageShownRef.current = true;
        queueMessage("YOU'VE OUTDONE YOURSELF.");
      }
    }, 0);
    return () => window.clearTimeout(timeout);
  }, [queueMessage, score]);

  useEffect(() => {
    const previous = progressRef.current;
    const linesCleared = state.cleared - previous.lines;
    const levelUp = level > previous.level;
    progressRef.current = { lines: state.cleared, level };

    const messages: string[] = [];
    if (linesCleared === 1) messages.push("SMALL WINS MATTER.");
    if (linesCleared > 1 && linesCleared < 4) messages.push("LOOK AT YOU GO!");
    if (linesCleared === 4) messages.push("HARD WORK PAYS OFF.");
    if (levelUp) messages.push("KEEP GROWING.");
    if (messages.length) {
      const timeout = window.setTimeout(() => messages.forEach(queueMessage), 0);
      return () => window.clearTimeout(timeout);
    }
  }, [level, queueMessage, state.cleared]);

  useEffect(() => {
    if (victoryRef.current || state.cleared < 20 || state.status !== GameStatus.PLAYING) return;
    const timeout = window.setTimeout(() => {
      victoryRef.current = true;
      setVictory(true);
      actions.onPause?.();
    }, 0);
    return () => window.clearTimeout(timeout);
  }, [actions, state.cleared, state.status]);

  useEffect(() => () => {
    if (messageTimerRef.current !== null) window.clearTimeout(messageTimerRef.current);
  }, []);

  useEffect(() => {
    if (!state.countdown) return;
    const timeout = window.setTimeout(() => actions.onFinishedCountdown?.(), 900);
    return () => window.clearTimeout(timeout);
  }, [actions, state.countdown]);

  useEffect(() => {
    const onVisibilityChange = () => {
      if (document.hidden && state.status === GameStatus.PLAYING) actions.onPause?.();
    };
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => document.removeEventListener("visibilitychange", onVisibilityChange);
  }, [actions, state.status]);

  const restart = useCallback(() => {
    unlockAudio();
    clearMessages();
    setMoves(0);
    setVictory(false);
    victoryRef.current = false;
    recordMessageShownRef.current = false;
    progressRef.current = { lines: 0, level: 1 };
    play();
    queueMessage("EVERY GREAT THING STARTS WITH ONE MOVE.");
    window.setTimeout(() => gameRef.current?.focus(), 0);
  }, [clearMessages, play, queueMessage, unlockAudio]);
  const togglePause = useCallback(() => {
    if (state.status === GameStatus.PLAYING) actions.onPause?.();
    else if (state.status === GameStatus.PAUSED) actions.onUnpause?.();
  }, [actions, state.status]);

  const onBoardPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!active || (event.pointerType !== "touch" && event.pointerType !== "pen") || (event.target as HTMLElement).closest("button")) return;
    unlockAudio();
    event.preventDefault();
    gestureRef.current = { pointerId: event.pointerId, startX: event.clientX, startY: event.clientY, lastX: event.clientX, lastY: event.clientY, startedAt: performance.now(), moved: false };
    try { event.currentTarget.setPointerCapture(event.pointerId); } catch { /* Pointer capture is optional on older browsers. */ }
  };

  const onBoardPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const gesture = gestureRef.current;
    if (!gesture || gesture.pointerId !== event.pointerId) return;
    const dx = event.clientX - gesture.lastX;
    const totalDx = event.clientX - gesture.startX;
    const totalDy = event.clientY - gesture.startY;
    if (Math.abs(totalDx) >= Math.abs(totalDy) && Math.abs(dx) >= 24) {
      const steps = Math.floor(Math.abs(dx) / 24);
      for (let step = 0; step < steps; step += 1) {
        if (dx < 0) runAction(actions.onMoveLeft);
        else runAction(actions.onMoveRight);
      }
      gesture.lastX += Math.sign(dx) * steps * 24;
      gesture.moved = true;
    }
    if (Math.abs(event.clientY - gesture.startY) >= 16) gesture.moved = true;
  };

  const onBoardPointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    const gesture = gestureRef.current;
    if (!gesture || gesture.pointerId !== event.pointerId) return;
    const dx = event.clientX - gesture.startX;
    const dy = event.clientY - gesture.startY;
    if (!gesture.moved) {
      if (Math.abs(dx) < 16 && Math.abs(dy) < 16) runAction(actions.onRotate);
      else if (Math.abs(dx) >= Math.abs(dy)) {
        if (dx < 0) runAction(actions.onMoveLeft);
        else runAction(actions.onMoveRight);
      } else if (dy > 0) runAction(actions.onTick);
    } else if (dy > 16) {
      const duration = performance.now() - gesture.startedAt;
      if (dy >= 85 && duration <= 320) runAction(actions.onHardDrop);
      else {
        const steps = Math.max(1, Math.floor(dy / 28));
        for (let step = 0; step < steps; step += 1) runAction(actions.onTick);
      }
    }
    gestureRef.current = null;
    try { event.currentTarget.releasePointerCapture(event.pointerId); } catch { /* Capture may already have been released. */ }
  };

  const boardStyle = boardSize > 0 ? { width: `${boardSize}px`, height: `${boardSize * 2}px` } : undefined;

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target;
      if (target instanceof HTMLElement && target.closest("button, input, textarea, select, a")) return;
      if (event.key.startsWith("Arrow") || event.key === " " || event.key === "Spacebar" || event.key.toLowerCase() === "p") unlockAudio();

      if (event.key === "Escape") return;
      if (event.key === "p" || event.key === "P") {
        if (state.status === GameStatus.PLAYING || state.status === GameStatus.PAUSED) {
          event.preventDefault();
          togglePause();
        }
        return;
      }
      if (state.status !== GameStatus.PLAYING) return;

      switch (event.key) {
        case "ArrowLeft": runAction(actions.onMoveLeft); event.preventDefault(); break;
        case "ArrowRight": runAction(actions.onMoveRight); event.preventDefault(); break;
        case "ArrowUp": runAction(actions.onRotate); event.preventDefault(); break;
        case "ArrowDown":
          if (!event.repeat) runAction(actions.onDropStart);
          event.preventDefault();
          break;
        case " ":
        case "Spacebar":
          if (!event.repeat) {
            runAction(actions.onHardDrop);
          }
          event.preventDefault();
          break;
      }
    };

    const onKeyUp = (event: KeyboardEvent) => {
      if (event.key === "ArrowDown") actions.onDropStop?.();
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, [actions, runAction, state.status, togglePause, unlockAudio]);

  const nextShape = state.board?.shapeNext;
  const nextRotation = state.board?.rotateNext ?? 0;
  const nextCells = nextShape ? SHAPES_SMALL[nextShape][nextRotation] ?? SHAPES_SMALL[nextShape][0] : [];
  const progress = Math.min(100, (state.cleared / 20) * 100);

  return (
    <div ref={gameRef} className={styles.game} tabIndex={0} aria-label="Tetris game. Use arrow keys to play, space to drop, and P to pause.">
      <div className={styles.mobileHud}>
        <div className={styles.mobileHudTop}>
          <div className={`${styles.mobileHudCard} ${styles.movesCard}`}><span>MOVES</span><strong>{String(moves).padStart(2, "0")}</strong></div>
          <div className={`${styles.mobileHudCard} ${styles.goalCard}`}><span>GOAL</span><strong>Clear <i>20</i> Lines</strong></div>
          <div className={styles.mobileNextCard}>
            <span className={styles.panelLabel}>NEXT</span>
            <div className={styles.preview} aria-label={`Next piece ${nextShape ?? "loading"}`}>
              {Array.from({ length: 16 }, (_, index) => (
                <span key={index} className={`${styles.previewCell} ${nextCells?.includes(index) && nextShape ? styles[`cell${nextShape.toLowerCase()}`] : ""}`} />
              ))}
            </div>
          </div>
        </div>
        <div className={styles.mobileHudDetails}>
          <div><span>SCORE</span><strong>{String(score).padStart(6, "0")}</strong></div>
          <div><span>LINES</span><strong>{String(state.cleared).padStart(2, "0")} / 20</strong></div>
          <div><span>LEVEL</span><strong>{String(level).padStart(2, "0")}</strong></div>
          <div className={styles.progressTrack} role="progressbar" aria-label="Lines cleared toward goal" aria-valuemin={0} aria-valuemax={20} aria-valuenow={Math.min(state.cleared, 20)}><span style={{ width: `${progress}%` }} /></div>
        </div>
      </div>
      <main className={styles.layout}>
        <section className={styles.brandPanel} aria-label="Tetris by Mars">
          <div className={styles.brandSticker}>KEEP BUILDING.<br />KEEP GROWING.</div>
          <h1 className={styles.brandTitle}><span>TETRIS</span><span><i>{"\u00D7"}</i> MARS</span></h1>
          <p className={styles.brandMessage}>EVERY PIECE MATTERS.<br />EVERY MOVE IS PROGRESS.</p>
          <div className={styles.brandNote} aria-hidden="true"><b>GOOD DESIGN</b><b>GOOD CODE</b><b>GOOD IMPACT</b><span>MM / 001</span></div>
        </section>

        <section className={styles.boardColumn} aria-label="Play Tetris" ref={boardColumnRef}>
          <div className={styles.boardWrap} style={boardStyle} onPointerDown={onBoardPointerDown} onPointerMove={onBoardPointerMove} onPointerUp={onBoardPointerUp} onPointerCancel={() => { gestureRef.current = null; }}>
            <div className={styles.board} role="grid" aria-label="Tetris playing field, 10 columns by 20 rows">
              {Array.from({ length: BOARD_SIZE.height }, (_, row) =>
                Array.from({ length: BOARD_SIZE.width }, (_, column) => {
                  const cell = boardCells[row * BOARD_WIDTH_WITH_EDGES + column + 1];
                  const shapeClass = cell ? styles[`cell${String(cell).toLowerCase()}`] : "";
                  return <div key={`${row}-${column}`} role="gridcell" className={`${styles.cell} ${shapeClass}`} />;
                })
              )}
            </div>
            {(paused || finished || victory || state.countdown || state.status === GameStatus.IDLE) && (
              <div className={`${styles.overlay} ${finished ? styles.finishOverlay : ""} ${state.status === GameStatus.IDLE ? styles.welcomeOverlay : ""}`}>
                {state.countdown ? <strong>GET READY</strong> : state.status === GameStatus.IDLE ? (
                  <button className={styles.overlayButton} type="button" onClick={restart}>START BUILDING <span aria-hidden="true">&rarr;</span></button>
                ) : victory ? (
                  <>
                    <strong>YOU BUILT IT.</strong>
                    <span>20 lines cleared. Keep growing.</span>
                    <button className={styles.overlayButton} type="button" onClick={restart}>PLAY AGAIN <span aria-hidden="true">&rarr;</span></button>
                  </>
                ) : finished ? (
                  <>
                    <strong>PROGRESS NEVER STOPS.</strong>
                    <span>Not every piece falls into place. Keep going.</span>
                    <button className={styles.overlayButton} type="button" onClick={restart}>TRY AGAIN <span aria-hidden="true">&rarr;</span></button>
                  </>
                ) : paused ? (
                  <>
                    <strong>PAUSED</strong>
                    <span>Take a breath. You can pick it up again.</span>
                    <div className={styles.overlayActions}>
                      <button className={styles.overlayButton} type="button" onClick={() => { togglePause(); gameRef.current?.focus(); }}>RESUME</button>
                      <button className={styles.overlayButton} type="button" onClick={restart}>RESTART</button>
                    </div>
                  </>
                ) : null}
              </div>
            )}
          </div>
          <div className={styles.messageRail} aria-live="polite" aria-atomic="true">
            {motivation && <p key={motivation.id} className={styles.motivation}>{motivation.text}</p>}
          </div>
        </section>

        <aside className={styles.sidebar} aria-label="Game information and controls">
          <div className={styles.scorePanel}><span>SCORE</span><strong>{String(score).padStart(6, "0")}</strong></div>
          <div className={styles.statsGrid}>
            <div className={styles.stat}><span>LEVEL</span><strong>{String(level).padStart(2, "0")}</strong></div>
            <div className={styles.stat}><span>LINES</span><strong>{String(state.cleared).padStart(3, "0")}</strong></div>
            <div className={styles.stat}><span>BEST</span><strong>{String(best).padStart(6, "0")}</strong></div>
          </div>
          <div className={styles.nextCard}>
            <span className={styles.panelLabel}>NEXT PIECE</span>
            <div className={styles.preview} aria-label={`Next piece ${nextShape ?? "loading"}`}>
              {Array.from({ length: 16 }, (_, index) => (
                <span key={index} className={`${styles.previewCell} ${nextCells?.includes(index) && nextShape ? styles[`cell${nextShape.toLowerCase()}`] : ""}`} />
              ))}
            </div>
          </div>
          <div className={styles.keyGuide} aria-label="Keyboard controls">
            <span>CONTROLS</span>
            <p><kbd>&larr;</kbd><kbd>&rarr;</kbd> MOVE</p>
            <p><kbd>&uarr;</kbd> ROTATE</p>
            <p><kbd>&darr;</kbd> SOFT DROP</p>
            <p><kbd>SPACE</kbd> HARD DROP</p>
            <p><kbd>P</kbd> PAUSE</p>
          </div>
          <div className={styles.buttonRow}>
            <button type="button" className={styles.gameButton} onClick={restart} aria-label="Restart game">RESTART</button>
            <button type="button" className={styles.gameButton} onClick={() => { togglePause(); gameRef.current?.focus(); }} disabled={!active && !paused} aria-label={paused ? "Resume game" : "Pause game"}>{paused ? "RESUME" : "PAUSE"}</button>
            <button type="button" className={styles.gameButton} onClick={() => { setSoundEnabled((enabled) => !enabled); if (!soundEnabled) unlockAudio(); }} aria-label={soundEnabled ? "Turn sound off" : "Turn sound on"}>{soundEnabled ? "SOUND ON" : "SOUND OFF"}</button>
          </div>
        </aside>
      </main>

      <div className={styles.mobileFooter}>
        <button type="button" className={styles.soundButton} onClick={() => { setSoundEnabled((enabled) => !enabled); if (!soundEnabled) unlockAudio(); }} aria-label={soundEnabled ? "Turn sound off" : "Turn sound on"} aria-pressed={soundEnabled}>{soundEnabled ? <Volume2 aria-hidden="true" /> : <VolumeX aria-hidden="true" />}<span>{soundEnabled ? "SOUND" : "MUTED"}</span></button>
        <button type="button" className={styles.pauseButton} onClick={() => { unlockAudio(); togglePause(); }} disabled={!active && (!paused || victory)} aria-label={victory ? "Game complete" : paused ? "Resume game" : "Pause game"}>
          {paused ? <Play aria-hidden="true" /> : <Pause aria-hidden="true" />}
        </button>
      </div>
      <span className={styles.srOnly}>{shapes.join(", ")} pieces</span>
    </div>
  );
}
