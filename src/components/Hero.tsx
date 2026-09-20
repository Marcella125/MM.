"use client";

import {
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import Image from "next/image";
import { ArrowDown } from "lucide-react";
import { useRef, useState, useSyncExternalStore, type MouseEvent } from "react";
import { assetPath } from "@/src/lib/paths";
import HeroVisuals from "./HeroVisuals";
import { StoryExit } from "./StoryScroll";
import { useHydratedReducedMotion } from "./useHydratedReducedMotion";

const ease = [0.22, 1, 0.36, 1] as const;
const spring = { stiffness: 180, damping: 18, mass: 0.5 };
const wordVariants = {
  hidden: ({ impact }: { index: number; impact: boolean }) => ({
    y: impact ? "78%" : "68%",
    scale: impact ? 0.94 : 1,
    clipPath: "inset(100% -14% -20% -14%)",
  }),
  visible: ({ index, impact }: { index: number; impact: boolean }) => ({
    y: "0%",
    scale: 1,
    clipPath: "inset(-20% -14% -20% -14%)",
    transition: {
      duration: impact ? 0.7 : 0.62,
      delay: 0.14 + index * 0.085,
      ease,
    },
  }),
};

function subscribeToFinePointer(callback: () => void) {
  const query = window.matchMedia("(hover: hover) and (pointer: fine)");
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}

function getFinePointer() {
  return window.matchMedia("(hover: hover) and (pointer: fine)").matches;
}

export default function Hero() {
  const prefersReducedMotion = useHydratedReducedMotion();
  const finePointer = useSyncExternalStore(subscribeToFinePointer, getFinePointer, () => false);
  const canParallax = finePointer && !prefersReducedMotion;
  const [entranceComplete, setEntranceComplete] = useState(false);
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const kickerDepth = useTransform(scrollYProgress, [0, 0.75], [0, -8]);
  const titleDepth = useTransform(scrollYProgress, [0, 0.75], [0, -24]);
  const descriptionDepth = useTransform(scrollYProgress, [0, 0.75], [0, -14]);
  const actionDepth = useTransform(scrollYProgress, [0, 0.75], [0, -10]);
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const smoothX = useSpring(pointerX, { stiffness: 60, damping: 20, mass: 0.5 });
  const smoothY = useSpring(pointerY, { stiffness: 60, damping: 20, mass: 0.5 });

  function handleMouseMove(event: MouseEvent<HTMLElement>) {
    if (!canParallax) return;

    const bounds = event.currentTarget.getBoundingClientRect();
    pointerX.set(((event.clientX - bounds.left) / bounds.width) * 2 - 1);
    pointerY.set(((event.clientY - bounds.top) / bounds.height) * 2 - 1);
  }

  function handleMouseLeave() {
    pointerX.set(0);
    pointerY.set(0);
  }

  return (
    <section
      ref={heroRef}
      className="hero"
      id="work"
      aria-labelledby="hero-heading"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="hero-copy">
        <motion.div style={{ y: canParallax ? kickerDepth : 0 }}>
        <StoryExit start={0.02} end={0.14}>
        <motion.div
          className="intro-cluster"
          initial={prefersReducedMotion ? false : { opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.12, ease }}
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
          </p>
        </motion.div>
        </StoryExit>
        </motion.div>

        <StoryExit start={0.12} end={0.32} lift={34}>
        <motion.h1
          className="hero-title"
          id="hero-heading"
          style={{ y: canParallax ? titleDepth : 0 }}
          initial={prefersReducedMotion ? false : "hidden"}
          animate="visible"
        >
          <span className="hero-title-line">
            <motion.span
              className="hero-title-word hero-title-word-blue"
              variants={wordVariants}
              custom={{ index: 0, impact: false }}
              whileHover={
                prefersReducedMotion ? undefined : { letterSpacing: "0.018em" }
              }
              transition={{ duration: 0.24, ease }}
            >
              I
            </motion.span>{" "}
            <motion.span
              className="hero-title-word hero-title-word-pink"
              variants={wordVariants}
              custom={{ index: 1, impact: false }}
              whileHover={
                prefersReducedMotion ? undefined : { letterSpacing: "0.018em" }
              }
              transition={{ duration: 0.24, ease }}
            >
              Build
            </motion.span>
          </span>
          <span className="hero-title-line">
            <motion.span
              className="hero-title-word hero-title-word-highlight"
              variants={wordVariants}
              custom={{ index: 2, impact: false }}
            >
              Digital
            </motion.span>{" "}
            <motion.span
              className="hero-title-word hero-title-word-blue"
              variants={wordVariants}
              custom={{ index: 3, impact: false }}
              whileHover={
                prefersReducedMotion ? undefined : { letterSpacing: "0.028em" }
              }
              transition={{ duration: 0.26, ease }}
            >
              Experiences
            </motion.span>
          </span>
          <span className="hero-title-line">
            <motion.span
              className="hero-title-word hero-title-word-pink"
              variants={wordVariants}
              custom={{ index: 4, impact: false }}
              whileHover={prefersReducedMotion ? undefined : { y: -3 }}
              transition={spring}
            >
              That
            </motion.span>{" "}
            <motion.span
              className="hero-title-word hero-title-word-yellow"
              variants={wordVariants}
              custom={{ index: 5, impact: true }}
              whileHover={prefersReducedMotion ? undefined : { y: -3 }}
              transition={spring}
            >
              Hit
            </motion.span>{" "}
            <motion.span
              className="hero-title-blue hero-title-different"
              variants={wordVariants}
              custom={{ index: 6, impact: true }}
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
          </span>
        </motion.h1>
        </StoryExit>

        <motion.div style={{ y: canParallax ? descriptionDepth : 0 }}>
        <StoryExit start={0.29} end={0.42}>
        <motion.p
          className="hero-description"
          initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.52, delay: 1.02, ease }}
        >
          Developing websites and interactive experiences that are{" "}
          <mark>intuitive</mark>, <mark>responsive</mark> and easy to use.
        </motion.p>
        </StoryExit>
        </motion.div>

        <motion.div style={{ y: canParallax ? actionDepth : 0 }}>
        <StoryExit start={0.39} end={0.5}>
        <motion.div
          className="hero-actions"
          initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.14, ease }}
          onAnimationComplete={() => setEntranceComplete(true)}
        >
          <a className="scroll-cue" href="#about" aria-label="Scroll to about section">
            <span className="scroll-copy">SCROLL TO EXPLORE</span>
            <span className="scroll-arrow" aria-hidden="true">
              <ArrowDown />
            </span>
          </a>
        </motion.div>
        </StoryExit>
        </motion.div>
      </div>

      <HeroVisuals
        pointerX={smoothX}
        pointerY={smoothY}
        scrollProgress={scrollYProgress}
        canParallax={canParallax}
        entranceComplete={entranceComplete}
      />
    </section>
  );
}
