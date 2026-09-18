import { ArrowUpRight } from "lucide-react";
import { FaCss3Alt } from "react-icons/fa6";
import {
  SiExpress,
  SiFastapi,
  SiFramer,
  SiGit,
  SiGooglegemini,
  SiGreensock,
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
import { VscAzure, VscOpenai } from "react-icons/vsc";
import SectionLabel from "./SectionLabel";
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
      { name: "Azure OpenAI", Icon: VscOpenai, color: "#087f70" },
      { name: "Azure AI Search", Icon: VscAzure, color: "#0078d4" },
      { name: "Google Gemini", Icon: SiGooglegemini, color: "#8867d8" },
    ],
  },
  {
    number: "04",
    title: "Motion & tools",
    description: "Details that make digital work feel alive.",
    skills: [
      { name: "Framer Motion", Icon: SiFramer, color: "#171717" },
      { name: "GSAP", Icon: SiGreensock, color: "#72a712" },
      { name: "Vite", Icon: SiVite, color: "#8163e8" },
      { name: "Git", Icon: SiGit, color: "#f05032" },
      { name: "Shopify", Icon: SiShopify, color: "#7ab55c" },
    ],
  },
] as const;

export default function SkillsSection() {
  return (
    <section className={styles.section} id="skills" aria-labelledby="skills-heading">
      <div className={styles.inner}>
        <header className={styles.heading}>
          <div>
            <SectionLabel>What I use</SectionLabel>
            <h2 id="skills-heading">TOOLS I <span>KNOW.</span></h2>
          </div>
          <p>From the first line of CSS to the systems behind the screen, these are the tools I use to bring ideas to life.</p>
        </header>

        <div className={styles.grid}>
          {skillGroups.map((group) => (
            <article className={styles.card} key={group.number}>
              <div className={styles.cardTop}>
                <span>{group.number}</span>
                <ArrowUpRight aria-hidden="true" />
              </div>
              <div className={styles.cardBody}>
                <h3>{group.title}</h3>
                <p>{group.description}</p>
                <ul aria-label={`${group.title} skills`}>
                  {group.skills.map(({ name, Icon, color }) => (
                    <li key={name}>
                      <Icon aria-hidden="true" style={{ color }} />
                      <span>{name}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
