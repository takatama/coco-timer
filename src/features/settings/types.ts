export type Language = "ja" | "en";
export type NotifyMode = "both" | "sound" | "vibrate" | "none";
export type Voice = "male" | "female";

export interface Settings {
  language: Language;
  notifyMode: NotifyMode;
  voice: Voice;
  debugEnabled: boolean;
  debugSpeed: number;
  animation: boolean;
  calibrationMode: boolean;
  step3ExtraSecPer10g: number;
  pauseCalibrationHistory: PauseCalibrationRecord[];
}

export interface PauseCalibrationRecord {
  stepIndex: number;
  beans: number;
  pausedSec: number;
  timestamp: number;
}
