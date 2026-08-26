import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useFilters, useGroupedListings, DEFAULT_GROUPS } from "@asd/services";
import { selectPrefilterQuestions } from "@asd/domain";
import { useRFIFlow } from "@asd/ui/src/hooks/useRFIFlow";
import { useRFIStore, type RFIStore } from "@asd/ui/src/store/rfiStore";
import { useFormStore } from "@asd/ui/src/store/formStore";
import CTA from "@asd/ui/src/components/cta/CTA";
import ListingsPage from "@asd/ui/src/components/listings/ListingsPage";
import RFIModal from "@asd/ui/src/components/rfi/RFIModal";
import { getAttribution } from "./settings";

type View = "cta" | "listings";

interface Props {
  dataset: DOMStringMap;
}

function ListingsWidgetInner({ dataset }: Props) {
  const apiUrl = dataset.apiUrl ?? import.meta.env.VITE_API_URL ?? "";
  const attribution = getAttribution();

  const requiredKeys = (dataset.questionKeys ?? "postalCode,hsGraduation,education")
    .split(",")
    .map((k) => k.trim());

  const [filterValues, setFilterValues] = useState<Record<string, string | string[]>>(() => {
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

  const { data: filtersData } = useFilters(`${apiUrl}/api/filters?${new URLSearchParams(attribution)}`);

  const flatFilterValues = Object.fromEntries(
    Object.entries(filterValues).map(([k, v]) => [k, Array.isArray(v) ? v[0] : v])
  );

  const inquiries = useRFIStore((state: RFIStore) => state.inquiries);
  const savedValues = useFormStore((state) => state.savedValues);

  const inquiryParams = Object.fromEntries(
    Object.entries(inquiries).map(([programId, ts]) => [`inquiries[${programId}]`, ts as string])
  );

  const listingsParams = { ...attribution, ...flatFilterValues, ...savedValues, ...inquiryParams };

  const groups = dataset.providers
    ? dataset.providers.split("|").map((g) => g.split(",").map((s) => s.trim()).filter(Boolean))
    : DEFAULT_GROUPS;

  const { listings, allListings, refetchAll, message } = useGroupedListings(`${apiUrl}/api/listings`, listingsParams, groups);

  const fetchListingsData = () => refetchAll();

  const {
    modalOpen,
    showThankYou,
    rfiResponse,
    rfiError,
    isLoadingNext,
    handleNextStep,
    handleProgramChange,
    handleClose,
    handleSkip,
    handleComplete,
  } = useRFIFlow({
    listings,
    searchParams: { ...attribution, ...flatFilterValues },
    rfiEndpoint: `${apiUrl}/api/rfi`,
    fetchListings: fetchListingsData,
    onListingsUpdate: () => {},
  });

  if (!filtersData) return null;

  const config = {
    title: dataset.title,
    buttonLabel: dataset.buttonLabel,
  };

  const updateUrl = (values: Record<string, string | string[]>) => {
    const params = new URLSearchParams();
    Object.entries(values).forEach(([k, v]) => {
      if (Array.isArray(v)) v.forEach((s) => params.append(k, s));
      else if (v) params.set(k, v);
    });
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

  const handleApplyFilters = (values: Record<string, string | string[]>) => {
    setFilterValues(values);
    updateUrl(values);
  };

  return (
    <>
      {view === "cta" ? (
        <CTA
          questions={selectPrefilterQuestions(filtersData.prefilter, requiredKeys as any[])}
          action="#"
          onClientSubmit={handleCTAAction}
          config={config}
        />
      ) : (
        <ListingsPage
          listings={listings}
          filters={filtersData.filters}
          initialValues={filterValues}
          message={message}
          onApplyFilters={handleApplyFilters}
          onNextStep={handleNextStep}
        />
      )}
      <RFIModal
        isOpen={modalOpen}
        showThankYou={showThankYou}
        listings={allListings}
        rfi={{
          response: rfiResponse,
          error: rfiError,
          submitUrl: `${apiUrl}/api/rfi?${new URLSearchParams(attribution)}`,
          isLoadingNext,
          onComplete: handleComplete,
          onProgramChange: handleProgramChange,
          onProgramSkip: handleSkip,
        }}
        onClose={handleClose}
      />
    </>
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
