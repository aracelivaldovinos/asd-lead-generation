"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useRouter, usePathname } from "next/navigation";
import { FiltersResponse, Listing, Program, RFIResponse, groupPrograms } from "@asd/domain";
import { fetchRFI } from "@asd/services";
import ListingsPage from "@asd/ui/src/components/listings/ListingsPage";
import RFIModal from "@asd/ui/src/components/rfi/RFIModal";
import { useRFIStore } from "@asd/ui/src/store/rfiStore";

interface ListingsClientProps {
  listings: Listing[];
  filters: FiltersResponse;
  initialValues: Record<string, string | string[]>;
  message?: string;
}

export default function ListingsClient({ listings, filters, initialValues, message }: ListingsClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { queue, initQueue, initPrograms } = useRFIStore();
  const [queryClient] = useState(() => new QueryClient());
  const [modalOpen, setModalOpen] = useState(false);
  const [rfiResponse, setRfiResponse] = useState<RFIResponse | null>(null);

  const getUrlParams = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const params: Record<string, string> = {};
    urlParams.forEach((value, key) => { params[key] = value; });
    return params;
  };

  const fetchRFIForProgram = async (program: Program) => {
    setRfiResponse(null);
    const params = getUrlParams();
    const rfi = await fetchRFI("/api/rfi", {
      programId: program.programId,
      marketContext: params.marketContext ?? "",
      s: "",
      ...params,
    });
    setRfiResponse(rfi);
  };

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

  const handleNextStep = () => {
    const programs = queue;
    initQueue(programs);
    initPrograms(groupPrograms(listings).rfis);
    setModalOpen(true);
    if (programs[0]) fetchRFIForProgram(programs[0]);
  };

  const handleProgramChange = (program: Program) => {
    fetchRFIForProgram(program);
  };

  const handleClose = () => {
    setModalOpen(false);
    setRfiResponse(null);
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
          submitUrl="/api/rfi"
          onClose={handleClose}
          onProgramChange={handleProgramChange}
          onProgramSkip={handleClose}
        />
      </QueryClientProvider>
    </>
  );
}
