"use client";

import { useState, useEffect, useRef } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { FiltersResponse, Listing, DEFAULT_GROUPS } from "@asd/domain";
import { useGroupedListings, type ListingsParams } from "@asd/services";
import ListingsPage from "@asd/ui/src/components/listings/ListingsPage";
import RFIModal from "@asd/ui/src/components/rfi/RFIModal";
import { useRFIFlow } from "@asd/ui/src/hooks/useRFIFlow";
import { useRFIStore } from "@asd/ui/src/store/rfiStore";
import { useFormStore } from "@asd/ui/src/store/formStore";

interface ListingsClientProps {
  listings: Listing[];
  filters: FiltersResponse;
  initialValues: Record<string, string | string[]>;
}

function ListingsClientInner({ listings: initialListings, filters, initialValues }: ListingsClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    useRFIStore.getState().clearQueue();
  }, []);

  const initialDataRef = useRef<Listing[] | undefined>(initialListings);
  useEffect(() => { initialDataRef.current = undefined; }, []);

  const savedValues = useFormStore((state) => state.savedValues);
  const inquiries = useRFIStore((state) => state.inquiries);

  const inquiryParams = Object.fromEntries(
    Object.entries(inquiries).map(([programId, ts]) => [`inquiries[${programId}]`, ts as string])
  );

  const { listings, allListings, refetchAll, message } = useGroupedListings(
    "/api/listings",
    { ...Object.fromEntries(searchParams.entries()), ...savedValues, ...inquiryParams } as ListingsParams,
    DEFAULT_GROUPS,
    initialDataRef.current, // pre-seeds group 1 on first render only — clears after mount so param changes fetch fresh
  );

  const { modalOpen, showThankYou, isLoadingNext, rfiResponse, rfiError, handleNextStep, handleProgramChange, handleClose, handleSkip, handleComplete } = useRFIFlow({
    listings,
    searchParams: Object.fromEntries(searchParams.entries()),
    rfiEndpoint: "/api/rfi",
    fetchListings: refetchAll,
    onListingsUpdate: () => {},
  });

  const handleApplyFilters = (values: Record<string, string | string[]>) => {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(values)) {
      if (Array.isArray(value)) {
        value.forEach((v) => params.append(key, v));
      } else if (value) {
        params.set(key, value);
      }
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <>
      <ListingsPage
        listings={listings}
        filters={filters}
        initialValues={initialValues}
        message={message}
        onApplyFilters={handleApplyFilters}
        onNextStep={handleNextStep}
      />
      <RFIModal
        isOpen={modalOpen}
        showThankYou={showThankYou}
        listings={allListings}
        onClose={handleClose}
        rfi={{
          response: rfiResponse,
          error: rfiError,
          submitUrl: `/api/rfi?${searchParams.toString()}`,
          isLoadingNext,
          onComplete: handleComplete,
          onProgramChange: handleProgramChange,
          onProgramSkip: handleSkip,
        }}
      />
    </>
  );
}

export default function ListingsClient(props: ListingsClientProps) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: { queries: { staleTime: Infinity } },
  }));
  return (
    <QueryClientProvider client={queryClient}>
      <ListingsClientInner {...props} />
    </QueryClientProvider>
  );
}
