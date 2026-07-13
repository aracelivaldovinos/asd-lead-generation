import { redirect } from "next/navigation";
import { selectPrefilterQuestions } from "@asd/domain";
import CTA from "@asd/ui/src/components/cta/CTA";
import { getCachedFilters } from "@/app/lib/filters";

export default async function CTASection({ redirectPath = "/listings" }: { redirectPath?: string }) {
  const { prefilter } = await getCachedFilters();

  const questions = selectPrefilterQuestions(prefilter, [
    "subjectArea",
    "hsGraduation",
    "education",
  ]);

  async function handleSearch(formData: FormData) {
    "use server";
    const params = new URLSearchParams();
    formData.forEach((value, key) => {
      if (value && !key.startsWith("$ACTION")) params.set(key, value.toString());
    });
    redirect(`${redirectPath}?${params.toString()}`);
  }

  return <CTA questions={questions} action={handleSearch} />;
}
