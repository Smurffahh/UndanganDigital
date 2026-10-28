import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const focusRing =
  "focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-rose-700 focus-visible:ring-offset-2";

export const disabledState =
  "disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed";
