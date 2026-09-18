"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowRight,
  Code2,
  Menu,
  Music,
  Send,
  Sparkle,
  X,
} from "lucide-react";
import type { MouseEvent } from "react";
import { useEffect, useState } from "react";
import { assetPath } from "@/src/lib/paths";
import { useHydratedReducedMotion } from "./useHydratedReducedMotion";
import { useSound } from "./SoundProvider";

const navItems = [
  { label: "HOME", index: "01", href: "#work", Icon: Code2 },
  { label: "ABOUT", index: "02", href: "#about", Icon: Sparkle },
  { label: "PROJECTS", index: "03", href: "#projects", Icon: Music },
  { label: "CONTACT", index: "04", href: "#contact", Icon: Send },
];

const ease = [0.22, 1, 0.36, 1] as const;
const spring = { stiffness: 180, damping: 18, mass: 0.5 };
const waveformBars = Array.from({ length: 11 });
const MotionLink = motion.create(Link);

function supportsHover() {
  return window.matchMedia("(hover: hover) and (pointer: fine)").matches;
}

function scrollToPageTop() {
  const root = document.documentElement;
  const previousScrollBehavior = root.style.scrollBehavior;

  root.style.scrollBehavior = "auto";
  window.scrollTo({ top: 0, left: 0, behavior: "auto" });

  window.requestAnimationFrame(() => {
    root.style.scrollBehavior = previousScrollBehavior;
  });
}

export default function Header() {
  const isHome = usePathname() === "/";
  const prefersReducedMotion = useHydratedReducedMotion();
  const { isSoundOn, toggleSound } = useSound();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const soundX = useMotionValue(0);
  const soundY = useMotionValue(0);
  const smoothSoundX = useSpring(soundX, spring);
  const smoothSoundY = useSpring(soundY, spring);

  function handleSoundMouseMove(event: MouseEvent<HTMLButtonElement>) {
    if (prefersReducedMotion || !supportsHover()) return;

    const bounds = event.currentTarget.getBoundingClientRect();
    const relativeX = (event.clientX - bounds.left) / bounds.width - 0.5;
    const relativeY = (event.clientY - bounds.top) / bounds.height - 0.5;

    soundX.set(relativeX * 10);
    soundY.set(relativeY * 10);
  }

  function handleSoundMouseLeave() {
    soundX.set(0);
    soundY.set(0);
  }

  function handleTopLinkClick(event: MouseEvent<HTMLAnchorElement>) {
    if (!isHome) return;
    event.preventDefault();
    window.history.replaceState(null, "", window.location.pathname);
    setIsMenuOpen(false);
    scrollToPageTop();
  }

  function handleNavLinkClick(event: MouseEvent<HTMLAnchorElement>, href: string) {
    setIsMenuOpen(false);

    if (!isHome || href === "#work" || window.matchMedia("(min-width: 1101px)").matches) {
      return;
    }

    const target = document.querySelector<HTMLElement>(href);
    if (!target) return;

    event.preventDefault();
    window.history.replaceState(null, "", href);

    window.requestAnimationFrame(() => {
      const root = document.documentElement;
      const previousScrollBehavior = root.style.scrollBehavior;
      root.style.scrollBehavior = "auto";
      target.scrollIntoView({ block: "start", behavior: "auto" });
      window.requestAnimationFrame(() => {
        root.style.scrollBehavior = previousScrollBehavior;
      });
    });
  }

  useEffect(() => {
    document.body.classList.toggle("is-menu-open", isMenuOpen);

    return () => {
      document.body.classList.remove("is-menu-open");
    };
  }, [isMenuOpen]);

  return (
    <motion.header
      className="site-header"
      aria-label="Primary navigation"
      initial={isHome ? { opacity: 0, y: prefersReducedMotion ? 0 : -12 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease }}
    >
      <Link
        className="logo"
        href={isHome ? "#work" : "/"}
        aria-label="Back to top"
        onClick={handleTopLinkClick}
      >
        <Image
          className="logo-image"
          src={assetPath("/assets/MM. logo.png")}
          alt="MM."
          width={180}
          height={70}
          priority
        />
      </Link>

      <nav
        className={`primary-nav${isMenuOpen ? " is-open" : ""}`}
        id="primary-navigation"
      >
        {navItems.map(({ label, index, href, Icon }) => (
          <MotionLink
            className="nav-link"
            href={isHome ? href : `/${href}`}
            key={`${label}-${index}`}
            initial="rest"
            animate="rest"
            whileHover="hover"
            onClick={(event) => {
              if (href === "#work" && isHome) {
                handleTopLinkClick(event);
                return;
              }

              handleNavLinkClick(event, href);
            }}
          >
            <span className="nav-icon-badge" aria-hidden="true">
              <Icon size={22} strokeWidth={2.4} />
            </span>
            <span className="nav-label-window">
              <motion.span
                className="nav-label-stack"
                variants={{ rest: { y: "0%" }, hover: { y: "-50%" } }}
                transition={{ duration: 0.22, ease }}
              >
                <span>{label}</span>
                <span>{label}</span>
              </motion.span>
            </span>
            <motion.span
              className="nav-index"
              variants={{ rest: { x: 0 }, hover: { x: 0 } }}
            >
              [{index}]
            </motion.span>
            <motion.span
              className="nav-underline"
              variants={{ rest: { scaleX: 0 }, hover: { scaleX: 1 } }}
              transition={{ duration: 0.18, ease: "easeOut" }}
            />
            <span className="nav-mobile-arrow" aria-hidden="true">
              <ArrowRight size={28} strokeWidth={2.2} />
            </span>
          </MotionLink>
        ))}
      </nav>

      <div className="sound-control" aria-label="Sound status">
        <span>
          SOUND{" "}
          <span className="sound-state">[ {isSoundOn ? "ON" : "OFF"} ]</span>
        </span>
        <motion.button
          className={`sound-button${isSoundOn ? " is-active" : ""}`}
          type="button"
          aria-label={isSoundOn ? "Turn sound off" : "Turn sound on"}
          aria-pressed={isSoundOn}
          onClick={toggleSound}
          onMouseMove={handleSoundMouseMove}
          onMouseLeave={handleSoundMouseLeave}
          style={
            prefersReducedMotion
              ? undefined
              : { x: smoothSoundX, y: smoothSoundY }
          }
          animate={
            prefersReducedMotion || !isSoundOn
              ? undefined
              : { scale: [1, 1.04, 1] }
          }
          whileHover={prefersReducedMotion ? undefined : { scale: 1.06 }}
          transition={
            prefersReducedMotion || !isSoundOn
              ? undefined
              : { duration: 2.2, repeat: Infinity, ease: "easeInOut" }
          }
        >
          <span
            className={`sound-waveform${isSoundOn ? " is-active" : ""}`}
            aria-hidden="true"
          >
            {waveformBars.map((_, index) => (
              <span className="sound-waveform-bar" key={index} />
            ))}
          </span>
        </motion.button>
      </div>

      <button
        className="menu-button"
        type="button"
        aria-label={isMenuOpen ? "Close navigation" : "Open navigation"}
        aria-expanded={isMenuOpen}
        aria-controls="primary-navigation"
        onClick={() => setIsMenuOpen((current) => !current)}
      >
        {isMenuOpen ? <X size={24} strokeWidth={2.2} /> : <Menu size={25} strokeWidth={2.2} />}
      </button>
    </motion.header>
  );
}
