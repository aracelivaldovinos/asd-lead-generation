import { useState, useRef, useEffect } from "react";
import { Listing, Program, RFIResponse, groupPrograms } from "@asd/domain";
import { fetchRFI, RFI_UNAVAILABLE_MESSAGE } from "@asd/services";
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
  const [showThankYou, setShowThankYou] = useState(false);
  const [rfiResponse, setRfiResponse] = useState<RFIResponse | null>(null);
  const [rfiError, setRfiError] = useState<string | null>(null);
  const [isLoadingNext, setIsLoadingNext] = useState(false);

  // Unmount guard — prevents state updates after modal unmounts
  const mountedRef = useRef(true);
  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  // AbortController — cancels stale in-flight RFI requests
  const abortRef = useRef<AbortController | null>(null);

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
    // Cancel any previous in-flight request
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    if (showLoading) setRfiResponse(null);
    setRfiError(null);
    try {
      const response = await getRFI(program);
      if (controller.signal.aborted || !mountedRef.current) return;
      if (response.defaultValues) {
        useFormStore.getState().seedFromParams(response.defaultValues);
      }
      setRfiResponse(response);
    } catch (e) {
      if (controller.signal.aborted || !mountedRef.current) return;
      setRfiError(e instanceof Error ? e.message : RFI_UNAVAILABLE_MESSAGE);
      fetchListings().then(onListingsUpdate);
    }
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
    abortRef.current?.abort();
    setModalOpen(false);
    setShowThankYou(false);
    setRfiResponse(null);
    setRfiError(null);
    setIsLoadingNext(false);
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
      try {
        // Fetch first, then update store — prevents currentProgram/rfiResponse mismatch
        const rfi = await getRFI(suggested[0]);
        if (!mountedRef.current) return;
        if (skippedSchoolId) addSkippedSchool(skippedSchoolId);
        initSuggestedQueue(suggested);
        initPrograms(allRfis);
        setRfiResponse(rfi);
      } catch (e) {
        if (!mountedRef.current) return;
        setRfiError(e instanceof Error ? e.message : RFI_UNAVAILABLE_MESSAGE);
        fetchListings().then(onListingsUpdate);
      }
    } else {
      setShowThankYou(true);
    }
  };

  const handleComplete = async () => {
    setIsLoadingNext(true);
    const { queue: currentQueue, submittedSchoolIds } = useRFIStore.getState();

    if (currentQueue.length > 0 && submittedSchoolIds.length < MAX_RFIS) {
      // Run both in parallel, wait for both before clearing loading state
      await Promise.all([
        fetchRFIForProgram(currentQueue[0], false),
        fetchListings().then(onListingsUpdate),
      ]);
      if (mountedRef.current) setIsLoadingNext(false);
      return;
    }

    const newListings = await fetchListings();
    if (!mountedRef.current) return;
    onListingsUpdate(newListings);

    const { submittedSchoolIds: submitted, skippedSchoolIds } = useRFIStore.getState();
    if (submitted.length < MAX_RFIS) {
      const allRfis = groupPrograms(newListings).rfis;
      const suggested = allRfis.filter(
        (p) => !submitted.includes(p.school.id) && !skippedSchoolIds.includes(p.school.id),
      );

      if (suggested.length > 0) {
        try {
          const rfi = await getRFI(suggested[0]);
          if (!mountedRef.current) return;
          initSuggestedQueue(suggested);
          initPrograms(allRfis);
          setRfiResponse(rfi);
        } catch (e) {
          if (!mountedRef.current) return;
          setRfiError(e instanceof Error ? e.message : RFI_UNAVAILABLE_MESSAGE);
          fetchListings().then(onListingsUpdate);
        }
      } else {
        setShowThankYou(true);
      }
    } else {
      setShowThankYou(true);
    }
    if (mountedRef.current) setIsLoadingNext(false);
  };

  return {
    modalOpen,
    showThankYou,
    rfiResponse,
    rfiError,
    isLoadingNext,
    handleNextStep,
    handleProgramChange,
    handleClose,
    handleSkip,
    handleComplete,
  };
}
