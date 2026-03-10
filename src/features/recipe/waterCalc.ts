import type { ComputedStep, FlavorProfile, Recipe } from "./types";

interface StepTimeAdjustment {
  step3ExtraSecPer10g: number;
}

function computeStep3ExtraSeconds(beans: number, step3ExtraSecPer10g: number): number {
  if (step3ExtraSecPer10g <= 0) return 0;
  return Math.round((beans / 10) * step3ExtraSecPer10g);
}

export function getTotalWater(beans: number, waterRatio: number): number {
  return Math.round(beans * waterRatio);
}

export function calcFlavor1(total: number, flavor: FlavorProfile): number {
  const factor = flavor === "sweet" ? 0.42 : flavor === "sour" ? 0.58 : 0.5;
  return Math.round(total * 0.4 * factor);
}

export function calcFlavor2(total: number, flavor: FlavorProfile): number {
  const factor = flavor === "sweet" ? 0.58 : flavor === "sour" ? 0.42 : 0.5;
  return Math.round(total * 0.4 * factor);
}

export function calcStrength(total: number): number {
  return Math.round((total * 0.6) / 2);
}

export function computeSteps(
  recipe: Recipe,
  beans: number,
  flavor: FlavorProfile,
  adjustment?: StepTimeAdjustment,
): ComputedStep[] {
  const total = getTotalWater(beans, recipe.waterRatio);
  const step3ExtraSeconds = computeStep3ExtraSeconds(
    beans,
    adjustment?.step3ExtraSecPer10g ?? 0,
  );
  let cumulative = 0;

  return recipe.steps.map((step, index) => {
    let increment: number;
    switch (step.waterAmountType) {
      case "flavor1":
        increment = calcFlavor1(total, flavor);
        break;
      case "flavor2":
        increment = calcFlavor2(total, flavor);
        break;
      case "strength":
        increment = calcStrength(total);
        break;
      case "none":
        increment = 0;
        break;
      default: {
        const _exhaustive: never = step.waterAmountType;
        throw new Error(`Unknown waterAmountType: ${_exhaustive}`);
      }
    }
    cumulative += increment;
    const adjustedTimeSec = index >= 2 ? step.timeSec + step3ExtraSeconds : step.timeSec;
    return { ...step, timeSec: adjustedTimeSec, cumulative, increment };
  });
}

export function getCurrentStepIndex(
  steps: ComputedStep[],
  currentTime: number,
): number {
  for (let i = steps.length - 1; i >= 0; i--) {
    if (currentTime >= steps[i].timeSec) return i;
  }
  return 0;
}

export function formatTime(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}
