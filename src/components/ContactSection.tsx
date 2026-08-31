"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, MapPin, Phone } from "lucide-react";
import { useHydratedReducedMotion } from "./useHydratedReducedMotion";

const ease = [0.22, 1, 0.36, 1] as const;

export default function ContactSection() {
  const prefersReducedMotion = useHydratedReducedMotion();

  return (
    <section className="contact-section" id="contact" aria-labelledby="contact-heading">
      <motion.div
        className="contact-pixel-board"
        initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.24 }}
        transition={{ duration: 0.6, ease }}
      >
        <div className="contact-pixel-bar" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>

        <div className="contact-pixel-copy">
          <p className="contact-kicker">AVAILABLE FOR COLLABS</p>
          <h2 className="contact-title" id="contact-heading">
            LET&apos;S MAKE THE NEXT PIXEL COUNT.
          </h2>
          <p className="contact-text">
            Have a website, interface, or visual idea that needs a sharper digital
            shape? Send the brief and I will bring the build energy.
          </p>
        </div>

        <div className="contact-pixel-actions">
          <motion.a
            className="contact-primary-link"
            href="tel:+96170335113"
            whileHover={prefersReducedMotion ? undefined : { x: 6, y: -4 }}
            transition={{ duration: 0.2, ease }}
          >
            <Phone size={20} strokeWidth={2.2} />
            CONTACT ME
            <ArrowUpRight size={20} strokeWidth={2.2} />
          </motion.a>
          <div className="contact-mini-links" aria-label="Contact options">
            <a href="mailto:marcellamoussa74@gmail.com">MARCELLAMOUSSA74@GMAIL.COM</a>
            <a href="#work">BACK TO TOP</a>
          </div>
          <div className="contact-social-row" aria-label="Social links and location">
            <a href="#" aria-label="LinkedIn profile">
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                width="18"
                height="18"
              >
                <path
                  d="M6.94 8.98H3.6V20h3.34V8.98ZM5.27 4a1.94 1.94 0 1 0 0 3.88 1.94 1.94 0 0 0 0-3.88ZM20.4 13.69c0-3.12-1.67-4.57-3.9-4.57-1.8 0-2.6.99-3.05 1.68V8.98h-3.2V20h3.34v-5.45c0-1.44.27-2.84 2.06-2.84 1.76 0 1.79 1.65 1.79 2.93V20h3.34v-6.31h-.38Z"
                  fill="currentColor"
                />
              </svg>
            </a>
            <a href="#" aria-label="Instagram profile">
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                width="18"
                height="18"
              >
                <rect
                  x="4"
                  y="4"
                  width="16"
                  height="16"
                  rx="4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <circle
                  cx="12"
                  cy="12"
                  r="3.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <circle cx="16.8" cy="7.2" r="1.2" fill="currentColor" />
              </svg>
            </a>
            <span className="contact-location">
              <MapPin size={18} strokeWidth={2.2} />
              LEBANON
            </span>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
