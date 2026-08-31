"use client";

import { motion } from "framer-motion";
import { useHydratedReducedMotion } from "./useHydratedReducedMotion";

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
    <section className="projects-section" id="projects" aria-labelledby="projects-heading">
      <div className="projects-heading-row">
        <motion.h2
          className="projects-title"
          id="projects-heading"
          initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease }}
        >
          PROJECTS
        </motion.h2>
      </div>

      <div className="projects-atlas">
        {projects.map((project, index) => (
          <motion.article
            className="project-atlas-item"
            key={project.index}
            initial={{
              opacity: 0,
              y: prefersReducedMotion ? 0 : 34,
              rotate: prefersReducedMotion ? 0 : index % 2 === 0 ? -1.8 : 1.8,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
              rotate: prefersReducedMotion ? 0 : index % 2 === 0 ? -1.2 : 1.2,
              transition: { duration: 0.58, ease },
            }}
            viewport={{ once: false, amount: 0.55 }}
            whileHover={prefersReducedMotion ? undefined : { y: -8 }}
            transition={{ duration: 0.24, ease }}
          >
            <div className="project-atlas-topline">
              <span>{project.index}</span>
              <span>{project.type}</span>
            </div>
            <div className="project-atlas-copy">
              <h3>{project.title}</h3>
              <p>{project.copy}</p>
            </div>
            <div
              className="project-atlas-tags"
              aria-label={`${project.title} technologies`}
            >
              {project.tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
