import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useFilters } from "@asd/services";
import { selectPrefilterQuestions } from "@asd/domain";
import CTA from "@asd/ui/src/components/cta/CTA";

interface CTAWidgetProps {
  dataset: DOMStringMap;
}

function CTAWidgetInner({ dataset }: CTAWidgetProps) {
  const apiUrl = dataset.apiUrl ?? import.meta.env.VITE_API_URL ?? "";
  const { data } = useFilters(`${apiUrl}/api/filters`);

  if (!data) return null;

  const ctaType = (dataset.ctaType ?? "prefilter") as
    | "prefilter"
    | "single-dropdown"
    | "button";

  const config = {
    title: dataset.title,
    buttonLabel: dataset.buttonLabel,
  };

  const handleSubmit = (formData: FormData) => {
    const params = new URLSearchParams();
    formData.forEach((value, key) => {
      if (value) params.set(key, value.toString());
    });
    const redirectUrl = dataset.redirectUrl ?? `${apiUrl}/listings`;
    window.location.href = `${redirectUrl}?${params.toString()}`;
  };

  if (ctaType === "button") {
    return (
      <CTA
        variant="button"
        label={config.buttonLabel ?? "Find Schools"}
        action="#"
        onClientSubmit={handleSubmit}
      />
    );
  }

  if (ctaType === "single-dropdown") {
    const questionKey = dataset.questionKey ?? "subjectArea";
    const questions = selectPrefilterQuestions(data.prefilter, [
      questionKey as any,
    ]);
    if (!questions[0]) return null;
    return (
      <CTA
        variant="single-dropdown"
        question={questions[0]}
        action="#"
        onClientSubmit={handleSubmit}
        config={config}
      />
    );
  }

  const keys = (dataset.questionKeys ?? "subjectArea,hsGraduation,education")
    .split(",")
    .map((k) => k.trim()) as any[];
  const questions = selectPrefilterQuestions(data.prefilter, keys);
  return <CTA questions={questions} action="#" onClientSubmit={handleSubmit} config={config} />;
}

export default function CTAWidget({ dataset }: CTAWidgetProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: { queries: { staleTime: Infinity } },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <CTAWidgetInner dataset={dataset} />
    </QueryClientProvider>
  );
}
