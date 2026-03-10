import { describe, expect, it } from "vitest";
import { buildCalibrationSuggestion, computeSuggestedPer10g } from "./calibration";

describe("computeSuggestedPer10g", () => {
  it("converts paused seconds into per-10g adjustment", () => {
    expect(computeSuggestedPer10g(8, 20)).toBe(4);
  });
});

describe("buildCalibrationSuggestion", () => {
  it("returns null when no step3 pause logs exist", () => {
    expect(
      buildCalibrationSuggestion(
        [{ stepIndex: 1, beans: 20, pausedSec: 8, timestamp: 1 }],
        20,
      ),
    ).toBeNull();
  });

  it("uses median pause to build stable recommendation", () => {
    const suggestion = buildCalibrationSuggestion(
      [
        { stepIndex: 2, beans: 20, pausedSec: 6, timestamp: 1 },
        { stepIndex: 2, beans: 20, pausedSec: 8, timestamp: 2 },
        { stepIndex: 2, beans: 20, pausedSec: 30, timestamp: 3 },
      ],
      20,
    );

    expect(suggestion).toEqual({
      stepIndex: 2,
      recommendedPer10g: 4,
      latestPauseSec: 30,
    });
  });
});
