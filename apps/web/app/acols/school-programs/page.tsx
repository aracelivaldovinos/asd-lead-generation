import CTASection from "@/app/components/CTASection";
import ListingsSection from "@/app/components/ListingsSection";

const CTA_REQUIRED_PARAMS = ["subjectArea", "hsGraduation", "education"] as const;

interface PageProps {
  searchParams: Promise<Record<string, string>>;
}

export default async function SchoolProgramsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const hasRequiredParams = CTA_REQUIRED_PARAMS.every((key) => params[key]);

  if (!hasRequiredParams) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50 p-8">
        <div className="w-full max-w-3xl">
          <CTASection redirectPath="/acols/school-programs" />
        </div>
      </main>
    );
  }

  return <ListingsSection params={params} />;
}
