import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useTimer } from "./useTimer";
import type { ComputedStep } from "../../recipe/types";

const makeSteps = (): ComputedStep[] => [
  { timeSec: 0, actionType: "switch_close_pour", waterAmountType: "flavor1", cumulative: 50, increment: 50 },
  { timeSec: 40, actionType: "switch_open_pour", waterAmountType: "flavor2", cumulative: 120, increment: 70 },
  { timeSec: 90, actionType: "pour_cool", waterAmountType: "strength", cumulative: 210, increment: 90 },
  { timeSec: 130, actionType: "switch_close_pour", waterAmountType: "strength", cumulative: 300, increment: 90 },
  { timeSec: 165, actionType: "switch_open", waterAmountType: "none", cumulative: 300, increment: 0 },
  { timeSec: 210, actionType: "none", waterAmountType: "none", cumulative: 300, increment: 0 },
];

describe("useTimer", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("starts in idle status", () => {
    const { result } = renderHook(() =>
      useTimer(makeSteps(), 1, {}),
    );
    expect(result.current.status).toBe("idle");
    expect(result.current.currentTime).toBe(0);
    expect(result.current.currentStepIndex).toBe(0);
  });

  it("transitions to running on start", () => {
    const { result } = renderHook(() =>
      useTimer(makeSteps(), 1, {}),
    );
    act(() => {
      result.current.start();
    });
    expect(result.current.status).toBe("running");
  });

  it("transitions to paused on pause", () => {
    const { result } = renderHook(() =>
      useTimer(makeSteps(), 1, {}),
    );
    act(() => {
      result.current.start();
    });
    act(() => {
      result.current.pause();
    });
    expect(result.current.status).toBe("paused");
  });

  it("resets to initial state", () => {
    const { result } = renderHook(() =>
      useTimer(makeSteps(), 1, {}),
    );
    act(() => {
      result.current.start();
    });
    act(() => {
      result.current.reset();
    });
    expect(result.current.status).toBe("idle");
    expect(result.current.currentTime).toBe(0);
  });

  it("computes finalTime from last step", () => {
    const { result } = renderHook(() =>
      useTimer(makeSteps(), 1, {}),
    );
    expect(result.current.finalTime).toBe(210);
  });

  it("handles empty steps array", () => {
    const { result } = renderHook(() =>
      useTimer([], 1, {}),
    );
    expect(result.current.finalTime).toBe(0);
    expect(result.current.currentStepIndex).toBe(0);
  });

  it("fires onStepCrossed when crossing step boundary", () => {
    const onStepCrossed = vi.fn();
    const steps = makeSteps();

    const { result } = renderHook(() =>
      useTimer(steps, 1, { onStepCrossed }),
    );

    act(() => {
      result.current.start();
    });

    // Advance performance.now by 41 seconds to cross step 1 boundary (40s)
    const startTime = performance.now();
    vi.spyOn(performance, "now").mockReturnValue(startTime + 41000);

    act(() => {
      vi.advanceTimersByTime(100);
    });

    expect(onStepCrossed).toHaveBeenCalled();

    vi.restoreAllMocks();
  });

  it("fires onPreNotify 5 seconds before next step", () => {
    const onPreNotify = vi.fn();
    const steps = makeSteps();

    const { result } = renderHook(() =>
      useTimer(steps, 1, { onPreNotify }),
    );

    act(() => {
      result.current.start();
    });

    // Advance to 35.1 seconds (5 seconds before step at 40s)
    const startTime = performance.now();
    vi.spyOn(performance, "now").mockReturnValue(startTime + 35100);

    act(() => {
      vi.advanceTimersByTime(100);
    });

    expect(onPreNotify).toHaveBeenCalledWith(1, false);

    vi.restoreAllMocks();
  });
});
