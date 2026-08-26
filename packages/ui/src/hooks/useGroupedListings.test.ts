import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createElement } from "react";
import { useGroupedListings } from "@asd/services";
import { NO_RESULTS_MESSAGE, FALLBACK_MESSAGE } from "@asd/domain";
import type { Listing } from "@asd/domain";

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const GROUPS = [["linkouts", "rfi"], ["mm", "eddy"]];
const BASE_URL = "/api/listings";
const PARAMS = { marketContext: "test", utm_medium: "direct", utm_source: "other" };

const makeListing = (): Listing => ({ name: "BAND1", schools: [] } as unknown as Listing);

const mockFetch = (handler: (url: string) => Listing[]) => {
  vi.spyOn(global, "fetch").mockImplementation((url) => {
    const listings = handler(String(url));
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ listings }),
    } as Response);
  });
};

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, staleTime: Infinity } },
  });
  return ({ children }: { children: React.ReactNode }) =>
    createElement(QueryClientProvider, { client: queryClient }, children);
};

// ─── Tests ────────────────────────────────────────────────────────────────────

describe("useGroupedListings message", () => {
  beforeEach(() => vi.restoreAllMocks());

  it("returns no message when group 1 has results", async () => {
    mockFetch((url) => url.includes("linkouts") ? [makeListing()] : []);

    const { result } = renderHook(
      () => useGroupedListings(BASE_URL, PARAMS, GROUPS),
      { wrapper: createWrapper() },
    );

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.listings).toHaveLength(1);
    expect(result.current.message).toBeUndefined();
  });

  it("returns FALLBACK_MESSAGE when group 1 is empty and group 2 has results", async () => {
    mockFetch((url) => url.includes("mm") ? [makeListing()] : []);

    const { result } = renderHook(
      () => useGroupedListings(BASE_URL, PARAMS, GROUPS),
      { wrapper: createWrapper() },
    );

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.listings).toHaveLength(1);
    expect(result.current.message).toBe(FALLBACK_MESSAGE);
  });

  it("returns NO_RESULTS_MESSAGE when all groups are empty", async () => {
    mockFetch(() => []);

    const { result } = renderHook(
      () => useGroupedListings(BASE_URL, PARAMS, GROUPS),
      { wrapper: createWrapper() },
    );

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.listings).toHaveLength(0);
    expect(result.current.message).toBe(NO_RESULTS_MESSAGE);
  });

  it("returns no message while groups are still loading", () => {
    vi.spyOn(global, "fetch").mockReturnValue(new Promise(() => {}));

    const { result } = renderHook(
      () => useGroupedListings(BASE_URL, PARAMS, GROUPS),
      { wrapper: createWrapper() },
    );

    expect(result.current.isLoading).toBe(true);
    expect(result.current.message).toBeUndefined();
  });

  it("uses initialData for group 1 without re-fetching it", async () => {
    const fetchSpy = vi.spyOn(global, "fetch").mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ listings: [] }),
    } as Response);

    const initialData = [makeListing()];

    const { result } = renderHook(
      () => useGroupedListings(BASE_URL, PARAMS, GROUPS, initialData),
      { wrapper: createWrapper() },
    );

    // Group 1 immediately available from initialData — no fetch needed
    expect(result.current.listings).toEqual(initialData);

    // Only group 2 should fetch
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(fetchSpy).toHaveBeenCalledTimes(1);
    expect(String(fetchSpy.mock.calls[0][0])).toContain("mm");
  });
});
