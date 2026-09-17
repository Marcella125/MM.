"use client";

import { useRef, type CSSProperties } from "react";
import { motion, type MotionValue, useScroll, useTransform } from "framer-motion";
import SectionLabel from "./SectionLabel";
import { useHydratedReducedMotion } from "./useHydratedReducedMotion";
import { assetPath } from "@/src/lib/paths";
import Link from "next/link";
import styles from "./PortfolioSections.module.css";

const projects = [
  { index: "01", title: "Kira", type: "AI product", copy: "AI Knowledge Assistant", tags: ["AI", "Azure", "Full Stack"] },
  { index: "02", title: "Femi", type: "Health technology", copy: "AI-Powered Health Platform", tags: ["Health Tech", "AI", "Full Stack"] },
  { index: "03", title: "Rong Xing", type: "Corporate website", copy: "Trading and business website", tags: ["Web", "Frontend", "Responsive"] },
  { index: "04", title: "Rushd", type: "Interactive experience", copy: "Interactive Bilingual Experience", tags: ["Creative Development", "Three.js", "RTL"] },
] as const;

const cardStops = [
  [0, 0.20, 0.28, 1],
  [0, 0.20, 0.28, 0.43, 0.51, 1],
  [0, 0.43, 0.51, 0.66, 0.74, 1],
  [0, 0.66, 0.74, 1],
];
const opacityStops = [
  [1, 1, 0, 0],
  [0, 0, 1, 1, 0, 0],
  [0, 0, 1, 1, 0, 0],
  [0, 0, 1, 1],
];
const offsetStops = [
  [0, 0, -56, -56],
  [56, 56, 0, 0, -56, -56],
  [56, 56, 0, 0, -56, -56],
  [56, 56, 0, 0],
];
const scaleStops = [
  [1, 1, 0.95, 0.95],
  [0.95, 0.95, 1, 1, 0.95, 0.95],
  [0.95, 0.95, 1, 1, 0.95, 0.95],
  [0.95, 0.95, 1, 1],
];
const blurStops = [
  [0, 0, 9, 9],
  [9, 9, 0, 0, 9, 9],
  [9, 9, 0, 0, 9, 9],
  [9, 9, 0, 0],
];

function ProjectCard({ project, index, progress }: {
  project: (typeof projects)[number];
  index: number;
  progress: MotionValue<number>;
}) {
  const reducedMotion = useHydratedReducedMotion();
  const opacity = useTransform(progress, cardStops[index], opacityStops[index]);
  const y = useTransform(progress, cardStops[index], offsetStops[index]);
  const scale = useTransform(progress, cardStops[index], scaleStops[index]);
  const blur = useTransform(progress, cardStops[index], blurStops[index]);
  const filter = useTransform(blur, (value) => `blur(${value}px)`);
  const pointerEvents = useTransform(opacity, (value) => value > 0.8 ? "auto" : "none");
  const imagePath = index === 0
    ? "/assets/kira.png"
    : index === 1
      ? "/assets/femi.png"
      : index === 2
        ? "/assets/rong%20xing.png"
        : "/assets/rushd.png";
  const card = (
    <article
      className={styles.project}
      data-project-index={project.index}
      style={imagePath ? { "--project-image": `url("${assetPath(imagePath)}")` } as CSSProperties : undefined}
    >
      <div className={styles.projectTop}>
        <span className={styles.projectNumber}>{project.index}</span>
        <span className={styles.projectType}>{project.type}</span>
      </div>
      <div className={styles.projectContent}>
        <h3>{project.title}</h3>
        <p>{project.copy}</p>
        <div className={styles.tags} aria-label={`${project.title} project details`}>
          {project.tags.map((tag) => <span key={tag}>{tag}</span>)}
        </div>
      </div>
    </article>
  );

  return (
    <motion.div
      className={styles.projectReveal}
      style={{
        opacity,
        y: reducedMotion ? 0 : y,
        scale: reducedMotion ? 1 : scale,
        filter: reducedMotion ? "none" : filter,
        pointerEvents,
        zIndex: index + 1,
      }}
    >
      <Link className={styles.projectLink} href={`/projects/${project.index === "03" ? "rong-xing" : project.title.toLowerCase()}`} aria-label={`Explore ${project.title} project`}>
          {card}
      </Link>
    </motion.div>
  );
}

export default function ProjectsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress: progress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  return (
    <section className={styles.projectsSection} id="projects" aria-labelledby="projects-heading" ref={sectionRef}>
      <div className={styles.inner}>
        <header className={styles.sectionHeading}>
          <div>
            <SectionLabel>Selected work</SectionLabel>
            <h2 className={styles.title} id="projects-heading">
              <span className={styles.titleLine}>Things I&apos;ve</span>
              <span className={styles.titleAccent}>built.</span>
            </h2>
          </div>
          <p className={styles.lede}>
            Websites and applications built with clean interfaces, thoughtful interactions, and solid engineering.
          </p>
        </header>

        <div className={styles.projectGrid} aria-label="Selected projects">
          {projects.map((project, index) => (
            <ProjectCard key={project.index} project={project} index={index} progress={progress} />
          ))}
        </div>
      </div>
    </section>
  );
}
