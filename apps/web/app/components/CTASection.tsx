import { redirect } from "next/navigation";
import { selectPrefilterQuestions } from "@asd/domain";
import CTA from "@asd/ui/src/components/cta/CTA";
import { getCachedFilters } from "@/app/lib/filters";
import { getGeoData } from "@/app/lib/geo";

interface CTASectionProps {
  redirectPath?: string;
  prefilterQuestions: string[];
  marketContext: string;
  existingParams?: Record<string, string>;
}

export default async function CTASection({
  redirectPath = "/school-programs",
  prefilterQuestions,
  marketContext,
  existingParams = {},
}: CTASectionProps) {
  const [{ prefilter }, { postalCode }] = await Promise.all([
    getCachedFilters(),
    getGeoData(),
  ]);

  const questions = selectPrefilterQuestions(prefilter, prefilterQuestions);

  async function handleSearch(formData: FormData) {
    "use server";
    const params = new URLSearchParams(existingParams);
    formData.forEach((value, key) => {
      if (value && !key.startsWith("$ACTION")) params.set(key, value.toString());
    });
    if (marketContext) params.set("marketContext", marketContext);
    if (postalCode && !params.has("postalCode")) params.set("postalCode", postalCode);
    redirect(`${redirectPath}?${params.toString()}`);
  }

  return <CTA questions={questions} action={handleSearch} defaultValues={{ postalCode }} />;
}
