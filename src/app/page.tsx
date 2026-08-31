import Header from "@/src/components/Header";
import AboutSection from "@/src/components/AboutSection";
import Hero from "@/src/components/Hero";
import ProjectStrip from "@/src/components/ProjectStrip";

export default function Home() {
  return (
    <main className="homepage">
      <Header />
      <Hero />
      <ProjectStrip />
      <AboutSection />
    </main>
  );
}
