import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { DebugBgmDayType, Language, NotifyMode, Settings, Voice } from "./types";

function getDefaultLanguage(): Language {
  if (typeof navigator === "undefined") return "en";
  return navigator.language.startsWith("ja") ? "ja" : "en";
}

function getDefaultDebugBgmDayType(): DebugBgmDayType {
  if (typeof navigator === "undefined") {
    return "weekday";
  }

  const locale = navigator.language;
  const today = new Date();

  const localeInfo = typeof Intl.Locale !== "undefined"
    ? new Intl.Locale(locale)
    : null;
  const weekendDays = localeInfo?.weekInfo?.weekend;

  const jsDay = today.getDay();
  const dayForWeekInfo = jsDay === 0 ? 7 : jsDay;

  if (Array.isArray(weekendDays) && weekendDays.includes(dayForWeekInfo)) {
    return "holiday";
  }

  return jsDay === 0 || jsDay === 6 ? "holiday" : "weekday";
}

function normalizeNotifyMode(mode: string | undefined): NotifyMode {
  if (mode === "both" || mode === "sound" || mode === "vibrate" || mode === "none") {
    return mode;
  }
  return "both";
}

export interface SettingsStore extends Settings {
  setLanguage: (lang: Language) => void;
  setNotifyMode: (mode: NotifyMode) => void;
  toggleNotifyFlag: (flag: "sound" | "vibrate") => void;
  setVoice: (voice: Voice) => void;
  setDebugEnabled: (enabled: boolean) => void;
  setDebugSpeed: (speed: number) => void;
  setAnimation: (enabled: boolean) => void;
  setBgmEnabled: (enabled: boolean) => void;
  setDebugBgmDayType: (dayType: DebugBgmDayType) => void;
  isSoundEnabled: () => boolean;
  isVibrateEnabled: () => boolean;
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set, get) => ({
      language: getDefaultLanguage(),
      notifyMode: "both" as NotifyMode,
      voice: "male" as Voice,
      debugEnabled: false,
      debugSpeed: 1,
      animation: true,
      bgmEnabled: true,
      debugBgmDayType: getDefaultDebugBgmDayType(),

      setLanguage: (language) => set({ language }),
      setNotifyMode: (notifyMode) => set({ notifyMode }),

      toggleNotifyFlag: (flag) => {
        const { notifyMode } = get();
        const flags = {
          sound: notifyMode === "sound" || notifyMode === "both",
          vibrate: notifyMode === "vibrate" || notifyMode === "both",
        };
        flags[flag] = !flags[flag];

        let newMode: NotifyMode;
        if (flags.sound && flags.vibrate) newMode = "both";
        else if (flags.sound) newMode = "sound";
        else if (flags.vibrate) newMode = "vibrate";
        else newMode = "none";

        set({ notifyMode: newMode });
      },

      setVoice: (voice) => set({ voice }),
      setDebugEnabled: (debugEnabled) =>
        set({
          debugEnabled,
          debugSpeed: debugEnabled ? 5 : 1,
        }),
      setDebugSpeed: (debugSpeed) =>
        set({
          debugSpeed: debugSpeed === 5 ? 5 : 1,
        }),
      setAnimation: (animation) => set({ animation }),
      setBgmEnabled: (bgmEnabled) => set({ bgmEnabled }),
      setDebugBgmDayType: (debugBgmDayType) => set({ debugBgmDayType }),

      isSoundEnabled: () => {
        const mode = get().notifyMode;
        return mode === "sound" || mode === "both";
      },
      isVibrateEnabled: () => {
        const mode = get().notifyMode;
        return mode === "vibrate" || mode === "both";
      },
    }),
    {
      name: "coco-timer-settings",
      version: 4,
      migrate: (persistedState: unknown) => {
        const state = (persistedState ?? {}) as Partial<Settings>;
        const debugSpeed = state.debugSpeed === 5 ? 5 : 1;
        return {
          ...state,
          debugSpeed,
          debugEnabled: state.debugEnabled ?? debugSpeed > 1,
          bgmEnabled: state.bgmEnabled ?? true,
          debugBgmDayType: state.debugBgmDayType ?? getDefaultDebugBgmDayType(),
        };
      },
      partialize: (state) => ({
        language: state.language,
        notifyMode: normalizeNotifyMode(state.notifyMode),
        voice: state.voice,
        debugEnabled: state.debugEnabled,
        debugSpeed: state.debugSpeed,
        animation: state.animation,
        bgmEnabled: state.bgmEnabled,
        debugBgmDayType: state.debugBgmDayType,
      }),
    },
  ),
);
