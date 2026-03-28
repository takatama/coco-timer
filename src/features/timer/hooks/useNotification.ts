import { useCallback, useEffect, useRef } from "react";
import { useSettingsStore } from "../../settings/store";

export function useNotification() {
  const language = useSettingsStore((s) => s.language);
  const voice = useSettingsStore((s) => s.voice);

  const nextStepAudioRef = useRef<HTMLAudioElement | null>(null);
  const finishAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const nextStepAudio = new Audio(`/assets/audio/${language}-${voice}-next-step.wav`);
    const finishAudio = new Audio(`/assets/audio/${language}-${voice}-finish.wav`);
    nextStepAudio.load();
    finishAudio.load();
    nextStepAudioRef.current = nextStepAudio;
    finishAudioRef.current = finishAudio;

    return () => {
      nextStepAudio.pause();
      finishAudio.pause();
    };
  }, [language, voice]);

  const playSound = useCallback((isFinish: boolean) => {
    if (!useSettingsStore.getState().isSoundEnabled()) return;
    const audio = isFinish ? finishAudioRef.current : nextStepAudioRef.current;
    if (!audio) return;
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
