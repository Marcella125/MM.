import Header from "@/src/components/Header";
import AboutSection from "@/src/components/AboutSection";
import Hero from "@/src/components/Hero";
import ProjectStrip from "@/src/components/ProjectStrip";
import ProjectsSection from "@/src/components/ProjectsSection";
import ContactSection from "@/src/components/ContactSection";
import CinematicSectionStack from "@/src/components/CinematicSectionStack";
import stackStyles from "@/src/components/CinematicSectionStack.module.css";

export default function Home() {
  return (
    <main className="homepage">
      <Header />
      <CinematicSectionStack>
        <div className={stackStyles.homeLayer}>
          <Hero />
          <ProjectStrip />
        </div>
        <AboutSection />
        <ProjectsSection />
        <ContactSection />
      </CinematicSectionStack>
    </main>
  );
}
