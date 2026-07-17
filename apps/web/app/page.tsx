import CTASection from "@/app/components/CTASection";
import HeroImage from "@/app/components/HeroImage";
import Title from "@/app/components/Title";
import Quotes from "@/app/components/Quotes";
import { getSiteConfig } from "@/app/lib/site-config";

export default async function HomePage() {
  const config = await getSiteConfig();
  const { page } = config;

  return (
    <main className="w-full max-w-5xl mx-auto">
      <Title title={page.title} description={page.description} />
      <div className="relative">
        <HeroImage src={page.heroImage} />
        <div className="md:absolute md:top-1/2 md:right-8 md:-translate-y-1/2">
          <div
            className="text-white rounded-xl p-4 w-full md:w-[350px]"
            style={{ backgroundColor: "var(--color-primary)" }}
          >
            <CTASection
              redirectPath="/school-programs"
              prefilterQuestions={config.prefilterQuestions}
              marketContext={config.marketContext}
            />
          </div>
        </div>
      </div>
      <div className="w-full px-4 py-10 text-lg leading-5">
        <Quotes quotes={page.quotes} />
      </div>
    </main>
  );
}
