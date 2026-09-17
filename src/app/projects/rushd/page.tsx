import type { Metadata } from "next";
import ProjectExperience from "@/src/components/ProjectExperience";

export const metadata: Metadata = { title: "RUSHD. — MM. Portfolio", description: "An interactive bilingual website for Rushd Center, connecting research on technology, ethics, and Islamic thought." };
export default function RushdPage() { return <ProjectExperience project="rushd" />; }
