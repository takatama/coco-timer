import { Trans, useTranslation } from "react-i18next";
import type { ReactNode } from "react";
import type { ComputedStep } from "../../recipe/types";
import {
  BrewStepCardFrame,
  TimerTimeline,
} from "../../../shared/brew-timer";
import { Countdown } from "./Countdown";
import styles from "./StepCard.module.css";

interface Props {
  step: ComputedStep;
  stepIndex: number;
  totalSteps: number;
  remainingSeconds: number;
  progress: number;
  isImminent: boolean;
  hideTargetAmount?: boolean;
  nextStepPreview?: ReactNode;
  steps: ComputedStep[];
  currentTime: number;
}

function VerbText({ step }: { step: ComputedStep }) {
  const { t } = useTranslation();

  const withNote = (label: string, note: string) => (
    <>
      {label}
      <span className={styles.verbNote}>({note})</span>
    </>
  );

  switch (step.actionType) {
    case "switch_close_pour":
      return withNote(t("timer.close"), t("timer.up"));
    case "switch_open_pour":
    case "pour_cool":
      return withNote(t("timer.open"), t("timer.down"));
    case "switch_open":
      return withNote(t("timer.open"), t("timer.down"));
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
    return <>{t("timer.openWaitNoPour")}</>;
  }

  const amount = step.cumulative;
  if (step.actionType === "switch_close_pour" || step.actionType === "switch_open_pour") {
    return (
      <Trans
        i18nKey="timer.pourToAmount"
        values={{ amount }}
        components={{ num: <span className="pour-number" />, unit: <span className="pour-unit" /> }}
      />
    );
  }

  if (step.actionType === "pour_cool") {
    return (
      <Trans
        i18nKey="timer.pourCoolTo"
        values={{ amount }}
        components={{
          num: <span className="pour-number" />,
          unit: <span className="pour-unit" />,
          br: <br />,
        }}
      />
    );
  }

  return null;
}

export function StepCard({
  step,
  stepIndex,
  totalSteps,
  remainingSeconds,
  progress,
  isImminent,
  hideTargetAmount = false,
  nextStepPreview,
  steps,
  currentTime,
}: Props) {
  const { t } = useTranslation();
  return (
    <div className={`${styles.cardFrame}${nextStepPreview ? ` ${styles.cardFrameWithPreview}` : ""}`}>
      <BrewStepCardFrame
      ariaLabel={t("timer.currentStep")}
      stepLabel={<>STEP {stepIndex + 1} / {totalSteps}</>}
      timeline={(
        <TimerTimeline
          steps={steps}
          currentStepIndex={stepIndex}
          currentTime={currentTime}
          ariaLabel={t("timer.timeline")}
        />
      )}
      instruction={(
        <>
          <div className={styles.stepVerb}>
            <VerbText step={step} />
          </div>
          <div
            className={`${styles.stepSub}${hideTargetAmount ? ` ${styles.stepSubHidden}` : ""}`}
            aria-hidden={hideTargetAmount || undefined}
          >
            <InstructionText step={step} />
          </div>
        </>
      )}
      preview={nextStepPreview}
      countdown={(
        <Countdown
          remainingSeconds={remainingSeconds}
          progress={progress}
          isImminent={isImminent}
        />
      )}
      isImminent={isImminent}
      />
    </div>
  );
}
