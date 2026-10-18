"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { useHydratedReducedMotion } from "./useHydratedReducedMotion";
import styles from "./SectionHeadingReveal.module.css";

const headingEase = [0.22, 1, 0.36, 1] as const;

export default function SectionHeadingReveal({
  children,
  className,
  id,
}: {
  children: ReactNode;
  className?: string;
  id: string;
}) {
  const reducedMotion = Boolean(useHydratedReducedMotion());

  return (
    <motion.div
      className={styles.mask}
      initial={reducedMotion ? false : "hidden"}
      whileInView="visible"
      viewport={{ once: false, amount: 0.45 }}
    >
      <motion.h2
        id={id}
        className={className}
        variants={reducedMotion ? { hidden: { y: "0%" }, visible: { y: "0%" } } : { hidden: { y: "105%" }, visible: { y: "0%" } }}
        transition={{ duration: 0.75, ease: headingEase }}
      >
        {children}
      </motion.h2>
    </motion.div>
  );
}
