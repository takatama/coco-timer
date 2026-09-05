import { act, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { ComputedStep } from "../../recipe/types";
import i18n from "../../../shared/i18n/config";
import { NextStepPreview } from "./NextStepPreview";
import { StepCard } from "./StepCard";

vi.mock("../../../shared/components/LottiePlayer", () => ({
  buildLottieQueue: () => ["switch_close", "pour"],
  LottiePlayer: () => <div data-testid="lottie-player" />,
}));

const steps: ComputedStep[] = [
  {
    timeSec: 0,
    actionType: "switch_close_pour",
    waterAmountType: "flavor1",
    cumulative: 60,
    increment: 60,
  },
  {
    timeSec: 40,
    actionType: "switch_open_pour",
    waterAmountType: "flavor2",
    cumulative: 120,
    increment: 60,
  },
  {
    timeSec: 210,
    actionType: "none",
    waterAmountType: "none",
    cumulative: 300,
    increment: 0,
  },
];

describe("COCO timer card", () => {
  afterEach(async () => {
    await act(async () => i18n.changeLanguage("en"));
  });

  it("keeps the timeline and COCO instruction in the main card", async () => {
    await act(async () => i18n.changeLanguage("en"));
    render(
      <StepCard
        step={steps[0]}
        stepIndex={0}
        totalSteps={2}
        remainingSeconds={40}
        progress={0}
        isImminent={false}
        steps={steps}
        currentTime={0}
      />,
    );

    const card = screen.getByRole("region", { name: "Current Step" });
    expect(within(card).getByRole("img", { name: "Timeline" })).toBeVisible();
    expect(within(card).getByText("CLOSE")).toBeVisible();
    expect(within(card).getByText("(UP)")).toBeVisible();
    expect(within(card).getByText("60")).toBeVisible();
    expect(within(card).queryByRole("status")).not.toBeInTheDocument();
  });

  it("places the startup preview inside the card without removing current content", async () => {
    await act(async () => i18n.changeLanguage("en"));
    render(
      <StepCard
        step={steps[0]}
        stepIndex={0}
        totalSteps={2}
        remainingSeconds={40}
        progress={0}
        isImminent={false}
        hideTargetAmount
        nextStepPreview={(
          <NextStepPreview
            step={steps[0]}
            prevCumulative={0}
            visible
            isFirstStep
          />
        )}
        steps={steps}
        currentTime={0}
      />,
    );

    const card = screen.getByRole("region", { name: "Current Step" });
    expect(within(card).getByRole("status", { name: "First" })).toBeVisible();
    expect(within(card).getByText("CLOSE")).toBeVisible();
    expect(screen.queryAllByRole("region", { name: "Current Step" })).toHaveLength(1);
  });

  it("breaks the cool-pour instruction into two lines in both locations", async () => {
    await act(async () => i18n.changeLanguage("en"));
    const coolStep: ComputedStep = {
      timeSec: 90,
      actionType: "pour_cool",
      waterAmountType: "strength",
      cumulative: 210,
      increment: 90,
    };

    render(
      <StepCard
        step={coolStep}
        stepIndex={2}
        totalSteps={5}
        remainingSeconds={40}
        progress={0}
        isImminent
        nextStepPreview={(
          <NextStepPreview
            step={coolStep}
            prevCumulative={120}
            visible
          />
        )}
        steps={[steps[0], steps[1], coolStep, steps[2]]}
        currentTime={90}
      />,
    );

    const card = screen.getByRole("region", { name: "Current Step" });
    expect(within(card).getByText("210")).toBeVisible();
    expect(within(card).getAllByText("70")).toHaveLength(2);
    expect(card.querySelectorAll("br")).toHaveLength(2);
  });
});
