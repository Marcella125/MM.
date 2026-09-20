"use client";

import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import Image from "next/image";
import type { MouseEvent } from "react";
import { assetPath } from "@/src/lib/paths";
import { useHydratedReducedMotion } from "./useHydratedReducedMotion";
import { StoryExit } from "./StoryScroll";

type HeroVisualsProps = {
  pointerX: MotionValue<number>;
  pointerY: MotionValue<number>;
  scrollProgress: MotionValue<number>;
  canParallax: boolean;
  entranceComplete: boolean;
};

type VisualAssetProps = {
  alt?: string;
  className: string;
  delay: number;
  duration: number;
  entryRotate?: number;
  height: number;
  idle?: {
    rotate?: number[];
    scale?: number[];
    y?: number[];
  };
  parallax: {
    x: number;
    y: number;
  };
  pointerX: MotionValue<number>;
  pointerY: MotionValue<number>;
  scrollProgress: MotionValue<number>;
  scrollDepth?: number;
  canParallax: boolean;
  entranceComplete: boolean;
  priority?: boolean;
  src: string;
  width: number;
};

const spring = { stiffness: 180, damping: 18, mass: 0.5 };

function supportsHover() {
  return window.matchMedia("(hover: hover) and (pointer: fine)").matches;
}

function getHoverAnimation(className: string) {
  if (className.includes("pink-ticket")) return { rotate: 2, y: -6 };
  if (className.includes("star-accent")) return { rotate: 18, scale: 1.08 };
  if (className.includes("yellow-x")) return { rotate: 12 };
  if (className.includes("music-note")) return { y: [0, -6, 0], rotate: [0, -4, 0] };
  if (className.includes("neon-face")) {
    return { scaleX: [1, 1.04, 1], scaleY: [1, 0.97, 1] };
  }
  if (className.includes("cursor-sticker")) return { x: [0, -2, 2, -1, 0] };
  if (className.includes("blue-ticket")) return { y: -5, rotate: 1 };
  return {};
}

