"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import Image from "next/image";
import type { MouseEvent } from "react";
import { assetPath } from "@/src/lib/paths";
import { useHydratedReducedMotion } from "./useHydratedReducedMotion";
import { StoryExit } from "./StoryScroll";

const spring = { stiffness: 180, damping: 18, mass: 0.5 };

function supportsHover() {
  return window.matchMedia("(hover: hover) and (pointer: fine)").matches;
}

export default function ProjectStrip() {
  const prefersReducedMotion = useHydratedReducedMotion();
  const magnetX = useMotionValue(0);
  const magnetY = useMotionValue(0);
  const smoothMagnetX = useSpring(magnetX, spring);
  const smoothMagnetY = useSpring(magnetY, spring);

  function handleMouseMove(event: MouseEvent<HTMLElement>) {
    if (prefersReducedMotion || !supportsHover()) return;

    const bounds = event.currentTarget.getBoundingClientRect();
    const relativeX = (event.clientX - bounds.left) / bounds.width - 0.5;
    const relativeY = (event.clientY - bounds.top) / bounds.height - 0.5;

    magnetX.set(relativeX * 10);
    magnetY.set(relativeY * 10);
  }

  function handleMouseLeave() {
    magnetX.set(0);
    magnetY.set(0);
  }

  return (
    <StoryExit className="project-strip" start={0.16} end={0.34} lift={30}>
    <aside
      className="project-strip-tilt"
      aria-hidden="true"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        className="ticket-motion"
        style={
          prefersReducedMotion
            ? undefined
            : { x: smoothMagnetX, y: smoothMagnetY }
        }
        initial={{ opacity: 0, scale: prefersReducedMotion ? 1 : 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.42, delay: 0.38, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.div
          className="ticket-float"
          animate={prefersReducedMotion ? undefined : { y: [0, -6, 0], rotate: [-1, 1, -1] }}
          transition={prefersReducedMotion ? undefined : { duration: 5.8, repeat: Infinity, ease: "easeInOut" }}
          whileHover={prefersReducedMotion ? undefined : { y: -5, rotate: 1 }}
        >
          <Image
            className="project-ticket-image"
            src={assetPath("/assets/yellow-ticket.png")}
            alt=""
            width={300}
            height={130}
          />
        </motion.div>
      </motion.div>
    </aside>
    </StoryExit>
  );
}
