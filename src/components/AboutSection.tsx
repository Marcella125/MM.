"use client";

import Image from "next/image";
import { motion, type MotionValue, useMotionValueEvent, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import { assetPath } from "@/src/lib/paths";
import SectionLabel from "./SectionLabel";
import { useHydratedReducedMotion } from "./useHydratedReducedMotion";
import styles from "./AboutSection.module.css";

const chapters = [
  {
    eyebrow: "Creative developer",
    title: ["I BUILD", "FOR THE WEB."],
    description: "Hi, I’m Marcella, a creative developer turning ideas into responsive, interactive experiences that look sharp, feel intuitive, and work beautifully.",
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

const transitions = [[0.18, 0.28], [0.48, 0.58], [0.78, 0.88]] as const;
const chapterImages = ["/assets/profile.jpeg", "/assets/usek.png", "/assets/kloudr.png", "/assets/fekra.png"] as const;

function smoothStep(value: number, start: number, end: number) {
  const t = Math.min(1, Math.max(0, (value - start) / (end - start)));
  return t * t * (3 - 2 * t);
}

function chapterPose(index: number, value: number) {
  const incoming = index === 0 ? 1 : smoothStep(value, transitions[index - 1][0], transitions[index - 1][1]);
  const outgoing = index === chapters.length - 1 ? 0 : smoothStep(value, transitions[index][0], transitions[index][1]);
  return { incoming, outgoing, opacity: incoming * (1 - outgoing) };
}

function chapterAt(value: number) {
  return transitions.reduce((chapter, [start, end]) => value >= (start + end) / 2 ? chapter + 1 : chapter, 0);
}

function ChapterVisual({ index, progress, active, reducedMotion }: {
  index: number;
  progress: MotionValue<number>;
  active: boolean;
  reducedMotion: boolean;
}) {
  const pose = useTransform(progress, (value) => chapterPose(index, value));
  const y = useTransform(pose, ({ incoming, outgoing }) => 24 * (1 - incoming) - 18 * outgoing);
  const scale = useTransform(pose, ({ incoming, outgoing }) => 1.025 - 0.025 * incoming - 0.035 * outgoing);
  const clipPath = useTransform(pose, ({ incoming }) => `inset(${(1 - incoming) * 100}% 0 0 0)`);
  const artworkY = useTransform(pose, ({ incoming, outgoing }) => 10 * (1 - incoming) - 10 * outgoing);
  const visualClasses = [styles.portraitScene, styles.usekScene, styles.kloudrScene, styles.fekraScene];

  return (
    <motion.div
      className={`${styles.visualScene} ${visualClasses[index]}`}
      data-active={active}
      style={{
        clipPath: reducedMotion ? "none" : clipPath,
        visibility: reducedMotion && !active ? "hidden" : "visible",
        opacity: reducedMotion ? active ? 1 : 0 : 1,
        y: reducedMotion ? 0 : y,
        scale: reducedMotion ? 1 : scale,
        zIndex: index + 1,
      }}
      aria-hidden="true"
    >
      {index === 0 && (
        <>
          <Image
            className={`${styles.portraitBackground} ${styles.desktopPortraitBackground}`}
            src={assetPath("/assets/projects%20bg.png")}
            alt=""
            fill
            sizes="(max-width: 700px) 100vw, 42vw"
            priority
          />
          <Image
            className={`${styles.portraitBackground} ${styles.mobilePortraitBackground}`}
            src={assetPath("/assets/mobile%20about%20me%20bg.png")}
            alt=""
            fill
            sizes="100vw"
            priority
          />
          <motion.div className={styles.portraitFrame} style={{ y: reducedMotion ? 0 : artworkY, rotate: -3 }}>
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
          </motion.div>
        </>
      )}
      {index > 0 && (
        <motion.div className={styles.artworkDepth} style={{ y: reducedMotion ? 0 : artworkY }}>
          <Image
            className={styles.chapterImage}
            src={assetPath(chapterImages[index])}
            alt=""
            fill
            sizes="(max-width: 700px) 100vw, 42vw"
          />
        </motion.div>
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
  const pose = useTransform(progress, (value) => chapterPose(index, value));
  const opacity = useTransform(pose, ({ opacity }) => opacity);
  const y = useTransform(pose, ({ incoming, outgoing }) => 32 * (1 - incoming) - 28 * outgoing);
  const scale = useTransform(pose, ({ incoming, outgoing }) => 1 - 0.02 * (1 - incoming) - 0.03 * outgoing);
  const titleY = useTransform(pose, ({ incoming, outgoing }) => 14 * (1 - incoming) - 10 * outgoing);
  const titleClip = useTransform(pose, ({ incoming, outgoing }) =>
    `inset(${(1 - incoming) * 100}% 0 ${outgoing * 100}% 0)`,
  );
  const stickerY = useTransform(pose, ({ outgoing }) => -12 * outgoing);

  return (
    <motion.article
      className={`${styles.contentScene} ${index === 0 ? styles.introContentScene : ""}`}
      style={{
        opacity: reducedMotion ? active ? 1 : 0 : opacity,
        y: reducedMotion ? 0 : y,
        scale: reducedMotion ? 1 : scale,
        zIndex: index + 1,
      }}
      aria-hidden={!active}
    >
      <div className={styles.sectionLabel}>ABOUT / THE STORY</div>
      <div className={styles.chapterOverline}>{chapter.eyebrow}</div>
      <motion.h3 className={styles.chapterTitle} style={{ clipPath: reducedMotion ? "none" : titleClip, y: reducedMotion ? 0 : titleY }}>
        <span>{chapter.title[0]}</span>
        <span>{chapter.title[1]}</span>
      </motion.h3>
      <p className={styles.chapterDescription}>{chapter.description}</p>
      <p className={styles.chapterDetail}>{chapter.detail}</p>
      <ul className={styles.tags} aria-label={`${chapter.eyebrow} skills and context`}>
        {chapter.tags.map((tag) => <li key={tag}>{tag}</li>)}
      </ul>
      {index === 0 && (
        <motion.div className={styles.stickerDepth} style={{ y: reducedMotion ? 0 : stickerY }}>
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
        </motion.div>
      )}
    </motion.article>
  );
}

function MobileChapterCard({ index, reducedMotion }: { index: number; reducedMotion: boolean }) {
  const chapter = chapters[index];
  const viewport = { once: true, amount: 0.18, margin: "0px 0px -8% 0px" } as const;

  return (
    <motion.article
      className={styles.mobileCard}
      aria-label={`${index + 1} of ${chapters.length}: ${chapter.eyebrow}`}
      initial={reducedMotion ? false : { opacity: 0, y: 54, scale: 0.975 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={viewport}
      transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div
        className={`${styles.mobileCardVisual} ${index === 0 ? styles.mobilePortraitVisual : ""}`}
        aria-hidden="true"
        initial={reducedMotion ? false : { scale: 1.08 }}
        whileInView={{ scale: 1 }}
        viewport={viewport}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      >
        {index === 0 ? (
          <>
            <Image
              className={styles.portraitBackground}
              src={assetPath("/assets/mobile%20about%20me%20bg.png")}
              alt=""
              fill
              sizes="calc(100vw - 36px)"
              priority
            />
            <div className={styles.mobilePortraitFrame}>
              <div className={styles.portraitPhoto}>
                <Image
                  className={styles.portraitImage}
                  src={assetPath(chapterImages[index])}
                  alt=""
                  fill
                  sizes="46vw"
                  priority
                />
              </div>
            </div>
          </>
        ) : (
          <Image
            className={styles.chapterImage}
            src={assetPath(chapterImages[index])}
            alt=""
            fill
            sizes="calc(100vw - 36px)"
          />
        )}
      </motion.div>

      <motion.div
        className={styles.mobileCardContent}
        initial={reducedMotion ? false : { opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={viewport}
        transition={{ duration: 0.62, delay: reducedMotion ? 0 : 0.12, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className={styles.chapterOverline}>{chapter.eyebrow}</div>
        <h3 className={styles.chapterTitle}>
          <span>{chapter.title[0]}</span>
          <span>{chapter.title[1]}</span>
        </h3>
        <p className={styles.chapterDescription}>{chapter.description}</p>
        <p className={styles.chapterDetail}>{chapter.detail}</p>
        <ul className={styles.tags} aria-label={`${chapter.eyebrow} skills and context`}>
          {chapter.tags.map((tag) => <li key={tag}>{tag}</li>)}
        </ul>
      </motion.div>
    </motion.article>
  );
}

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress: progress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  const [activeChapter, setActiveChapter] = useState(0);
  const reducedMotion = Boolean(useHydratedReducedMotion());

  useMotionValueEvent(progress, "change", (value) => {
    const nextChapter = chapterAt(value);
    setActiveChapter((current) => current === nextChapter ? current : nextChapter);
  });

  return (
    <section className={styles.section} id="about" aria-labelledby="about-heading" ref={sectionRef}>
      <header className={styles.mobileHeading}>
        <SectionLabel>About / the story</SectionLabel>
        <motion.h2
          id="about-heading"
          initial={reducedMotion ? false : { opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        >
          About <span>me.</span>
        </motion.h2>
      </header>
      <div className={styles.stage}>
        <div className={styles.visualPanel} aria-hidden="true">
          {chapters.map((chapter, index) => (
            <ChapterVisual
              key={chapter.eyebrow}
              index={index}
              progress={progress}
              active={activeChapter === index}
              reducedMotion={reducedMotion}
            />
          ))}
        </div>
        <div className={styles.contentPanel}>
          {chapters.map((chapter, index) => (
            <ChapterContent key={chapter.eyebrow} index={index} progress={progress} active={activeChapter === index} reducedMotion={reducedMotion} />
          ))}
        </div>
      </div>
      <div className={styles.mobileScroller} aria-label="About Marcella chapters">
        {chapters.map((chapter, index) => (
          <MobileChapterCard key={chapter.eyebrow} index={index} reducedMotion={reducedMotion} />
        ))}
      </div>
    </section>
  );
}
