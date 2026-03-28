import { holidaySatClearTracks } from "./holiday/sat/clear";
import { weekdayMonClearTracks } from "./weekday/mon/clear";
import type { AudioTrack, BgmContext } from "./types";

export type { AudioTrack, BgmContext } from "./types";

export type DebugBgmPreset = "weekday" | "holiday";

const DEBUG_BGM_CONTEXT_BY_PRESET: Record<DebugBgmPreset, BgmContext> = {
  weekday: { dayType: "weekday", dayOfWeek: "mon", weather: "clear" },
  holiday: { dayType: "holiday", dayOfWeek: "sat", weather: "clear" },
};

const TRACKS_BY_CONTEXT_KEY: Record<string, AudioTrack[]> = {
  "weekday:mon:clear": weekdayMonClearTracks,
  "holiday:sat:clear": holidaySatClearTracks,
};

const toContextKey = (context: BgmContext): string =>
  `${context.dayType}:${context.dayOfWeek}:${context.weather}`;

export const getTracksForContext = (context: BgmContext): AudioTrack[] => {
  return TRACKS_BY_CONTEXT_KEY[toContextKey(context)] ?? weekdayMonClearTracks;
};

export const getDebugBgmContext = (dayType: DebugBgmPreset): BgmContext => {
  return DEBUG_BGM_CONTEXT_BY_PRESET[dayType];
};

export const getDebugBgmTracks = (dayType: DebugBgmPreset): AudioTrack[] => {
  return getTracksForContext(getDebugBgmContext(dayType));
};
