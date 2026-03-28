import { describe, expect, it } from "vitest";
import { getActiveBgmTracks, getBgmTracksForDayType } from "./index";

describe("bgm day type normalization", () => {
  it("falls back to weekday tracks for unexpected dayType in debug resolver", () => {
    const tracks = getBgmTracksForDayType("invalid" as unknown as "weekday");

    expect(tracks).toHaveLength(10);
    expect(tracks[0]?.id.startsWith("weekday_mon_clear_")).toBe(true);
  });

  it("falls back to weekday tracks when debugDayType is invalid", () => {
    const tracks = getActiveBgmTracks({
      debugEnabled: true,
      debugDayType: "invalid" as unknown as "weekday",
    });

    expect(tracks).toHaveLength(10);
    expect(tracks[0]?.id.startsWith("weekday_mon_clear_")).toBe(true);
  });
});
