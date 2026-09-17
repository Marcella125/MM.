"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { ArrowDown, ArrowLeft, ArrowRight } from "lucide-react";
import Header from "@/src/components/Header";
import ProjectFooter from "@/src/components/ProjectFooter";
import { useHydratedReducedMotion } from "@/src/components/useHydratedReducedMotion";
import styles from "./kira.module.css";

const pipeline = [
  { title: "Wiki.js", label: "SOURCE" },
  { title: "HTML Export", label: "EXTRACT" },
  { title: "Azure Blob Storage", label: "STORE" },
  { title: "Azure AI Search", label: "RETRIEVE" },
  { title: "FastAPI", label: "SERVE" },
  { title: "AI Model", label: "REASON" },
  { title: "Answer", label: "RESPOND" },
];

const contributions = [
  { title: "Document retrieval system", detail: "Making documentation discoverable." },
  { title: "AI search integration", detail: "Connecting queries to relevant knowledge." },
  { title: "FastAPI backend", detail: "The service layer behind every request." },
  { title: "React frontend", detail: "A clear, approachable interaction." },
  { title: "Rate limiting", detail: "Built-in guardrails for responsible use." },
  { title: "Responsive experience", detail: "The same clarity on every screen." },
  { title: "Azure deployment", detail: "From build to a running service." },
];

const stack = ["React 19", "FastAPI", "Python", "Azure Blob Storage", "Azure AI Search", "Azure AI Foundry"];

function SectionMarker({ number, label }: { number: string; label: string }) {
  return <div className={styles.sectionMarker}><span>{number} / {label}</span><span>MM. × KIRA</span></div>;
}

export default function KiraExperience() {
  const reduced = useHydratedReducedMotion();
  const pipelineRef = useRef<HTMLElement>(null);
  const [activeContribution, setActiveContribution] = useState<number | null>(null);
  const { scrollYProgress } = useScroll({ target: pipelineRef, offset: ["start 0.8", "end 0.35"] });
  const connectionProgress = useTransform(scrollYProgress, [0.05, 0.85], [0, 1]);

  return <main className={styles.page}>
    <Header />

    <section className={styles.hero} aria-labelledby="kira-title">
      <div className={styles.heroGrid} aria-hidden="true" />
      <div className={styles.heroTop}>
        <Link href="/#projects" className={styles.back}><ArrowLeft size={16} /> BACK TO PROJECTS</Link>
        <span>SELECTED WORK / 01 — 04</span>
      </div>
      <div className={styles.heroMain}>
        <div className={styles.heroCopy}>
          <span className={styles.eyebrow}>INTERNAL PROJECT / AI SYSTEM</span>
          <h1 id="kira-title">KIRA<span>.</span></h1>
          <p>Internal AI Knowledge Assistant</p>
          <div className={styles.heroTags}><span>AI</span><span>FULL STACK</span><span>AZURE</span></div>
        </div>
      </div>
      <div className={styles.heroBottom}><span>BUILT TO FIND WHAT MATTERS.</span><a href="#what-is-kira">SCROLL TO EXPLORE <ArrowDown size={17} /></a></div>
    </section>

    <section className={styles.what} id="what-is-kira" aria-labelledby="what-title">
      <SectionMarker number="01" label="WHAT IS KIRA?" />
      <div className={styles.whatStage}>
        <div className={styles.whatCopy}>
          <span className={styles.eyebrow}>KNOWLEDGE, MADE ACCESSIBLE.</span>
          <h2 id="what-title"><span>AN INTERNAL</span><motion.span initial={reduced ? false : { opacity: 0, x: -60 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.5 }} transition={{ duration: 0.65 }}>CHATBOT<span className={styles.accentDot}>.</span></motion.span></h2>
          <p>Helping employees find information in company documentation with AI.</p>
        </div>
        <div className={styles.whatWords} aria-label="Documentation to relevant answers">
          <span>COMPANY DOCS</span>
          <span>AI RETRIEVAL</span>
          <strong>RELEVANT ANSWERS<span>.</span></strong>
        </div>
      </div>
    </section>

    <section className={styles.pipelineSection} id="how-it-works" ref={pipelineRef} aria-labelledby="pipeline-title">
      <SectionMarker number="02" label="HOW IT WORKS" />
      <div className={styles.pipelineHeading}><h2 id="pipeline-title"><span>FROM <em>SOURCE</em></span><span>TO ANSWER.</span></h2><p>Seven connected steps.<br />One grounded response.</p></div>
      <div className={styles.pipelineTrack}>
        <div className={styles.connection} aria-hidden="true"><motion.div className={styles.connectionFill} style={reduced ? { scaleX: 1, scaleY: 1 } : { scaleX: connectionProgress, scaleY: connectionProgress }} /></div>
        {pipeline.map((step, index) => <motion.div className={styles.pipelineNode} key={step.title} initial={reduced ? false : { opacity: 0, y: 42 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.35 }} transition={{ duration: 0.5, delay: reduced ? 0 : index * 0.06 }}><span className={styles.nodeIndex}>0{index + 1}</span><span className={styles.nodeLight} aria-hidden="true" /><strong>{step.title}</strong><small>{step.label}</small></motion.div>)}
      </div>
      <div className={styles.pipelineFooter}><span>DOCUMENTATION IN</span><span>ANSWER OUT</span></div>
    </section>

    <section className={styles.built} aria-labelledby="built-title">
      <SectionMarker number="03" label="WHAT I BUILT" />
      <div className={styles.builtLayout}><div className={styles.builtHeading}><h2 id="built-title">WHAT I <em>BUILT.</em></h2><p>From retrieval to the experience around it.</p></div><div className={styles.contributionList}>{contributions.map((item, index) => <button type="button" className={styles.contribution} key={item.title} aria-expanded={activeContribution === index} onClick={() => setActiveContribution(activeContribution === index ? null : index)}><span className={styles.contributionIndex}>0{index + 1}</span><span className={styles.contributionContent}><strong>{item.title}</strong><span className={styles.contributionDetail}>{item.detail}</span></span></button>)}</div></div>
    </section>

    <section className={styles.principle} aria-labelledby="principle-title">
      <SectionMarker number="04" label="THE KEY PRINCIPLE" />
      <div className={styles.principleMain}><h2 id="principle-title">ANSWERS COME<br />FROM <em>COMPANY</em><br />DOCUMENTATION<span>.</span></h2><div className={styles.principleRule}><span>RELEVANT SOURCE FOUND → ANSWER</span><span>NO RELEVANT SOURCE → REFUSE</span></div></div>
      <p>When the information isn&apos;t there, Kira doesn&apos;t invent it.</p>
    </section>

    <section className={styles.tech} aria-labelledby="tech-title">
      <SectionMarker number="05" label="TECH STACK" />
      <div className={styles.techStage}>
        <div className={styles.techHeading}><span className={styles.eyebrow}>SIX PIECES. ONE SYSTEM.</span><h2 id="tech-title">THE<br /><em>TOOLS.</em></h2></div>
        <div className={styles.techList}>{stack.map((name, index) => <div key={name}><span>0{index + 1}</span><strong>{name}</strong><ArrowRight size={19} aria-hidden="true" /></div>)}</div>
      </div>
    </section>

    <ProjectFooter index="01" current="KIRA" statement={<>KIRA<br />BUILT FROM<br /><em>KNOWLEDGE.</em></>} next="FEMI" nextHref="/projects/femi" />
  </main>;
}
