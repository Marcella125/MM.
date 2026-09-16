import type { Metadata } from "next";
import ProjectExperience from "@/src/components/ProjectExperience";

export const metadata: Metadata = { title: "FEMI. — MM. Portfolio", description: "An interactive look at Femi, an AI-powered health platform." };
export default function FemiPage() { return <ProjectExperience project="femi" />; }
