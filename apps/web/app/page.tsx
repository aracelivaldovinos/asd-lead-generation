import Image from "next/image";
import CTASection from "@/app/components/CTASection";
import HeroImage from "@/app/components/HeroImage";
import SubjectAreaGrid from "@/app/components/SubjectAreaGrid";
import Title from "@/app/components/Title";
import Quotes from "@/app/components/Quotes";
import { getSiteConfig } from "@/app/lib/site-config";
import { getSessionMeta } from "@/app/lib/session";

interface PageProps {
  searchParams: Promise<Record<string, string>>;
}

export default async function HomePage({ searchParams }: PageProps) {
  const [params, config, session] = await Promise.all([searchParams, getSiteConfig(), getSessionMeta()]);

  const isExternalReferer = session?.dom_referer && !session.dom_referer.startsWith(session.dom_current);
  const effectiveParams: Record<string, string> = { ...params };
  if (!effectiveParams.utm_source && !effectiveParams.utm_medium && !isExternalReferer) {
    effectiveParams.utm_source = "other";
    effectiveParams.utm_medium = "direct";
  }

  if (config.type === "hub") {
    return (
      <>
        <div className="relative flex items-center justify-center h-64 overflow-hidden w-full">
          <div className="absolute inset-x-0 text-2xl text-center font-bold text-white p-2 md:p-8 z-10">
            {config.page.description}
          </div>
          <Image
            className="h-full w-full object-cover object-left"
            src="/acols/hero.png"
            alt="banner"
            priority
            height={350}
            width={2800}
          />
        </div>
        <main className="w-full max-w-5xl mx-auto">
          <div className="flex flex-col items-center p-4 space-y-2">
            <h3 className="text-4xl font-bold text-center text-gray-900">{config.page.title}</h3>
            <Image src="/acols/chevron.svg" alt="down arrow" width={32} height={32} />
          </div>
          <div className="md:px-24 py-4">
            <SubjectAreaGrid subjects={config.subjects} existingParams={effectiveParams} />
          </div>
        </main>
      </>
    );
  }

  const funnelParams: Record<string, string> = { marketContext: config.marketContext, ...effectiveParams };

  return (
    <main className="w-full max-w-5xl mx-auto">
      <Title title={config.page.title} description={config.page.description} />
      <div className="relative">
        <HeroImage src={config.page.heroImage} />
        <div className="md:absolute md:top-1/2 md:right-8 md:-translate-y-1/2">
          <div
            className="text-white rounded-xl"
            style={{ backgroundColor: "var(--color-primary)" }}
          >
            <CTASection
              prefilterQuestions={config.prefilterQuestions}
              existingParams={funnelParams}
            />
          </div>
        </div>
      </div>
      <div className="w-full px-4 py-10 text-lg leading-5">
        <Quotes quotes={config.page.quotes} />
        {config.page.bodyContent && (
          <div className="mt-6 space-y-4" dangerouslySetInnerHTML={{ __html: config.page.bodyContent }} />
        )}
      </div>
    </main>
  );
}
