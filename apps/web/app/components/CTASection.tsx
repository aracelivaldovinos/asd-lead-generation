import { redirect } from "next/navigation";
import { selectPrefilterQuestions } from "@asd/domain";
import CTA from "@asd/ui/src/components/cta/CTA";
import { getCachedFilters } from "@/app/lib/filters";
import { getGeoData } from "@/app/lib/geo";

interface CTASectionProps {
  redirectPath?: string;
  prefilterQuestions: string[];
  existingParams?: Record<string, string | string[]>;
}

export default async function CTASection({
  redirectPath = "/school-programs",
  prefilterQuestions,
  existingParams = {},
}: CTASectionProps) {
  const [{ prefilter }, { postalCode }] = await Promise.all([
    getCachedFilters(existingParams),
    getGeoData(),
  ]);

  const questions = selectPrefilterQuestions(prefilter, prefilterQuestions);

  async function handleSearch(formData: FormData) {
    "use server";
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(existingParams)) {
      if (Array.isArray(value)) value.forEach((v) => params.append(key, v));
      else params.set(key, value);
    }
    formData.forEach((value, key) => {
      if (value && !key.startsWith("$ACTION")) params.set(key, value.toString());
    });
    if (postalCode && !params.has("postalCode")) params.set("postalCode", postalCode);
    redirect(`${redirectPath}?${params.toString()}`);
  }

  return <CTA questions={questions} action={handleSearch} defaultValues={{ postalCode }} />;
}
