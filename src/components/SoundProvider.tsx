"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { assetPath } from "@/src/lib/paths";

const backgroundAudioSrc = assetPath(
  "/audio/ALLDAY%20PROJECT%20%E2%80%93%20FAMOUS%20_%20Instrumental.mp3",
);
const targetVolume = 0.2;
const fadeDuration = 450;

type SoundContextValue = {
  isSoundOn: boolean;
  toggleSound: () => void;
};

const SoundContext = createContext<SoundContextValue | null>(null);

export function useSound() {
  const context = useContext(SoundContext);
  if (!context) throw new Error("useSound must be used within SoundProvider");
  return context;
}

export default function SoundProvider({ children }: { children: ReactNode }) {
  const [isSoundOn, setIsSoundOn] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeFrameRef = useRef<number | null>(null);

  const cancelFade = useCallback(() => {
    if (fadeFrameRef.current !== null) {
      window.cancelAnimationFrame(fadeFrameRef.current);
      fadeFrameRef.current = null;
    }
  }, []);

  const fadeVolume = useCallback((audio: HTMLAudioElement, toVolume: number, onComplete?: () => void) => {
    const fromVolume = audio.volume;
    const startTime = performance.now();
    cancelFade();

    function tick(now: number) {
      const progress = Math.min(Math.max((now - startTime) / fadeDuration, 0), 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      audio.volume = Math.min(Math.max(fromVolume + (toVolume - fromVolume) * easedProgress, 0), 1);

      if (progress < 1) {
        fadeFrameRef.current = window.requestAnimationFrame(tick);
      } else {
        fadeFrameRef.current = null;
        onComplete?.();
      }
    }

    fadeFrameRef.current = window.requestAnimationFrame(tick);
  }, [cancelFade]);

  const getAudio = useCallback(() => {
    if (audioRef.current) return audioRef.current;
    const audio = new Audio(backgroundAudioSrc);
    audio.loop = true;
    audio.preload = "auto";
    audio.volume = 0;
    audioRef.current = audio;
    return audio;
  }, []);

  const toggleSound = useCallback(async () => {
    const audio = getAudio();

    if (isSoundOn) {
      setIsSoundOn(false);
      fadeVolume(audio, 0, () => audio.pause());
      return;
    }

    cancelFade();
    if (!audio.paused) {
      setIsSoundOn(true);
      fadeVolume(audio, targetVolume);
      return;
    }

    audio.volume = 0;
    try {
      await audio.play();
      setIsSoundOn(true);
      fadeVolume(audio, targetVolume);
    } catch {
      setIsSoundOn(false);
    }
  }, [cancelFade, fadeVolume, getAudio, isSoundOn]);

  useEffect(() => () => {
    cancelFade();
    audioRef.current?.pause();
  }, [cancelFade]);

  return <SoundContext.Provider value={{ isSoundOn, toggleSound }}>{children}</SoundContext.Provider>;
}
