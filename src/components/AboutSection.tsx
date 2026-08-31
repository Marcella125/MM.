"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { assetPath } from "@/src/lib/paths";
import { useHydratedReducedMotion } from "./useHydratedReducedMotion";

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
    <section className="about-section" id="about" aria-labelledby="about-heading">
      <motion.div
        className="about-marquee"
        aria-hidden="true"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{ duration: 0.55, ease }}
      >
        <motion.div className="about-marquee-track">
          <span>ABOUT ME</span>
        </motion.div>
      </motion.div>

      <div className="about-shell">
        <motion.div
          className="about-copy"
          initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease }}
        >
          <div className="about-title-row">
            <h2 className="about-title" id="about-heading">
              Bringing <span>design</span> and <span>development</span> together.
              <Image
                className="about-heading-star"
                src={assetPath("/assets/black%20star.png")}
                alt=""
                width={96}
                height={96}
                aria-hidden="true"
              />
            </h2>
            <Image
              className="about-heading-smiley"
              src={assetPath("/assets/pink%20smiley.png")}
              alt=""
              width={120}
              height={120}
              aria-hidden="true"
            />
          </div>
          <p className="about-lede">
            <mark>Hi!</mark> I am Marcella, a Computer Science graduate who
            enjoys bringing design and development together. I love creating
            digital experiences that feel intuitive, expressive, and a little
            unexpected.
          </p>
        </motion.div>

        <motion.div
          className="about-visual-board"
          initial={{ opacity: 0, rotate: prefersReducedMotion ? 0 : -2, y: prefersReducedMotion ? 0 : 24 }}
          whileInView={{ opacity: 1, rotate: 0, y: 0 }}
          viewport={{ once: true, amount: 0.28 }}
          transition={{ duration: 0.65, ease }}
          aria-hidden="true"
        >
          <motion.div
            className="about-polaroid about-polaroid-main"
            animate={prefersReducedMotion ? undefined : { y: [0, -10, 0], rotate: [-2, 1, -2] }}
            transition={
              prefersReducedMotion
                ? undefined
                : { duration: 6, repeat: Infinity, ease: "easeInOut" }
            }
          >
            <Image
              src={assetPath("/assets/image%201%20about.png")}
              alt=""
              width={360}
              height={360}
            />
          </motion.div>
          <motion.div
            className="about-polaroid about-polaroid-secondary"
            animate={prefersReducedMotion ? undefined : { y: [0, 8, 0], rotate: [5, 2, 5] }}
            transition={
              prefersReducedMotion
                ? undefined
                : { duration: 5.4, repeat: Infinity, ease: "easeInOut" }
            }
          >
            <Image
              src={assetPath("/assets/blue-picture.png")}
              alt=""
              width={260}
              height={260}
            />
          </motion.div>
          <Image
            className="about-sticker about-sticker-star"
            src={assetPath("/assets/star.png")}
            alt=""
            width={46}
            height={46}
          />
        </motion.div>

        <motion.div
          className="about-card-stage"
          id="journey"
        >
          {notes.map((note) => (
            <motion.article
              className="about-note-card"
              key={note.index}
              initial={{ opacity: 0, x: prefersReducedMotion ? 0 : -18 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, amount: 0.38 }}
              transition={{ duration: 0.58, ease }}
              whileHover={
                prefersReducedMotion
                  ? undefined
                  : {
                      x: 8,
                      transition: { duration: 0.22, ease: "easeOut" },
                    }
              }
            >
              <span className="about-note-index">{note.index}</span>
              <div className="about-note-content">
                <h3>{note.title}</h3>
                <div className="about-note-meta">
                  <span>{note.role}</span>
                  <span>{note.period}</span>
                  <span>{note.location}</span>
                </div>
                <p>{note.copy}</p>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
