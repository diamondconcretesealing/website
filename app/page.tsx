import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Services } from "@/components/Services";
import { Benefits } from "@/components/Benefits";
import { Process } from "@/components/Process";
import { Projects } from "@/components/Projects";
import { Reviews } from "@/components/Reviews";
import { FAQ } from "@/components/FAQ";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { JsonLd } from "@/components/JsonLd";

// Rebuild the page at most once an hour so newly published Sanity projects
// appear without a manual deploy. No webhooks to configure or break.
export const revalidate = 3600;

export default function Home() {
  return (
    <>
      <Header />
      <main id="main" className="flex-1">
        <Hero />
        <About />
        <Services />
        <Benefits />
        <Process />
        <Projects />
        <Reviews />
        <FAQ />
        <Contact />
      </main>
      <Footer />
      <JsonLd />
    </>
  );
}
