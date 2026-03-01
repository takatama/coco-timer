import { describe, it, expect } from "vitest";
import {
  getTotalWater,
  calcFlavor1,
  calcFlavor2,
  calcStrength,
  computeSteps,
  getCurrentStepIndex,
  formatTime,
} from "./waterCalc";
import { newHybridMethod } from "./recipe";

describe("getTotalWater", () => {
  it("calculates total water with 15:1 ratio", () => {
    expect(getTotalWater(20, 15)).toBe(300);
  });

  it("rounds to nearest integer", () => {
    expect(getTotalWater(13, 15)).toBe(195);
  });

  it("handles 1g beans", () => {
    expect(getTotalWater(1, 15)).toBe(15);
  });
});

describe("calcFlavor1", () => {
  it("sweet: 42% of 40% of total", () => {
    expect(calcFlavor1(300, "sweet")).toBe(50); // 300 * 0.4 * 0.42 = 50.4 → 50
  });

  it("neutral: 50% of 40% of total", () => {
    expect(calcFlavor1(300, "neutral")).toBe(60); // 300 * 0.4 * 0.5 = 60
  });

  it("sour: 58% of 40% of total", () => {
    expect(calcFlavor1(300, "sour")).toBe(70); // 300 * 0.4 * 0.58 = 69.6 → 70
  });
});

describe("calcFlavor2", () => {
  it("sweet: 58% of 40% of total", () => {
    expect(calcFlavor2(300, "sweet")).toBe(70); // 300 * 0.4 * 0.58 = 69.6 → 70
  });

  it("neutral: 50% of 40% of total", () => {
    expect(calcFlavor2(300, "neutral")).toBe(60); // 300 * 0.4 * 0.5 = 60
  });

  it("sour: 42% of 40% of total", () => {
    expect(calcFlavor2(300, "sour")).toBe(50); // 300 * 0.4 * 0.42 = 50.4 → 50
  });
});

describe("calcStrength", () => {
  it("calculates 30% of total (60% / 2)", () => {
    expect(calcStrength(300)).toBe(90); // 300 * 0.6 / 2 = 90
  });
});

describe("computeSteps", () => {
  it("produces 6 steps for the hybrid method", () => {
    const steps = computeSteps(newHybridMethod, 20, "neutral");
    expect(steps).toHaveLength(6);
  });

  it("neutral 20g: final cumulative is 300g", () => {
    const steps = computeSteps(newHybridMethod, 20, "neutral");
    expect(steps[steps.length - 1].cumulative).toBe(300);
  });

  it("neutral 20g: step water amounts are correct", () => {
    const steps = computeSteps(newHybridMethod, 20, "neutral");
    // flavor1=60, flavor2=60, strength=90, strength=90, 0, 0
    expect(steps[0].increment).toBe(60);
    expect(steps[0].cumulative).toBe(60);
    expect(steps[1].increment).toBe(60);
    expect(steps[1].cumulative).toBe(120);
    expect(steps[2].increment).toBe(90);
    expect(steps[2].cumulative).toBe(210);
    expect(steps[3].increment).toBe(90);
    expect(steps[3].cumulative).toBe(300);
    expect(steps[4].increment).toBe(0);
    expect(steps[4].cumulative).toBe(300);
    expect(steps[5].increment).toBe(0);
    expect(steps[5].cumulative).toBe(300);
  });

  it("sweet 20g: flavor1 < flavor2", () => {
    const steps = computeSteps(newHybridMethod, 20, "sweet");
    expect(steps[0].increment).toBeLessThan(steps[1].increment);
  });

  it("sour 20g: flavor1 > flavor2", () => {
    const steps = computeSteps(newHybridMethod, 20, "sour");
    expect(steps[0].increment).toBeGreaterThan(steps[1].increment);
  });

  it("preserves step timing", () => {
    const steps = computeSteps(newHybridMethod, 20, "neutral");
    expect(steps.map((s) => s.timeSec)).toEqual([0, 40, 90, 130, 165, 210]);
  });

  it("preserves action types", () => {
    const steps = computeSteps(newHybridMethod, 20, "neutral");
    expect(steps.map((s) => s.actionType)).toEqual([
      "switch_close_pour",
      "switch_open_pour",
      "pour_cool",
      "switch_close_pour",
      "switch_open",
      "none",
    ]);
  });

  it("handles different bean amounts", () => {
    const steps10 = computeSteps(newHybridMethod, 10, "neutral");
    const steps30 = computeSteps(newHybridMethod, 30, "neutral");
    expect(steps10[steps10.length - 1].cumulative).toBe(150);
    expect(steps30[steps30.length - 1].cumulative).toBe(450);
  });
});

describe("getCurrentStepIndex", () => {
  const steps = computeSteps(newHybridMethod, 20, "neutral");

  it("returns 0 at time 0", () => {
    expect(getCurrentStepIndex(steps, 0)).toBe(0);
  });

  it("returns 0 just before step 2", () => {
    expect(getCurrentStepIndex(steps, 39.9)).toBe(0);
  });

  it("returns 1 at time 40", () => {
    expect(getCurrentStepIndex(steps, 40)).toBe(1);
  });

  it("returns last step at final time", () => {
    expect(getCurrentStepIndex(steps, 210)).toBe(5);
  });

  it("returns last step beyond final time", () => {
    expect(getCurrentStepIndex(steps, 999)).toBe(5);
  });
});

describe("formatTime", () => {
  it("formats 0 seconds", () => {
    expect(formatTime(0)).toBe("0:00");
  });

  it("formats 90 seconds as 1:30", () => {
    expect(formatTime(90)).toBe("1:30");
  });

  it("formats 210 seconds as 3:30", () => {
    expect(formatTime(210)).toBe("3:30");
  });

  it("formats 5 seconds as 0:05", () => {
    expect(formatTime(5)).toBe("0:05");
  });

  it("truncates fractional seconds", () => {
    expect(formatTime(90.7)).toBe("1:30");
  });
});
