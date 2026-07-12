"use client";

import { useRouter, usePathname } from "next/navigation";
import { FiltersResponse, Listing } from "@asd/domain";
import ListingsPage from "@asd/ui/src/components/listings/ListingsPage";
import { useRFIStore } from "@asd/ui/src/store/rfiStore";

interface ListingsClientProps {
  listings: Listing[];
  filters: FiltersResponse;
  initialValues: Record<string, string>;
}

export default function ListingsClient({ listings, filters, initialValues }: ListingsClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { queue, initQueue } = useRFIStore();

  const handleApplyFilters = (values: Record<string, string>) => {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(values)) {
      if (value) params.set(key, value);
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleNextStep = () => {
    initQueue(queue);
    router.push(`${pathname}/rfi`);
  };

  return (
    <ListingsPage
      listings={listings}
      filters={filters}
      initialValues={initialValues}
      onApplyFilters={handleApplyFilters}
      onNextStep={handleNextStep}
    />
  );
}
