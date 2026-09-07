"use client";

import { motion } from "framer-motion";
import { ArrowUp, ArrowUpRight, MapPin, Phone } from "lucide-react";
import type { MouseEvent } from "react";
import { useHydratedReducedMotion } from "./useHydratedReducedMotion";
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
    <section className={styles.section} id="contact" aria-labelledby="contact-heading">
      <div className={styles.inner}>
        <motion.div
          className={styles.contactLayout}
          initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease }}
        >
          <div>
            <p className={styles.eyebrow}>Available for collaborations</p>
            <h2 className={styles.title} id="contact-heading">
              Your next idea.<br /><span>Let’s build it.</span>
            </h2>
            <p className={styles.lede}>
              Have a website, interface, or visual idea in mind? I’d love to hear
              about it and help bring it to life.
            </p>
          </div>
          <div className={styles.contactCard}>
            <span className={styles.label}>A note, a brief, a little hello</span>
            <h3>Let’s make something<br />worth putting out there.</h3>
            <a className={styles.emailLink} href="mailto:marcellamoussa74@gmail.com">
              Send me an email <ArrowUpRight size={22} aria-hidden="true" />
            </a>
            <p className={styles.emailAddress}>
              <a href="mailto:marcellamoussa74@gmail.com">marcellamoussa74@gmail.com</a>
            </p>
            <a className={styles.phoneLink} href="tel:+96170335113">
              <Phone size={16} aria-hidden="true" /> +961 70 335 113
            </a>
          </div>
        </motion.div>
        <footer className={styles.footer}>
          <p>&copy; 2026 Marcella Moussa.</p>
          <span className={styles.location}><MapPin size={15} aria-hidden="true" /> Lebanon</span>
          <a className={styles.backToTop} href="#work" onClick={handleBackToTopClick}>
            Back to top <ArrowUp size={16} aria-hidden="true" />
          </a>
        </footer>
      </div>
    </section>
  );
}
