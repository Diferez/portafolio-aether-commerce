import type { IntroColorMode, IntroCompletionReason } from "./types";

export const INTRO_SESSION_KEY = "liminal-intro-seen-v1";

export const INTRO_CONFIG = Object.freeze({
  enabled: true,
  showOncePerSession: true,
  durationScale: 1,
  debug: false,
  colorMode: "monochrome" as IntroColorMode,
});

export function resolveIntroColorMode(value: string | null, fallback: IntroColorMode = INTRO_CONFIG.colorMode): IntroColorMode {
  return value === "duotone" || value === "realistic" || value === "monochrome" ? value : fallback;
}

export interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

export function shouldRunIntro(
  storage: StorageLike | null,
  force = false,
  config = INTRO_CONFIG,
): boolean {
  if (!config.enabled) return false;
  if (force || config.debug || !config.showOncePerSession) return true;
  try { return storage?.getItem(INTRO_SESSION_KEY) !== "1"; }
  catch { return true; }
}

export function markIntroSeen(storage: StorageLike | null): boolean {
  try { storage?.setItem(INTRO_SESSION_KEY, "1"); return Boolean(storage); }
  catch { return false; }
}

export function getSessionStorageSafely(): StorageLike | null {
  if (typeof window === "undefined") return null;
  try { return window.sessionStorage; }
  catch { return null; }
}

export function createOnceFinalizer<T extends [IntroCompletionReason]>(callback: (...args: T) => void) {
  let complete = false;
  return (...args: T): boolean => {
    if (complete) return false;
    complete = true;
    callback(...args);
    return true;
  };
}
