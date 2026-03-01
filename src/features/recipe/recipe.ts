import type { Recipe } from "./types";

export const newHybridMethod: Recipe = {
  id: "new-hybrid-method",
  waterRatio: 15,
  waterTemp: 90,
  steps: [
    { timeSec: 0, actionType: "switch_close_pour", waterAmountType: "flavor1" },
    { timeSec: 40, actionType: "switch_open_pour", waterAmountType: "flavor2" },
    { timeSec: 90, actionType: "pour_cool", waterAmountType: "strength" },
    { timeSec: 130, actionType: "switch_close_pour", waterAmountType: "strength" },
    { timeSec: 165, actionType: "switch_open", waterAmountType: "none" },
    { timeSec: 210, actionType: "none", waterAmountType: "none" },
  ],
};
