"use client";

import { motion } from "framer-motion";
import SectionLabel from "./SectionLabel";
import SectionHeadingReveal from "./SectionHeadingReveal";
import { useHydratedReducedMotion } from "./useHydratedReducedMotion";
import Link from "next/link";
import styles from "./PortfolioSections.module.css";

type Project = {
  index: string;
  slug: string;
  title: string;
  type: string;
  copy: string;
  tags: readonly string[];
  exploreHref: string;
  website?: string;
};

const projects: readonly Project[] = [
  { index: "01", slug: "rong-xing", title: "Rong Xing", type: "Corporate website", copy: "Trading and business website", tags: ["Web", "Frontend", "Responsive"], exploreHref: "/projects/rong-xing", website: "https://guanzhouronxing.com/" },
  { index: "02", slug: "rushd", title: "Rushd", type: "Research & policy", copy: "Islamic ethics & technology", tags: ["Bilingual", "Interactive", "RTL"], exploreHref: "/projects/rushd", website: "https://rushd.center/" },
  { index: "03", slug: "kira", title: "Kira", type: "AI product", copy: "AI Knowledge Assistant", tags: ["AI", "Azure", "Full Stack"], exploreHref: "/projects/kira" },
  { index: "04", slug: "femi", title: "Femi", type: "Health technology", copy: "AI-Powered Health Platform", tags: ["Health Tech", "AI", "Full Stack"], exploreHref: "/projects/femi" },
  { index: "05", slug: "veltro", title: "Veltro", type: "Web experience", copy: "Interactive responsive website", tags: ["Web", "Interactive", "Responsive"], exploreHref: "https://marcella125.github.io/VELTRO/", website: "https://marcella125.github.io/VELTRO/" },
] as const;

function ProjectCard({ project, index }: {
  project: Project;
  index: number;
}) {
  const reducedMotion = useHydratedReducedMotion();
  const externalExplore = project.exploreHref.startsWith("http");

  return (
    <div className={styles.projectReveal}>
      <motion.article
        className={styles.project}
        data-project-index={project.index}
        data-project-slug={project.slug}
        initial={reducedMotion ? false : { opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.55, delay: reducedMotion ? 0 : index * 0.06 }}
      >
        <div className={styles.projectTop}>
          <span className={styles.projectType}>{project.type}</span>
          <span className={styles.projectIndex}>PROJECT / {project.index}</span>
        </div>
        <div className={styles.projectContent}>
          <h3>{project.title}</h3>
          <p>{project.copy}</p>
          <div className={styles.tags} aria-label={`${project.title} project details`}>
            {project.tags.map((tag) => <span key={tag}>{tag}</span>)}
          </div>
          <div className={styles.projectActions}>
            {!project.website && (externalExplore ? (
              <a className={styles.projectCta} href={project.exploreHref} target="_blank" rel="noopener noreferrer">
                Explore project <span aria-hidden="true">↗</span>
              </a>
            ) : (
              <Link className={styles.projectCta} href={project.exploreHref}>
                Explore project <span aria-hidden="true">↗</span>
              </Link>
            ))}
            {project.website && (
              <a className={`${styles.projectCta} ${styles.websiteCta}`} href={project.website} target="_blank" rel="noopener noreferrer">
                Go to website <span aria-hidden="true">↗</span>
              </a>
            )}
          </div>
        </div>
      </motion.article>
    </div>
  );
}

export default function ProjectsSection() {
  const reducedMotion = useHydratedReducedMotion();

  return (
    <section className={styles.projectsSection} id="projects" aria-labelledby="projects-heading">
      <div className={styles.inner}>
        <motion.header
          className={styles.sectionHeading}
          initial={reducedMotion ? false : { opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <div>
            <SectionLabel>Selected work</SectionLabel>
            <SectionHeadingReveal className={styles.title} id="projects-heading">
              <span className={styles.titleLine}>Some of the things</span>
              <span className={styles.titleAccent}>I&apos;ve built.</span>
            </SectionHeadingReveal>
          </div>
          <p className={styles.lede}>
            Websites and applications built with clean interfaces, thoughtful interactions, and solid engineering.
          </p>
        </motion.header>

        <div className={styles.projectGrid} aria-label="Selected projects">
          {projects.map((project, index) => (
            <ProjectCard key={project.index} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
