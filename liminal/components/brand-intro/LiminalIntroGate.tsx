"use client";

import { useCallback, useEffect, useState } from "react";
import { LiminalBrandIntro } from "./LiminalBrandIntro";
import {
  getSessionStorageSafely,
  INTRO_CONFIG,
  markIntroSeen,
  resolveIntroColorMode,
  shouldRunIntro,
} from "./introSession";
import type { IntroColorMode, IntroCompletionReason } from "./types";

interface IntroState {
  show: boolean;
  ready: boolean;
  debug: boolean;
  reduced: boolean;
  colorMode: IntroColorMode;
}

export function LiminalIntroGate() {
  const [introState, setIntroState] = useState<IntroState>({
    show: true,
    ready: false,
    debug: false,
    reduced: false,
    colorMode: INTRO_CONFIG.colorMode,
  });

  useEffect(() => {
    let cancelled = false;
    queueMicrotask(() => {
      if (cancelled) return;
      const params = new URLSearchParams(window.location.search);
      const localPreview = ["localhost", "127.0.0.1"].includes(window.location.hostname);
      const debugRequested = localPreview && params.get("intro") === "debug";
      const reducedRequested = localPreview && params.get("intro") === "reduce";
      const introMode = params.get("intro");
      const colorMode = resolveIntroColorMode(params.get("variant") ?? introMode);
      const forced = introMode === "1" || introMode === "duotone" || introMode === "realistic" || debugRequested || reducedRequested;
      const shouldShow = shouldRunIntro(getSessionStorageSafely(), forced || debugRequested);
      document.documentElement.dataset.liminalTheme = colorMode;
      setIntroState({ show: shouldShow, ready: shouldShow, debug: debugRequested || INTRO_CONFIG.debug, reduced: reducedRequested, colorMode });
    });
    return () => { cancelled = true; };
  }, []);

  const finish = useCallback((reason: IntroCompletionReason) => {
    markIntroSeen(getSessionStorageSafely());
    const overlay = document.querySelector<HTMLElement>("[data-liminal-intro]");
    const activeWasInside = Boolean(overlay?.contains(document.activeElement));
    setIntroState((current) => ({ ...current, show: false }));
    if (reason === "skip" || activeWasInside) {
      requestAnimationFrame(() => document.querySelector<HTMLElement>("#store-content")?.focus({ preventScroll: true }));
    }
  }, []);

  if (!introState.show) return null;
  if (!introState.ready) {
    return (
      <div
        aria-label="Introducción de Liminal Accesorios"
        role="dialog"
        style={{ position: "fixed", inset: 0, zIndex: 2147483000, background: "#000" }}
      />
    );
  }
  return (
    <LiminalBrandIntro
      enabled
      colorMode={introState.colorMode}
      debug={introState.debug}
      forceReducedMotion={introState.reduced}
      durationScale={introState.debug ? 1.8 : INTRO_CONFIG.durationScale}
      onComplete={finish}
    />
  );
}
