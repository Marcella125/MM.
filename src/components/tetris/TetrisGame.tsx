"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowDownToLine, ArrowLeft, ArrowRight, Pause, Play, RotateCw, Share2 } from "lucide-react";
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
type GameMode = "classic" | "challenge";
type LocalScore = { id: string; name: string; score: number; mode: GameMode; createdAt: number };
const LEADERBOARD_KEY = "portfolio-tetris-local-leaderboard-v1";
const CHALLENGE_SECONDS = 60;

function readBestScore(mode: GameMode = "classic") {
  try {
    if (typeof window === "undefined") return 0;
    const score = window.localStorage.getItem(`portfolio-tetris-best-${mode}`) ?? (mode === "classic" ? window.localStorage.getItem("portfolio-tetris-best") : null);
    return Number(score) || 0;
  } catch {
    return 0;
  }
}

function readLeaderboard(): LocalScore[] {
  try {
    const parsed: unknown = JSON.parse(window.localStorage.getItem(LEADERBOARD_KEY) ?? "[]");
    return Array.isArray(parsed) ? parsed.filter((entry): entry is LocalScore => Boolean(entry && typeof entry === "object" && typeof entry.name === "string" && typeof entry.score === "number" && (entry.mode === "classic" || entry.mode === "challenge"))) : [];
  } catch {
    return [];
  }
}

