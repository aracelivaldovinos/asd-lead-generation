import { useState } from "react";
import { Listing, Program, RFIResponse, groupPrograms } from "@asd/domain";
import { fetchRFI } from "@asd/services";
import { useRFIStore, MAX_RFIS } from "../store/rfiStore";
import { useFormStore } from "../store/formStore";

export interface UseRFIFlowOptions {
  listings: Listing[];
  searchParams: Record<string, string>;
  rfiEndpoint: string;
  fetchListings: () => Promise<Listing[]>;
  onListingsUpdate: (listings: Listing[]) => void;
}

export function useRFIFlow({
  listings,
  searchParams,
  rfiEndpoint,
  fetchListings,
  onListingsUpdate,
}: UseRFIFlowOptions) {
  const [modalOpen, setModalOpen] = useState(false);
  const [rfiResponse, setRfiResponse] = useState<RFIResponse | null>(null);

  const { queue, initQueue, initSuggestedQueue, initPrograms, addSkippedSchool } = useRFIStore();

  const getRFI = (program: Program): Promise<RFIResponse> => {
    useFormStore.getState().resetTransient();
    useFormStore.getState().seedFromParams(searchParams);
    return fetchRFI(rfiEndpoint, {
      programId: program.programId,
      marketContext: searchParams.marketContext ?? "",
      s: "",
      ...searchParams,
    });
  };

  const fetchRFIForProgram = async (program: Program, showLoading = true) => {
    if (showLoading) setRfiResponse(null);
    setRfiResponse(await getRFI(program));
  };

  const handleNextStep = () => {
    const programs = queue;
    initQueue(programs);
    initPrograms(groupPrograms(listings).rfis);
    setModalOpen(true);
    if (programs[0]) fetchRFIForProgram(programs[0]);
  };

  const handleProgramChange = (program: Program) => {
    fetchRFIForProgram(program, false);
  };

  const handleClose = () => {
    setModalOpen(false);
    setRfiResponse(null);
  };

  const handleSkip = async (skippedProgram: Program | null) => {
    const { queue: currentQueue, submittedSchoolIds, skippedSchoolIds } = useRFIStore.getState();

    if (currentQueue.length > 0) {
      fetchRFIForProgram(currentQueue[0], false);
      return;
    }

    const skippedSchoolId = skippedProgram?.school.id;
    const allSkippedSchoolIds = [
      ...skippedSchoolIds,
      ...(skippedSchoolId ? [skippedSchoolId] : []),
    ];

    const allRfis = groupPrograms(listings).rfis;
    const suggested = allRfis.filter(
      (p) => !submittedSchoolIds.includes(p.school.id) && !allSkippedSchoolIds.includes(p.school.id),
    );

    if (suggested.length > 0) {
      // Fetch first, then update store — prevents currentProgram/rfiResponse mismatch
      const rfi = await getRFI(suggested[0]);
      if (skippedSchoolId) addSkippedSchool(skippedSchoolId);
      initSuggestedQueue(suggested);
      initPrograms(allRfis);
      setRfiResponse(rfi);
    } else {
      setModalOpen(false);
      setRfiResponse(null);
    }
  };

  const handleComplete = async () => {
    const { queue: currentQueue, submittedSchoolIds } = useRFIStore.getState();

    if (currentQueue.length > 0 && submittedSchoolIds.length < MAX_RFIS) {
      fetchRFIForProgram(currentQueue[0], false);
      fetchListings().then(onListingsUpdate);
      return;
    }

    const newListings = await fetchListings();
    onListingsUpdate(newListings);

    const { submittedSchoolIds: submitted, skippedSchoolIds } = useRFIStore.getState();
    if (submitted.length < MAX_RFIS) {
      const allRfis = groupPrograms(newListings).rfis;
      const suggested = allRfis.filter(
        (p) => !submitted.includes(p.school.id) && !skippedSchoolIds.includes(p.school.id),
      );

      if (suggested.length > 0) {
        // Fetch first, then update store — prevents currentProgram/rfiResponse mismatch
        const rfi = await getRFI(suggested[0]);
        initSuggestedQueue(suggested);
        initPrograms(allRfis);
        setRfiResponse(rfi);
      } else {
        setModalOpen(false);
        setRfiResponse(null);
      }
    } else {
      setModalOpen(false);
      setRfiResponse(null);
    }
  };

  return {
    modalOpen,
    rfiResponse,
    handleNextStep,
    handleProgramChange,
    handleClose,
    handleSkip,
    handleComplete,
  };
}
