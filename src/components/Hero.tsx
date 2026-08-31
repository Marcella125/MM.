"use client";

import {
  motion,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { ArrowDown } from "lucide-react";
import Image from "next/image";
import type { MouseEvent } from "react";
import { assetPath } from "@/src/lib/paths";
import HeroVisuals from "./HeroVisuals";
import { useHydratedReducedMotion } from "./useHydratedReducedMotion";

const ease = [0.22, 1, 0.36, 1] as const;
const spring = { stiffness: 180, damping: 18, mass: 0.5 };

export default function Hero() {
  const prefersReducedMotion = useHydratedReducedMotion();
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const smoothX = useSpring(pointerX, { stiffness: 60, damping: 20, mass: 0.5 });
  const smoothY = useSpring(pointerY, { stiffness: 60, damping: 20, mass: 0.5 });

  function handleMouseMove(event: MouseEvent<HTMLElement>) {
    if (prefersReducedMotion) return;

    const bounds = event.currentTarget.getBoundingClientRect();
    pointerX.set(((event.clientX - bounds.left) / bounds.width) * 2 - 1);
    pointerY.set(((event.clientY - bounds.top) / bounds.height) * 2 - 1);
  }

  function handleMouseLeave() {
    pointerX.set(0);
    pointerY.set(0);
  }

  const lineVariants = {
    hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 35 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease } },
  };

  return (
    <section
      className="hero"
      id="work"
      aria-labelledby="hero-heading"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="hero-copy">
        <motion.div
          className="intro-cluster"
          initial={{ opacity: 0, x: prefersReducedMotion ? 0 : -15 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.55, delay: 0.12, ease }}
        >
          <div className="disk-orbit" aria-hidden="true">
            <motion.div className="disk-motion">
              <Image
                className="disk-asset"
                src={assetPath("/assets/disk.png")}
                alt=""
                width={140}
                height={140}
                priority
              />
            </motion.div>
          </div>

          <p className="hero-kicker">
            CREATIVE DEVELOPER
            <br />
            &amp; DIGITAL DESIGNER
          </p>
        </motion.div>

        <motion.h1
          className="hero-title"
          id="hero-heading"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: { staggerChildren: 0.08, delayChildren: 0.2 },
            },
          }}
        >
          <motion.span className="hero-title-line" variants={lineVariants}>
            <motion.span
              className="hero-title-word hero-title-word-blue"
              whileHover={
                prefersReducedMotion ? undefined : { letterSpacing: "0.018em" }
              }
              transition={{ duration: 0.24, ease }}
            >
              I
            </motion.span>{" "}
            <motion.span
              className="hero-title-word hero-title-word-pink"
              whileHover={
                prefersReducedMotion ? undefined : { letterSpacing: "0.018em" }
              }
              transition={{ duration: 0.24, ease }}
            >
              Design
            </motion.span>
          </motion.span>
          <motion.span className="hero-title-line" variants={lineVariants}>
            <motion.span
              className="hero-title-word hero-title-word-yellow"
              whileHover={prefersReducedMotion ? undefined : { scaleX: 1.025 }}
              transition={spring}
            >
              Digital
            </motion.span>{" "}
            <motion.span
              className="hero-title-word hero-title-word-blue"
              whileHover={
                prefersReducedMotion ? undefined : { letterSpacing: "0.028em" }
              }
              transition={{ duration: 0.26, ease }}
            >
              Experiences
            </motion.span>
          </motion.span>
          <motion.span className="hero-title-line" variants={lineVariants}>
            <motion.span
              className="hero-title-word hero-title-word-pink"
              whileHover={prefersReducedMotion ? undefined : { y: -3 }}
              transition={spring}
            >
              That
            </motion.span>{" "}
            <motion.span
              className="hero-title-word hero-title-word-yellow"
              whileHover={prefersReducedMotion ? undefined : { y: -3 }}
              transition={spring}
            >
              Hit
            </motion.span>{" "}
            <motion.span
              className="hero-title-blue hero-title-different"
              whileHover={
                prefersReducedMotion
                  ? undefined
                  : {
                      x: [0, -2, 2, -1, 0],
                      textShadow: [
                        "0 0 0 #070707, 0 0 0 #1238ff",
                        "2px 0 0 #070707, -2px 0 0 #1238ff",
                        "-2px 0 0 #070707, 2px 0 0 #1238ff",
                        "1px 0 0 #070707, -1px 0 0 #1238ff",
                        "0 0 0 #070707, 0 0 0 #1238ff",
                      ],
                    }
              }
              transition={{ duration: 0.24, ease: "easeOut" }}
            >
              Different.
            </motion.span>
          </motion.span>
        </motion.h1>

        <motion.p
          className="hero-description"
          initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.48, ease }}
        >
          Crafting websites, brands and interactions that are{" "}
          <mark>intuitive</mark>, <mark>immersive</mark> and memorable.
        </motion.p>

        <motion.div
          className="hero-actions"
          initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.58, ease }}
        >
          <a className="scroll-cue" href="#about" aria-label="Scroll to about section">
            <span className="scroll-copy">
              SCROLL TO EXPLORE
              <span className="scroll-line" />
            </span>
            <motion.span
              className="scroll-arrow"
              animate={prefersReducedMotion ? undefined : { y: [0, 6, 0] }}
              transition={
                prefersReducedMotion
                  ? undefined
                  : { duration: 1.6, repeat: Infinity, ease: "easeInOut" }
              }
            >
              <ArrowDown size={40} strokeWidth={1.7} />
            </motion.span>
          </a>
        </motion.div>
      </div>

      <HeroVisuals pointerX={smoothX} pointerY={smoothY} />
    </section>
  );
}
