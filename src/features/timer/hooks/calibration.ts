import type { PauseCalibrationRecord } from "../../settings/types";

export interface CalibrationSuggestion {
  stepIndex: number;
  recommendedPer10g: number;
  latestPauseSec: number;
}

export function computeSuggestedPer10g(pauseSec: number, beans: number): number {
  if (beans <= 0 || pauseSec <= 0) return 0;
  return Math.max(0, Math.min(30, Math.round((pauseSec * 10) / beans)));
}

export function buildCalibrationSuggestion(
  records: PauseCalibrationRecord[],
  currentBeans: number,
): CalibrationSuggestion | null {
  const relevant = records.filter((record) => record.stepIndex === 2);
  if (relevant.length === 0) return null;

  const sortedDurations = relevant
    .map((record) => record.pausedSec)
    .sort((a, b) => a - b);
  const middle = Math.floor(sortedDurations.length / 2);
  const medianPause =
    sortedDurations.length % 2 === 0
      ? Math.round((sortedDurations[middle - 1] + sortedDurations[middle]) / 2)
      : sortedDurations[middle];

  const latestPauseSec = relevant[relevant.length - 1].pausedSec;

  return {
    stepIndex: 2,
    recommendedPer10g: computeSuggestedPer10g(medianPause, currentBeans),
    latestPauseSec,
  };
}
