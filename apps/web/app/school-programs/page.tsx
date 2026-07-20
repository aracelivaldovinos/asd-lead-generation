import Image from "next/image";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";
import CTASection from "@/app/components/CTASection";
import ListingsSection from "@/app/components/ListingsSection";
import { getSiteConfig, getPrefilterQuestions } from "@/app/lib/site-config";

interface PageProps {
  searchParams: Promise<Record<string, string | string[]>>;
}

export default async function SchoolProgramsPage({ searchParams }: PageProps) {
  const [params, config] = await Promise.all([searchParams, getSiteConfig()]);
  const marketContext = params.marketContext as string | undefined;
  const prefilterQuestions = getPrefilterQuestions(config, marketContext);
  const hasRequiredParams = prefilterQuestions.every((key) => params[key]);

  const hubBanner = config.type === "hub" && (
    <div className="relative flex items-center justify-center h-32 overflow-hidden w-full">
      <div className="absolute inset-x-0 text-xl text-center font-bold text-white p-2 md:p-8 z-10">
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
  );

  if (!hasRequiredParams) {
    if (config.type === "funnel") redirect("/");

    return (
      <>
        {hubBanner}
        <main className="flex justify-center py-12 px-8">
          <div className="text-white rounded-xl" style={{ backgroundColor: "var(--color-primary)" }}>
            <CTASection
              prefilterQuestions={prefilterQuestions}
              existingParams={params}
            />
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      {hubBanner}
      <ListingsSection params={params} />
    </>
  );
}
