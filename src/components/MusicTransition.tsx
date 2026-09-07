"use client";

import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useRef } from "react";
import { useHydratedReducedMotion } from "./useHydratedReducedMotion";
import styles from "./MusicTransition.module.css";

const bars = Array.from({ length: 35 }, (_, index) => index);

function EqualizerBar({ progress, index, reducedMotion }: {
  progress: MotionValue<number>;
  index: number;
  reducedMotion: boolean;
}) {
  const peak = 0.4 + Math.sin(index * 1.9) ** 2 * 0.6;
  const scaleY = useTransform(
    progress,
    [0, 0.25, 0.5, 0.75, 1],
    [0.15, index % 2 ? peak : 0.25, peak, index % 2 ? 0.25 : peak, 0.15],
  );

  return <motion.span className={styles.bar} style={{ scaleY: reducedMotion ? peak : scaleY }} />;
}

export default function MusicTransition({ track, title }: { track: string; title: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = useHydratedReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const noteY = useTransform(scrollYProgress, [0, 1], [20, -20]);
  const noteRotate = useTransform(scrollYProgress, [0, 0.5, 1], [-16, 6, 16]);
  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <div
      ref={ref}
      className={styles.transition}
      data-track={track}
      aria-hidden="true"
    >
      <div className={styles.inner}>
        <div className={styles.caption}>
          <span className={styles.track}>{track} / NEXT TRACK</span>
          <span className={styles.title}>{title}</span>
        </div>
        <div className={styles.waveform}>
          {bars.map((index) => (
            <EqualizerBar key={index} index={index} progress={scrollYProgress} reducedMotion={Boolean(reducedMotion)} />
          ))}
        </div>
        <motion.span
          className={styles.note}
          style={{ y: reducedMotion ? 0 : noteY, rotate: reducedMotion ? 0 : noteRotate }}
        >
          ♫
        </motion.span>
      </div>
      <div className={styles.progress}>
        <motion.div style={{ scaleX: reducedMotion ? 1 : lineScale }} />
      </div>
    </div>
  );
}
