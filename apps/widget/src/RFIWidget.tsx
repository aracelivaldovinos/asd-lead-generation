import { useState, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useRFI } from "@asd/services";
import RFIForm from "@asd/ui/src/components/rfi/RFIForm";
import ThankYouScreen from "@asd/ui/src/components/thankyou/ThankYouScreen";
import { useRFIStore } from "@asd/ui/src/store/rfiStore";
import { useFormStore } from "@asd/ui/src/store/formStore";
import type { Program } from "@asd/domain";
import { getAttribution } from "./settings";

interface RFIViewProps {
  apiUrl: string;
  programId: string;
  attribution: Record<string, string>;
  onComplete?: () => void;
}

export function RFIView({ apiUrl, programId: initialProgramId, attribution, onComplete }: RFIViewProps) {
  const [programId, setProgramId] = useState(initialProgramId);
  const [submitted, setSubmitted] = useState(false);
  const { data: rfiResponse } = useRFI(`${apiUrl}/api/rfi`, { ...attribution, programId });
  const initQueue = useRFIStore((state) => state.initQueue);

  useEffect(() => {
    if (!rfiResponse) return;
    const program: Program = {
      programId: rfiResponse.programId,
      displayName: rfiResponse.displayName,
      rawDisplayName: rfiResponse.displayName,
      name: "BAND1",
      degreeName: "",
      programInfo: "",
      school: { id: rfiResponse.schoolId, displayName: rfiResponse.schoolName },
      instructionMethod: "",
    };
    initQueue([program]);
    if (rfiResponse.defaultValues) {
      useFormStore.getState().seedFromParams(rfiResponse.defaultValues);
    }
  }, [rfiResponse?.programId]);

  if (!rfiResponse) return null;

  return (
    <>
      <RFIForm
        response={rfiResponse}
        submitUrl={`${apiUrl}/api/rfi?${new URLSearchParams(attribution)}`}
        onComplete={() => { setSubmitted(true); onComplete?.(); }}
        onProgramChange={(program: Program) => setProgramId(program.programId)}
        onProgramSkip={() => {}}
      />
      {submitted && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black/50" />
          <div className="relative w-full min-h-full">
            <ThankYouScreen listings={[]} />
          </div>
        </div>
      )}
    </>
  );
}

interface Props {
  dataset: DOMStringMap;
}

export default function RFIWidget({ dataset }: Props) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: { queries: { staleTime: Infinity } },
      })
  );

  const apiUrl = dataset.apiUrl ?? import.meta.env.VITE_API_URL ?? "";
  const programId = dataset.programId ?? "";
  const attribution = getAttribution();

  return (
    <QueryClientProvider client={queryClient}>
      <RFIView apiUrl={apiUrl} programId={programId} attribution={attribution} />
    </QueryClientProvider>
  );
}
