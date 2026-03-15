import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import {
  HeroSection,
  StatCards,
  FeaturedExperts,
  HowItWorks,
  SpecializationAreas,
  WhyChooseUs,
  FAQSection,
  CTABanner,
  PlatformFeatures,
  ExpertRegistrationCTA,
  PsychologicalTestsPreview,
  ExpertQualityProcess,
  BlogSection,
  OnlineTherapyInfo,
  PopularQuestions,
} from "@/components/landing";

export const metadata = {
  title: "Mindely | Online Psikolog, Diyetisyen ve Sağlık Uzmanları",
  description:
    "Psikolog, diyetisyen ve sağlık uzmanları ile online görüşme yapın. Randevu alın, psikolojik testler çözün. Online terapi platformu.",
  keywords: [
    "online psikolog",
    "online diyetisyen",
    "terapi platformu",
    "psikolojik test",
    "online görüşme",
    "mental sağlık",
  ],
  openGraph: {
    title: "Mindely | Online Psikolog ve Sağlık Uzmanları",
    description:
      "Mental sağlık ve yaşam sağlığı uzmanlarını sizinle buluşturan modern online platform.",
  },
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <StatCards />
        <FeaturedExperts />
        <OnlineTherapyInfo />
        <HowItWorks />
        <PlatformFeatures />
        <WhyChooseUs />
        <ExpertRegistrationCTA />
        <ExpertQualityProcess />
        <SpecializationAreas />
        <PsychologicalTestsPreview />
        <BlogSection />
        <PopularQuestions />
        <FAQSection />
        <CTABanner />
      </main>
      <Footer />
    </div>
  );
}
