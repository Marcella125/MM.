"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { useHydratedReducedMotion } from "./useHydratedReducedMotion";

const revealEase = [0.16, 1, 0.3, 1] as const;

export default function ScrollReveal({
  children,
  className,
  delay = 0,
  lift = 42,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  lift?: number;
}) {
  const prefersReducedMotion = useHydratedReducedMotion();

  return (
    <motion.div
      className={className}
      initial={
        prefersReducedMotion
          ? false
          : {
              opacity: 0,
              y: lift,
              filter: "blur(10px)",
            }
      }
      whileInView={{
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
      }}
      viewport={{ once: true, amount: 0.45 }}
      transition={{ duration: 0.82, delay, ease: revealEase }}
    >
      {children}
    </motion.div>
  );
}
