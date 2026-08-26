export const RFI_UNAVAILABLE_MESSAGE = "This program is no longer available.";

import {
  Listing,
  DEFAULT_GROUPS,
  NO_RESULTS_MESSAGE,
  FALLBACK_MESSAGE,
  RawRFIResponse,
  RawRFISubmitResponse,
  RawFiltersResponse,
  RFIResponse,
  transformRFIResponse,
  transformFiltersResponse,
  transformPrefilter,
  FiltersResponse,
  PrefilterQuestion,
} from "@asd/domain";

export { DEFAULT_GROUPS } from "@asd/domain";
import { useMutation, useQuery, useQueries } from "@tanstack/react-query";

export interface ListingsParams {
  marketContext: string;
  utm_medium: string;
  utm_source: string;
  s?: string;
  [key: string]: string | undefined;
}

export interface RFIParams {
  programId: string;
  marketContext?: string;
  s?: string;
  [key: string]: string | undefined;
}

export const fetchListings = async (
  baseURL: string,
  params: ListingsParams,
): Promise<{ listings: Listing[]; message?: string }> => {
  const queryString = new URLSearchParams(
    Object.entries(params).filter(([_, v]) => v !== undefined && v !== "") as [string, string][],
  );
  const response = await fetch(`${baseURL}?${queryString.toString()}`);
  const data = await response.json();
  return { listings: data.listings ?? [], message: data.message };
};

export const useListings = (baseURL: string, params: ListingsParams) => {
  return useQuery({
    queryKey: ["listings", params],
    queryFn: async () => {
      const { listings } = await fetchListings(baseURL, params);
      return listings;
    },
  });
};

export const useGroupedListings = (
  baseURL: string,
  params: ListingsParams,
  groups: string[][] = DEFAULT_GROUPS,
  initialData?: Listing[],
) => {
  const results = useQueries({
    queries: groups.map((group, i) => ({
      queryKey: ["listings", group, params],
      queryFn: () => fetchListings(baseURL, { ...params, groups: group.join(",") }),
      staleTime: Infinity,
      ...(i === 0 && initialData !== undefined && { initialData: { listings: initialData } }),
    })),
  });

  const activeIndex = results.findIndex((r) => r.isSuccess && (r.data?.listings?.length ?? 0) > 0);
  const listings: Listing[] = activeIndex >= 0 ? (results[activeIndex].data?.listings ?? []) : [];
  const allListings: Listing[] = results.flatMap((r) => r.isSuccess ? (r.data?.listings ?? []) : []);
  const isLoading = results.some((r) => r.isPending);

  const message = listings.length === 0 && !isLoading
    ? NO_RESULTS_MESSAGE
    : activeIndex > 0
    ? FALLBACK_MESSAGE
    : undefined;

  const refetchAll = async (): Promise<Listing[]> => {
    const refetched = await Promise.all(results.map((r) => r.refetch()));
    const activeResult = refetched.find((r) => (r.data?.listings?.length ?? 0) > 0);
    return activeResult?.data?.listings ?? [];
  };

  return { listings, allListings, refetchAll, isLoading, message };
};

export const fetchRFI = async (
  baseURL: string,
  params: RFIParams,
): Promise<RFIResponse> => {
  const queryString = new URLSearchParams(
    Object.entries(params).filter(([_, v]) => v !== undefined && v !== "") as [
      string,
      string,
    ][],
  );
  const queryUrl = `${baseURL}?${queryString.toString()}`;

  const response = await fetch(queryUrl);
  const raw: RawRFIResponse & { defaultValues?: Record<string, string> } = await response.json();

  if (!raw?.questions) throw new Error(RFI_UNAVAILABLE_MESSAGE);

  return { ...transformRFIResponse(raw), programId: params.programId ?? "", defaultValues: raw.defaultValues };
};

export const useRFI = (baseURL: string, params: RFIParams) => {
  return useQuery({
    queryKey: ["rfi", params],
    queryFn: () => fetchRFI(baseURL, params),
  });
};

const fetchRFISubmit = async (
  baseURL: string,
  programId: string,
  values: Record<string, string | Record<string, string>>,
): Promise<RawRFISubmitResponse> => {
  const [base, qs] = baseURL.split("?");
  const url = qs ? `${base}/${programId}?${qs}` : `${base}/${programId}`;
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(values),
  });

  return response.json();
};

export const useRFISubmit = (baseURL: string) => {
  return useMutation({
    mutationFn: ({
      programId,
      values,
    }: {
      programId: string;
      values: Record<string, string | Record<string, string>>;
    }) => fetchRFISubmit(baseURL, programId, values),
  });
};

interface FiltersData {
  filters: FiltersResponse;
  prefilter: PrefilterQuestion[];
  defaultValues?: Record<string, string>;
}

export const fetchFilters = async (baseURL: string, init?: RequestInit): Promise<FiltersData> => {
  const response = await fetch(baseURL, init);
  const raw: RawFiltersResponse & { defaultValues?: Record<string, string> } = await response.json();
  return {
    filters: transformFiltersResponse(raw),
    prefilter: transformPrefilter(raw),
    defaultValues: raw.defaultValues,
  };
};

export const useFilters = (baseURL: string) => {
  return useQuery({
    queryKey: ["filters"],
    queryFn: () => fetchFilters(baseURL),
    staleTime: Infinity,
  });
};

export type GeoData = {
  postalCode: string;
  city: string;
  state: string;
};

export const useGeoData = (baseURL: string) => {
  return useQuery<GeoData>({
    queryKey: ["geo"],
    queryFn: () => fetch(`${baseURL}/api/geo`).then((r) => r.json()),
    staleTime: Infinity,
  });
};
