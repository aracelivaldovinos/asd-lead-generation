import { FiltersResponse, Listing, Program } from "@asd/domain";
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

  const programCount = listings.flatMap((listing) =>
    listing.schools.flatMap((school) =>
      school.locations.flatMap((location) => location.programs)
    )
  ).length;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Available Programs ({programCount})
      </h1>
      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="w-full lg:w-64 lg:shrink-0">
          <FiltersPanel filters={filters} onApply={onApplyFilters} />
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