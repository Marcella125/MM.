"use client";

import { motion } from "framer-motion";
import { useHydratedReducedMotion } from "./useHydratedReducedMotion";
import styles from "./PortfolioSections.module.css";

const ease = [0.22, 1, 0.36, 1] as const;

const projects = [
  {
    index: "01",
    title: "Rushd Center",
    type: "Full-stack app",
    copy: "A smart search experience built around retrieval, clean UX, and fast answers.",
    tags: ["React", "FastAPI", "Azure AI"],
  },
  {
    index: "02",
    title: "Kira",
    type: "Web experience",
    copy: "A polished storefront concept focused on responsive pages and clear product flow.",
    tags: ["Next.js", "Shopify", "UI"],
  },
  {
    index: "03",
    title: "Rong Xing",
    type: "Identity site",
    copy: "A personal web system with motion, custom visuals, and expressive interactions.",
    tags: ["Motion", "Design", "Next.js"],
  },
  {
    index: "04",
    title: "Femi",
    type: "Interaction study",
    copy: "Small experiments exploring tactile components, playful states, and visual systems.",
    tags: ["React", "UX", "Prototype"],
  },
] satisfies Array<{
  index: string;
  title: string;
  type: string;
  copy: string;
  tags: string[];
}>;

export default function ProjectsSection() {
  const prefersReducedMotion = useHydratedReducedMotion();

  return (
    <section className={styles.section} id="projects" aria-labelledby="projects-heading">
      <div className={styles.inner}>
      <div className={styles.headingRow}>
        <motion.h2
          className={styles.title}
          id="projects-heading"
          initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease }}
        >
          A few things<br /><span>I’ve built.</span>
        </motion.h2>
        <p className={styles.lede}>
          From thoughtful interfaces to full-stack applications. A selection of
          projects where design and development come together.
        </p>
      </div>

      <div className={styles.projectGrid}>
        {projects.map((project) => (
          <motion.article
            className={styles.project}
            key={project.index}
            initial={{
              opacity: 0,
              y: prefersReducedMotion ? 0 : 24,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
              transition: { duration: 0.58, ease },
            }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.24, ease }}
          >
            <div className={styles.projectTop}>
              <span className={styles.projectNumber}>{project.index}</span>
              <span className={styles.label}>{project.type}</span>
            </div>
              <h3>{project.title}</h3>
              <p>{project.copy}</p>
            <div
              className={styles.tags}
              aria-label={`${project.title} technologies`}
            >
              {project.tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
          </motion.article>
        ))}
      </div>
      </div>
    </section>
  );
}
