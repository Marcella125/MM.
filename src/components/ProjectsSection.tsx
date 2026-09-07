"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useHydratedReducedMotion } from "./useHydratedReducedMotion";
import SectionLabel from "./SectionLabel";
import styles from "./PortfolioSections.module.css";

const ease = [0.22, 1, 0.36, 1] as const;

const projects = [
  {
    index: "01",
    mark: "RC",
    title: "Rushd Center",
    type: "Full-stack app",
    copy: "A smart search experience built around retrieval, clean UX, and fast answers.",
    tags: ["React", "FastAPI", "Azure AI"],
  },
  {
    index: "02",
    mark: "K",
    title: "Kira",
    type: "Web experience",
    copy: "A polished storefront concept focused on responsive pages and a clear product journey.",
    tags: ["Next.js", "Shopify", "UI"],
  },
  {
    index: "03",
    mark: "RX",
    title: "Rong Xing",
    type: "Identity site",
    copy: "A personal web system with expressive motion, custom visuals, and tactile interactions.",
    tags: ["Motion", "Design", "Next.js"],
  },
  {
    index: "04",
    mark: "FM",
    title: "Femi",
    type: "Interaction study",
    copy: "Playful experiments exploring responsive components, visual systems, and digital texture.",
    tags: ["React", "UX", "Prototype"],
  },
] as const;

export default function ProjectsSection() {
  const prefersReducedMotion = useHydratedReducedMotion();

  return (
    <section className={styles.projectsSection} id="projects" aria-labelledby="projects-heading">
      <div className={styles.inner}>
        <motion.header
          className={styles.sectionHeading}
          initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.65, ease }}
        >
          <div>
            <SectionLabel>Selected work</SectionLabel>
            <h2 className={styles.title} id="projects-heading">
              Things I&apos;ve<br /><span>built.</span>
            </h2>
          </div>
          <p className={styles.lede}>
            Digital products where development, interaction, and visual direction work as one system.
          </p>
        </motion.header>

        <div className={styles.projectGrid}>
          {projects.map((project, position) => (
            <motion.article
              className={styles.project}
              key={project.index}
              initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 34 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.18 }}
              transition={{ duration: 0.68, delay: prefersReducedMotion ? 0 : position * 0.07, ease }}
            >
              <div className={styles.projectTop}>
                <span className={styles.projectNumber}>{project.index}</span>
                <span className={styles.projectType}>{project.type}</span>
                <ArrowUpRight aria-hidden="true" />
              </div>

              <div className={styles.projectVisual} aria-hidden="true">
                <span className={styles.projectMark}>{project.mark}</span>
                <span className={styles.orbit} />
                <span className={styles.pixelDot} />
              </div>

              <div className={styles.projectContent}>
                <h3>{project.title}</h3>
                <p>{project.copy}</p>
                <div className={styles.tags} aria-label={`${project.title} technologies`}>
                  {project.tags.map((tag) => <span key={tag}>{tag}</span>)}
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
