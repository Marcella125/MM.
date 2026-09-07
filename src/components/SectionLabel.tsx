import type { ReactNode } from "react";
import styles from "./SectionLabel.module.css";

type SectionLabelProps = {
  children: ReactNode;
};

export default function SectionLabel({ children }: SectionLabelProps) {
  return <p className={styles.label}>{children}</p>;
}
