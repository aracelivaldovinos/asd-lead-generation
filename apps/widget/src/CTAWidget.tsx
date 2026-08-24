import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useFilters } from "@asd/services";
import { selectPrefilterQuestions } from "@asd/domain";
import CTA from "@asd/ui/src/components/cta/CTA";

interface CTAWidgetProps {
  dataset: DOMStringMap;
}

declare global {
  interface Window {
    ASD_SETTINGS?: {
      marketContext?: string;
      utm_medium?: string;
      utm_source?: string;
      utm_campaign?: string;
      utm_content?: string;
      cid?: string;
      pid?: string;
      KTID?: string;
    };
  }
}

// Read a param from the current page URL
function getUrlParam(name: string): string {
  return new URLSearchParams(window.location.search).get(name) ?? "";
}

// Priority: ASD_SETTINGS → URL param
function getAttribution() {
  const asd = window.ASD_SETTINGS ?? {};
  const pick = (key: keyof typeof asd) =>
    asd[key] || getUrlParam(key as string);

  return {
    marketContext: pick("marketContext"),
    utm_medium:    pick("utm_medium"),
    utm_source:    pick("utm_source"),
    utm_campaign:  pick("utm_campaign"),
    utm_content:   pick("utm_content"),
    cid:           pick("cid"),
    pid:           pick("pid"),
    KTID:          pick("KTID"),
  };
}

function CTAWidgetInner({ dataset }: CTAWidgetProps) {
  const apiUrl = dataset.apiUrl ?? import.meta.env.VITE_API_URL ?? "";
  const attribution = getAttribution();

  const { data } = useFilters(`${apiUrl}/api/filters?${new URLSearchParams(attribution)}`);

  if (!data) return null;

  const ctaType = (dataset.ctaType ?? "prefilter") as
    | "prefilter"
    | "single-dropdown"
    | "button";

  const config = {
    title: dataset.title,
    buttonLabel: dataset.buttonLabel,
  };

  const defaultValues = data.defaultValues ?? {};
  const postalCode = defaultValues.postalCode ?? "";

  const handleSubmit = (formData: FormData) => {
    const params = new URLSearchParams();
    formData.forEach((value, key) => {
      if (value) params.set(key, value.toString());
    });
    if (postalCode && !params.has("postalCode")) params.set("postalCode", postalCode);
    // Forward attribution params
    Object.entries(attribution).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    const redirectUrl = dataset.redirectUrl ?? `${apiUrl}/listings`;
    window.location.href = `${redirectUrl}?${params.toString()}`;
  };

  if (ctaType === "button") {
    return (
      <div className="asd-cta-button">
        <CTA
          variant="button"
          label={config.buttonLabel ?? "FIND SCHOOLS"}
          action="#"
          onClientSubmit={handleSubmit}
        />
      </div>
    );
  }

  if (ctaType === "single-dropdown") {
    const questionKey = dataset.questionKey ?? "subjectArea";
    const questions = selectPrefilterQuestions(data.prefilter, [
      questionKey as any,
    ]);
    if (!questions[0]) return null;
    return (
      <div className="asd-cta-single-dropdown">
        <CTA
          variant="single-dropdown"
          question={questions[0]}
          action="#"
          onClientSubmit={handleSubmit}
          config={config}
        />
      </div>
    );
  }

  const keys = (dataset.questionKeys ?? "postalCode,hsGraduation,education")
    .split(",")
    .map((k) => k.trim()) as any[];
  const questions = selectPrefilterQuestions(data.prefilter, keys);
  return (
    <div className="asd-cta-prefilter">
      <CTA
        questions={questions}
        action="#"
        onClientSubmit={handleSubmit}
        config={config}
        defaultValues={defaultValues}
      />
    </div>
  );
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
