"use client";

import Image from "next/image";
import { ArrowUp, Mail, Phone } from "lucide-react";
import type { MouseEvent } from "react";
import { assetPath } from "@/src/lib/paths";
import ScrollReveal from "./ScrollReveal";
import { GithubLogo, InstagramLogo, LinkedinLogo } from "./SocialIcons";
import styles from "./PortfolioSections.module.css";

const socialLinks = [
  { label: "Instagram", handle: "@moussa_marcella", href: "https://www.instagram.com/moussa_marcella/", Icon: InstagramLogo },
  { label: "LinkedIn", handle: "/marcellamoussa", href: "https://www.linkedin.com/in/marcellamoussa/", Icon: LinkedinLogo },
  { label: "GitHub", handle: "/Marcella125", href: "https://github.com/Marcella125", Icon: GithubLogo },
] as const;

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
  function handleBackToTopClick(event: MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();
    scrollToPageTop();
  }

  return (
    <section className={styles.contactSection} id="contact" aria-labelledby="contact-heading">
      <div className={styles.contactInner}>
        <div className={styles.contactLayout}>
          <ScrollReveal className={styles.contactIntro}>
            <h2 className={styles.contactTitle} id="contact-heading">
              <span className={styles.contactLine}>Good ideas</span>
              <span className={styles.contactLine}>sound better</span>
              <span className={styles.contactLine}><span className={styles.contactHighlight}>together.</span></span>
            </h2>
            <p className={styles.contactDescription}>
              Have a project, a collaboration<br className={styles.desktopBreak} /> or just want to say hi?<br />
              <a href="mailto:marcellamoussa74@gmail.com">I&apos;d love to hear from you.</a>
            </p>
          </ScrollReveal>

          <div className={styles.contactBody}>
            <ScrollReveal className={styles.contactVisual} delay={0.12} lift={50}>
              <div className={styles.contactDisc}>
                <Image
                  className={styles.contactDiscImage}
                  src={assetPath("/assets/disk.png")}
                  alt=""
                  width={1672}
                  height={941}
                  sizes="(max-width: 700px) 85vw, (max-width: 1100px) 50vw, 38vw"
                />
              </div>
            </ScrollReveal>

            <ScrollReveal className={styles.contactLinks} delay={0.2} lift={44}>
              <a className={styles.contactLink} href="mailto:marcellamoussa74@gmail.com">
                <Mail aria-hidden="true" />
                <span><strong>Email</strong><small>marcellamoussa74@gmail.com</small></span>
              </a>
              {socialLinks.map(({ label, handle, href, Icon }) => (
                <a className={styles.contactLink} href={href} target="_blank" rel="noopener noreferrer" key={label}>
                  <Icon aria-hidden="true" />
                  <span><strong>{label}</strong><small>{handle}</small></span>
                </a>
              ))}
              <a className={styles.contactPhone} href="tel:+96170335113">
                <Phone aria-hidden="true" />
                <span><strong>Phone</strong><small>+961 70 335 113</small></span>
              </a>
            </ScrollReveal>
          </div>
        </div>

        <footer className={styles.footer}>
          <p>&copy; 2026 Marcella Moussa.</p>
          <p>Built with care.</p>
          <a className={styles.backToTop} href="#work" onClick={handleBackToTopClick}>
            Back to top <ArrowUp aria-hidden="true" />
          </a>
        </footer>
      </div>
    </section>
  );
}
