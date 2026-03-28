export type Language = "ja" | "en";
export type NotifyMode = "both" | "sound" | "vibrate" | "none";
export type Voice = "male" | "female";
export type DebugBgmDayType = "weekday" | "holiday";

export interface Settings {
  language: Language;
  notifyMode: NotifyMode;
  voice: Voice;
  debugEnabled: boolean;
  debugSpeed: number;
  animation: boolean;
  bgmEnabled: boolean;
  debugBgmDayType: DebugBgmDayType;
}
