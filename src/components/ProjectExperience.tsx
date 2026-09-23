"use client";

import { useRef, useState, type CSSProperties } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowDown, ArrowLeft, ArrowRight } from "lucide-react";
import Header from "./Header";
import ProjectFooter from "./ProjectFooter";
import { useHydratedReducedMotion } from "./useHydratedReducedMotion";
import { assetPath } from "@/src/lib/paths";
import styles from "./ProjectExperience.module.css";

type ProjectKey = "femi" | "rong-xing" | "rushd";

const projects = {
  femi: {
    index: "02", title: "FEMI", category: "HEALTH TECHNOLOGY", subtitle: "AI-Powered Health Platform",
    color: "#9f2058", wash: "#ffe1f2", base: "#ffffff", highlight: "#ffe1f2", heroBackground: "#9f2058", heroForeground: "#ffffff", heroHighlight: "#ffe1f2", principleBackground: "#9f2058", intro: ["A MORE", "THOUGHTFUL", "HEALTH SPACE."],
    description: "A PCOS companion with a home dashboard, cycle calendar, health insights, reminders, blood test tools, and Bloom AI to help users explore their health data.",
    facets: ["PCOS CARE", "BLOOM AI", "FULL STACK"],
    contributions: [
      { title: "Home dashboard", detail: "Brought daily check-ins, cycle context, and key health information into one view." },
      { title: "Calendar and tracking", detail: "Built cycle views and daily logs for symptoms and health patterns." },
      { title: "Health insights", detail: "Turned logged activity into readable trends and monthly recaps." },
      { title: "Bloom AI", detail: "Connected a Gemini-powered assistant to the user's logged health context." },
      { title: "Reminders", detail: "Added reminders to support regular check-ins and health routines." },
      { title: "Blood test insights", detail: "Built upload, marker extraction, interpretation, and test comparison flows." },
      { title: "Settings", detail: "Added a dedicated place for account and experience preferences." },
    ],
    principle: ["CARE", "WITH", "CLARITY."], principleNote: "Technology should make a complex space feel easier to navigate.",
    tech: ["React", "Vite", "Tailwind CSS", "Express", "PostgreSQL", "Google Gemini"],
    gallery: [
      { src: "/assets/Projects/FEMI/home.png", label: "HOME / CYCLE OVERVIEW", alt: "Femi home dashboard with cycle tracking and daily check-in cards", width: 1907, height: 906 },
      { src: "/assets/Projects/FEMI/bloom.png", label: "BLOOM AI", alt: "Femi Bloom AI assistant page with suggested health questions", width: 1627, height: 907 },
      { src: "/assets/Projects/FEMI/blood%20test%20img.png", label: "BLOOD TESTS", alt: "Femi blood test upload and comparison page", width: 1627, height: 907 },
    ],
    statement: ["FEMI", "CARE WITH", "CLARITY."], next: "RONG XING", nextHref: "/projects/rong-xing",
  },
  "rong-xing": {
    index: "03", title: "RONG XING", category: "CORPORATE WEBSITE", subtitle: "Trading and Business Website",
    color: "#1c2f4c", wash: "#d4ae69", base: "#ffffff", highlight: "#d4ae69", heroBackground: "#1c2f4c", heroForeground: "#ffffff", heroHighlight: "#d4ae69", principleBackground: "#1c2f4c", intro: ["BUSINESS", "WITHOUT", "BORDERS."],
    description: "A responsive company website presenting Guangzhou Rongxing's services, global reach, gallery, and contact information.",
    facets: ["GLOBAL TRADE", "MOTION", "RESPONSIVE"],
    contributions: [
      { title: "Company website", detail: "Built sections for services, global reach, company information, and contact." },
      { title: "Interactive gallery", detail: "Built an image gallery with a keyboard and touch-friendly lightbox." },
      { title: "Responsive motion", detail: "Added scroll animation and layouts that adapt across screen sizes." },
    ],
    principle: ["CLEAR", "ACROSS", "BORDERS."], principleNote: "A business story should remain easy to explore on every screen.",
    tech: ["Next.js", "React", "TypeScript", "Tailwind CSS", "GSAP", "Framer Motion"],
    gallery: [
      { src: "/assets/Projects/RONG%20XING/home.png", label: "HOME / GLOBAL TRADE", alt: "Rong Xing website hero showing global shipping and trade", width: 1917, height: 902 },
      { src: "/assets/Projects/RONG%20XING/goal.png", label: "GLOBAL REACH", alt: "Rong Xing global reach section with a world map", width: 1911, height: 811 },
      { src: "/assets/Projects/RONG%20XING/text.png", label: "OUR PROMISE", alt: "Rong Xing promise section about finding business solutions", width: 1912, height: 822 },
    ],
    statement: ["RONG XING", "A WORLD IN", "MOTION."], next: "RUSHD", nextHref: "/projects/rushd",
  },
  rushd: {
    index: "04", title: "RUSHD", category: "RESEARCH & POLICY WEBSITE", subtitle: "Exploring technology, ethics, and Islamic thought",
    color: "#081713", wash: "#53d8d0", base: "#ffffff", highlight: "#53d8d0", heroBackground: "#081713", heroForeground: "#ffffff", heroHighlight: "#53d8d0", principleBackground: "#081713", intro: ["WHERE", "ETHICS MEETS", "INNOVATION."],
    description: "Rushd Center brings interdisciplinary research and policy into public view, examining emerging technologies through Islamic ethical thought and contemporary expertise.",
    facets: ["RESEARCH", "ETHICS", "TECHNOLOGY"],
    contributions: [
      { title: "Interactive development", detail: "Creating a visual entry point to the center's research and ideas." },
      { title: "Bilingual experience", detail: "Supporting the site's English and Arabic content." },
      { title: "RTL support", detail: "Making the Arabic experience natural to read and navigate." },
      { title: "Three.js interactions", detail: "Adding motion and depth to the landing experience." },
    ],
    principle: ["INNOVATION", "WITH", "RESPONSIBILITY."], principleNote: "Research on emerging technology should remain grounded in human dignity and the common good.",
    tech: ["Next.js", "React", "Framer Motion", "Lucide React"],
    gallery: [
      { src: "/assets/Projects/RUSHD/home.png", label: "INTERACTIVE LANDING", alt: "Rushd Center landing page with teal interactive waves", width: 1912, height: 912 },
      { src: "/assets/Projects/RUSHD/home%202.png", label: "VISION & VALUES", alt: "Rushd Center page reading Guiding Innovation with Islamic Values", width: 1917, height: 911 },
      { src: "/assets/Projects/RUSHD/image.png", label: "CONTENT DASHBOARD", alt: "Rushd CMS dashboard overview with research, media, and editorial tools", width: 1917, height: 911 },
    ],
    statement: ["RUSHD", "ETHICS FOR", "WHAT'S NEXT."], next: "KIRA", nextHref: "/projects/kira",
  },
} satisfies Record<ProjectKey, {
  index: string; title: string; category: string; subtitle: string; color: string; wash: string; base: string; highlight: string; heroBackground: string; heroForeground: string; heroHighlight: string; principleBackground: string;
  intro: string[]; description: string; facets: string[];
  contributions: { title: string; detail: string }[];
  principle: string[]; principleNote: string; tech: string[];
  gallery: { src: `/${string}`; label: string; alt: string; width: number; height: number }[];
  statement: string[]; next: string; nextHref: string;
}>;

