import CTASection from "@/app/components/CTASection";
import ListingsSection from "@/app/components/ListingsSection";
import { getSiteConfig } from "@/app/lib/site-config";

interface PageProps {
  searchParams: Promise<Record<string, string | string[]>>;
}

export default async function SchoolProgramsPage({ searchParams }: PageProps) {
  const [params, config] = await Promise.all([searchParams, getSiteConfig()]);
  const hasRequiredParams = config.prefilterQuestions.every((key) => params[key]);

  if (!hasRequiredParams) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50 p-8">
        <div className="w-full max-w-3xl">
          <CTASection
            prefilterQuestions={config.prefilterQuestions}
            existingParams={params}
          />
        </div>
      </main>
    );
  }

  return <ListingsSection params={params} />;
}
