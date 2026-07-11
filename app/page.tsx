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
import { getHeroSlides, getSignatureStory, getTestimonialBackgrounds } from "@/lib/content/photoScanner";

export default function Home() {
  const heroSlides = getHeroSlides();
  const signatureStory = getSignatureStory();
  const testimonialBackgrounds = getTestimonialBackgrounds();

  return (
    <>
      <Header />
      <main className="relative">
        <Hero slides={heroSlides} />
        <Introduction />
        <SelectedWorks />
        <SignatureStory story={signatureStory} />
        <About />
        <Services />
        <ClientExperience />
        <Testimonials backgrounds={testimonialBackgrounds} />
        <RecentStories />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
