"use client";

import { motion } from "framer-motion";
import { ArrowUp, ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";
import type { MouseEvent } from "react";
import { useHydratedReducedMotion } from "./useHydratedReducedMotion";
import SectionLabel from "./SectionLabel";
import styles from "./PortfolioSections.module.css";

const ease = [0.22, 1, 0.36, 1] as const;

function scrollToPageTop() {
  const root = document.documentElement;
  const previousScrollBehavior = root.style.scrollBehavior;
  root.style.scrollBehavior = "auto";
  window.history.replaceState(null, "", window.location.pathname);
  window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  window.requestAnimationFrame(() => {
    root.style.scrollBehavior = previousScrollBehavior;
  });
}

export default function ContactSection() {
  const prefersReducedMotion = useHydratedReducedMotion();

  function handleBackToTopClick(event: MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();
    scrollToPageTop();
  }

  return (
    <section className={styles.contactSection} id="contact" aria-labelledby="contact-heading">
      <div className={styles.contactTicker} aria-hidden="true">
        <div className={styles.contactTickerTrack}>
          {[0, 1].map((group) => (
            <div className={styles.contactTickerGroup} key={group}>
              <span>Have an idea?</span><i>✦</i>
              <span>Let&apos;s talk</span><i>✦</i>
              <span>Design + development</span><i>✦</i>
              <span>Let&apos;s make it real</span><i>✦</i>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.contactInner}>
        <motion.div
          className={styles.contactLayout}
          initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease }}
        >
          <div className={styles.contactIntro}>
            <SectionLabel>Let&apos;s talk</SectionLabel>
            <h2 className={styles.title} id="contact-heading">
              Have an idea?<br /><span>Let&apos;s make it real.</span>
            </h2>
            <p className={styles.lede}>
              Tell me what you are imagining. A website, an interface, or a complete digital identity—we can shape it together.
            </p>
          </div>

          <div className={styles.contactCard}>
            <div className={styles.contactCardTop}>
              <span>Start a conversation</span>
            </div>
            <a className={styles.emailLink} href="mailto:marcellamoussa74@gmail.com">
              <span><Mail aria-hidden="true" /> Email me</span>
              <ArrowUpRight aria-hidden="true" />
            </a>
            <a className={styles.emailAddress} href="mailto:marcellamoussa74@gmail.com">
              marcellamoussa74@gmail.com
            </a>
            <div className={styles.contactMeta}>
              <a href="tel:+96170335113"><Phone aria-hidden="true" /> +961 70 335 113</a>
              <span><MapPin aria-hidden="true" /> Lebanon</span>
            </div>
          </div>
        </motion.div>

        <footer className={styles.footer}>
          <p>&copy; 2026 Marcella Moussa.</p>
          <p>Designed &amp; developed with intention.</p>
          <a className={styles.backToTop} href="#work" onClick={handleBackToTopClick}>
            Back to top <ArrowUp aria-hidden="true" />
          </a>
        </footer>
      </div>
    </section>
  );
}