function Marker({ number, label, title }: { number: string; label: string; title: string }) {
  return <div className={styles.marker}><span>{number} / {label}</span><span>MM. × {title}</span></div>;
}

export default function ProjectExperience({ project }: { project: ProjectKey }) {
  const data = projects[project];
  const liveSiteUrl = project === "rushd" ? "https://rushd.center/" : null;
  const reduced = useHydratedReducedMotion();
  const [activeContribution, setActiveContribution] = useState<number | null>(null);
  const [activeShot, setActiveShot] = useState(0);
  const galleryRef = useRef<HTMLDivElement>(null);
  const goToShot = (index: number) => {
    const rail = galleryRef.current;
    const shot = rail?.children[index] as HTMLElement | undefined;
    if (!rail || !shot) return;
    rail.scrollTo({ left: shot.offsetLeft, behavior: reduced ? "auto" : "smooth" });
    setActiveShot(index);
  };
  const syncActiveShot = () => {
    const rail = galleryRef.current;
    if (!rail) return;
    const index = Array.from(rail.children).reduce((nearest, child, current) =>
      Math.abs((child as HTMLElement).offsetLeft - rail.scrollLeft) < Math.abs((rail.children[nearest] as HTMLElement).offsetLeft - rail.scrollLeft) ? current : nearest, 0);
    setActiveShot(index);
  };
  const theme = {
    "--project-color": data.color,
    "--project-wash": data.wash,
    "--project-base": data.base,
    "--project-highlight": data.highlight,
    "--project-hero-background": data.heroBackground,
    "--project-hero-foreground": data.heroForeground,
    "--project-hero-highlight": data.heroHighlight,
    "--project-principle-background": data.principleBackground,
    "--blue": data.color,
    "--blue-deep": data.color,
    "--logo-dot-display": "block",
    "--logo-dot-color": project === "femi" ? data.color : data.highlight,
    "--footer-accent": "#ffffff",
    "--footer-background": data.principleBackground,
    "--footer-highlight": data.highlight,
  } as CSSProperties;

  return <main className={styles.page} data-project={project} style={theme}>
    <Header />

    <section className={styles.hero} aria-labelledby="project-title">
      <div className={styles.heroGrid} aria-hidden="true" />
      <div className={styles.heroTop}><Link href="/#projects"><ArrowLeft size={16} /> BACK TO PROJECTS</Link><span>SELECTED WORK / {data.index} — 04</span></div>
      <div className={styles.heroMain}><span className={styles.eyebrow}>{data.category}</span><h1 id="project-title">{data.title}<span>.</span></h1><p>{data.subtitle}</p><div className={styles.heroTags}>{data.facets.map(tag => <span key={tag}>{tag}</span>)}</div></div>
      <div className={styles.heroBottom}><span>SELECTED WORK / {data.index}</span><a href="#overview">SCROLL TO EXPLORE <ArrowDown size={17} /></a></div>
    </section>

    <section className={styles.overview} id="overview" aria-labelledby="overview-title">
      <Marker number="01" label="THE PROJECT" title={data.title} />
      <h2 id="overview-title">{data.intro.map((line, index) => <motion.span key={line} className={index === 1 ? styles.accentText : ""} initial={reduced ? false : { opacity: 0, x: -55 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: .4 }} transition={{ duration: .55, delay: index * .1 }}>{line}</motion.span>)}</h2>
      <div className={styles.overviewBottom}><p>{data.description}</p></div>
    </section>

    <section className={styles.showcase} aria-labelledby="showcase-title">
      <Marker number="02" label="IN VIEW" title={data.title} />
      <div className={styles.showcaseHeading}>
        <div className={styles.showcaseTitle}>
          <h2 id="showcase-title">A LOOK <em>INSIDE.</em></h2>
          {liveSiteUrl && <a className={styles.liveLink} href={liveSiteUrl} target="_blank" rel="noopener noreferrer">VISIT LIVE SITE <ArrowRight size={17} /></a>}
        </div>
        <div className={styles.showcaseControls}>
          <span>0{activeShot + 1} / 0{data.gallery.length}</span>
          <button type="button" aria-label={`Previous ${data.title} image`} disabled={activeShot === 0} onClick={() => goToShot(activeShot - 1)}><ArrowLeft size={20} /></button>
          <button type="button" aria-label={`Next ${data.title} image`} disabled={activeShot === data.gallery.length - 1} onClick={() => goToShot(activeShot + 1)}><ArrowRight size={20} /></button>
        </div>
      </div>
      <div className={styles.showcaseRail} ref={galleryRef} onScroll={syncActiveShot} role="region" tabIndex={0} aria-label={`${data.title} project images`}>
        {data.gallery.map((shot, index) => <motion.figure className={styles.showcaseSlide} key={shot.src} initial={reduced ? false : { opacity: 0, x: 35 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: .25 }} transition={{ duration: .5 }}>
          <div className={styles.showcaseFrame}><Image src={assetPath(shot.src)} alt={shot.alt} width={shot.width} height={shot.height} sizes="(max-width: 700px) 90vw, 75vw" priority={index === 0} /></div>
          <figcaption><span>0{index + 1} / {shot.label}</span><span>{data.title}</span></figcaption>
        </motion.figure>)}
      </div>
    </section>

    <section className={styles.dna} aria-labelledby="dna-title">
      <Marker number="03" label="PROJECT DNA" title={data.title} />
      <div className={styles.dnaHeading}><h2 id="dna-title">THE<br /><em>BUILDING</em><br />BLOCKS.</h2><p>Three things at the heart of this project.</p></div>
      <div className={styles.dnaGrid}>{data.facets.map((facet, index) => <motion.div key={facet} initial={reduced ? false : { opacity: 0, y: 35 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .3 }} transition={{ duration: .5, delay: index * .09 }}><span>0{index + 1}</span><strong>{facet}</strong><span>↗</span></motion.div>)}</div>
    </section>

    <section className={styles.built} aria-labelledby="built-title">
      <Marker number="04" label="WHAT I BUILT" title={data.title} />
      <div className={styles.builtLayout}><div className={styles.builtHeading}><h2 id="built-title">WHAT I <em>BUILT.</em></h2><p>My part in bringing it to life.</p></div><div className={styles.contributionGrid}>{data.contributions.map((item, index) => <button key={item.title} type="button" className={styles.contribution} aria-expanded={activeContribution === index} onClick={() => setActiveContribution(activeContribution === index ? null : index)}><span>0{index + 1}</span><strong>{item.title}</strong><small>{item.detail}</small></button>)}</div></div>
    </section>

    <section className={styles.principle} aria-labelledby="principle-title">
      <Marker number="05" label="THE IDEA" title={data.title} />
      <h2 id="principle-title">{data.principle.map((line, index) => <span key={line} className={index === 1 ? styles.principleAccent : ""}>{line}</span>)}</h2>
      <p>{data.principleNote}</p>
    </section>

    <section className={styles.tech} aria-labelledby="tech-title">
      <Marker number="06" label="TECH & FOCUS" title={data.title} />
      <h2 id="tech-title">THE<br /><em>TOOLS.</em></h2>
      <div className={styles.techContent}>
        <div className={styles.techList}>{data.tech.map((name, index) => <div key={name}><span>0{index + 1}</span><strong>{name}</strong><ArrowRight size={18} /></div>)}</div>
        {liveSiteUrl && <a className={styles.liveLink} href={liveSiteUrl} target="_blank" rel="noopener noreferrer">VISIT LIVE SITE <ArrowRight size={17} /></a>}
      </div>
    </section>

    <ProjectFooter index={data.index} current={data.title} statement={<>{data.statement[0]}<br />{data.statement[1]}<br /><em>{data.statement[2]}</em></>} next={data.next} nextHref={data.nextHref} />
  </main>;
}
