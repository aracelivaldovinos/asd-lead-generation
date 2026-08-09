"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { FiltersResponse, Listing } from "@asd/domain";
import ListingsPage from "@asd/ui/src/components/listings/ListingsPage";
import RFIModal from "@asd/ui/src/components/rfi/RFIModal";
import { useRFIFlow } from "@asd/ui/src/hooks/useRFIFlow";

interface ListingsClientProps {
  listings: Listing[];
  filters: FiltersResponse;
  initialValues: Record<string, string | string[]>;
  message?: string;
}

export default function ListingsClient({ listings: initialListings, filters, initialValues, message }: ListingsClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [queryClient] = useState(() => new QueryClient());
  const [clientListings, setClientListings] = useState<Listing[] | null>(null);
  const listings = clientListings ?? initialListings;

  const { modalOpen, rfiResponse, handleNextStep, handleProgramChange, handleClose, handleSkip, handleComplete } = useRFIFlow({
    listings,
    searchParams: Object.fromEntries(searchParams.entries()),
    rfiEndpoint: "/api/rfi",
    fetchListings: () =>
      fetch(`/api/listings?${searchParams.toString()}`)
        .then((r) => r.json())
        .then((d) => d.listings ?? []),
    onListingsUpdate: setClientListings,
  });

  const handleApplyFilters = (values: Record<string, string | string[]>) => {
    setClientListings(null);
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
      <QueryClientProvider client={queryClient}>
        <RFIModal
          isOpen={modalOpen}
          rfiResponse={rfiResponse}
          submitUrl={`/api/rfi?${searchParams.toString()}`}
          onClose={handleClose}
          onComplete={handleComplete}
          onProgramChange={handleProgramChange}
          onProgramSkip={handleSkip}
        />
      </QueryClientProvider>
    </>
  );
}
