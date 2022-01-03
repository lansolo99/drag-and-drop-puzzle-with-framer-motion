import { TTwBgcolorRefs } from "@/types/misc";

export const numberBetween = (x: number, min: number, max: number) => {
  return x >= min && x <= max;
};

export const setMarkerColor = (unit: string): string => {
  const twBgcolor = unit.match(/marker:(.*)/)![1];
  const options: TTwBgcolorRefs = {
    "bg-anthracite-500": "#515151",
    "bg-champagne-600": "#ead9bb",
    "bg-magenta-500": "#EB308A",
    "bg-blue-400": "#23C6E8",
    "bg-blue-500": "#0DB6E2",
  };
  return options[twBgcolor];
};
