import { useCallback, useEffect, useRef } from "react";
import { useSettingsStore } from "../../settings/store";

export const VOICE_NOTIFICATION_EVENT = "coco:voice-notification";

function loadAudioPair(
  language: string,
  voice: string,
): [HTMLAudioElement, HTMLAudioElement] {
  const nextStep = new Audio(`/assets/audio/${language}-${voice}-next-step.wav`);
  const finish = new Audio(`/assets/audio/${language}-${voice}-finish.wav`);
  nextStep.load();
  finish.load();
  return [nextStep, finish];
}

export function useNotification() {
  const nextStepAudioRef = useRef<HTMLAudioElement | null>(null);
  const finishAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const { language, voice } = useSettingsStore.getState();
    [nextStepAudioRef.current, finishAudioRef.current] = loadAudioPair(language, voice);

    const unsubscribe = useSettingsStore.subscribe((state, prev) => {
      if (state.language !== prev.language || state.voice !== prev.voice) {
        nextStepAudioRef.current?.pause();
        finishAudioRef.current?.pause();
        [nextStepAudioRef.current, finishAudioRef.current] = loadAudioPair(
          state.language,
          state.voice,
        );
      }
    });

    return () => {
      unsubscribe();
      nextStepAudioRef.current?.pause();
      finishAudioRef.current?.pause();
    };
  }, []);

  const playSound = useCallback((isFinish: boolean) => {
    if (!useSettingsStore.getState().isSoundEnabled()) return;
    const audio = isFinish ? finishAudioRef.current : nextStepAudioRef.current;
    if (!audio) return;
    window.dispatchEvent(new CustomEvent(VOICE_NOTIFICATION_EVENT));
    audio.currentTime = 0;
    audio.play().catch(() => {});
  }, []);

  const vibrate = useCallback((type: "pre-step" | "step-change") => {
    if (!useSettingsStore.getState().isVibrateEnabled()) return;
    if (!navigator.vibrate) return;
    if (type === "pre-step") {
      navigator.vibrate(180);
    } else {
      navigator.vibrate([140, 80, 140]);
    }
  }, []);

  return { playSound, vibrate };
}
