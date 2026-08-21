import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useRFIFlow } from "./useRFIFlow";
import { useRFIStore } from "../store/rfiStore";

// ─── Mocks ────────────────────────────────────────────────────────────────────

vi.mock("@asd/services", () => ({
  fetchRFI: vi.fn(),
}));

vi.mock("../store/formStore", () => ({
  useFormStore: {
    getState: () => ({ resetTransient: vi.fn(), seedFromParams: vi.fn() }),
  },
}));

import { fetchRFI } from "@asd/services";

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const makeProgram = (schoolId: number, programId: string) => ({
  programId,
  displayName: `Program ${programId}`,
  rawDisplayName: `Program ${programId}`,
  degreeName: "Bachelor",
  clickTrackingUrl: "",
  programInfo: "",
  name: "BAND1",
  instructionMethod: "online",
  school: { id: schoolId, displayName: `School ${schoolId}` },
});

const makeListing = (schoolId: number, programIds: string[]) => ({
  name: "BAND1",
  message: "",
  schools: [
    {
      id: schoolId,
      displayName: `School ${schoolId}`,
      logo: { src: "", width: 0, height: 0 },
      locations: [
        {
          instructionMethod: "online",
          programs: programIds.map((pid) => ({
            programId: pid,
            displayName: `Program ${pid}`,
            degreeName: "Bachelor",
            clickTrackingUrl: "",
            programInfo: "",
          })),
        },
      ],
    },
  ],
});

const mockRFIResponse = (schoolId: number, programId = `p${schoolId}`) => ({
  programId,
  schoolId,
  schoolName: `School ${schoolId}`,
  displayName: `School ${schoolId}`,
  questions: [],
  disclaimer: "",
  tcpaDisclaimer: "",
  tcpaCheckboxRequired: false,
  useLeadId: false,
  useTrustedForm: false,
  logo: null,
});

