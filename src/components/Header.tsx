"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Code2,
  Menu,
  Music,
  Send,
  Sparkle,
  X,
  Zap,
} from "lucide-react";
import type { MouseEvent } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { assetPath } from "@/src/lib/paths";
import { useHydratedReducedMotion } from "./useHydratedReducedMotion";

const navItems = [
  { label: "HOME", index: "01", href: "#work", Icon: Code2 },
  { label: "ABOUT", index: "02", href: "#about", Icon: Sparkle },
  { label: "JOURNEY", index: "03", href: "#journey", Icon: Zap },
  { label: "PROJECTS", index: "04", href: "#playlist", Icon: Music },
  { label: "CONTACT", index: "05", href: "#contact", Icon: Send },
];

const ease = [0.22, 1, 0.36, 1] as const;
const backgroundAudioSrc = assetPath(
  "/audio/ALLDAY%20PROJECT%20%E2%80%93%20FAMOUS%20_%20Instrumental.mp3",
);
const targetVolume = 0.2;
const fadeDuration = 450;
const initialAudioStartTime = 0;
const spring = { stiffness: 180, damping: 18, mass: 0.5 };
const waveformBars = Array.from({ length: 11 });

function clampVolume(volume: number) {
  return Math.min(Math.max(volume, 0), 1);
}

function supportsHover() {
  return window.matchMedia("(hover: hover) and (pointer: fine)").matches;
}

