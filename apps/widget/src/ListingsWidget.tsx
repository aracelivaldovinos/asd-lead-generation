import { useState, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useFilters, useListings, fetchRFI } from "@asd/services";
import { selectPrefilterQuestions } from "@asd/domain";
import { RFIResponse } from "@asd/domain";
import { useRFIStore } from "@asd/ui/src/store/rfiStore";
import CTA from "@asd/ui/src/components/cta/CTA";
import ListingsPage from "@asd/ui/src/components/listings/ListingsPage";
import RFIForm from "@asd/ui/src/components/rfi/RFIForm";

type View = "cta" | "listings" | "rfi";

interface Props {
  dataset: DOMStringMap;
}

function ListingsWidgetInner({ dataset }: Props) {
  const apiUrl = dataset.apiUrl ?? import.meta.env.VITE_API_URL ?? "";

  const requiredKeys = (
    dataset.questionKeys ?? "subjectArea,hsGraduation,education"
  )
    .split(",")
    .map((k) => k.trim());

  const [filterValues, setFilterValues] = useState<Record<string, string>>(() => {
    const params = new URLSearchParams(window.location.search);
    const values: Record<string, string> = {};
    params.forEach((value, key) => { values[key] = value; });
    return values;
  });

  const [view, setView] = useState<View>(() =>
    requiredKeys.every((k) => new URLSearchParams(window.location.search).has(k))
      ? "listings"
      : "cta"
  );
  const [rfiResponse, setRfiResponse] = useState<RFIResponse | null>(null);

  const { data: filtersData } = useFilters(`${apiUrl}/api/filters`);
  const { queue, currentProgram, initQueue } = useRFIStore();

  const { data: listings = [] } = useListings(`${apiUrl}/api/listings`, {
    ...filterValues,
    s: "",
    marketContext: "",
    utm_medium: "",
    utm_source: "",
  });

  useEffect(() => {
    if (view !== "rfi" || !currentProgram) return;
    fetchRFI(`${apiUrl}/api/rfi`, {
      programId: currentProgram.programId,
      marketContext: "",
      s: "",
    }).then(setRfiResponse);
  }, [view, currentProgram, apiUrl]);

  if (!filtersData) return null;

  const config = {
    title: dataset.title,
    buttonLabel: dataset.buttonLabel,
  };


  const updateUrl = (values: Record<string, string>) => {
    const params = new URLSearchParams();
    Object.entries(values).forEach(([k, v]) => { if (v) params.set(k, v); });
    window.history.pushState({}, "", `?${params.toString()}`);
  };

  const handleCTAAction = (formData: FormData) => {
    const values: Record<string, string> = {};
    formData.forEach((value, key) => {
      if (value) values[key] = value.toString();
    });
    setFilterValues(values);
    updateUrl(values);
    setView("listings");
  };

  const handleApplyFilters = (values: Record<string, string>) => {
    setFilterValues(values);
    updateUrl(values);
  };

  const handleNextStep = () => {
    initQueue(queue);
    setView("rfi");
  };

  if (view === "cta") {
    const questions = selectPrefilterQuestions(
      filtersData.prefilter,
      requiredKeys as any[]
    );
    return (
      <CTA questions={questions} action="#" onClientSubmit={handleCTAAction} config={config} />
    );
  }

  if (view === "rfi" && currentProgram && rfiResponse) {
    return (
      <RFIForm
        response={rfiResponse}
        programs={queue}
        submitUrl={`${apiUrl}/api/rfi`}
        onComplete={() => setView("listings")}
        onProgramChange={() => {}}
        onProgramSkip={() => {}}
      />
    );
  }

  return (
    <ListingsPage
      listings={listings}
      filters={filtersData.filters}
      initialValues={filterValues}
      onApplyFilters={handleApplyFilters}
      onNextStep={handleNextStep}
    />
  );
}

export default function ListingsWidget({ dataset }: Props) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: { queries: { staleTime: Infinity } },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ListingsWidgetInner dataset={dataset} />
    </QueryClientProvider>
  );
}
