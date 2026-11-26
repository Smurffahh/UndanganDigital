"use client";

import {
  JAVANESE_SCRIPT_ACCENTS,
  type FontTheme,
  type JavaneseAccentKey,
} from "@/lib/fontThemes";

interface JavaneseScriptAccentProps {
  section: JavaneseAccentKey;
  fontTheme?: FontTheme;
  className?: string;
}

export function JavaneseScriptAccent({
  section,
  fontTheme = "classic",
  className = "",
}: JavaneseScriptAccentProps) {
  if (fontTheme !== "javanese") {
    return null;
  }

  const text = JAVANESE_SCRIPT_ACCENTS[section];

  return (
    <p
      lang="jv"
      aria-hidden="true"
      className={`font-invitation-javanese text-[#7A4E1D] leading-[1.9] py-[0.15em] font-normal tracking-normal select-none ${className}`}
    >
      {text}
    </p>
  );
}
