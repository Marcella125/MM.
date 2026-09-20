"use client";

import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { useRef, type ReactNode } from "react";
import { entrance } from "./motionFoundation";
import { useHydratedReducedMotion } from "./useHydratedReducedMotion";

export default function ScrollReveal({
  children,
  className,
  delay = 0,
  lift = entrance.lift,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  lift?: number;
}) {
  const prefersReducedMotion = useHydratedReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.98", "start 0.7"] });
  const progress = useSpring(scrollYProgress, { stiffness: 260, damping: 32, mass: 0.55 });
  const start = Math.min(delay * 0.4, 0.12);
  const opacity = useTransform(progress, [start, Math.min(start + 0.72, 1)], [entrance.opacity, 1]);
  const y = useTransform(progress, [start, 1], [Math.min(lift, 26), 0]);
  const scale = useTransform(progress, [start, 1], [entrance.scale, 1]);

  return (
    <motion.div
      ref={ref}
      className={className}
      style={prefersReducedMotion ? { opacity: 1, y: 0, scale: 1 } : { opacity, y, scale }}
    >
      {children}
    </motion.div>
  );
}