function VisualAsset({
  alt = "",
  className,
  delay,
  duration,
  entryRotate = 0,
  height,
  idle,
  parallax,
  pointerX,
  pointerY,
  scrollProgress,
  scrollDepth = 0,
  canParallax,
  entranceComplete,
  priority = false,
  src,
  width,
}: VisualAssetProps) {
  const prefersReducedMotion = useHydratedReducedMotion();
  const x = useTransform(pointerX, [-1, 1], [parallax.x, -parallax.x]);
  const y = useTransform([pointerY, scrollProgress], (values) => {
    const [pointer, scroll] = values as number[];
    return -pointer * parallax.y - Math.min(scroll / 0.75, 1) * scrollDepth;
  });
  const magnetX = useMotionValue(0);
  const magnetY = useMotionValue(0);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const smoothMagnetX = useSpring(magnetX, spring);
  const smoothMagnetY = useSpring(magnetY, spring);
  const smoothRotateX = useSpring(rotateX, spring);
  const smoothRotateY = useSpring(rotateY, spring);
  const isHeadphones = className.includes("headphones");
  const hoverAnimation = getHoverAnimation(className);

  function handleMouseMove(event: MouseEvent<HTMLDivElement>) {
    if (!canParallax || !supportsHover()) return;

    const bounds = event.currentTarget.getBoundingClientRect();
    const relativeX = (event.clientX - bounds.left) / bounds.width - 0.5;
    const relativeY = (event.clientY - bounds.top) / bounds.height - 0.5;

    if (isHeadphones) {
      rotateX.set(relativeY * -3);
      rotateY.set(relativeX * 3);
      return;
    }

    magnetX.set(relativeX * 8);
    magnetY.set(relativeY * 8);
  }

  function handleMouseLeave() {
    magnetX.set(0);
    magnetY.set(0);
    rotateX.set(0);
    rotateY.set(0);
  }

  return (
    <div className={`${className} visual-interactive`}>
      <motion.div
        className="visual-motion"
        style={
          prefersReducedMotion
            ? undefined
            : isHeadphones
              ? {
                  rotateX: smoothRotateX,
                  rotateY: smoothRotateY,
                  transformPerspective: 900,
                }
              : { x: smoothMagnetX, y: smoothMagnetY }
        }
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        initial={prefersReducedMotion ? false : { opacity: 0, y: 18, scale: 0.94, rotate: entryRotate }}
        animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
        transition={prefersReducedMotion ? { duration: 0 } : { type: "spring", stiffness: 210, damping: 26, mass: 0.75, delay }}
      >
        <motion.div
          style={canParallax ? { x, y } : undefined}
          className="parallax-layer"
        >
          <motion.div
            className="hover-layer"
            whileHover={
              prefersReducedMotion
                ? undefined
                : isHeadphones
                  ? { scale: 1.015 }
                  : hoverAnimation
            }
            transition={
              className.includes("cursor-sticker")
                ? { duration: 0.14, ease: "easeOut" }
                : spring
            }
          >
            <motion.div
              className="idle-layer"
              animate={entranceComplete && !prefersReducedMotion ? idle : undefined}
              transition={
                prefersReducedMotion || !entranceComplete || !idle
                  ? undefined
                  : { duration, repeat: Infinity, ease: "easeInOut" }
              }
            >
              <Image
                className="visual-asset"
                src={assetPath(src as `/${string}`)}
                alt={alt}
                width={width}
                height={height}
                priority={priority}
              />
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default function HeroVisuals({ pointerX, pointerY, scrollProgress, canParallax, entranceComplete }: HeroVisualsProps) {
  const sharedMotion = { pointerX, pointerY, scrollProgress, canParallax, entranceComplete };

  return (
    <StoryExit className="hero-visual-layer" start={0.04} end={0.38} lift={44} ariaHidden>
      <VisualAsset
        className="headphones"
        src="/assets/headphones.png"
        width={1200}
        height={1064}
        priority
        delay={0.25}
        duration={7.2}
        entryRotate={-3}
        scrollDepth={26}
        idle={{ y: [0, -4, 0], rotate: [0, 0.35, 0] }}
        parallax={{ x: 5, y: 4 }}
        {...sharedMotion}
      />
      <VisualAsset
        className="pink-ticket"
        src="/assets/Pink-Ticket.png"
        width={250}
        height={100}
        delay={0.39}
        duration={5.5}
        entryRotate={-7}
        scrollDepth={11}
        parallax={{ x: 6, y: 4 }}
        {...sharedMotion}
      />
      <VisualAsset
        className="neon-face"
        src="/assets/neon-face.png"
        width={130}
        height={130}
        delay={0.48}
        duration={6.4}
        entryRotate={6}
        scrollDepth={17}
        idle={{ y: [0, -3, 0], rotate: [-0.5, 0.5, -0.5] }}
        parallax={{ x: 7, y: 5 }}
        {...sharedMotion}
      />
      <VisualAsset
        className="cursor-sticker"
        src="/assets/cursor.png"
        width={180}
        height={180}
        delay={0.54}
        duration={5.2}
        entryRotate={-6}
        scrollDepth={13}
        parallax={{ x: 6, y: 5 }}
        {...sharedMotion}
      />
      <VisualAsset
        className="yellow-x"
        src="/assets/yellow-x.png"
        width={110}
        height={110}
        delay={0.62}
        duration={5}
        entryRotate={8}
        scrollDepth={7}
        parallax={{ x: 0, y: 0 }}
        {...sharedMotion}
      />
      <VisualAsset
        className="music-note"
        src="/assets/music-note.png"
        width={180}
        height={180}
        delay={0.69}
        duration={7.8}
        entryRotate={-8}
        scrollDepth={12}
        idle={{ y: [0, -3, 0], rotate: [-0.5, 0.5, -0.5] }}
        parallax={{ x: 5, y: 4 }}
        {...sharedMotion}
      />
      <VisualAsset
        className="star-accent star-left"
        src="/assets/star.png"
        width={30}
        height={30}
        delay={0.76}
        duration={3.2}
        entryRotate={-12}
        scrollDepth={6}
        parallax={{ x: 0, y: 0 }}
        {...sharedMotion}
      />
      <VisualAsset
        className="blue-picture blue-picture-left-top"
        src="/assets/blue-picture.png"
        width={130}
        height={130}
        delay={0.83}
        duration={4.4}
        entryRotate={5}
        scrollDepth={8}
        parallax={{ x: 0, y: 0 }}
        {...sharedMotion}
      />
    </StoryExit>
  );
}
