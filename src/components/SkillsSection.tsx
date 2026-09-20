"use client";

import { motion, useMotionValueEvent, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useRef, useState, type PointerEvent } from "react";
import { FaCss3Alt } from "react-icons/fa6";
import {
  SiExpress,
  SiFastapi,
  SiFramer,
  SiGit,
  SiGooglegemini,
  SiGsap,
  SiHtml5,
  SiJavascript,
  SiNextdotjs,
  SiNodedotjs,
  SiPostgresql,
  SiPython,
  SiReact,
  SiShopify,
  SiTailwindcss,
  SiTypescript,
  SiVite,
} from "react-icons/si";
import { VscAzure } from "react-icons/vsc";
import AzureAISearchIcon from "./icons/AzureAISearchIcon";
import AzureOpenAIIcon from "./icons/AzureOpenAIIcon";
import SectionLabel from "./SectionLabel";
import { useHydratedReducedMotion } from "./useHydratedReducedMotion";
import styles from "./SkillsSection.module.css";

const skillGroups = [
  {
    number: "01",
    title: "Frontend",
    description: "Interfaces that feel clear, responsive, and considered.",
    skills: [
      { name: "HTML", Icon: SiHtml5, color: "#e34f26" },
      { name: "CSS", Icon: FaCss3Alt, color: "#1572b6" },
      { name: "JavaScript", Icon: SiJavascript, color: "#d6ab00" },
      { name: "React", Icon: SiReact, color: "#149eca" },
      { name: "Next.js", Icon: SiNextdotjs, color: "#111111" },
      { name: "TypeScript", Icon: SiTypescript, color: "#3178c6" },
      { name: "Tailwind CSS", Icon: SiTailwindcss, color: "#06b6d4" },
    ],
  },
  {
    number: "02",
    title: "Backend",
    description: "The services and data behind the experience.",
    skills: [
      { name: "Node.js", Icon: SiNodedotjs, color: "#5fa04e" },
      { name: "Express", Icon: SiExpress, color: "#111111" },
      { name: "Python", Icon: SiPython, color: "#3776ab" },
      { name: "FastAPI", Icon: SiFastapi, color: "#009688" },
      { name: "PostgreSQL", Icon: SiPostgresql, color: "#4169e1" },
    ],
  },
  {
    number: "03",
    title: "Cloud & AI",
    description: "Useful intelligence, connected to real products.",
    skills: [
      { name: "Azure", Icon: VscAzure, color: "#0078d4" },
      { name: "Azure OpenAI", Icon: AzureOpenAIIcon, color: "#0078d4" },
      { name: "Azure AI Search", Icon: AzureAISearchIcon, color: "#0078d4" },
      { name: "Google Gemini", Icon: SiGooglegemini, color: "#8867d8" },
    ],
  },
  {
    number: "04",
    title: "Motion & tools",
    description: "Details that make digital work feel alive.",
    skills: [
      { name: "Framer Motion", Icon: SiFramer, color: "#171717" },
      { name: "GSAP", Icon: SiGsap, color: "#0b8f3b" },
      { name: "Vite", Icon: SiVite, color: "#8163e8" },
      { name: "Git", Icon: SiGit, color: "#f05032" },
      { name: "Shopify", Icon: SiShopify, color: "#7ab55c" },
    ],
  },
] as const;

const ease = [0.22, 1, 0.36, 1] as const;

