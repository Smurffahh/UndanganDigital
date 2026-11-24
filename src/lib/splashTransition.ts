const TRANSITION_STORAGE_KEY = "undangan_login_welcome_transition";
const MAX_TTL_MS = 10000;

export interface SplashTransitionData {
  displayName: string;
  role: "admin" | "parent" | string;
  startedAt: number;
}

export function saveSplashTransition(data: {
  displayName?: string;
  role?: string;
}): void {
  if (typeof window === "undefined") return;

  try {
    const payload: SplashTransitionData = {
      displayName: (data.displayName || "").trim(),
      role: (data.role || "admin").trim(),
      startedAt: Date.now(),
    };
    sessionStorage.setItem(TRANSITION_STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // Gracefully ignore storage quota / sandbox restrictions
  }
}

export function getSplashTransition(): SplashTransitionData | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = sessionStorage.getItem(TRANSITION_STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as Partial<SplashTransitionData>;
    if (!parsed || typeof parsed.startedAt !== "number") {
      sessionStorage.removeItem(TRANSITION_STORAGE_KEY);
      return null;
    }

    if (Date.now() - parsed.startedAt > MAX_TTL_MS) {
      sessionStorage.removeItem(TRANSITION_STORAGE_KEY);
      return null;
    }

    return {
      displayName: typeof parsed.displayName === "string" ? parsed.displayName : "",
      role: typeof parsed.role === "string" ? parsed.role : "admin",
      startedAt: parsed.startedAt,
    };
  } catch {
    sessionStorage.removeItem(TRANSITION_STORAGE_KEY);
    return null;
  }
}

export function clearSplashTransition(): void {
  if (typeof window === "undefined") return;

  try {
    sessionStorage.removeItem(TRANSITION_STORAGE_KEY);
  } catch {
    // Gracefully ignore
  }
}
