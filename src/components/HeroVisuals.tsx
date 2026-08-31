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
import { useHydratedReducedMotion } from "./useHydratedReducedMotion";

type HeroVisualsProps = {
  pointerX: MotionValue<number>;
  pointerY: MotionValue<number>;
};

type VisualAssetProps = {
  alt?: string;
  className: string;
  delay: number;
  duration: number;
  height: number;
  idle: {
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
  priority?: boolean;
  src: string;
  width: number;
};

const ease = [0.22, 1, 0.36, 1] as const;
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
  height,
  idle,
  parallax,
  pointerX,
  pointerY,
  priority = false,
  src,
  width,
}: VisualAssetProps) {
  const prefersReducedMotion = useHydratedReducedMotion();
  const x = useTransform(pointerX, [-1, 1], [parallax.x, -parallax.x]);
  const y = useTransform(pointerY, [-1, 1], [parallax.y, -parallax.y]);
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
    if (prefersReducedMotion || !supportsHover()) return;

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
        initial={{ opacity: 0, scale: prefersReducedMotion ? 1 : 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.42, delay, ease }}
      >
        <motion.div
          style={prefersReducedMotion ? undefined : { x, y }}
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
              animate={prefersReducedMotion ? undefined : idle}
              transition={
                prefersReducedMotion
                  ? undefined
                  : { duration, repeat: Infinity, ease: "easeInOut" }
              }
            >
              <Image
                className="visual-asset"
                src={src}
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

export default function HeroVisuals({ pointerX, pointerY }: HeroVisualsProps) {
  return (
    <div className="hero-visual-layer" aria-hidden="true">
      <VisualAsset
        className="headphones"
        src="/assets/headphones.png"
        width={1200}
        height={1064}
        priority
        delay={0.24}
        duration={6.6}
        idle={{ y: [0, -8, 0], rotate: [0, 0.7, 0] }}
        parallax={{ x: 10, y: 8 }}
        pointerX={pointerX}
        pointerY={pointerY}
      />
      <VisualAsset
        className="pink-ticket"
        src="/assets/Pink-Ticket.png"
        width={250}
        height={100}
        delay={0.42}
        duration={5.5}
        idle={{ y: [0, -8, 0], rotate: [-1, 1, -1] }}
        parallax={{ x: 14, y: 10 }}
        pointerX={pointerX}
        pointerY={pointerY}
      />
      <VisualAsset
        className="neon-face"
        src="/assets/neon-face.png"
        width={130}
        height={130}
        delay={0.5}
        duration={4.8}
        idle={{ y: [0, -10, 0], rotate: [-2, 2, -2], scale: [1, 1.025, 1] }}
        parallax={{ x: 16, y: 12 }}
        pointerX={pointerX}
        pointerY={pointerY}
      />
      <VisualAsset
        className="cursor-sticker"
        src="/assets/cursor.png"
        width={180}
        height={180}
        delay={0.58}
        duration={5.2}
        idle={{ rotate: [0, 2, 0] }}
        parallax={{ x: 18, y: 14 }}
        pointerX={pointerX}
        pointerY={pointerY}
      />
      <VisualAsset
        className="yellow-x"
        src="/assets/yellow-x.png"
        width={110}
        height={110}
        delay={0.66}
        duration={5}
        idle={{ y: [0, -5, 0], rotate: [0, 8, 0] }}
        parallax={{ x: 10, y: 8 }}
        pointerX={pointerX}
        pointerY={pointerY}
      />
      <VisualAsset
        className="music-note"
        src="/assets/music-note.png"
        width={180}
        height={180}
        delay={0.74}
        duration={4.1}
        idle={{ y: [0, -10, 0], rotate: [-2, 2, -2], scale: [1, 1.03, 1] }}
        parallax={{ x: 14, y: 12 }}
        pointerX={pointerX}
        pointerY={pointerY}
      />
      <VisualAsset
        className="star-accent star-left"
        src="/assets/star.png"
        width={30}
        height={30}
        delay={0.9}
        duration={3.2}
        idle={{ scale: [0.9, 1.08, 0.9], rotate: [0, -8, 0] }}
        parallax={{ x: 7, y: 7 }}
        pointerX={pointerX}
        pointerY={pointerY}
      />
      <VisualAsset
        className="blue-picture blue-picture-left-top"
        src="/assets/blue-picture.png"
        width={130}
        height={130}
        delay={0.98}
        duration={4.4}
        idle={{ y: [0, -6, 0], rotate: [-2, 2, -2] }}
        parallax={{ x: 8, y: 8 }}
        pointerX={pointerX}
        pointerY={pointerY}
      />
    </div>
  );
}
