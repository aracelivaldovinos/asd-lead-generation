import {
  Listing,
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
import { useMutation, useQuery } from "@tanstack/react-query";

export interface ListingsParams {
  marketContext: string;
  utm_medium: string;
  utm_source: string;
  s: string;
  [key: string]: string | undefined;
}

export interface RFIParams {
  programId: string;
  marketContext: string;
  s: string;
  [key: string]: string | undefined;
}

const fetchListings = async (
  baseURL: string,
  params: ListingsParams,
): Promise<Listing[]> => {
  const queryString = new URLSearchParams(
    Object.entries(params).filter(([_, v]) => v !== undefined && v !== "") as [
      string,
      string,
    ][],
  );
  const queryUrl = `${baseURL}?${queryString.toString()}`;

  const response = await fetch(queryUrl);
  return await response.json();
};

export const useListings = (baseURL: string, params: ListingsParams) => {
  return useQuery({
    queryKey: ["listings", params],
    queryFn: () => fetchListings(baseURL, params),
  });
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
  const raw: RawRFIResponse = await response.json();

  return transformRFIResponse(raw);
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
  values: Record<string, string>,
): Promise<RawRFISubmitResponse> => {
  const response = await fetch(`${baseURL}/${programId}`, {
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
      values: Record<string, string>;
    }) => fetchRFISubmit(baseURL, programId, values),
  });
};

interface FiltersData {
  filters: FiltersResponse;
  prefilter: PrefilterQuestion[];
}

export const fetchFilters = async (baseURL: string): Promise<FiltersData> => {
  const response = await fetch(baseURL);
  const raw: RawFiltersResponse = await response.json();
  return {
    filters: transformFiltersResponse(raw),
    prefilter: transformPrefilter(raw),
  };
};

export const useFilters = (baseURL: string) => {
  return useQuery({
    queryKey: ["filters"],
    queryFn: () => fetchFilters(baseURL),
    staleTime: Infinity,
  });
};
