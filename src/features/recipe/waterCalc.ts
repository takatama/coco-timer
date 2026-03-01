import type { ComputedStep, FlavorProfile, Recipe } from "./types";

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
): ComputedStep[] {
  const total = getTotalWater(beans, recipe.waterRatio);
  let cumulative = 0;

  return recipe.steps.map((step) => {
    let increment = 0;
    if (step.waterAmountType === "flavor1") increment = calcFlavor1(total, flavor);
    if (step.waterAmountType === "flavor2") increment = calcFlavor2(total, flavor);
    if (step.waterAmountType === "strength") increment = calcStrength(total);
    cumulative += increment;
    return { ...step, cumulative, increment };
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
