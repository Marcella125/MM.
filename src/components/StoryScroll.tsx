"use client";

import {
  createContext,
  type ReactNode,
  useContext,
  useRef,
  useSyncExternalStore,
} from "react";
import {
  motion,
  type MotionValue,
  useMotionValue,
  useScroll,
  useTransform,
} from "framer-motion";
import { useHydratedReducedMotion } from "./useHydratedReducedMotion";

const StoryProgressContext = createContext<MotionValue<number> | null>(null);
const storyEase = [0.16, 1, 0.3, 1] as const;

export function StoryScrollProvider({
  children,
  progress,
}: {
  children: ReactNode;
  progress: MotionValue<number>;
}) {
  return (
    <StoryProgressContext.Provider value={progress}>
      {children}
    </StoryProgressContext.Provider>
  );
}

export function useStoryScrollProgress() {
  const contextProgress = useContext(StoryProgressContext);
  const fallbackProgress = useMotionValue(1);
  return contextProgress ?? fallbackProgress;
}

function subscribeToDesktopStory(callback: () => void) {
  const query = window.matchMedia("(min-width: 1101px)");
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}

function getDesktopStorySnapshot() {
  return window.matchMedia("(min-width: 1101px)").matches;
}

function getDesktopStoryServerSnapshot() {
  return false;
}

export function StoryStep({
  children,
  className,
  start,
  end,
  lift = 28,
}: {
  children: ReactNode;
  className?: string;
  start: number;
  end: number;
  lift?: number;
}) {
  const progress = useStoryScrollProgress();
  const prefersReducedMotion = useHydratedReducedMotion();
  const desktopStory = useSyncExternalStore(
    subscribeToDesktopStory,
    getDesktopStorySnapshot,
    getDesktopStoryServerSnapshot,
  );
  const opacity = useTransform(progress, [start, end], [0, 1]);
  const y = useTransform(progress, [start, end], [lift, 0]);
  const filter = useTransform(progress, [start, end], ["blur(4px)", "blur(0px)"]);

  if (!desktopStory) {
    return (
      <motion.div
        className={className}
        initial={{ opacity: 0, y: prefersReducedMotion ? 0 : Math.min(lift, 18) }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.22 }}
        transition={{ duration: prefersReducedMotion ? 0.28 : 0.58, ease: storyEase }}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      className={className}
      style={{ opacity, y: prefersReducedMotion ? undefined : y, filter: prefersReducedMotion ? undefined : filter }}
    >
      {children}
    </motion.div>
  );
}

export function StoryExit({
  children,
  className,
  start,
  end,
  lift = 24,
  ariaHidden,
}: {
  children: ReactNode;
  className?: string;
  start: number;
  end: number;
  lift?: number;
  ariaHidden?: boolean;
}) {
  const exitRef = useRef<HTMLDivElement>(null);
  const progress = useStoryScrollProgress();
  const prefersReducedMotion = useHydratedReducedMotion();
  const desktopStory = useSyncExternalStore(
    subscribeToDesktopStory,
    getDesktopStorySnapshot,
    getDesktopStoryServerSnapshot,
  );
  const opacity = useTransform(progress, [start, end], [1, 0]);
  const y = useTransform(progress, [start, end], [0, -lift]);
  const filter = useTransform(progress, [start, end], ["blur(0px)", "blur(3px)"]);
  const { scrollYProgress: mobileProgress } = useScroll({
    target: exitRef,
    offset: ["start start", "end start"],
  });
  const mobileOpacity = useTransform(mobileProgress, [0, 1], [1, 0]);

  if (!desktopStory) {
    return (
      <motion.div ref={exitRef} className={className} aria-hidden={ariaHidden} style={{ opacity: mobileOpacity }}>
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      ref={exitRef}
      className={className}
      aria-hidden={ariaHidden}
      style={{ opacity, y: prefersReducedMotion ? undefined : y, filter: prefersReducedMotion ? undefined : filter }}
    >
      {children}
    </motion.div>
  );
}
