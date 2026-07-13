import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useListings } from "@asd/services";
import { groupPrograms } from "@asd/domain";
import ProgramCard from "@asd/ui/src/components/ProgramCard";

interface Props {
  dataset: DOMStringMap;
}

function ProgramWidgetInner({ dataset }: Props) {
  const apiUrl = dataset.apiUrl ?? import.meta.env.VITE_API_URL ?? "";

  const filterParams = Object.fromEntries(
    Object.entries(dataset).filter(([, v]) => v !== undefined)
  ) as Record<string, string>;

  const maxSchools = dataset.maxSchools ?? "1";
  const maxPrograms = dataset.maxPrograms ?? "1";

  const { data: listings = [], isLoading } = useListings(
    `${apiUrl}/api/listings`,
    {
      ...filterParams,
      offerType: "LINKOUT",
      maxSchools,
      maxPrograms,
      s: "",
      marketContext: "",
      utm_medium: "",
      utm_source: "",
    }
  );

  const { linkouts: programs } = groupPrograms(listings, {
    maxSchools: parseInt(maxSchools),
    maxPrograms: parseInt(maxPrograms),
  });

  if (isLoading) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {programs.map((program) => (
        <ProgramCard key={program.programId} program={program} />
      ))}
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