function SkillCard({
  group,
  index,
  progress,
  active,
  quiet,
  reducedMotion,
  onHover,
}: {
  group: (typeof skillGroups)[number];
  index: number;
  progress: MotionValue<number>;
  active: boolean;
  quiet: boolean;
  reducedMotion: boolean;
  onHover: (index: number | null) => void;
}) {
  const drift = useTransform(progress, [0, 1], index % 2 === 0 ? [-7, 7] : [7, -7]);

  function moveCard(event: PointerEvent<HTMLElement>) {
    if (reducedMotion || event.pointerType !== "mouse") return;
    const bounds = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--pointer-x", `${event.clientX - bounds.left}px`);
    event.currentTarget.style.setProperty("--pointer-y", `${event.clientY - bounds.top}px`);
  }

  function moveSkill(event: PointerEvent<HTMLLIElement>) {
    if (reducedMotion || event.pointerType !== "mouse") return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 8;
    const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 6;
    event.currentTarget.style.setProperty("--magnet-x", `${x}px`);
    event.currentTarget.style.setProperty("--magnet-y", `${y}px`);
  }

  return (
    <motion.article
      className={styles.card}
      data-active={active}
      data-quiet={quiet}
      tabIndex={0}
      initial={reducedMotion ? false : "hidden"}
      whileInView="visible"
      viewport={{ once: false, amount: 0.28 }}
      variants={reducedMotion ? {
        hidden: { opacity: 1, y: 0 },
        visible: { opacity: 1, y: 0 },
      } : {
        hidden: { opacity: 0, y: 28 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.52, delay: index * 0.065, ease, delayChildren: 0.12, staggerChildren: 0.035 } },
      }}
      onPointerEnter={(event) => { if (event.pointerType === "mouse") onHover(index); }}
      onPointerLeave={() => onHover(null)}
      onPointerMove={moveCard}
      onFocusCapture={() => onHover(index)}
      onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) onHover(null); }}
    >
      <div className={styles.cardTop}>
        <motion.span animate={active && !reducedMotion ? { x: 5 } : { x: 0 }} transition={{ type: "spring", stiffness: 350, damping: 24 }}>{group.number}</motion.span>
        <span className={styles.activeMark} aria-hidden="true" />
      </div>
      <div className={styles.cardBody}>
        <h3>{group.title}</h3>
        <p>{group.description}</p>
        <motion.ul aria-label={`${group.title} skills`} style={{ x: reducedMotion ? 0 : drift }}>
          {group.skills.map(({ name, Icon, color }) => (
            <motion.li
              key={name}
              variants={reducedMotion ? {
                hidden: { opacity: 1, y: 0 },
                visible: { opacity: 1, y: 0 },
              } : {
                hidden: { opacity: 0, y: 10 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease } },
              }}
              onPointerMove={moveSkill}
              onPointerLeave={(event) => {
                event.currentTarget.style.setProperty("--magnet-x", "0px");
                event.currentTarget.style.setProperty("--magnet-y", "0px");
              }}
            >
              <span className={styles.skillSurface}>
                <Icon aria-hidden="true" style={{ color }} />
                <span>{name}</span>
              </span>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </motion.article>
  );
}

export default function SkillsSection() {
  const reducedMotion = Boolean(useHydratedReducedMotion());
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const [scrollActive, setScrollActive] = useState(0);
  const [hovered, setHovered] = useState<number | null>(null);
  const activeIndex = hovered ?? scrollActive;

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    const next = Math.min(skillGroups.length - 1, Math.max(0, Math.floor(value * skillGroups.length)));
    setScrollActive((current) => current === next ? current : next);
  });

  return (
    <section className={styles.section} id="skills" aria-labelledby="skills-heading" ref={sectionRef}>
      <div className={styles.inner}>
        <header className={styles.heading}>
          <div>
            <SectionLabel>What I use</SectionLabel>
            <motion.div
              className={styles.headingMask}
              initial={reducedMotion ? false : "hidden"}
              whileInView="visible"
              viewport={{ once: false, amount: 0.45 }}
            >
              <motion.h2
                id="skills-heading"
                variants={reducedMotion ? {
                  hidden: { y: "0%" },
                  visible: { y: "0%" },
                } : {
                  hidden: { y: "105%" },
                  visible: { y: "0%" },
                }}
                transition={{ duration: 0.75, ease }}
              >TOOLS I <span>KNOW.</span></motion.h2>
            </motion.div>
          </div>
          <p>From the first line of CSS to the systems behind the screen, these are the tools I use to bring ideas to life.</p>
        </header>

        <div className={styles.grid}>
          {skillGroups.map((group, index) => (
            <SkillCard
              key={group.number}
              group={group}
              index={index}
              progress={scrollYProgress}
              active={activeIndex === index}
              quiet={activeIndex !== index}
              reducedMotion={reducedMotion}
              onHover={setHovered}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
