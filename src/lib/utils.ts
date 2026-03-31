import { type ClassValue, clsx } from "clsx";
import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";
import { analyticsOptions$ } from "./states/analytics";
import { chartColors } from "./constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function useMediaQuery(query: string) {
  const [value, setValue] = useState(false);

  useEffect(() => {
    function onChange(event: MediaQueryListEvent) {
      setValue(event.matches);
    }

    const result = matchMedia(query);
    result.addEventListener("change", onChange);
    setValue(result.matches);

    return () => result.removeEventListener("change", onChange);
  }, [query]);

  return value;
}

export function omitFromObject<T extends object>(
  obj: T,
  fields: (keyof T)[],
): Partial<T> {
  const newObj = { ...obj };
  for (const field of fields) {
    if (field in newObj) {
      delete newObj[field];
    }
  }
  return newObj;
}

export function cleanObject<T>(obj: Record<string, unknown>): T {
  const newObj = {} as Record<string, unknown>;
  Object.keys(obj).forEach((key) => {
    if (obj[key]) {
      newObj[key] = obj[key];
    }
  });
  return newObj as T;
}

export function getRandomColor(): string {
  const red = Math.floor(Math.random() * 256);
  const green = Math.floor(Math.random() * 256);
  const blue = Math.floor(Math.random() * 256);
  const color = `#${red.toString(16)}${green.toString(16)}${blue.toString(16)}`;
  return color;
}

export function DownloadJPEG(jpegString: string, filename: string) {
  const a = document.createElement("a");
  a.href = `data:image/jpeg;base64,${jpegString}`;
  a.download = filename + ".jpeg";
  a.click();
}

export const setColor = (species: string, index: number) => {
  if (analyticsOptions$.peek().colors[species]) {
    return;
  }
  analyticsOptions$.set((prev) => ({
    ...prev,
    colors: {
      ...prev.colors,
      [species]: chartColors[index] ?? "",
    },
  }));
};

export function dateToISOString(datee: Date) {
  const date = new Date(datee);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  return `${year}-${month < 10 ? `0${month}` : month}-${day < 10 ? `0${day}` : day}T${hours < 10 ? `0${hours}` : hours}:${minutes < 10 ? `0${minutes}` : minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
}

export function setParamsinDate(
  date: Date | undefined,
  params: {
    years?: number;
    months?: number;
    days?: number;
    hours?: number;
    minutes?: number;
    seconds?: number;
  },
) {
  if (!date) return;
  const newDate = new Date(date);
  if (params.years) newDate.setFullYear(params.years);
  if (params.months) newDate.setMonth(params.months);
  if (params.days) newDate.setDate(params.days);
  if (params.hours) newDate.setHours(params.hours);
  if (params.minutes) newDate.setMinutes(params.minutes);
  if (params.seconds) newDate.setSeconds(params.seconds);
  return newDate;
}
