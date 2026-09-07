"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { assetPath } from "@/src/lib/paths";
import { useHydratedReducedMotion } from "./useHydratedReducedMotion";
import SectionLabel from "./SectionLabel";
import styles from "./AboutSection.module.css";

const ease = [0.22, 1, 0.36, 1] as const;

export default function AboutSection() {
  const prefersReducedMotion = useHydratedReducedMotion();

  return (
    <section className={styles.section} id="about" aria-labelledby="about-heading">
      <div className={styles.paper}>
        <motion.div className={styles.visualColumn} initial={{ opacity: 0, x: prefersReducedMotion ? 0 : -24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.7, ease }}>
          <div className={styles.portraitFrame}>
            <Image className={styles.featureImage} src={assetPath("/assets/profile.jpeg")} alt="Portrait of Marcella" width={1254} height={1254} sizes="(max-width: 560px) 78vw, (max-width: 800px) 52vw, 30vw" />
          </div>
        </motion.div>

        <motion.div className={styles.content} initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.15 }} transition={{ duration: 0.7, delay: 0.08, ease }}>
          <div className={styles.introTopline}>
            <SectionLabel>About me</SectionLabel>
            <h2 className={styles.title} id="about-heading">
              <span className={styles.titleLead}>I turn ideas into</span>
              <span className={styles.titleAccent}>Digital experiences.</span>
            </h2>
          </div>
          <p className={styles.lede}><strong>Developer by logic, designer by instinct.</strong> I’m Marcella, a Computer Science graduate from USEK, passionate about building digital experiences that are both functional and meaningful. I turn ideas into clean, modern, interactive websites, with a focus on UI/UX, creative development, and the details that make the web feel alive.</p>
          <dl className={styles.facts}>
            <div><dt>Based in</dt><dd>Lebanon</dd></div>
            <div><dt>Field</dt><dd>Computer Science</dd></div>
            <div><dt>Focus</dt><dd>Web / UI / Creative Dev</dd></div>
          </dl>
        </motion.div>

      </div>
    </section>
  );
}