const defaultOptions = {
  listings: [makeListing(1, ["p1", "p2"]), makeListing(2, ["p3"])],
  searchParams: { marketContext: "test" },
  rfiEndpoint: "/api/rfi",
  fetchListings: vi.fn(),
  onListingsUpdate: vi.fn(),
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const resetStore = () =>
  useRFIStore.setState({
    queue: [],
    allPrograms: [],
    submittedSchoolIds: [],
    skippedSchoolIds: [],
    currentProgram: null,
    inquiries: {},
  });

// ─── Tests ────────────────────────────────────────────────────────────────────

describe("useRFIFlow", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resetStore();
  });

  describe("handleNextStep", () => {
    it("opens modal and fetches RFI for first program in queue", async () => {
      const prog = makeProgram(1, "p1");
      useRFIStore.setState({ queue: [prog] });
      vi.mocked(fetchRFI).mockResolvedValue(mockRFIResponse(1) as any);

      const { result } = renderHook(() => useRFIFlow(defaultOptions));

      await act(async () => {
        result.current.handleNextStep();
      });

      expect(result.current.modalOpen).toBe(true);
      expect(fetchRFI).toHaveBeenCalledWith("/api/rfi", expect.objectContaining({ programId: "p1" }));
      expect(result.current.rfiResponse?.schoolId).toBe(1);
    });

    it("does not fetch if queue is empty", async () => {
      const { result } = renderHook(() => useRFIFlow(defaultOptions));

      await act(async () => {
        result.current.handleNextStep();
      });

      expect(result.current.modalOpen).toBe(true);
      expect(fetchRFI).not.toHaveBeenCalled();
    });
  });

  describe("handleClose", () => {
    it("closes modal and clears rfiResponse", async () => {
      vi.mocked(fetchRFI).mockResolvedValue(mockRFIResponse(1) as any);
      useRFIStore.setState({ queue: [makeProgram(1, "p1")] });

      const { result } = renderHook(() => useRFIFlow(defaultOptions));

      await act(async () => { result.current.handleNextStep(); });
      expect(result.current.modalOpen).toBe(true);
      expect(result.current.rfiResponse).not.toBeNull();

      act(() => { result.current.handleClose(); });

      expect(result.current.modalOpen).toBe(false);
      expect(result.current.rfiResponse).toBeNull();
    });
  });

  describe("handleProgramChange", () => {
    it("fetches RFI without clearing current response", async () => {
      const rfi1 = mockRFIResponse(1);
      const rfi2 = mockRFIResponse(2);
      vi.mocked(fetchRFI).mockResolvedValueOnce(rfi1 as any).mockResolvedValueOnce(rfi2 as any);

      useRFIStore.setState({ queue: [makeProgram(1, "p1")] });
      const { result } = renderHook(() => useRFIFlow(defaultOptions));

      await act(async () => { result.current.handleNextStep(); });
      expect(result.current.rfiResponse?.schoolId).toBe(1);

      // rfiResponse stays as rfi1 until rfi2 resolves — no null flash
      await act(async () => { result.current.handleProgramChange(makeProgram(2, "p3")); });
      expect(result.current.rfiResponse?.schoolId).toBe(2);
    });
  });

  describe("handleComplete", () => {
    it("advances to next selected program when queue has items", async () => {
      const prog1 = makeProgram(1, "p1");
      const prog2 = makeProgram(2, "p3");
      const rfi2 = mockRFIResponse(2);
      vi.mocked(fetchRFI).mockResolvedValue(rfi2 as any);
      vi.mocked(defaultOptions.fetchListings).mockResolvedValue([]);

      useRFIStore.setState({ queue: [prog1, prog2], currentProgram: prog1, submittedSchoolIds: [] });
      // Simulate submit: remove prog1 from queue
      useRFIStore.setState({ queue: [prog2], currentProgram: prog2, submittedSchoolIds: [1] });

      const { result } = renderHook(() => useRFIFlow(defaultOptions));

      await act(async () => { result.current.handleComplete(); });

      expect(fetchRFI).toHaveBeenCalledWith("/api/rfi", expect.objectContaining({ programId: "p3" }));
      expect(result.current.rfiResponse?.schoolId).toBe(2);
      // Non-blocking listings fetch triggered
      expect(defaultOptions.fetchListings).toHaveBeenCalled();
    });

    it("transitions to suggested when queue is empty", async () => {
      const suggestedRfi = mockRFIResponse(2);
      vi.mocked(fetchRFI).mockResolvedValue(suggestedRfi as any);
      vi.mocked(defaultOptions.fetchListings).mockResolvedValue([
        makeListing(2, ["p3"]),
      ]);

      useRFIStore.setState({ queue: [], submittedSchoolIds: [1], skippedSchoolIds: [] });

      const { result } = renderHook(() => useRFIFlow(defaultOptions));

      await act(async () => { result.current.handleComplete(); });

      expect(defaultOptions.onListingsUpdate).toHaveBeenCalled();
      expect(fetchRFI).toHaveBeenCalledWith("/api/rfi", expect.objectContaining({ programId: "p3" }));
      expect(result.current.rfiResponse?.schoolId).toBe(2);
    });

    it("shows thank you when no suggested programs remain", async () => {
      vi.mocked(defaultOptions.fetchListings).mockResolvedValue([]);
      useRFIStore.setState({ queue: [], submittedSchoolIds: [1, 2], skippedSchoolIds: [] });

      const { result } = renderHook(() => useRFIFlow(defaultOptions));

      // Open modal first
      await act(async () => {
        result.current.handleNextStep();
        result.current.handleComplete();
      });

      expect(result.current.showThankYou).toBe(true);
    });

    it("store updates happen AFTER getRFI resolves in suggested transition", async () => {
      const suggestedRfi = mockRFIResponse(2);
      let resolveRFI!: (v: any) => void;
      vi.mocked(fetchRFI).mockReturnValue(new Promise((r) => { resolveRFI = r; }));
      vi.mocked(defaultOptions.fetchListings).mockResolvedValue([makeListing(2, ["p3"])]);

      useRFIStore.setState({ queue: [], submittedSchoolIds: [1], skippedSchoolIds: [] });

      const { result } = renderHook(() => useRFIFlow(defaultOptions));

      act(() => { void result.current.handleComplete(); });

      // Listings fetched and updated, but RFI not resolved yet
      await vi.waitFor(() => expect(defaultOptions.fetchListings).toHaveBeenCalled());

      // Store queue still not set — getRFI hasn't resolved
      expect(useRFIStore.getState().queue).toHaveLength(0);
      expect(result.current.rfiResponse).toBeNull();

      // Now resolve the RFI fetch
      await act(async () => { resolveRFI(suggestedRfi); });

      // Store and response update together
      expect(useRFIStore.getState().queue.length).toBeGreaterThan(0);
      expect(result.current.rfiResponse?.schoolId).toBe(2);
    });
  });

  describe("handleSkip", () => {
    it("advances to next program in queue when queue has items", async () => {
      const prog2 = makeProgram(2, "p3");
      const rfi2 = mockRFIResponse(2);
      vi.mocked(fetchRFI).mockResolvedValue(rfi2 as any);

      useRFIStore.setState({ queue: [prog2], submittedSchoolIds: [], skippedSchoolIds: [] });

      const { result } = renderHook(() => useRFIFlow(defaultOptions));

      await act(async () => { result.current.handleSkip(makeProgram(1, "p1")); });

      expect(fetchRFI).toHaveBeenCalledWith("/api/rfi", expect.objectContaining({ programId: "p3" }));
      expect(result.current.rfiResponse?.schoolId).toBe(2);
    });

    it("transitions to suggested when queue is empty", async () => {
      const suggestedRfi = mockRFIResponse(2);
      vi.mocked(fetchRFI).mockResolvedValue(suggestedRfi as any);

      useRFIStore.setState({ queue: [], submittedSchoolIds: [], skippedSchoolIds: [] });

      const { result } = renderHook(() => useRFIFlow({ ...defaultOptions, listings: [makeListing(1, ["p1"]), makeListing(2, ["p3"])] }));

      await act(async () => { result.current.handleSkip(makeProgram(1, "p1")); });

      expect(fetchRFI).toHaveBeenCalledWith("/api/rfi", expect.objectContaining({ programId: "p3" }));
      expect(result.current.rfiResponse?.schoolId).toBe(2);
      expect(useRFIStore.getState().skippedSchoolIds).toContain(1);
    });

    it("store updates happen AFTER getRFI resolves in suggested transition", async () => {
      const suggestedRfi = mockRFIResponse(2);
      let resolveRFI!: (v: any) => void;
      vi.mocked(fetchRFI).mockReturnValue(new Promise((r) => { resolveRFI = r; }));

      useRFIStore.setState({ queue: [], submittedSchoolIds: [], skippedSchoolIds: [] });

      const { result } = renderHook(() => useRFIFlow({ ...defaultOptions, listings: [makeListing(1, ["p1"]), makeListing(2, ["p3"])] }));

      act(() => { void result.current.handleSkip(makeProgram(1, "p1")); });

      // Queue still empty — getRFI hasn't resolved
      expect(useRFIStore.getState().queue).toHaveLength(0);
      expect(result.current.rfiResponse).toBeNull();

      await act(async () => { resolveRFI(suggestedRfi); });

      // Store and response update together after resolve
      expect(useRFIStore.getState().queue.length).toBeGreaterThan(0);
      expect(result.current.rfiResponse?.schoolId).toBe(2);
    });

    it("shows thank you when no suggested programs remain", async () => {
      useRFIStore.setState({ queue: [], submittedSchoolIds: [1, 2], skippedSchoolIds: [] });

      const { result } = renderHook(() => useRFIFlow(defaultOptions));

      act(() => { result.current.handleNextStep(); });
      expect(result.current.modalOpen).toBe(true);

      await act(async () => { result.current.handleSkip(makeProgram(1, "p1")); });

      expect(result.current.showThankYou).toBe(true);
    });
  });
});
