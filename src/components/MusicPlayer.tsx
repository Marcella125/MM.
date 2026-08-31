"use client";

import { motion } from "framer-motion";
import { Earth } from "lucide-react";
import { useHydratedReducedMotion } from "./useHydratedReducedMotion";

export default function MusicPlayer() {
  const prefersReducedMotion = useHydratedReducedMotion();

  return (
    <aside className="music-player" aria-label="Availability">
      <Earth className="location-globe" size={34} strokeWidth={2.1} />
      <div>
        <div>
          Based in{" "}
          <motion.span
            className="location-name"
            data-cursor="interactive"
            whileHover={
              prefersReducedMotion ? undefined : { letterSpacing: "0.08em" }
            }
            transition={{ duration: 0.28, ease: "easeOut" }}
          >
            Lebanon
          </motion.span>
        </div>
      </div>
      <span className="music-player-line" />
    </aside>
  );
}
