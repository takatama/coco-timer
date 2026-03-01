import { useCallback, useRef } from "react";
import { useSettingsStore } from "../../settings/store";

export function useNotification() {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playSound = useCallback((isFinish: boolean) => {
    const { language, voice } = useSettingsStore.getState();
    if (!useSettingsStore.getState().isSoundEnabled()) return;
    const type = isFinish ? "finish" : "next-step";
    const src = `/assets/audio/${language}-${voice}-${type}.wav`;
    if (audioRef.current) {
      audioRef.current.pause();
    }
    audioRef.current = new Audio(src);
    audioRef.current.play().catch(() => {});
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
