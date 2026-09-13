"use client";

import Image from "next/image";
import { motion, type MotionValue, useMotionValue, useMotionValueEvent, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { assetPath } from "@/src/lib/paths";
import { useStoryScrollProgress } from "./StoryScroll";
import { useHydratedReducedMotion } from "./useHydratedReducedMotion";
import styles from "./AboutSection.module.css";

const chapters = [
  {
    eyebrow: "Hi, I’m Marcella.",
    title: ["I BUILD", "FOR THE WEB."],
    description: "Turning ideas into responsive, interactive experiences designed to look sharp, feel intuitive, and work beautifully.",
    detail: "COMPUTER SCIENCE GRADUATE · LEBANON",
    tags: ["CREATIVE DEV", "FRONTEND", "WEB"],
  },
  {
    eyebrow: "The foundation",
    title: ["EDUCATION", "AT USEK."],
    description: "A B.Sc. in Computer Science at USEK built my foundation in software engineering, systems thinking, and the craft behind thoughtful digital products.",
    detail: "USEK · 2023 — 2026",
    tags: ["COMPUTER SCIENCE", "SOFTWARE", "SYSTEMS"],
  },
  {
    eyebrow: "The product",
    title: ["BUILDING", "AT KLOUDR."],
    description: "At Kloudr, I helped build Kira, an AI knowledge assistant, working across React interfaces, FastAPI services, Azure OpenAI, and AI Search.",
    detail: "KLOUDR · FULL-STACK DEVELOPER",
    tags: ["REACT", "FASTAPI", "AZURE AI"],
  },
  {
    eyebrow: "The craft",
    title: ["CREATING", "AT FEKRA."],
    description: "At Fekra Media Agency, I developed responsive websites and full-stack features, from interface implementation through testing and delivery.",
    detail: "FEKRA MEDIA AGENCY · WEB DEVELOPER",
    tags: ["NEXT.JS", "NODE.JS", "SHOPIFY"],
  },
] as const;

const visualFadeStops = [
  [0, 0.125, 0.208, 1],
  [0, 0.125, 0.208, 0.458, 0.542, 1],
  [0, 0.458, 0.542, 0.792, 0.875, 1],
  [0, 0.792, 0.875, 1],
];
const contentFadeStops = [
  [0, 0.125, 0.178, 1],
  [0, 0.158, 0.208, 0.458, 0.512, 1],
  [0, 0.488, 0.542, 0.792, 0.845, 1],
  [0, 0.825, 0.875, 1],
];
const fadeValues = [
  [1, 1, 0, 0],
  [0, 0, 1, 1, 0, 0],
  [0, 0, 1, 1, 0, 0],
  [0, 0, 1, 1],
];
const visualClipValues = [
  ["inset(0% 0 0 0)", "inset(0% 0 0 0)", "inset(0% 0 0 0)", "inset(0% 0 0 0)"],
  ["inset(100% 0 0 0)", "inset(100% 0 0 0)", "inset(0% 0 0 0)", "inset(0% 0 0 0)", "inset(0% 0 0 0)", "inset(0% 0 0 0)"],
  ["inset(100% 0 0 0)", "inset(100% 0 0 0)", "inset(0% 0 0 0)", "inset(0% 0 0 0)", "inset(0% 0 0 0)", "inset(0% 0 0 0)"],
  ["inset(100% 0 0 0)", "inset(100% 0 0 0)", "inset(0% 0 0 0)", "inset(0% 0 0 0)"],
];
const visualScaleValues = [
  [1, 1, 1.045, 1.045],
  [1.035, 1.035, 1, 1, 1.045, 1.045],
  [1.035, 1.035, 1, 1, 1.045, 1.045],
  [1.035, 1.035, 1, 1],
];
const visualBlurValues = [
  ["blur(0px)", "blur(0px)", "blur(7px)", "blur(7px)"],
  ["blur(5px)", "blur(5px)", "blur(0px)", "blur(0px)", "blur(7px)", "blur(7px)"],
  ["blur(5px)", "blur(5px)", "blur(0px)", "blur(0px)", "blur(7px)", "blur(7px)"],
  ["blur(5px)", "blur(5px)", "blur(0px)", "blur(0px)"],
];
const contentOffsetValues = [
  [0, 0, -34, -34],
  [34, 34, 0, 0, -34, -34],
  [34, 34, 0, 0, -34, -34],
  [34, 34, 0, 0],
];

function ChapterVisual({ index, progress, active, animateTransition, reducedMotion }: {
  index: number;
  progress: MotionValue<number>;
  active: boolean;
  animateTransition: boolean;
  reducedMotion: boolean;
}) {
  const clipPath = useTransform(progress, visualFadeStops[index], visualClipValues[index]);
  const scale = useTransform(progress, visualFadeStops[index], visualScaleValues[index]);
  const filter = useTransform(progress, visualFadeStops[index], visualBlurValues[index]);
  const visualClasses = [styles.portraitScene, styles.usekScene, styles.kloudrScene, styles.fekraScene];

  return (
    <motion.div
      className={`${styles.visualScene} ${visualClasses[index]}`}
      style={{
        clipPath: animateTransition ? clipPath : "none",
        visibility: animateTransition || active ? "visible" : "hidden",
        scale: animateTransition && !reducedMotion ? scale : 1,
        filter: animateTransition && !reducedMotion ? filter : "none",
        zIndex: index + 1,
        backgroundImage: index === 0 ? `url("${assetPath("/assets/projects%20bg.png")}")` : undefined,
      }}
      aria-hidden="true"
    >
      {index === 0 && (
        <div className={styles.portraitFrame}>
          <div className={styles.portraitPhoto}>
            <Image
              className={styles.portraitImage}
              src={assetPath("/assets/profile.jpeg")}
              alt=""
              fill
              sizes="(max-width: 700px) 62vw, 31vw"
              priority
            />
          </div>
        </div>
      )}
      {index === 1 && (
        <Image
          className={styles.chapterImage}
          src={assetPath("/assets/usek.png")}
          alt=""
          fill
          sizes="(max-width: 700px) 100vw, 42vw"
        />
      )}
      {index === 2 && (
        <Image
          className={styles.chapterImage}
          src={assetPath("/assets/kloudr.png")}
          alt=""
          fill
          sizes="(max-width: 700px) 100vw, 42vw"
        />
      )}
      {index === 3 && (
        <Image
          className={styles.chapterImage}
          src={assetPath("/assets/fekra.png")}
          alt=""
          fill
          sizes="(max-width: 700px) 100vw, 42vw"
        />
      )}
    </motion.div>
  );
}

function ChapterContent({ index, progress, active, reducedMotion }: {
  index: number;
  progress: MotionValue<number>;
  active: boolean;
  reducedMotion: boolean;
}) {
  const chapter = chapters[index];
  const opacity = useTransform(progress, contentFadeStops[index], fadeValues[index]);
  const y = useTransform(progress, contentFadeStops[index], contentOffsetValues[index]);
  const filter = useTransform(opacity, [0, 1], ["blur(7px)", "blur(0px)"]);

  return (
    <motion.article
      className={`${styles.contentScene} ${index === 0 ? styles.introContentScene : ""}`}
      style={{ opacity, y: reducedMotion ? 0 : y, filter: reducedMotion ? "none" : filter }}
      aria-hidden={!active}
    >
      <div className={styles.sectionLabel}>ABOUT / THE STORY</div>
      <div className={`${styles.chapterOverline} ${index === 0 ? styles.introGreeting : ""}`}>
        {index === 0 ? <>Hi, I’m <span className={styles.marcellaName}>Marcella.</span></> : chapter.eyebrow}
      </div>
      <h3 className={styles.chapterTitle}>
        <span>{chapter.title[0]}</span>
        <span>{chapter.title[1]}</span>
      </h3>
      <p className={styles.chapterDescription}>{chapter.description}</p>
      <p className={styles.chapterDetail}>{chapter.detail}</p>
      <ul className={styles.tags} aria-label={`${chapter.eyebrow} skills and context`}>
        {chapter.tags.map((tag) => <li key={tag}>{tag}</li>)}
      </ul>
      {index === 0 && (
        <div className={styles.introStickers} aria-hidden="true">
          {[
            { name: "a1.png", width: 200, height: 201 },
            { name: "a2.png", width: 266, height: 244 },
            { name: "a3.png", width: 337, height: 423 },
            { name: "a4.png", width: 137, height: 153 },
            { name: "a5.png", width: 222, height: 206 },
          ].map((sticker) => (
            <Image
              key={sticker.name}
              src={assetPath(`/assets/About%20Stickers/${sticker.name}`)}
              alt=""
              width={sticker.width}
              height={sticker.height}
            />
          ))}
        </div>
      )}
    </motion.article>
  );
}

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const mobileTrackRef = useRef<HTMLDivElement>(null);
  const desktopProgress = useStoryScrollProgress();
  const { scrollYProgress: mobileProgress } = useScroll({ target: mobileTrackRef, offset: ["start start", "end end"] });
  const { scrollYProgress: entryProgress } = useScroll({ target: sectionRef, offset: ["start end", "start start"] });
  const { scrollYProgress: exitProgress } = useScroll({ target: sectionRef, offset: ["end end", "end start"] });
  const entryOpacity = useTransform(entryProgress, [0, 0.5, 1], [0, 0, 1]);
  const entryScale = useTransform(entryProgress, [0, 1], [0.965, 1]);
  const exitOpacity = useTransform(exitProgress, [0, 0.08, 0.7, 1], [1, 1, 0, 0]);
  const mobileStageOpacity = useTransform(() => entryOpacity.get() * exitOpacity.get());
  const progress = useMotionValue(0);
  const [activeChapter, setActiveChapter] = useState(0);
  const [desktopLayout, setDesktopLayout] = useState(false);
  const reducedMotion = Boolean(useHydratedReducedMotion());

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1101px)");
    let animationFrame = 0;
    let userScrollIntentUntil = 0;

    const syncLayout = () => {
      setDesktopLayout(desktop.matches);
    };

    const markUserScrollIntent = (duration = 300) => {
      userScrollIntentUntil = performance.now() + duration;
    };

    const handleWheelScrollIntent = () => {
      markUserScrollIntent();
    };

    const handleTouchScrollIntent = () => {
      markUserScrollIntent(1000);
    };

    const handleScrollKeyIntent = (event: KeyboardEvent) => {
      if (["ArrowDown", "ArrowUp", "PageDown", "PageUp", "Home", "End", " "].includes(event.key)) {
        markUserScrollIntent();
      }
    };

    const syncProgressAfterScroll = () => {
      if (performance.now() > userScrollIntentUntil) return;

      cancelAnimationFrame(animationFrame);
      animationFrame = requestAnimationFrame(() => {
        progress.set(desktop.matches ? desktopProgress.get() : mobileProgress.get());
      });
    };

    desktop.addEventListener("change", syncLayout);
    window.addEventListener("wheel", handleWheelScrollIntent, { passive: true });
    window.addEventListener("touchstart", handleTouchScrollIntent, { passive: true });
    window.addEventListener("touchmove", handleTouchScrollIntent, { passive: true });
    window.addEventListener("keydown", handleScrollKeyIntent);
    window.addEventListener("scroll", syncProgressAfterScroll, { passive: true });
    syncLayout();

    return () => {
      cancelAnimationFrame(animationFrame);
      desktop.removeEventListener("change", syncLayout);
      window.removeEventListener("wheel", handleWheelScrollIntent);
      window.removeEventListener("touchstart", handleTouchScrollIntent);
      window.removeEventListener("touchmove", handleTouchScrollIntent);
      window.removeEventListener("keydown", handleScrollKeyIntent);
      window.removeEventListener("scroll", syncProgressAfterScroll);
    };
  }, [desktopProgress, mobileProgress, progress]);

  useMotionValueEvent(progress, "change", (value) => {
    const nextChapter = Math.min(3, Math.max(0, Math.round(value * 3)));
    setActiveChapter((current) => current === nextChapter ? current : nextChapter);
  });

  return (
    <section className={styles.section} id="about" aria-labelledby="about-heading" ref={sectionRef}>
      <h2 className={styles.srOnly} id="about-heading">About Marcella Moussa</h2>
      <div className={styles.mobileTrack} ref={mobileTrackRef} aria-hidden="true" />
      <motion.div
        className={styles.stage}
        style={{
          opacity: desktopLayout ? 1 : mobileStageOpacity,
          scale: desktopLayout || reducedMotion ? 1 : entryScale,
        }}
      >
        <div className={styles.visualPanel} aria-hidden="true">
          {chapters.map((chapter, index) => (
            <ChapterVisual
              key={chapter.eyebrow}
              index={index}
              progress={progress}
              active={activeChapter === index}
              animateTransition={desktopLayout}
              reducedMotion={reducedMotion}
            />
          ))}
        </div>
        <div className={styles.contentPanel}>
          {chapters.map((chapter, index) => (
            <ChapterContent key={chapter.eyebrow} index={index} progress={progress} active={activeChapter === index} reducedMotion={reducedMotion} />
          ))}
        </div>
      </motion.div>
    </section>
  );
}
