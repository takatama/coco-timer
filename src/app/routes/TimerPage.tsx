import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useTimerOrchestrator } from "../../features/timer/hooks/useTimerOrchestrator";
import { useSettingsStore } from "../../features/settings/store";
import { StepCard } from "../../features/timer/components/StepCard";
import { FinishCard } from "../../features/timer/components/FinishCard";
import { NextStepPreview } from "../../features/timer/components/NextStepPreview";
import { Timeline } from "../../features/timer/components/Timeline";
import { useCoffeeNews } from "../../features/timer/hooks/useCoffeeNews";
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
    handlePlayPause,
    handleReset,
  } = useTimerOrchestrator();

  const flavorLabel = t(`flavorLabels.${flavor}`);
  const { debugEnabled, debugSpeed, setDebugSpeed, language } = useSettingsStore();
  const { news, loading: newsLoading } = useCoffeeNews(language);

  return (
    <main className="content">
      <section className="card">
        <div>{t("timer.recipe")}</div>
        <div className={styles.chipRow}>
          <span className={styles.chip}>{t("timer.beansChipLabel")} {beans}g</span>
          <span className={styles.chip}>{flavorLabel}</span>
          <span className={styles.chip}>{t("timer.waterChipLabel")} {totalWater}g</span>
        </div>
        <button className={styles.textLink} onClick={() => navigate("/setup")}>
          {t("timer.editParams")}
        </button>
      </section>

      {currentStep && currentStep.actionType !== "none" && (
        <StepCard
          step={currentStep}
          stepIndex={timer.currentStepIndex}
          totalSteps={steps.length}
          remainingSeconds={remainingToNext}
          progress={progress}
          isImminent={isImminent}
        />
      )}

      {currentStep?.actionType === "none" && (
        <FinishCard
          stepIndex={timer.currentStepIndex}
          totalSteps={steps.length}
          news={news}
          newsLoading={newsLoading}
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
        <div className={styles.primaryControlRow}>
          <button className={`${styles.btn} ${styles.primary}`} onClick={handlePlayPause}>
            {isRunningOrStarting ? t("timer.pause") : t("timer.play")}
          </button>
          {debugEnabled && (
            <button
              className={`${styles.speedToggle} ${debugSpeed === 5 ? styles.speedToggleActive : ""}`}
              onClick={() => setDebugSpeed(debugSpeed === 5 ? 1 : 5)}
            >
              {t("settings.debugX5")}
            </button>
          )}
        </div>
        <button className={`${styles.btn} ${styles.outline}`} onClick={handleReset}>
          {t("timer.reset")}
        </button>
      </section>

      <Timeline
        steps={steps}
        currentStepIndex={timer.currentStepIndex}
        currentTime={timer.currentTime}
      />
    </main>
  );
}
