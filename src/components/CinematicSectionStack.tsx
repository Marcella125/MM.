"use client";

import {
  Children,
  type CSSProperties,
  type ReactNode,
  useEffect,
  useRef,
} from "react";
import {
  motion,
  type MotionValue,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { StoryScrollProvider } from "./StoryScroll";
import { useHydratedReducedMotion } from "./useHydratedReducedMotion";
import styles from "./CinematicSectionStack.module.css";

const sectionIds = ["work", "about", "projects", "contact"];
const sceneDurations: number[] = [1.35, 4.3, 5, 0];
const totalScrollUnits = sceneDurations.reduce((sum, duration) => sum + duration, 0);
const sceneStarts = sceneDurations.map((_, index) =>
  sceneDurations.slice(0, index).reduce((sum, duration) => sum + duration, 0),
);
const transitionUnits = 0.72;
const homeTransitionUnits = 1.15;
const scrollSpring = { stiffness: 118, damping: 27, mass: 0.34, restDelta: 0.0005 };

function CinematicPanel({
  children,
  index,
  progress,
}: {
  children: ReactNode;
  index: number;
  progress: MotionValue<number>;
}) {
  const reducedMotion = useHydratedReducedMotion();
  const arrivalEnd = sceneStarts[index] / totalScrollUnits;
  const arrivalStart = index === 0
    ? -0.001
    : Math.max(
        0,
        (sceneStarts[index] - (index === 1 ? homeTransitionUnits : transitionUnits)) / totalScrollUnits,
      );
  const nextArrivalEnd = index === sceneStarts.length - 1
    ? 1.001
    : sceneStarts[index + 1] / totalScrollUnits;
  const departureStart = index === sceneStarts.length - 1
    ? 1.001
    : Math.max(
        arrivalEnd,
        nextArrivalEnd - (index === 0 ? homeTransitionUnits : transitionUnits) / totalScrollUnits,
      );
  const departureEnd = nextArrivalEnd;
  const arrivalFadeStart = (arrivalStart + arrivalEnd) / 2;
  const departureFadeEnd = (departureStart + departureEnd) / 2;
  const storyEnd = Math.max(
    arrivalEnd + 0.001,
    departureStart - 0.05 / totalScrollUnits,
  );
  const storyProgress = useTransform(
    progress,
    [
      index === 0 ? departureStart : arrivalEnd,
      index === 0 ? departureEnd : storyEnd,
    ],
    [0, 1],
    { clamp: true },
  );

  const y = useTransform(
    progress,
    [arrivalStart, arrivalEnd],
    index < 2 ? ["0%", "0%"] : ["102%", "0%"],
  );
  const opacity = useTransform(
    progress,
    index === 0 ? [departureStart, departureFadeEnd] : [arrivalFadeStart, arrivalEnd],
    index === 0 ? [1, 0] : [0, 1],
  );
  const reducedOpacity = useTransform(
    progress,
    index === 0
      ? [departureStart, departureFadeEnd]
      : index === sceneStarts.length - 1
        ? [arrivalFadeStart, arrivalEnd]
        : [arrivalFadeStart, arrivalEnd, departureStart, departureFadeEnd],
    index === 0 ? [1, 0] : index === sceneStarts.length - 1 ? [0, 1] : [0, 1, 1, 0],
  );
  const reducedPointerEvents = useTransform(progress, (value) => {
    const entered = index === 0 || value >= (arrivalStart + arrivalEnd) / 2;
    const left = index !== sceneStarts.length - 1 && value >= (departureStart + departureEnd) / 2;
    return entered && !left ? "auto" : "none";
  });
  const aboutPointerEvents = useTransform(
    progress,
    (value) => value >= (arrivalStart + arrivalEnd) / 2 ? "auto" : "none",
  );
  const entryScale = useTransform(
    progress,
    [arrivalStart, arrivalEnd],
    index === 0 ? [1, 1] : [0.965, 1],
  );
  const exitScale = useTransform(
    progress,
    [departureStart, departureEnd],
    index === sceneStarts.length - 1 ? [1, 1] : [1, 0.972],
  );
  const exitFilter = useTransform(
    progress,
    [departureStart, departureEnd],
    index === sceneStarts.length - 1
      ? ["brightness(1)", "brightness(1)"]
      : ["brightness(1)", "brightness(0.88)"],
  );

  return (
    <motion.div
      className={styles.panel}
      data-stack-panel={sectionIds[index]}
      style={{
        y,
        opacity: index === 0
          ? undefined
          : reducedMotion
            ? reducedOpacity
            : index === 1 ? opacity : undefined,
        pointerEvents: reducedMotion
          ? reducedPointerEvents
          : index === 1 ? aboutPointerEvents : undefined,
        scale: entryScale,
        zIndex: index + 1,
      }}
    >
      <motion.div
        className={styles.surface}
        style={{ scale: exitScale, filter: exitFilter }}
      >
        <StoryScrollProvider progress={storyProgress}>
          {children}
        </StoryScrollProvider>
      </motion.div>
    </motion.div>
  );
}

export default function CinematicSectionStack({ children }: { children: ReactNode }) {
  const items = Children.toArray(children);
  const stackRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: stackRef,
    offset: ["start start", "end end"],
  });
  const smoothProgress = useSpring(scrollYProgress, scrollSpring);

  useEffect(() => {
    function isCinematicLayout() {
      return window.matchMedia("(min-width: 1101px)").matches;
    }

    function scrollToSection(index: number) {
      const stack = stackRef.current;
      if (!stack || !isCinematicLayout()) return false;

      const stackTop = stack.getBoundingClientRect().top + window.scrollY;
      const travel = stack.offsetHeight - window.innerHeight;
      const sectionProgress = sceneStarts[index] / totalScrollUnits;
      window.scrollTo({ top: stackTop + travel * sectionProgress, behavior: "smooth" });
      return true;
    }

    function handleAnchorClick(event: MouseEvent) {
      const target = event.target;
      if (!(target instanceof Element)) return;

      const anchor = target.closest<HTMLAnchorElement>('a[href^="#"]');
      const id = anchor?.getAttribute("href")?.slice(1);
      const index = id ? sectionIds.indexOf(id) : -1;
      if (index < 0 || !scrollToSection(index)) return;

      event.preventDefault();
      window.history.replaceState(null, "", index === 0 ? window.location.pathname : `#${id}`);
    }

    const initialIndex = sectionIds.indexOf(window.location.hash.slice(1));
    const initialFrame = window.requestAnimationFrame(() => {
      if (initialIndex > 0) scrollToSection(initialIndex);
    });

    document.addEventListener("click", handleAnchorClick, true);
    return () => {
      window.cancelAnimationFrame(initialFrame);
      document.removeEventListener("click", handleAnchorClick, true);
    };
  }, [items.length]);

  const stackStyle = {
    "--stack-scroll-units": totalScrollUnits + 1,
  } as CSSProperties;

  return (
    <div className={styles.stack} ref={stackRef} style={stackStyle}>
      <div className={styles.viewport}>
        {items.map((child, index) => (
          <CinematicPanel
            index={index}
            key={sectionIds[index] ?? index}
            progress={smoothProgress}
          >
            {child}
          </CinematicPanel>
        ))}
      </div>
    </div>
  );
}
