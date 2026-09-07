"use client";

import { motion } from "framer-motion";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { useHydratedReducedMotion } from "./useHydratedReducedMotion";
import styles from "./AboutSection.module.css";

const ease = [0.22, 1, 0.36, 1] as const;

const notes = [
  {
    index: "01",
    title: "USEK",
    role: "Bachelor of Science in Computer Science",
    period: "Jan 2023 - May 2026",
    location: "Kaslik, Lebanon",
    copy: "Studied software engineering, systems thinking, and the technical foundations behind the products I now design and build.",
  },
  {
    index: "02",
    title: "Kloudr",
    role: "Full-Stack Developer Intern",
    period: "Jun 2025 - Aug 2025",
    location: "Beirut",
    copy: "Built an AI-powered web application using React, FastAPI, Azure OpenAI, and Azure AI Search, from backend APIs and interface development to cloud deployment.",
  },
  {
    index: "03",
    title: "Fekra Media Agency",
    role: "Web Developer Intern",
    period: "Nov 2025 - Jan 2026",
    location: "Beirut",
    copy: "Built and maintained full-stack websites using React, Next.js, Node.js, and Python; worked with Shopify; designed responsive interfaces; and contributed to digital communication workflows.",
  },
  {
    index: "04",
    title: "Off-screen",
    role: "Creative Reset",
    period: "Always on",
    location: "Where inspiration shows up",
    copy: "Music playing, camera nearby, hiking when the weather allows, and finding inspiration in places that were not part of the plan.",
  },
];

export default function AboutSection() {
  const prefersReducedMotion = useHydratedReducedMotion();

  return (
    <section className={styles.section} id="about" aria-labelledby="about-heading">
      <div className={styles.layout}>
        <motion.div
          className={styles.intro}
          initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease }}
        >
          <div>
            <p className={styles.eyebrow}>Hi, I’m Marcella.</p>
            <h2 className={styles.title} id="about-heading">
              A creative eye.<br />
              <span>A developer’s<br />mind.</span>
            </h2>
          </div>
          <p className={styles.lede}>
            I am a Computer Science graduate who enjoys bringing design and
            development together. I love creating
            digital experiences that feel intuitive, expressive, and a little
            unexpected.
          </p>
          <aside className={styles.manifesto} aria-labelledby="approach-heading">
            <div className={styles.manifestoHeader}>
              <h3 className={styles.label} id="approach-heading">How I approach my work</h3>
              <ArrowUpRight aria-hidden="true" />
            </div>
            <p className={styles.manifestoStatement}>
              Thoughtfully designed.<br />
              <span>Carefully built.</span>
            </p>
            <p className={styles.manifestoCopy}>
              I bring ideas to life through code, with an eye for the details
              that make an experience feel right.
            </p>
            <div className={styles.manifestoFooter}>
              <span>Design meets development</span>
              <span aria-hidden="true">&lt;/&gt;</span>
            </div>
          </aside>
        </motion.div>

        <div className={styles.journey} id="journey" aria-labelledby="journey-heading">
          <div className={styles.journeyHeader}>
            <h3 id="journey-heading">The journey so far</h3>
            <ArrowDownRight aria-hidden="true" />
          </div>
          {notes.slice(0, 3).map((note) => (
            <motion.article
              className={styles.entry}
              key={note.index}
              initial={{ opacity: 0, x: prefersReducedMotion ? 0 : -18 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.58, ease }}
            >
              <span className={styles.index}>{note.index}</span>
              <div className={styles.entryContent}>
                <div className={styles.entryTop}>
                  <span>{note.index === "01" ? "Education" : "Experience"}</span>
                  <span>{note.period}</span>
                </div>
                <h4>{note.title}</h4>
                <div className={styles.role}>{note.role}</div>
                <span className={styles.location}>{note.location}</span>
                <p>{note.copy}</p>
              </div>
            </motion.article>
          ))}
          <aside className={styles.offscreen} aria-labelledby="offscreen-heading">
            <span className={styles.label}>Away from the keyboard</span>
            <h3 id="offscreen-heading">{notes[3].title} <span aria-hidden="true">✳</span></h3>
            <p>{notes[3].copy}</p>
            <ul className={styles.interests} aria-label="Interests">
              <li>Music</li><li>Photography</li><li>Hiking</li>
            </ul>
          </aside>
        </div>
      </div>
    </section>
  );
}
