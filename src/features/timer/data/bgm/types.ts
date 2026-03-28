export type AudioTrack = {
  id: string;
  title: string;
  subtitle: string;
  audioUrl: string;
  artworkUrl: string;
};

export type BgmDayType = "weekday" | "holiday";
export type BgmDayOfWeek = "mon" | "sat";
export type BgmWeather = "clear";

export type BgmContext = {
  dayType: BgmDayType;
  dayOfWeek: BgmDayOfWeek;
  weather: BgmWeather;
};
