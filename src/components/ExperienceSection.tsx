"use client";

import { Code2, GraduationCap, PanelsTopLeft } from "lucide-react";
import SectionLabel from "./SectionLabel";
import { StoryStep } from "./StoryScroll";
import styles from "./ExperienceSection.module.css";

const entries = [
  { index: "01", kind: "Education", title: "USEK", role: "Computer Science", period: "2023 — 2026", Icon: GraduationCap, copy: "A foundation in software engineering, systems thinking, and the technical craft behind the digital products I love to build." },
  { index: "02", kind: "Experience", title: "KLOUDR", role: "Full-Stack Developer", period: "2025", Icon: Code2, copy: "Built an AI-powered product with React, FastAPI, Azure OpenAI, and Azure AI Search — spanning interfaces, APIs, and deployment." },
  { index: "03", kind: "Experience", title: "FEKRA MEDIA", role: "Web Developer", period: "2025 — 2026", Icon: PanelsTopLeft, copy: "Developed responsive full-stack websites with React, Next.js, Node.js, Python, and Shopify." },
] as const;

type JourneyEntry = (typeof entries)[number];

function JourneyCard({ entry, index }: { entry: JourneyEntry; index: number }) {
  const start = 0.15 + index * 0.24;

  return (
    <StoryStep
      className={styles.panelReveal}
      start={start}
      end={start + 0.16}
      lift={28}
    >
      <article className={styles.panel}>
        <div className={styles.cardTop}>
          <span className={styles.index}>{entry.index}</span>
          <span className={styles.kind}>{entry.kind}</span>
        </div>
        <div className={styles.cardContent}>
          <h3>{entry.title}</h3>
          <p className={styles.meta}>{entry.role}</p>
          <p className={styles.description}>{entry.copy}</p>
        </div>
        <span className={styles.date}>{entry.period}</span>
        <div className={styles.art} aria-hidden="true">
          <entry.Icon strokeWidth={1.5} />
        </div>
      </article>
    </StoryStep>
  );
}

export default function ExperienceSection() {
  return (
    <section className={styles.section} id="journey" aria-labelledby="experience-heading">
      <StoryStep start={0.01} end={0.12} lift={20}>
        <header className={styles.header}>
          <div>
            <SectionLabel>My journey</SectionLabel>
            <h2 id="experience-heading">Education <span>&amp;</span> Experience</h2>
          </div>
          <p className={styles.headerCopy}>The places that shaped how I learn, solve problems, and build.</p>
        </header>
      </StoryStep>

      <div className={styles.panels}>
        {entries.map((entry, index) => (
          <JourneyCard entry={entry} index={index} key={entry.index} />
        ))}
      </div>
    </section>
  );
}