function cleanNickname(value: string) {
  return value.replace(/[^\p{L}\p{N}_ -]/gu, "").trim().slice(0, 16) || "PLAYER";
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
  const [best, setBest] = useState(() => readBestScore());
  const [motivation, setMotivation] = useState<{ id: number; text: string } | null>(null);
  const [boardSize, setBoardSize] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [mode, setMode] = useState<GameMode>("classic");
  const [nickname, setNickname] = useState("");
  const [hasStarted, setHasStarted] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [leaderboard, setLeaderboard] = useState<LocalScore[]>(() => typeof window === "undefined" ? [] : readLeaderboard());
  const [challengeRemaining, setChallengeRemaining] = useState(CHALLENGE_SECONDS);
  const [challengeCountdown, setChallengeCountdown] = useState("");
  const [challengeComplete, setChallengeComplete] = useState(false);
  const [confirmRestart, setConfirmRestart] = useState(false);
  const [shareNotice, setShareNotice] = useState("");
  const active = state.status === GameStatus.PLAYING;
  const paused = state.status === GameStatus.PAUSED;
  const finished = state.status === GameStatus.FINISHED;
  const gameRef = useRef<HTMLDivElement>(null);
  const boardColumnRef = useRef<HTMLElement>(null);
  const bestRef = useRef(best);
  const recordMessageShownRef = useRef(false);
  const challengeFinishedRef = useRef(false);
  const challengeIntroPendingRef = useRef(false);
  const resultSavedRef = useRef(false);
  const resumeAfterConfirmRef = useRef(false);
  const progressRef = useRef({ lines: 0, level: 1 });
  const messageQueueRef = useRef<string[]>([]);
  const messageTimerRef = useRef<number | null>(null);
  const messageIdRef = useRef(0);
  const gestureRef = useRef<{ pointerId: number; startX: number; startY: number; lastX: number; lastY: number; startedAt: number; moved: boolean } | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const soundEnabledRef = useRef(soundEnabled);
  const soundStateRef = useRef({ status: state.status, x: state.board?.x, rotate: state.board?.rotate, shape: state.board?.shape, cleared: state.cleared });

  useEffect(() => { soundEnabledRef.current = soundEnabled; }, [soundEnabled]);

  const unlockAudio = useCallback(() => {
    if (typeof window === "undefined") return;
    const AudioContextClass = window.AudioContext ?? (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const context = audioContextRef.current ?? new AudioContextClass();
    audioContextRef.current = context;
    if (context.state === "suspended") void context.resume().catch(() => {});
  }, []);

  const playSound = useCallback((kind: "move" | "rotate" | "lock" | "line" | "pause" | "start" | "over") => {
    const context = audioContextRef.current;
    if (!soundEnabledRef.current || !context || context.state === "closed") return;
    const notes: Record<typeof kind, [number, number, number]> = {
      move: [300, 0.055, 0.09], rotate: [510, 0.09, 0.11], lock: [180, 0.11, 0.12],
      line: [760, 0.22, 0.15], pause: [240, 0.12, 0.11], start: [440, 0.2, 0.12], over: [130, 0.3, 0.13],
    };
    const [frequency, duration, volume] = notes[kind];
    const playTone = () => {
      if (!soundEnabledRef.current || context.state !== "running") return;
      const now = context.currentTime;
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
    };
    if (context.state === "suspended") void context.resume().then(playTone).catch(() => {});
    else playTone();
  }, []);

  useEffect(() => {
    const previous = soundStateRef.current;
    const current = { status: state.status, x: state.board?.x, rotate: state.board?.rotate, shape: state.board?.shape, cleared: state.cleared };
    soundStateRef.current = current;
    if (!soundEnabled || !audioContextRef.current) return;
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
    if (navigator.vibrate && window.matchMedia("(max-width: 700px)").matches) navigator.vibrate(8);
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

  const saveResult = useCallback((finalScore: number) => {
    if (resultSavedRef.current || finalScore <= 0) return;
    resultSavedRef.current = true;
    const entry: LocalScore = { id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, name: cleanNickname(nickname), score: finalScore, mode, createdAt: Date.now() };
    const nextScores = [...readLeaderboard(), entry].sort((a, b) => b.score - a.score || a.createdAt - b.createdAt).slice(0, 10);
    try { window.localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(nextScores)); } catch { /* Keep the run playable if storage is unavailable. */ }
    setLeaderboard(nextScores);
  }, [mode, nickname]);

  useEffect(() => {
    if (!hasStarted) return;
    if (score <= bestRef.current) return;
    bestRef.current = score;
    const timeout = window.setTimeout(() => {
      try {
        window.localStorage.setItem(`portfolio-tetris-best-${mode}`, String(score));
      } catch {
        // Keep the current session playable if storage is unavailable.
      }
      setBest(score);
      if (!recordMessageShownRef.current) {
        recordMessageShownRef.current = true;
        queueMessage("YOU DID IT!");
      }
    }, 0);
    return () => window.clearTimeout(timeout);
  }, [hasStarted, mode, queueMessage, score]);

  useEffect(() => {
    const previous = progressRef.current;
    const linesCleared = state.cleared - previous.lines;
    const levelUp = level > previous.level;
    progressRef.current = { lines: state.cleared, level };

    const messages: string[] = [];
    if (hasStarted && linesCleared === 1) messages.push("NICE START!");
    if (hasStarted && linesCleared > 1 && linesCleared < 4) messages.push("KEEP BUILDING!");
    if (hasStarted && linesCleared >= 4) messages.push("UNSTOPPABLE!");
    if (hasStarted && levelUp) messages.push("KEEP GROWING.");
    if (messages.length) {
      const timeout = window.setTimeout(() => messages.forEach(queueMessage), 0);
      return () => window.clearTimeout(timeout);
    }
  }, [hasStarted, level, queueMessage, state.cleared]);

  useEffect(() => {
    if (hasStarted && state.status === GameStatus.FINISHED) saveResult(score);
  }, [hasStarted, saveResult, score, state.status]);

  const finishChallenge = useCallback(() => {
    if (challengeFinishedRef.current) return;
    challengeFinishedRef.current = true;
    setChallengeComplete(true);
    actions.onPause?.();
    queueMessage("LEGENDARY MOVE!");
    saveResult(score);
  }, [actions, queueMessage, saveResult, score]);

  useEffect(() => {
    if (mode !== "challenge" || !hasStarted || !active || state.countdown || challengeFinishedRef.current) return;
    const timer = window.setInterval(() => {
      setChallengeRemaining((remaining) => {
        if (remaining <= 1) {
          window.clearInterval(timer);
          window.setTimeout(finishChallenge, 0);
          return 0;
        }
        return remaining - 1;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [active, finishChallenge, hasStarted, mode, state.countdown]);

  useEffect(() => () => {
    if (messageTimerRef.current !== null) window.clearTimeout(messageTimerRef.current);
  }, []);

  useEffect(() => {
    if (!state.countdown || !hasStarted) return;
    if (mode !== "challenge" || !challengeIntroPendingRef.current) {
      setChallengeCountdown("");
      const timeout = window.setTimeout(() => actions.onFinishedCountdown?.(), 650);
      return () => window.clearTimeout(timeout);
    }
    const labels = ["3", "2", "1", "GO!"];
    let index = 0;
    let timeout: number;
    const advance = () => {
      setChallengeCountdown(labels[index]);
      if (index === labels.length - 1) {
        timeout = window.setTimeout(() => {
          challengeIntroPendingRef.current = false;
          setChallengeCountdown("");
          actions.onFinishedCountdown?.();
        }, 500);
        return;
      }
      index += 1;
      timeout = window.setTimeout(advance, 750);
    };
    timeout = window.setTimeout(advance, 0);
    return () => window.clearTimeout(timeout);
  }, [actions, hasStarted, mode, state.countdown]);

  useEffect(() => {
    const onVisibilityChange = () => {
      if (document.hidden && state.status === GameStatus.PLAYING) actions.onPause?.();
    };
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => document.removeEventListener("visibilitychange", onVisibilityChange);
  }, [actions, state.status]);

  const startGame = useCallback((selectedMode: GameMode = mode) => {
    unlockAudio();
    clearMessages();
    setMode(selectedMode);
    setNickname(cleanNickname(nickname));
    setHasStarted(true);
    setShowLeaderboard(false);
    challengeFinishedRef.current = false;
    challengeIntroPendingRef.current = selectedMode === "challenge";
    resultSavedRef.current = false;
    setChallengeComplete(false);
    setChallengeRemaining(CHALLENGE_SECONDS);
    setChallengeCountdown("");
    setConfirmRestart(false);
    recordMessageShownRef.current = false;
    progressRef.current = { lines: 0, level: 1 };
    const initialBest = readBestScore(selectedMode);
    bestRef.current = initialBest;
    setBest(initialBest);
    play();
    window.setTimeout(() => gameRef.current?.focus(), 0);
  }, [clearMessages, mode, nickname, play, unlockAudio]);

  const requestRestart = useCallback(() => {
    resumeAfterConfirmRef.current = active || paused;
    if (active) actions.onPause?.();
    setConfirmRestart(true);
  }, [actions, active, paused]);

  const cancelRestart = useCallback(() => {
    setConfirmRestart(false);
    if (resumeAfterConfirmRef.current) actions.onUnpause?.();
  }, [actions]);

  const shareScore = useCallback(async () => {
    const text = `${cleanNickname(nickname)} scored ${score.toLocaleString()} in ${mode === "challenge" ? "MARS CHALLENGE" : "CLASSIC MODE"} on TETRIS × MARS!`;
    try {
      if (navigator.share) await navigator.share({ title: "TETRIS × MARS", text });
      else { await navigator.clipboard.writeText(text); setShareNotice("SCORE COPIED!"); }
    } catch {
      setShareNotice("SCORE READY TO SHARE");
    }
    window.setTimeout(() => setShareNotice(""), 2200);
  }, [mode, nickname, score]);
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
    } else if (dy < -22) {
      runAction(actions.onRotate);
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
  const progress = mode === "challenge" ? ((CHALLENGE_SECONDS - challengeRemaining) / CHALLENGE_SECONDS) * 100 : ((state.cleared % 10) / 10) * 100;

  return (
    <div ref={gameRef} className={styles.game} tabIndex={0} aria-label="Tetris game. Use arrow keys to play, space to drop, and P to pause.">
      <div className={styles.mobileHud}>
        <div className={styles.mobileHudTop}>
          <div className={`${styles.mobileHudCard} ${styles.mobileScoreCard}`}><span>SCORE</span><strong>{String(score).padStart(6, "0")}</strong></div>
          <div className={`${styles.mobileHudCard} ${styles.levelCard}`}><span>LEVEL</span><strong>{String(level).padStart(2, "0")}</strong></div>
          <div className={`${styles.mobileHudCard} ${mode === "challenge" ? styles.timerCard : styles.bestCard}`}><span>{mode === "challenge" ? "TIME" : "BEST"}</span><strong>{mode === "challenge" ? `0:${String(challengeRemaining).padStart(2, "0")}` : String(best).padStart(6, "0")}</strong></div>
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
          <div><span>MODE</span><strong>{mode === "challenge" ? "MARS CHALLENGE" : "CLASSIC"}</strong></div>
          <div><span>LINES</span><strong>{String(state.cleared).padStart(2, "0")}</strong></div>
          <div className={styles.progressTrack} role="progressbar" aria-label={mode === "challenge" ? "Challenge time elapsed" : "Progress toward next level"} aria-valuemin={0} aria-valuemax={mode === "challenge" ? CHALLENGE_SECONDS : 10} aria-valuenow={mode === "challenge" ? CHALLENGE_SECONDS - challengeRemaining : state.cleared % 10}><span style={{ width: `${progress}%` }} /></div>
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
            {(paused || finished || state.countdown || state.status === GameStatus.IDLE) && (
              <div className={`${styles.overlay} ${finished ? styles.finishOverlay : ""} ${state.status === GameStatus.IDLE ? styles.welcomeOverlay : ""}`}>
                {state.countdown ? <strong className={challengeCountdown ? styles.countdownNumber : ""}>{challengeCountdown || "GET READY"}</strong> : challengeComplete ? (
                  <>
                    <strong>LEGENDARY MOVE!</strong>
                    <span>60 seconds. One seriously good run.</span>
                    <div className={styles.resultScore}><small>{cleanNickname(nickname)} - MARS CHALLENGE</small><b>{score.toLocaleString()}</b><small>FINAL SCORE</small></div>
                    {shareNotice && <span className={styles.shareNotice}>{shareNotice}</span>}
                    <div className={styles.overlayActions}><button className={styles.overlayButton} type="button" onClick={() => startGame("challenge")}>RETRY</button><button className={styles.overlayButton} type="button" onClick={shareScore}><Share2 aria-hidden="true" /> SHARE SCORE</button></div>
                    <button className={styles.textButton} type="button" onClick={() => { setHasStarted(false); setLeaderboard(readLeaderboard()); setShowLeaderboard(true); }}>LOCAL TOP 10</button>
                  </>
                ) : state.status === GameStatus.IDLE ? (
                  <button className={styles.overlayButton} type="button" onClick={() => startGame("classic")}>START BUILDING <span aria-hidden="true">→</span></button>
                ) : finished ? (
                  <>
                    <strong>{mode === "challenge" ? "LEGENDARY MOVE!" : "PROGRESS NEVER STOPS."}</strong>
                    <span>{mode === "challenge" ? "Your Mars Challenge run is complete." : "Not every piece falls into place. Keep going."}</span>
                    <div className={styles.resultScore}><small>{cleanNickname(nickname)} - {mode === "challenge" ? "MARS CHALLENGE" : "CLASSIC"}</small><b>{score.toLocaleString()}</b><small>FINAL SCORE</small></div>
                    {shareNotice && <span className={styles.shareNotice}>{shareNotice}</span>}
                    <div className={styles.overlayActions}><button className={styles.overlayButton} type="button" onClick={() => startGame(mode)}>TRY AGAIN</button><button className={styles.overlayButton} type="button" onClick={shareScore}><Share2 aria-hidden="true" /> SHARE SCORE</button></div>
                  </>
                ) : paused ? (
                  <>
                    <strong>PAUSED</strong>
                    <span>Take a breath. You can pick it up again.</span>
                    <div className={styles.overlayActions}>
                      <button className={styles.overlayButton} type="button" onClick={() => { togglePause(); gameRef.current?.focus(); }}>RESUME</button>
                      <button className={styles.overlayButton} type="button" onClick={requestRestart}>RESTART</button>
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
          <div className={styles.modeLabel}>{mode === "challenge" ? "MARS CHALLENGE" : "CLASSIC MODE"} · {cleanNickname(nickname)}</div>
          <div className={styles.scorePanel}><span>SCORE</span><strong>{String(score).padStart(6, "0")}</strong></div>
          {mode === "challenge" && <div className={styles.challengeClock}><span>TIME LEFT</span><strong>00:{String(challengeRemaining).padStart(2, "0")}</strong></div>}
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
            <button type="button" className={styles.gameButton} onClick={requestRestart} aria-label="Restart game">RESTART</button>
            <button type="button" className={styles.gameButton} onClick={() => { togglePause(); gameRef.current?.focus(); }} disabled={!active && !paused} aria-label={paused ? "Resume game" : "Pause game"}>{paused ? "RESUME" : "PAUSE"}</button>
            <button type="button" className={styles.gameButton} onClick={() => { setSoundEnabled((enabled) => !enabled); if (!soundEnabled) { unlockAudio(); window.setTimeout(() => playSound("start"), 80); } }} aria-label={soundEnabled ? "Turn sound off" : "Turn sound on"}>{soundEnabled ? "SOUND ON" : "SOUND OFF"}</button>
          </div>
          <button type="button" className={styles.gameButton} onClick={() => { if (active) actions.onPause?.(); setLeaderboard(readLeaderboard()); setHasStarted(false); setShowLeaderboard(true); }}>LOCAL TOP 10</button>
        </aside>
      </main>

      <nav className={styles.mobileControls} aria-label="Touch game controls">
        <button type="button" onClick={() => { unlockAudio(); runAction(actions.onMoveLeft); }} disabled={!active} aria-label="Move piece left"><ArrowLeft aria-hidden="true" /><span>LEFT</span></button>
        <button type="button" onClick={() => { unlockAudio(); runAction(actions.onRotate); }} disabled={!active} aria-label="Rotate piece"><RotateCw aria-hidden="true" /><span>ROTATE</span></button>
        <button type="button" onClick={() => { unlockAudio(); runAction(actions.onMoveRight); }} disabled={!active} aria-label="Move piece right"><ArrowRight aria-hidden="true" /><span>RIGHT</span></button>
        <button type="button" onClick={() => { unlockAudio(); runAction(actions.onHardDrop); }} disabled={!active} aria-label="Hard drop piece"><ArrowDownToLine aria-hidden="true" /><span>DROP</span></button>
      </nav>

      <div className={styles.mobileFooter}>
        <button type="button" className={styles.pauseButton} onClick={() => { unlockAudio(); togglePause(); }} disabled={!active && !paused} aria-label={paused ? "Resume game" : "Pause game"}>
          {paused ? <Play aria-hidden="true" /> : <Pause aria-hidden="true" />}
        </button>
      </div>
      {confirmRestart && (
        <div className={styles.confirmBackdrop} role="presentation">
          <section className={styles.confirmDialog} role="dialog" aria-modal="true" aria-labelledby="restart-confirm-title" aria-describedby="restart-confirm-description">
            <p className={styles.eyebrow}>NEW RUN</p>
            <h2 id="restart-confirm-title">RESTART THIS GAME?</h2>
            <p id="restart-confirm-description">Your current run will end. Your saved best score stays safe.</p>
            <div className={styles.overlayActions}><button type="button" className={styles.overlayButton} onClick={() => startGame(mode)}>RESTART</button><button type="button" className={styles.secondaryButton} onClick={cancelRestart}>KEEP PLAYING</button></div>
          </section>
        </div>
      )}
      <span className={styles.srOnly}>{shapes.join(", ")} pieces</span>
    </div>
  );
}
