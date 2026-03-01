import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useSessionStore } from "../../features/timer/store";
import { useSettingsStore } from "../../features/settings/store";
import { newHybridMethod, computeSteps, getTotalWater } from "../../features/recipe";
import { useTimer } from "../../features/timer/hooks/useTimer";
import { useWakeLock } from "../../features/timer/hooks/useWakeLock";
import { useNotification } from "../../features/timer/hooks/useNotification";
import { StepCard } from "../../features/timer/components/StepCard";
import { NextStepPreview } from "../../features/timer/components/NextStepPreview";
import { Timeline } from "../../features/timer/components/Timeline";

export function TimerPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const { beans, flavor } = useSessionStore();
  const { debugSpeed, animation } = useSettingsStore();
  const { playSound, vibrate } = useNotification();
  const wakeLock = useWakeLock();

  const steps = useMemo(
    () => computeSteps(newHybridMethod, beans, flavor),
    [beans, flavor],
  );
  const totalWater = getTotalWater(beans, newHybridMethod.waterRatio);

  const [overlayStep, setOverlayStep] = useState<{
    index: number;
    prevCumulative: number;
  } | null>(null);

  const startDelayRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const onPreNotify = useCallback(
    (nextStepIndex: number, isFinish: boolean) => {
      vibrate("pre-step");
      if (!isFinish && nextStepIndex >= 0 && animation) {
        const prevCumulative =
          nextStepIndex > 0 ? steps[nextStepIndex - 1].cumulative : 0;
        setOverlayStep({ index: nextStepIndex, prevCumulative });
      }
    },
    [vibrate, animation, steps],
  );

  const onSoundPreNotify = useCallback(
    (isFinish: boolean) => {
      playSound(isFinish);
    },
    [playSound],
  );

  const onStepCrossed = useCallback(() => {
    vibrate("step-change");
  }, [vibrate]);

  const onOverlayExpired = useCallback(() => {
    setOverlayStep(null);
  }, []);

  const timer = useTimer(steps, debugSpeed, {
    onPreNotify,
    onSoundPreNotify,
    onStepCrossed,
    onOverlayExpired,
  });

  const currentStep = steps[timer.currentStepIndex];
  const nextStep = steps[timer.currentStepIndex + 1];

  const remainingToNext = nextStep
    ? Math.max(0, nextStep.timeSec - timer.currentTime)
    : Math.max(0, timer.finalTime - timer.currentTime);

  const stepStart = currentStep?.timeSec ?? 0;
  const stepEnd = nextStep ? nextStep.timeSec : timer.finalTime;
  const stepDuration = Math.max(1, stepEnd - stepStart);
  const elapsed = Math.max(0, timer.currentTime - stepStart);
  const progress = Math.min(1, elapsed / stepDuration);
  const isImminent = remainingToNext > 0 && remainingToNext <= 5;

  const flavorLabel = t(`flavorLabels.${flavor}`);

  const handlePlayPause = () => {
    if (timer.status === "running") {
      timer.pause();
      if (startDelayRef.current) {
        clearTimeout(startDelayRef.current);
        startDelayRef.current = null;
        setOverlayStep(null);
      }
      wakeLock.release();
    } else {
      if (timer.currentTime === 0 && animation) {
        // Show first step overlay, then start after 5 seconds
        const prevCumulative = 0;
        setOverlayStep({ index: 0, prevCumulative });
        timer.setOverlayStep(0);
        wakeLock.request();
        startDelayRef.current = setTimeout(() => {
          startDelayRef.current = null;
          setOverlayStep(null);
          timer.start();
        }, 5000);
      } else {
        timer.start();
        wakeLock.request();
      }
    }
  };

  const handleReset = () => {
    if (startDelayRef.current) {
      clearTimeout(startDelayRef.current);
      startDelayRef.current = null;
    }
    setOverlayStep(null);
    timer.reset();
    wakeLock.release();
  };

  // Auto-start if query param is set
  useEffect(() => {
    if (searchParams.get("autostart") === "1") {
      const newParams = new URLSearchParams(searchParams);
      newParams.delete("autostart");
      setSearchParams(newParams, { replace: true });

      if (animation) {
        setOverlayStep({ index: 0, prevCumulative: 0 });
        timer.setOverlayStep(0);
        wakeLock.request();
        startDelayRef.current = setTimeout(() => {
          startDelayRef.current = null;
          setOverlayStep(null);
          timer.start();
        }, 5000);
      } else {
        timer.start();
        wakeLock.request();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Release wake lock on finish
  useEffect(() => {
    if (timer.status === "finished") {
      setOverlayStep(null);
      wakeLock.release();
    }
  }, [timer.status, wakeLock]);

  // Cleanup start delay on unmount
  useEffect(() => {
    return () => {
      if (startDelayRef.current) {
        clearTimeout(startDelayRef.current);
      }
    };
  }, []);

  const isRunningOrStarting =
    timer.status === "running" || startDelayRef.current !== null;

  return (
    <main className="content">
      <section className="card">
        <div>{t("timer.recipe")}</div>
        <div className="hint">
          {t("timer.beansLabel")} {beans}g / {t("timer.flavorLabel")} {flavorLabel}{" "}
          / {t("timer.waterLabel")} {totalWater}g
        </div>
        <button
          className="text-link"
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

      <section className="controls">
        <button className="btn primary" onClick={handlePlayPause}>
          {isRunningOrStarting ? t("timer.pause") : t("timer.play")}
        </button>
        <button className="btn secondary" onClick={handleReset}>
          {t("timer.reset")}
        </button>
      </section>

      {wakeLock.isActive && (
        <div className="screen-status">{t("timer.screenOn")}</div>
      )}

      <Timeline
        steps={steps}
        currentStepIndex={timer.currentStepIndex}
        currentTime={timer.currentTime}
      />
    </main>
  );
}
