import { describe, it, expect } from "vitest";
import { isCallCenter } from "../urlParams";

describe("isCallCenter",() => {
  const searchparams = new URLSearchParams({"utm_medium": "is_cc_center"});
  it("returns true if utm_medium is a call center",()=> {
    const cc = isCallCenter(searchparams);

    expect(cc).toBe(true);
  });
  it("returns false if utm_medium is not call center",()=> {
    searchparams.set("utm_medium", "direct");
    const cc = isCallCenter(searchparams);

    expect(cc).toBe(false);
  });
});