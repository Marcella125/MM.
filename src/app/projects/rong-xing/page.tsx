import type { Metadata } from "next";
import ProjectExperience from "@/src/components/ProjectExperience";

export const metadata: Metadata = { title: "RONG XING. — MM. Portfolio", description: "An interactive look at the Rong Xing trading and business website." };
export default function RongXingPage() { return <ProjectExperience project="rong-xing" />; }
