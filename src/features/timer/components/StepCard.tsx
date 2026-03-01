import { useTranslation } from "react-i18next";
import type { ComputedStep } from "../../recipe/types";
import { Countdown } from "./Countdown";

interface Props {
  step: ComputedStep;
  stepIndex: number;
  totalSteps: number;
  remainingSeconds: number;
  progress: number;
  isImminent: boolean;
}

function VerbText({ step }: { step: ComputedStep }) {
  const { t } = useTranslation();

  const withNote = (label: string, note: string) => (
    <>
      {label}
      <span className="verb-note">({note})</span>
    </>
  );

  switch (step.actionType) {
    case "switch_close_pour":
      return withNote(t("timer.close"), t("timer.up"));
    case "switch_open_pour":
    case "pour_cool":
      return withNote(t("timer.open"), t("timer.down"));
    case "switch_open":
      return withNote(t("timer.open"), t("timer.up"));
    case "none":
      return <>{t("timer.finish")}</>;
    default:
      return <>{t("timer.wait")}</>;
  }
}

function InstructionText({ step }: { step: ComputedStep }) {
  const { t } = useTranslation();

  if (step.actionType === "none") {
    return <>{t("timer.enjoyCoffee")}</>;
  }
  if (step.actionType === "switch_open") {
    return <>{t("timer.waitNoPour")}</>;
  }

  const amount = step.cumulative;
  if (step.actionType === "pour_cool") {
    return (
      <>
        <span className="pour-amount">{amount}g</span> {t("timer.pourTo")}
        {", "}
        <span className="pour-amount">70℃</span> {t("timer.coolTo")}
      </>
    );
  }

  return (
    <>
      <span className="pour-amount">{amount}g</span> {t("timer.pourTo")}
    </>
  );
}

export function StepCard({
  step,
  stepIndex,
  totalSteps,
  remainingSeconds,
  progress,
  isImminent,
}: Props) {
  return (
    <section className={`card primary-card${isImminent ? " imminent" : ""}`}>
      <div className="step-meta">
        STEP {stepIndex + 1} / {totalSteps}
      </div>
      <div className="step-verb">
        <VerbText step={step} />
      </div>
      <div className="step-sub">
        <InstructionText step={step} />
      </div>
      <Countdown
        remainingSeconds={remainingSeconds}
        progress={progress}
        isImminent={isImminent}
      />
    </section>
  );
}
