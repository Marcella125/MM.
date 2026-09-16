import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import styles from "./ProjectFooter.module.css";

type ProjectFooterProps = {
  index: string;
  current: string;
  statement: ReactNode;
  next: string;
  nextHref: string;
};

export default function ProjectFooter({ index, current, statement, next, nextHref }: ProjectFooterProps) {
  return <footer className={styles.footer} aria-label={`${current} project footer`}>
    <div className={styles.top}><span>END OF PROJECT {index} / 04</span><span>MM. SELECTED WORK</span></div>
    <h2>{statement}</h2>
    <div className={styles.bottom}>
      <Link href={nextHref} className={styles.next}><span>NEXT PROJECT —</span><strong>{next} <ArrowRight aria-hidden="true" /></strong></Link>
      <Link href="/#projects" className={styles.all}>ALL PROJECTS ↗</Link>
    </div>
  </footer>;
}
