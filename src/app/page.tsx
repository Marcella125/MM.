import Header from "@/src/components/Header";
import AboutSection from "@/src/components/AboutSection";
import Hero from "@/src/components/Hero";
import ProjectStrip from "@/src/components/ProjectStrip";
import ProjectsSection from "@/src/components/ProjectsSection";
import ContactSection from "@/src/components/ContactSection";
import MusicTransition from "@/src/components/MusicTransition";

export default function Home() {
  return (
    <main className="homepage">
      <Header />
      <Hero />
      <ProjectStrip />
      <MusicTransition track="02" title="About me" />
      <AboutSection />
      <MusicTransition track="03" title="Selected projects" />
      <ProjectsSection />
      <MusicTransition track="04" title="Let’s connect" />
      <ContactSection />
    </main>
  );
}
