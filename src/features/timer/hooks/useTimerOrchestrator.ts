import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useSettingsStore } from "../../settings/store";
import { useSessionStore } from "../store";
import { newHybridMethod, computeSteps, getTotalWater } from "../../recipe";
import { useTimer } from "./useTimer";
import { useWakeLock } from "./useWakeLock";
import { useNotification } from "./useNotification";
import { buildCalibrationSuggestion } from "./calibration";

export function useTimerOrchestrator() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { beans, flavor } = useSessionStore();
  const settings = useSettingsStore();
  const {
    debugSpeed,
    animation,
    step3ExtraSecPer10g,
    calibrationMode,
    pauseCalibrationHistory,
  } = settings;
  const { playSound, vibrate } = useNotification();
  const wakeLock = useWakeLock();

  const steps = useMemo(
    () => computeSteps(newHybridMethod, beans, flavor, { step3ExtraSecPer10g }),
    [beans, flavor, step3ExtraSecPer10g],
  );
  const totalWater = getTotalWater(beans, newHybridMethod.waterRatio);

  const [overlayStep, setOverlayStep] = useState<{
    index: number;
    prevCumulative: number;
  } | null>(null);

  const startDelayRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pauseStartRef = useRef<number | null>(null);
  const pauseStepIndexRef = useRef<number | null>(null);
  const [calibrationPrompt, setCalibrationPrompt] = useState<{
    recommendedPer10g: number;
    latestPauseSec: number;
  } | null>(null);

  const onPreNotify = useCallback(
    (nextStepIndex: number, isFinish: boolean) => {
      vibrate("pre-step");
      playSound(isFinish);
      if (!isFinish && nextStepIndex >= 0 && animation) {
        const prevCumulative =
          nextStepIndex > 0 ? steps[nextStepIndex - 1].cumulative : 0;
        setOverlayStep({ index: nextStepIndex, prevCumulative });
      }
    },
    [vibrate, playSound, animation, steps],
  );

  const onStepCrossed = useCallback(() => {
    vibrate("step-change");
  }, [vibrate]);

  const onOverlayExpired = useCallback(() => {
    setOverlayStep(null);
  }, []);

  const timer = useTimer(steps, debugSpeed, {
    onPreNotify,
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

  const startWithAnimation = useCallback(() => {
    setOverlayStep({ index: 0, prevCumulative: 0 });
    timer.setOverlayStep(0);
    wakeLock.request();
    startDelayRef.current = setTimeout(() => {
      startDelayRef.current = null;
      setOverlayStep(null);
      timer.start();
    }, 5000);
  }, [timer, wakeLock]);

  const handlePlayPause = useCallback(() => {
    // Cancel pending startup countdown first, if any
    if (startDelayRef.current) {
      clearTimeout(startDelayRef.current);
      startDelayRef.current = null;
      setOverlayStep(null);
      wakeLock.release();
      return;
    }

    if (timer.status === "running") {
      pauseStartRef.current = Date.now();
      pauseStepIndexRef.current = timer.currentStepIndex;
      timer.pause();
      wakeLock.release();
    } else {
      if (timer.status === "paused" && pauseStartRef.current !== null) {
        const pausedSec = Math.max(0, Math.round((Date.now() - pauseStartRef.current) / 1000));
        pauseStartRef.current = null;
        const stepIndex = pauseStepIndexRef.current ?? timer.currentStepIndex;
        pauseStepIndexRef.current = null;
        if (pausedSec > 0) {
          settings.addPauseCalibrationRecord({
            stepIndex,
            beans,
            pausedSec,
            timestamp: Date.now(),
          });
        }
      }

      if (timer.currentTime === 0 && animation) {
        startWithAnimation();
      } else {
        timer.start();
        wakeLock.request();
      }
    }
  }, [timer, animation, wakeLock, startWithAnimation, settings, beans]);

  const handleReset = useCallback(() => {
    if (startDelayRef.current) {
      clearTimeout(startDelayRef.current);
      startDelayRef.current = null;
    }
    setOverlayStep(null);
    timer.reset();
    pauseStartRef.current = null;
    pauseStepIndexRef.current = null;
    setCalibrationPrompt(null);
    wakeLock.release();
  }, [timer, wakeLock]);

  // Auto-start if query param is set
  useEffect(() => {
    if (searchParams.get("autostart") === "1") {
      const newParams = new URLSearchParams(searchParams);
      newParams.delete("autostart");
      setSearchParams(newParams, { replace: true });

      if (animation) {
        startWithAnimation();
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
      if (calibrationMode) {
        const suggestion = buildCalibrationSuggestion(pauseCalibrationHistory, beans);
        if (
          suggestion &&
          suggestion.recommendedPer10g > 0 &&
          suggestion.recommendedPer10g !== step3ExtraSecPer10g
        ) {
          setCalibrationPrompt({
            recommendedPer10g: suggestion.recommendedPer10g,
            latestPauseSec: suggestion.latestPauseSec,
          });
        }
      }
    }
  }, [
    timer.status,
    wakeLock,
    calibrationMode,
    pauseCalibrationHistory,
    beans,
    step3ExtraSecPer10g,
  ]);

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

  return {
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
    calibrationPrompt,
    applyCalibrationSuggestion: () => {
      if (!calibrationPrompt) return;
      settings.setStep3ExtraSecPer10g(calibrationPrompt.recommendedPer10g);
      setCalibrationPrompt(null);
    },
    dismissCalibrationSuggestion: () => setCalibrationPrompt(null),
    handlePlayPause,
    handleReset,
  };
}
