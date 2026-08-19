export interface ZipGeo {
  city: string;
  state: string;
}

export async function fetchZippopotam(postalCode: string): Promise<ZipGeo | null> {
  try {
    const res = await fetch(`https://api.zippopotam.us/us/${postalCode}`);
    if (!res.ok) return null;
    const data = await res.json();
    const place = data.places?.[0];
    if (!place) return null;
    return { city: place["place name"], state: place["state abbreviation"] };
  } catch {
    return null;
  }
}
