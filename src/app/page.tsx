import Header from "@/src/components/Header";
import AboutSection from "@/src/components/AboutSection";
import Hero from "@/src/components/Hero";
import ProjectStrip from "@/src/components/ProjectStrip";
import ProjectsSection from "@/src/components/ProjectsSection";
import ContactSection from "@/src/components/ContactSection";

export default function Home() {
  return (
    <main className="homepage">
      <Header />
      <Hero />
      <ProjectStrip />
      <AboutSection />
      <ProjectsSection />
      <ContactSection />
    </main>
  );
}
