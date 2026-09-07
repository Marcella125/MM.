"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { assetPath } from "@/src/lib/paths";
import { useHydratedReducedMotion } from "./useHydratedReducedMotion";
import SectionLabel from "./SectionLabel";
import styles from "./ExperienceSection.module.css";

const ease = [0.22, 1, 0.36, 1] as const;

const entries = [
  { index: "01", kind: "Education", title: "USEK", role: "Computer Science", period: "2023 — 2026", art: "/assets/disk.png", copy: "A foundation in software engineering, systems thinking, and the technical craft behind the digital products I love to build." },
  { index: "02", kind: "Experience", title: "KLOUDR", role: "Full-Stack Developer", period: "2025", art: "/assets/headphones.png", copy: "Built an AI-powered product with React, FastAPI, Azure OpenAI, and Azure AI Search — spanning interfaces, APIs, and deployment." },
  { index: "03", kind: "Experience", title: "FEKRA MEDIA", role: "Web Developer", period: "2025 — 2026", art: "/assets/cursor.png", copy: "Created responsive full-stack websites with React, Next.js, Node.js, Python, and Shopify for real brands and real audiences." },
] as const;

export default function ExperienceSection() {
  const prefersReducedMotion = useHydratedReducedMotion();

  return (
    <section className={styles.section} id="journey" aria-labelledby="experience-heading">
      <motion.header className={styles.header} initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.5 }} transition={{ duration: 0.7, ease }}>
        <div>
          <SectionLabel>My journey</SectionLabel>
          <h2 id="experience-heading">Education <span>&amp;</span> Experience</h2>
        </div>
        <p className={styles.headerCopy}>The places that shaped how I think, design, and build.</p>
      </motion.header>

      <div className={styles.panels}>
        {entries.map((entry, position) => (
          <motion.article
            className={styles.panel}
            key={entry.index}
            initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 26 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.62, delay: prefersReducedMotion ? 0 : position * 0.08, ease }}
          >
            <div className={styles.cardTop}>
              <span className={styles.index}>{entry.index}</span>
              <span className={styles.kind}>{entry.kind}</span>
            </div>
            <div className={styles.art} aria-hidden="true">
              <Image src={assetPath(entry.art)} alt="" width={500} height={500} />
            </div>
            <div className={styles.cardContent}>
              <h3>{entry.title}</h3>
              <p className={styles.meta}>{entry.role} <i>•</i> {entry.period}</p>
              <p className={styles.description}>{entry.copy}</p>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
