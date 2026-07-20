import { Listing } from "@asd/domain";
import type { RequestContext } from "./types";

export const fireImpressions = async (
  listings: Listing[],
  ctx: RequestContext,
  search: string,
): Promise<void> => {
  const impressionServer = process.env.IMPRESSION_SERVER;
  if (!impressionServer) return;

  const baseRecord: Record<string, string> = {
    ...Object.fromEntries(
      Object.entries(ctx.query).flatMap(([k, v]) =>
        Array.isArray(v) ? v.map((val) => [k, val]) : [[k, v]],
      ),
    ),
    ...(typeof ctx.meta === "object" && ctx.meta !== null
      ? (ctx.meta as Record<string, string>)
      : {}),
  };

  const impressions = listings.flatMap((listing) =>
    listing.schools.flatMap((school) =>
      school.locations.flatMap((location) =>
        location.programs.map((program) => ({
          impression: crypto.randomUUID(),
          session: ctx.session,
          search,
          placement: "unknown",
          ...baseRecord,
          id: program.programId,
          band: listing.name,
          ...(program.impressionData ?? {}),
        })),
      ),
    ),
  );

  if (impressions.length === 0) return;

  try {
    const res = await fetch(impressionServer, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(impressions),
    });
    if (!res.ok) {
      console.error("Impression server error", res.status, await res.text());
    }
  } catch (err) {
    console.error("Failed to fire impressions", (err as Error).message);
  }
};
