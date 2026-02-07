import { Navigation } from "@/components/navigation";
import { Hero } from "@/components/hero";
import { CoursesSection } from "@/components/courses-section";
import { AboutSection } from "@/components/about-section";
import { ReviewsSection } from "@/components/reviews-section";
import { FaqSection } from "@/components/faq-section";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <Hero />
      <CoursesSection />
      <AboutSection />
      <ReviewsSection />
      <FaqSection />
      <Footer />
    </main>
  );
}
