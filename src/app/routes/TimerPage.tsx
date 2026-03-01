import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useTimerOrchestrator } from "../../features/timer/hooks/useTimerOrchestrator";
import { StepCard } from "../../features/timer/components/StepCard";
import { NextStepPreview } from "../../features/timer/components/NextStepPreview";
import { Timeline } from "../../features/timer/components/Timeline";
import styles from "./TimerPage.module.css";

export function TimerPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const {
    steps,
    beans,
    flavor,
    totalWater,
    currentStep,
    timer,
    overlayStep,
    remainingToNext,
    progress,
    isImminent,
    isRunningOrStarting,
    animation,
    wakeLock,
    handlePlayPause,
    handleReset,
  } = useTimerOrchestrator();

  const flavorLabel = t(`flavorLabels.${flavor}`);

  return (
    <main className="content">
      <section className="card">
        <div>{t("timer.recipe")}</div>
        <div className="hint">
          {t("timer.beansLabel")} {beans}g / {t("timer.flavorLabel")} {flavorLabel}{" "}
          / {t("timer.waterLabel")} {totalWater}g
        </div>
        <button
          className={styles.textLink}
          onClick={() => navigate("/setup")}
        >
          {t("timer.editParams")}
        </button>
      </section>

      {currentStep && (
        <StepCard
          step={currentStep}
          stepIndex={timer.currentStepIndex}
          totalSteps={steps.length}
          remainingSeconds={remainingToNext}
          progress={progress}
          isImminent={isImminent}
        />
      )}

      {overlayStep && animation && steps[overlayStep.index] && (
        <NextStepPreview
          step={steps[overlayStep.index]}
          prevCumulative={overlayStep.prevCumulative}
          visible={true}
        />
      )}

      <section className={styles.controls}>
        <button className={`${styles.btn} ${styles.primary}`} onClick={handlePlayPause}>
          {isRunningOrStarting ? t("timer.pause") : t("timer.play")}
        </button>
        <button className={`${styles.btn} ${styles.secondary}`} onClick={handleReset}>
          {t("timer.reset")}
        </button>
      </section>

      {wakeLock.isActive && (
        <div className={styles.screenStatus}>{t("timer.screenOn")}</div>
      )}

      <Timeline
        steps={steps}
        currentStepIndex={timer.currentStepIndex}
        currentTime={timer.currentTime}
      />
    </main>
  );
}
