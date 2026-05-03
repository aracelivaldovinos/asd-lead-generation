import { FiltersResponse, Listing, Program } from "@asd/domain";
import { useState } from "react";
import { useRFIStore } from "../../store/rfiStore";
import ProgramCard from "../ProgramCard";
import FiltersPanel from "./FiltersPanel";

interface ListingsPageProps {
  listings: Listing[];
  filters: FiltersResponse;
  onNextStep: () => void;
  onApplyFilters: (values: Record<string, string>) => void;
}

const ListingsPage = ({ listings, filters, onNextStep, onApplyFilters }: ListingsPageProps) => {
  const { queue } = useRFIStore();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});

  const appliedCount = Object.values(filterValues).filter(Boolean).length;

  const handleApplyFilters = (values: Record<string, string>) => {
    setFilterValues(values);
    onApplyFilters(values);
  };

  const programCount = listings.flatMap((listing) =>
    listing.schools.flatMap((school) =>
      school.locations.flatMap((location) => location.programs)
    )
  ).length;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Available Programs ({programCount})
        </h1>
        {/* Mobile filter button */}
        <button
          onClick={() => setDrawerOpen(true)}
          className="md:hidden flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h18M7 12h10M10 20h4" />
          </svg>
          Filters
          {appliedCount > 0 && (
            <span className="bg-primary text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {appliedCount}
            </span>
          )}
        </button>
      </div>

      {/* Mobile drawer */}
      {drawerOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex flex-col justify-end">
          <div className="absolute inset-0 bg-black/40" onClick={() => setDrawerOpen(false)} />
          <div className="relative bg-white rounded-t-2xl p-6 max-h-[85vh] overflow-y-auto">
            <FiltersPanel
              filters={filters}
              values={filterValues}
              onApply={handleApplyFilters}
              onClose={() => setDrawerOpen(false)}
            />
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-8">
        <aside className="hidden md:block md:w-64 md:shrink-0">
          <FiltersPanel filters={filters} values={filterValues} onApply={handleApplyFilters} />
        </aside>
        <main className="flex-1 pb-24">
          {queue.length > 0 && (
            <div className="fixed bottom-6 left-[calc(50%+8rem)] -translate-x-1/2 z-20">
              <div className="inline-flex items-center gap-8 bg-dark border-2 border-primary rounded-full px-6 py-4">
                <span className="font-semibold text-white">
                  <span className="text-primary font-extrabold">{queue.length}</span> Program{queue.length > 1 ? "s" : ""} selected for submission
                </span>
                <button
                  onClick={onNextStep}
                  className="bg-primary hover:bg-primaryHover text-white font-bold py-2 px-6 rounded-lg transition-colors duration-200"
                >
                  Next Step →
                </button>
              </div>
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {listings.map((listing) =>
              listing.schools.map((school) =>
                school.locations.map((location) =>
                  location.programs.map((program) => (
                    <ProgramCard
                      key={program.programId}
                      program={{
                        ...program,
                        name: listing.name,
                        school: { id: school.id, displayName: school.displayName },
                        instructionMethod: location.instructionMethod,
                      }}
                    />
                  ))
                )
              )
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ListingsPage;