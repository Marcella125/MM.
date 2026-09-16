import type { Metadata } from "next";
import KiraExperience from "./KiraExperience";

export const metadata: Metadata = {
  title: "KIRA. — MM. Portfolio",
  description: "An interactive look at Kira, an AI knowledge assistant.",
};

export default function KiraPage() {
  return <KiraExperience />;
}
