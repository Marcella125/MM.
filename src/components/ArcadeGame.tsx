"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import dynamic from "next/dynamic";
import Image from "next/image";
import { X } from "lucide-react";
import { assetPath } from "@/src/lib/paths";
import styles from "./ArcadeGame.module.css";

const TetrisGame = dynamic(() => import("./tetris/TetrisGame"), {
  ssr: false,
  loading: () => <div className={styles.loading} role="status">LOADING GAME...</div>,
});

export default function ArcadeGame() {
  const [open, setOpen] = useState(false);
  const openerRef = useRef<HTMLElement | null>(null);
  const exitRef = useRef<HTMLButtonElement>(null);
  const scrollPositionRef = useRef(0);
  const bodyStyleRef = useRef<{ position: string; top: string; width: string; overflow: string; rootOverflow: string } | null>(null);

  useEffect(() => {
    const onOpenArcade = () => {
      openerRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      setOpen(true);
    };
    window.addEventListener("portfolio:open-arcade", onOpenArcade);
    let hashTimeout: number | undefined;
    if (window.location.hash === "#arcade") {
      window.history.replaceState(null, "", window.location.pathname);
      hashTimeout = window.setTimeout(onOpenArcade, 0);
    }
    return () => {
      window.removeEventListener("portfolio:open-arcade", onOpenArcade);
      if (hashTimeout !== undefined) window.clearTimeout(hashTimeout);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    scrollPositionRef.current = window.scrollY;
    bodyStyleRef.current = {
      position: document.body.style.position,
      top: document.body.style.top,
      width: document.body.style.width,
      overflow: document.body.style.overflow,
      rootOverflow: document.documentElement.style.overflow,
    };
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollPositionRef.current}px`;
    document.body.style.width = "100%";
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    exitRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      const previous = bodyStyleRef.current;
      if (previous) {
        document.body.style.position = previous.position;
        document.body.style.top = previous.top;
        document.body.style.width = previous.width;
        document.body.style.overflow = previous.overflow;
        document.documentElement.style.overflow = previous.rootOverflow;
      }
      window.scrollTo({ top: scrollPositionRef.current, left: 0, behavior: "auto" });
      window.requestAnimationFrame(() => openerRef.current?.focus());
    };
  }, [open]);

  const close = () => {
    setOpen(false);
  };

  const dialog = open ? (
    <section className={styles.experience} role="dialog" aria-modal="true" aria-label="Tetris by Mars">
      <header className={styles.topbar}>
        <Image
          className={styles.logo}
          src={assetPath("/assets/MM. logo.png")}
          alt="MM."
          width={180}
          height={70}
          priority
        />
        <Image
          className={styles.mobileBrand}
          src={assetPath("/assets/tetris x mars logo mobile.png")}
          alt="Tetris × Mars"
          width={2172}
          height={724}
          priority
        />
        <button ref={exitRef} className={styles.exitButton} type="button" onClick={close}>
          EXIT GAME <span>[ ESC ]</span> <X aria-hidden="true" />
        </button>
      </header>
      <div className={styles.gameArea}>
        <TetrisGame />
      </div>
    </section>
  ) : null;

  return dialog && typeof document !== "undefined" ? createPortal(dialog, document.body) : null;
}
