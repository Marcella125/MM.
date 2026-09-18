"use client";

import { useRef } from "react";
import { motion, type MotionValue, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import SectionLabel from "./SectionLabel";
import { useHydratedReducedMotion } from "./useHydratedReducedMotion";
import Link from "next/link";
import { assetPath } from "@/src/lib/paths";
import styles from "./PortfolioSections.module.css";

const projects = [
  { index: "01", title: "Kira", type: "AI product", copy: "AI Knowledge Assistant", tags: ["AI", "Azure", "Full Stack"], image: "/assets/kira.png" },
  { index: "02", title: "Femi", type: "Health technology", copy: "AI-Powered Health Platform", tags: ["Health Tech", "AI", "Full Stack"], image: "/assets/femi.png" },
  { index: "03", title: "Rong Xing", type: "Corporate website", copy: "Trading and business website", tags: ["Web", "Frontend", "Responsive"], image: "/assets/rong%20xing.png" },
  { index: "04", title: "Rushd", type: "Research & policy", copy: "Islamic ethics & technology", tags: ["Bilingual", "Interactive", "RTL"], image: "/assets/rushd.png" },
] as const;

const focusedCard = (progress: number) => progress * (projects.length - 1);

function stackOffset(distance: number) {
  const depth = Math.abs(distance);
  return Math.sign(distance) * (depth <= 1 ? depth * 190 : 190 + (depth - 1) * 80);
}

function ProjectCard({ project, index, progress }: {
  project: (typeof projects)[number];
  index: number;
  progress: MotionValue<number>;
}) {
  const reducedMotion = useHydratedReducedMotion();
  const y = useTransform(progress, (value) => stackOffset(index - focusedCard(value)));
  const scale = useTransform(progress, (value) => 1 - Math.min(Math.abs(index - focusedCard(value)), 1) * 0.2);
  const zIndex = useTransform(progress, (value) => Math.round(20 - Math.abs(index - focusedCard(value)) * 4));
  const card = (
    <article
      className={styles.project}
      data-project-index={project.index}
    >
      <div className={styles.projectTop}>
        <span className={styles.projectType}>{project.type}</span>
      </div>
      <div className={styles.projectContent}>
        <h3>{project.title}</h3>
        <p>{project.copy}</p>
        <div className={styles.tags} aria-label={`${project.title} project details`}>
          {project.tags.map((tag) => <span key={tag}>{tag}</span>)}
        </div>
      </div>
      <div className={styles.projectArtwork} aria-hidden="true">
        <Image src={assetPath(project.image)} alt="" fill sizes="(max-width: 700px) 36vw, 1px" />
      </div>
    </article>
  );

  return (
    <motion.div
      className={styles.projectReveal}
      style={{
        y: reducedMotion ? 0 : y,
        scale: reducedMotion ? 1 : scale,
        zIndex,
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
