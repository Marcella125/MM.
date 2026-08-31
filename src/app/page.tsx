import Header from "@/src/components/Header";
import Hero from "@/src/components/Hero";
import ProjectStrip from "@/src/components/ProjectStrip";

export default function Home() {
  return (
    <main className="homepage">
      <Header />
      <Hero />
      <ProjectStrip />
    </main>
  );
}
