import type { Metadata } from "next";
import ProjectExperience from "@/src/components/ProjectExperience";

export const metadata: Metadata = { title: "RUSHD. — MM. Portfolio", description: "An interactive look at Rushd, a bilingual creative experience." };
export default function RushdPage() { return <ProjectExperience project="rushd" />; }
