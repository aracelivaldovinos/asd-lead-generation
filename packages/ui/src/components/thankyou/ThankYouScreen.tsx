import { Listing, extractThankYouLinkouts } from "@asd/domain";
import EnvelopeIcon from "../../assets/svg/EnvelopeIcon";
import CircleCheckIcon from "../../assets/svg/CircleCheckIcon";
import PreppedForSuccess from "./PreppedForSuccess";
import ProgramListingCard from "./ProgramListingCard";
import { useFormStore } from "../../store/formStore";
import { useRFIStore, selectSubmittedPrograms } from "../../store/rfiStore";
import { useShallow } from "zustand/react/shallow";

interface ThankYouScreenProps {
  listings: Listing[];
}

const ThankYouScreen = ({ listings }: ThankYouScreenProps) => {
  const firstName = useFormStore((s) => s.savedValues["firstName"]);
  const submittedPrograms = useRFIStore(useShallow(selectSubmittedPrograms));
  const linkouts = extractThankYouLinkouts(listings);

  return (
    <div className="bg-white flex flex-col min-h-full">

      {/* Full-width orange banner */}
      <div className="bg-primary text-white px-4 py-3 flex items-center justify-center gap-2 text-sm font-medium flex-shrink-0">
        <EnvelopeIcon />
        Check your email for your confirmation
      </div>

      {/* Two-column layout below banner */}
      <div className="flex flex-1 flex-col lg:flex-row min-h-0">

        {/* Main content */}
        <div className="flex-1 px-8 py-10 md:px-12 overflow-y-auto">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 mb-4">
              <CircleCheckIcon />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Thank You{firstName ? `, ${firstName}` : ""}!
            </h1>
            <p className="text-gray-500 text-sm max-w-xs">
              Your information was successfully submitted. You're on your way to a great education.
            </p>
          </div>

          {/* What's next card */}
          {submittedPrograms.length > 0 && (
            <div className="rounded-lg border border-gray-200 p-5 mb-6">
              <p className="text-sm font-bold text-gray-900 mb-2">What's next?</p>
              <p className="text-sm text-gray-500 mb-3">
                In the next few days, you can expect to hear directly from representatives of:
              </p>
              <ul className="flex flex-col gap-2">
                {submittedPrograms.map((p) => (
                  <li key={p.programId} className="flex items-start gap-2">
                    <span className="mt-1 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-primary" />
                    <span className="text-sm text-gray-700">
                      <span className="font-semibold">{p.school.displayName}</span>
                      {" — "}{p.rawDisplayName}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Your Top Matches */}
          {linkouts.length > 0 && (
            <div>
              <p className="text-sm font-bold text-gray-900 mb-3">You May Also Be Interested In</p>
              <div className="flex flex-col gap-3">
                {linkouts.map((linkout) => (
                  <ProgramListingCard key={linkout.programId} linkout={linkout} />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right sidebar — Prepped for Success */}
        <div className="lg:w-[480px] lg:flex-shrink-0 border-t lg:border-t-0 lg:border-l border-gray-200 overflow-y-auto">
          <PreppedForSuccess />
        </div>

      </div>
    </div>
  );
};

export default ThankYouScreen;
