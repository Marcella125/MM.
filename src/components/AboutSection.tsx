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
const visualOffsetValues = [
  [0, 0, -36, -36],
  [36, 36, 0, 0, -36, -36],
  [36, 36, 0, 0, -36, -36],
  [36, 36, 0, 0],
];

function ChapterVisual({ index, progress, reducedMotion }: {
  index: number;
  progress: MotionValue<number>;
  reducedMotion: boolean;
}) {
  const opacity = useTransform(progress, visualFadeStops[index], fadeValues[index]);
  const offset = useTransform(progress, visualFadeStops[index], visualOffsetValues[index]);
  const scale = useTransform(opacity, [0, 1], [1.075, 1]);
  const filter = useTransform(opacity, [0, 1], ["blur(12px)", "blur(0px)"]);
  const visualClasses = [styles.portraitScene, styles.usekScene, styles.kloudrScene, styles.fekraScene];

  return (
    <motion.div
      className={`${styles.visualScene} ${visualClasses[index]}`}
      style={{
        opacity,
        y: reducedMotion ? 0 : offset,
        scale: reducedMotion ? 1 : scale,
        filter: reducedMotion ? "none" : filter,
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
  const y = useTransform(opacity, [0, 1], [24, 0]);
  const filter = useTransform(opacity, [0, 1], ["blur(7px)", "blur(0px)"]);

  return (
    <motion.article
      className={styles.contentScene}
      style={{ opacity, y: reducedMotion ? 0 : y, filter: reducedMotion ? "none" : filter }}
      aria-hidden={!active}
    >
      <div className={styles.sectionLabel}>ABOUT / THE STORY</div>
      <div className={`${styles.chapterOverline} ${index === 0 ? styles.introGreeting : ""}`}>{chapter.eyebrow}</div>
      <h3 className={styles.chapterTitle}>
        <span>{chapter.title[0]}</span>
        <span>{chapter.title[1]}</span>
      </h3>
      <p className={styles.chapterDescription}>{chapter.description}</p>
      <p className={styles.chapterDetail}>{chapter.detail}</p>
      <ul className={styles.tags} aria-label={`${chapter.eyebrow} skills and context`}>
        {chapter.tags.map((tag) => <li key={tag}>{tag}</li>)}
      </ul>
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
    const sync = () => {
      setDesktopLayout(desktop.matches);
      progress.set(desktop.matches ? desktopProgress.get() : mobileProgress.get());
    };
    const unsubscribeDesktop = desktopProgress.on("change", sync);
    const unsubscribeMobile = mobileProgress.on("change", sync);
    desktop.addEventListener("change", sync);
    sync();
    return () => {
      unsubscribeDesktop();
      unsubscribeMobile();
      desktop.removeEventListener("change", sync);
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
            <ChapterVisual key={chapter.eyebrow} index={index} progress={progress} reducedMotion={reducedMotion} />
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
