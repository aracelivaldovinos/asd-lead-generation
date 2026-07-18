import CTASection from "@/app/components/CTASection";
import HeroImage from "@/app/components/HeroImage";
import Title from "@/app/components/Title";
import Quotes from "@/app/components/Quotes";
import { getSiteConfig } from "@/app/lib/site-config";
import { getSessionMeta } from "@/app/lib/session";

interface PageProps {
  searchParams: Promise<Record<string, string>>;
}

export default async function HomePage({ searchParams }: PageProps) {
  const [params, config, session] = await Promise.all([searchParams, getSiteConfig(), getSessionMeta()]);
  const { page } = config;
  
  const effectiveParams: Record<string, string> = { marketContext: config.marketContext, ...params };
  const isExternalReferer = session?.dom_referer && !session.dom_referer.startsWith(session.dom_current);
  
  //Review this referer***
  if (!effectiveParams.utm_source && !effectiveParams.utm_medium && !isExternalReferer) {
    effectiveParams.utm_source = "other";
    effectiveParams.utm_medium = "direct";
  }

  return (
    <main className="w-full max-w-5xl mx-auto">
      <Title title={page.title} description={page.description} />
      <div className="relative">
        <HeroImage src={page.heroImage} />
        <div className="md:absolute md:top-1/2 md:right-8 md:-translate-y-1/2">
          <div
            className="text-white rounded-xl"
            style={{ backgroundColor: "var(--color-primary)" }}
          >
            <CTASection
              prefilterQuestions={config.prefilterQuestions}
              existingParams={effectiveParams}
            />
          </div>
        </div>
      </div>
      <div className="w-full px-4 py-10 text-lg leading-5">
        <Quotes quotes={page.quotes} />
        {page.bodyContent && (
          <div className="mt-6 space-y-4" dangerouslySetInnerHTML={{ __html: page.bodyContent }} />
        )}
      </div>
    </main>
  );
}