export default function Header() {
  const prefersReducedMotion = useHydratedReducedMotion();
  const [isSoundOn, setIsSoundOn] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeFrameRef = useRef<number | null>(null);
  const hasStartedAudioRef = useRef(false);
  const soundX = useMotionValue(0);
  const soundY = useMotionValue(0);
  const smoothSoundX = useSpring(soundX, spring);
  const smoothSoundY = useSpring(soundY, spring);

  const cancelFade = useCallback(() => {
    if (fadeFrameRef.current === null) return;

    window.cancelAnimationFrame(fadeFrameRef.current);
    fadeFrameRef.current = null;
  }, []);

  const fadeVolume = useCallback(
    (
      audio: HTMLAudioElement,
      fromVolume: number,
      toVolume: number,
      onComplete?: () => void,
    ) => {
      const startTime = performance.now();

      cancelFade();

      function tick(now: number) {
        const progress = Math.min(
          Math.max((now - startTime) / fadeDuration, 0),
          1,
        );
        const easedProgress = 1 - Math.pow(1 - progress, 3);

        audio.volume = clampVolume(
          fromVolume + (toVolume - fromVolume) * easedProgress,
        );

        if (progress < 1) {
          fadeFrameRef.current = window.requestAnimationFrame(tick);
          return;
        }

        fadeFrameRef.current = null;
        onComplete?.();
      }

      fadeFrameRef.current = window.requestAnimationFrame(tick);
    },
    [cancelFade],
  );

  const getAudio = useCallback(() => {
    if (audioRef.current) return audioRef.current;

    const audio = new Audio(backgroundAudioSrc);

    audio.loop = true;
    audio.preload = "auto";
    audio.volume = 0;
    audioRef.current = audio;

    return audio;
  }, []);

  const stopSound = useCallback(() => {
    const audio = audioRef.current;

    if (!audio) return;

    setIsSoundOn(false);
    fadeVolume(audio, audio.volume, 0, () => {
      audio.pause();
    });
  }, [fadeVolume]);

  const startSound = useCallback(async () => {
    const audio = getAudio();

    if (!audio.paused) {
      cancelFade();
      setIsSoundOn(true);
      fadeVolume(audio, audio.volume, targetVolume);
      return;
    }

    if (!hasStartedAudioRef.current) {
      audio.currentTime = initialAudioStartTime;
    }

    audio.volume = 0;

    try {
      await audio.play();
      hasStartedAudioRef.current = true;
      setIsSoundOn(true);
      fadeVolume(audio, audio.volume, targetVolume);
    } catch {
      setIsSoundOn(false);
    }
  }, [cancelFade, fadeVolume, getAudio]);

  const toggleSound = useCallback(() => {
    if (isSoundOn) {
      stopSound();
      return;
    }

    void startSound();
  }, [isSoundOn, startSound, stopSound]);

  function handleSoundMouseMove(event: MouseEvent<HTMLButtonElement>) {
    if (prefersReducedMotion || !supportsHover()) return;

    const bounds = event.currentTarget.getBoundingClientRect();
    const relativeX = (event.clientX - bounds.left) / bounds.width - 0.5;
    const relativeY = (event.clientY - bounds.top) / bounds.height - 0.5;

    soundX.set(relativeX * 10);
    soundY.set(relativeY * 10);
  }

  function handleSoundMouseLeave() {
    soundX.set(0);
    soundY.set(0);
  }

  useEffect(() => {
    return () => {
      cancelFade();
      audioRef.current?.pause();
    };
  }, [cancelFade]);

  useEffect(() => {
    document.body.classList.toggle("is-menu-open", isMenuOpen);

    return () => {
      document.body.classList.remove("is-menu-open");
    };
  }, [isMenuOpen]);

  return (
    <motion.header
      className="site-header"
      aria-label="Primary navigation"
      initial={{ opacity: 0, y: prefersReducedMotion ? 0 : -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease }}
    >
      <Link className="logo" href="/" aria-label="MM home">
        <Image
          className="logo-image"
          src={assetPath("/assets/MM. logo.png")}
          alt="MM."
          width={180}
          height={70}
          priority
        />
      </Link>

      <nav
        className={`primary-nav${isMenuOpen ? " is-open" : ""}`}
        id="primary-navigation"
      >
        {navItems.map(({ label, index, href, Icon }) => (
          <motion.a
            className="nav-link"
            href={href}
            key={`${label}-${index}`}
            initial="rest"
            animate="rest"
            whileHover="hover"
            onClick={() => setIsMenuOpen(false)}
          >
            <span className="nav-icon-badge" aria-hidden="true">
              <Icon size={22} strokeWidth={2.4} />
            </span>
            <span className="nav-label-window">
              <motion.span
                className="nav-label-stack"
                variants={{ rest: { y: "0%" }, hover: { y: "-50%" } }}
                transition={{ duration: 0.22, ease }}
              >
                <span>{label}</span>
                <span>{label}</span>
              </motion.span>
            </span>
            <motion.span
              className="nav-index"
              variants={{ rest: { x: 0 }, hover: { x: 0 } }}
            >
              [{index}]
            </motion.span>
            <motion.span
              className="nav-underline"
              variants={{ rest: { scaleX: 0 }, hover: { scaleX: 1 } }}
              transition={{ duration: 0.18, ease: "easeOut" }}
            />
            <span className="nav-mobile-arrow" aria-hidden="true">
              <ArrowRight size={28} strokeWidth={2.2} />
            </span>
          </motion.a>
        ))}
      </nav>

      <div className="sound-control" aria-label="Sound status">
        <span>
          SOUND{" "}
          <span className="sound-state">[ {isSoundOn ? "ON" : "OFF"} ]</span>
        </span>
        <motion.button
          className={`sound-button${isSoundOn ? " is-active" : ""}`}
          type="button"
          aria-label={isSoundOn ? "Turn sound off" : "Turn sound on"}
          aria-pressed={isSoundOn}
          onClick={toggleSound}
          onMouseMove={handleSoundMouseMove}
          onMouseLeave={handleSoundMouseLeave}
          style={
            prefersReducedMotion
              ? undefined
              : { x: smoothSoundX, y: smoothSoundY }
          }
          animate={
            prefersReducedMotion || !isSoundOn
              ? undefined
              : { scale: [1, 1.04, 1] }
          }
          whileHover={prefersReducedMotion ? undefined : { scale: 1.06 }}
          transition={
            prefersReducedMotion || !isSoundOn
              ? undefined
              : { duration: 2.2, repeat: Infinity, ease: "easeInOut" }
          }
        >
          <span
            className={`sound-waveform${isSoundOn ? " is-active" : ""}`}
            aria-hidden="true"
          >
            {waveformBars.map((_, index) => (
              <span className="sound-waveform-bar" key={index} />
            ))}
          </span>
        </motion.button>
      </div>

      <button
        className="menu-button"
        type="button"
        aria-label={isMenuOpen ? "Close navigation" : "Open navigation"}
        aria-expanded={isMenuOpen}
        aria-controls="primary-navigation"
        onClick={() => setIsMenuOpen((current) => !current)}
      >
        {isMenuOpen ? <X size={24} strokeWidth={2.2} /> : <Menu size={25} strokeWidth={2.2} />}
      </button>
    </motion.header>
  );
}
