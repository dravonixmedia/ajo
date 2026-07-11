import Header from "@/components/Header";
import Hero from "@/components/sections/Hero";
import Introduction from "@/components/sections/Introduction";
import SelectedWorks from "@/components/sections/SelectedWorks";
import SignatureStory from "@/components/sections/SignatureStory";
import About from "@/components/sections/About";
import Services from "@/components/sections/Services";
import ClientExperience from "@/components/sections/ClientExperience";
import Testimonials from "@/components/sections/Testimonials";
import RecentStories from "@/components/sections/RecentStories";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main className="relative">
        <Hero />
        <Introduction />
        <SelectedWorks />
        <SignatureStory />
        <About />
        <Services />
        <ClientExperience />
        <Testimonials />
        <RecentStories />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
