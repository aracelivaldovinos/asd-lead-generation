import { Listing } from "@asd/domain";
import { useQuery } from "@tanstack/react-query";

export interface ListingsParams {
  marketContext: string;
  utm_medium: string;
  utm_source: string;
  s: string;
  [key: string]: string | undefined;
}
const fetchListings = async ( baseURL: string, params: ListingsParams): Promise<Listing[]> => {
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
        queryFn: () => fetchListings(baseURL, params)
    })
}