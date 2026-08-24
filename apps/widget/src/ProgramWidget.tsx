import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useListings } from "@asd/services";
import { groupPrograms } from "@asd/domain";
import ProgramCard from "@asd/ui/src/components/ProgramCard";
import { getAttribution } from "./settings";

interface Props {
  dataset: DOMStringMap;
}

function ProgramWidgetInner({ dataset }: Props) {
  const apiUrl = dataset.apiUrl ?? import.meta.env.VITE_API_URL ?? "";

  const attribution = getAttribution();
  const maxSchools = dataset.maxSchools ?? "1";
  const maxPrograms = dataset.maxPrograms ?? "1";

  const listingsParams = { ...attribution, offerType: "LINKOUT", maxSchools, maxPrograms };
  const { data: listings = [], isLoading } = useListings(
    `${apiUrl}/api/listings`,
    listingsParams
  );

  const bands = new Set((dataset.band ?? "BAND1").split(",").map((b) => b.trim()));
  const { linkouts } = groupPrograms(listings, {
    maxSchools: parseInt(maxSchools),
    maxPrograms: parseInt(maxPrograms),
  });
  const programs = linkouts.filter((p) => bands.has(p.name));

  if (isLoading) return null;

  const title = dataset.title;

  return (
    <div className="asd-program-widget">
      {title && <h2 className="asd-program-title">{title}</h2>}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {programs.map((program) => (
          <ProgramCard key={program.programId} program={program} />
        ))}
      </div>
    </div>
  );
}

export default function ProgramWidget({ dataset }: Props) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: { queries: { staleTime: Infinity } },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ProgramWidgetInner dataset={dataset} />
    </QueryClientProvider>
  );
}
