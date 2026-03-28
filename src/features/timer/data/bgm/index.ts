import { holidaySatClearTracks } from "./holiday/sat/clear";
import { weekdayMonClearTracks } from "./weekday/mon/clear";
import type { AudioTrack, BgmContext } from "./types";

export type { AudioTrack, BgmContext } from "./types";

export type BgmDayTypePreset = "weekday" | "holiday";

const BGM_CONTEXT_BY_DAY_TYPE: Record<BgmDayTypePreset, BgmContext> = {
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

export const getBgmContextForDayType = (dayType: BgmDayTypePreset): BgmContext => {
  return BGM_CONTEXT_BY_DAY_TYPE[dayType];
};

export const getBgmTracksForDayType = (dayType: BgmDayTypePreset): AudioTrack[] => {
  return getTracksForContext(getBgmContextForDayType(dayType));
};

export const getAutoBgmDayType = (): BgmDayTypePreset => {
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
};

export const getActiveBgmTracks = (params: {
  debugEnabled: boolean;
  debugDayType: BgmDayTypePreset;
}): AudioTrack[] => {
  const dayType = params.debugEnabled ? params.debugDayType : getAutoBgmDayType();
  return getBgmTracksForDayType(dayType);
};
