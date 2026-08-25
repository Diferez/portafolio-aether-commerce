"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, type RefObject } from "react";
import { createOnceFinalizer } from "./introSession";
import { doorGeometryFor } from "./geometry";
import type { IntroColorMode, IntroCompletionReason } from "./types";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

interface IntroControllerOptions {
  scope: RefObject<HTMLDivElement | null>;
  enabled: boolean;
  embedded: boolean;
  scrollBound: boolean;
  colorMode: IntroColorMode;
  debug: boolean;
  forceReducedMotion: boolean;
  durationScale: number;
  onComplete: (reason: IntroCompletionReason) => void;
}

interface CameraGeometry {
  scale: number;
  x: number;
  y: number;
  originX: number;
  originY: number;
}

const CRITICAL_LOAD_TIMEOUT = 1400;

function monitorCriticalImages(scope: HTMLElement, onFailure: () => void): () => void {
  const images = Array.from(scope.querySelectorAll<HTMLImageElement>("img[data-critical='true']"));
  let finished = false;
  let timer = 0;
  const checkFailure = () => {
    window.setTimeout(() => {
      if (images.some((image) => image.complete && image.naturalWidth === 0)) fail();
    }, 0);
  };
  const cleanup = () => {
    window.clearTimeout(timer);
    images.forEach((image) => image.removeEventListener("error", checkFailure));
  };
  const fail = () => {
    if (finished) return;
    finished = true;
    cleanup();
    onFailure();
  };
  images.forEach((image) => image.addEventListener("error", checkFailure));
  timer = window.setTimeout(() => {
    if (images.some((image) => !image.complete || image.naturalWidth === 0)) fail();
    else { finished = true; cleanup(); }
  }, CRITICAL_LOAD_TIMEOUT);
  return cleanup;
}

function getCameraGeometry(stage: HTMLElement, colorMode: IntroColorMode): CameraGeometry {
  const rect = stage.getBoundingClientRect();
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.visualViewport?.height ?? window.innerHeight;
  const door = doorGeometryFor(colorMode);
  const originX = (door.focusX / 1536) * rect.width;
  const originY = (door.focusY / 1536) * rect.height;
  const doorWidth = (door.width / 1536) * rect.width;
  const doorHeight = (door.height / 1536) * rect.height;
  const doorCenterX = rect.left + originX;
  const doorCenterY = rect.top + originY;

  return {
    scale: Math.max((viewportWidth * 1.08) / doorWidth, (viewportHeight * 1.08) / doorHeight),
    x: viewportWidth / 2 - doorCenterX,
    y: viewportHeight / 2 - doorCenterY,
    originX,
    originY,
  };
}

function flameLoops(query: gsap.utils.SelectorFunc, mobile: boolean) {
  const amplitude = mobile ? 0.55 : 1;
  const left = query("[data-flame='left']");
  const right = query("[data-flame='right']");

  gsap.timeline({ repeat: -1, yoyo: true })
    .to(left, { scaleX: 0.975, scaleY: 1.045, rotation: -1.35 * amplitude, skewX: 0.7 * amplitude, y: -2 * amplitude, duration: 0.68, ease: "sine.inOut" })
    .to(left, { scaleX: 1.015, scaleY: 0.985, rotation: 0.65 * amplitude, skewX: -0.45 * amplitude, y: 0, duration: 0.57, ease: "sine.inOut" });

  gsap.timeline({ repeat: -1, yoyo: true, delay: 0.13 })
    .to(right, { scaleX: 1.018, scaleY: 1.035, rotation: 1.1 * amplitude, skewX: -0.55 * amplitude, y: -1.3 * amplitude, duration: 0.82, ease: "sine.inOut" })
    .to(right, { scaleX: 0.982, scaleY: 0.992, rotation: -0.55 * amplitude, skewX: 0.35 * amplitude, y: 0.4, duration: 0.71, ease: "sine.inOut" });

  gsap.timeline({ repeat: -1, yoyo: true })
    .to(query("[data-halo='left']"), { opacity: 0.72, scale: 1.09, duration: 1.06, ease: "sine.inOut" });
  gsap.timeline({ repeat: -1, yoyo: true, delay: 0.28 })
    .to(query("[data-halo='right']"), { opacity: 0.62, scale: 1.12, duration: 1.24, ease: "sine.inOut" });
  gsap.timeline({ repeat: -1, yoyo: true, delay: 0.11 })
    .to(query("[data-ambient='left']"), { opacity: mobile ? 0.23 : 0.31, scale: 1.08, duration: 1.17, ease: "sine.inOut" });
  gsap.timeline({ repeat: -1, yoyo: true, delay: 0.42 })
    .to(query("[data-ambient='right']"), { opacity: mobile ? 0.2 : 0.28, scale: 1.06, duration: 1.38, ease: "sine.inOut" });

  gsap.to(query("[data-displacement='left']"), { attr: { scale: mobile ? 2.3 : 6 }, duration: 0.74, repeat: -1, yoyo: true, ease: "sine.inOut" });
  gsap.to(query("[data-displacement='right']"), { attr: { scale: mobile ? 2 : 5.2 }, duration: 0.91, repeat: -1, yoyo: true, ease: "sine.inOut", delay: 0.17 });

  if (!mobile) {
    query("[data-particle]").forEach((particle, index) => {
      gsap.fromTo(particle,
        { y: 4, x: 0, opacity: 0, scale: 0.5 },
        { y: -28 - index * 4, x: index % 2 ? 5 : -4, opacity: 0, scale: 0.15, duration: 1.15 + index * 0.14, repeat: -1, delay: index * 0.36, repeatDelay: 0.42 + index * 0.09, ease: "power1.out", keyframes: { opacity: [0, 0.55, 0] } },
      );
    });
  }
}

function starLoops(query: gsap.utils.SelectorFunc) {
  query("[data-star]").forEach((star, index) => {
    const durations = [1.14, 1.76, 0.92, 2.05, 1.42, 1.88];
    gsap.timeline({ repeat: -1, yoyo: true, delay: index * 0.19 })
      .to(star, { opacity: index < 2 ? 0.85 : 0.62, scale: index < 2 ? 1.18 : 1.28, duration: durations[index % durations.length], ease: "sine.inOut" });
  });
}

function fantasyFlameLoops(query: gsap.utils.SelectorFunc, mobile: boolean) {
  const amplitude = mobile ? 0.5 : 1;
  gsap.timeline({ repeat: -1, yoyo: true })
    .to(query("[data-fantasy-flame='left']"), { scaleX: 0.992, scaleY: 1.018, rotation: -0.3 * amplitude, filter: "brightness(1.32) saturate(1.18)", opacity: 0.72, duration: 0.72, ease: "sine.inOut" })
    .to(query("[data-fantasy-flame='left']"), { scaleX: 1.006, scaleY: 0.994, rotation: 0.18 * amplitude, filter: "brightness(1.14) saturate(1.08)", opacity: 0.48, duration: 0.61, ease: "sine.inOut" });
  gsap.timeline({ repeat: -1, yoyo: true, delay: 0.19 })
    .to(query("[data-fantasy-flame='right']"), { scaleX: 1.007, scaleY: 1.021, rotation: 0.34 * amplitude, filter: "brightness(1.38) saturate(1.16)", opacity: 0.68, duration: 0.88, ease: "sine.inOut" })
    .to(query("[data-fantasy-flame='right']"), { scaleX: 0.993, scaleY: 0.996, rotation: -0.16 * amplitude, filter: "brightness(1.16) saturate(1.06)", opacity: 0.44, duration: 0.69, ease: "sine.inOut" });
}

export function useLiminalIntro({ scope, enabled, embedded, scrollBound, colorMode, debug, forceReducedMotion, durationScale, onComplete }: IntroControllerOptions) {
  const mainTimeline = useRef<gsap.core.Timeline | null>(null);
  const skipTimeline = useRef<gsap.core.Timeline | null>(null);
  const finalizeOnce = useMemo(() => createOnceFinalizer<[IntroCompletionReason]>(onComplete), [onComplete]);

  const unlockScroll = useRef<() => void>(() => undefined);
  useEffect(() => {
    if (!enabled || embedded) return;
    const body = document.body;
    const previous = { overflow: body.style.overflow, paddingRight: body.style.paddingRight, overscrollBehavior: body.style.overscrollBehavior };
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    body.style.overflow = "hidden";
    body.style.overscrollBehavior = "none";
    if (scrollbar > 0) body.style.paddingRight = `${scrollbar}px`;
    let restored = false;
    unlockScroll.current = () => {
      if (restored) return;
      restored = true;
      body.style.overflow = previous.overflow;
      body.style.paddingRight = previous.paddingRight;
      body.style.overscrollBehavior = previous.overscrollBehavior;
    };
    return unlockScroll.current;
  }, [enabled, embedded]);

  useLayoutEffect(() => {
    if (!enabled || !scope.current) return;
    const root = scope.current;
    const query = gsap.utils.selector(root);
    let cancelled = false;
    let mm: gsap.MatchMedia | null = null;
    let resizeHandler: (() => void) | null = null;
    let criticalCleanup: (() => void) | null = null;

    const finish = (reason: IntroCompletionReason) => {
      root.style.pointerEvents = "none";
      unlockScroll.current();
      finalizeOnce(reason);
    };

    const fallback = () => {
      if (cancelled) return;
      mainTimeline.current?.kill();
      mm?.revert();
      root.dataset.state = "fallback";
      gsap.set(query("[data-fallback]"), { autoAlpha: 1 });
      gsap.set(query("[data-stage]"), { autoAlpha: 0 });
      mainTimeline.current = gsap.timeline()
        .fromTo(query("[data-fallback]"), { opacity: 0 }, { opacity: 1, duration: 0.18 })
        .to(root, { opacity: 0, duration: 0.28, delay: 0.22, ease: "power1.out" })
        .call(() => finish("fallback"));
    };

    mm = gsap.matchMedia();
    mm.add({ all: "(min-width: 0px)", reduce: "(prefers-reduced-motion: reduce)", mobile: "(max-width: 767px)" }, (context) => {
        const reduce = forceReducedMotion || Boolean(context.conditions?.reduce);
        const mobile = Boolean(context.conditions?.mobile);
        const stage = query("[data-stage]")[0] as HTMLElement;
        const skip = query("[data-skip]");
        const flash = query("[data-flash]");
        const cameraGeometry = () => {
          const camera = getCameraGeometry(stage, colorMode);
          // The store intro is centered in the viewport. In the portfolio the
          // same scene lives inside a right-hand frame, so viewport recentering
          // would make the camera drift horizontally during the portal zoom.
          return embedded ? { ...camera, x: 0 } : camera;
        };
        const geometry = { current: cameraGeometry() };
        const refreshGeometry = () => {
          if ((mainTimeline.current?.time() ?? 0) < 1.55) {
            geometry.current = cameraGeometry();
            mainTimeline.current?.invalidate();
          }
        };
        resizeHandler = refreshGeometry;
        window.addEventListener("resize", refreshGeometry, { passive: true });

        gsap.set(stage, { transformOrigin: () => `${geometry.current.originX}px ${geometry.current.originY}px` });
        gsap.set(skip, { autoAlpha: 0 });
        gsap.set(query("[data-door-bloom]"), { opacity: 0.08, scale: 0.82 });
        gsap.set(query("[data-door-radiance], [data-door-core], [data-color-atmosphere]"), { opacity: 0 });
        gsap.set(query("[data-vignette], [data-peripheral-blur]"), { opacity: 0 });

        if (reduce) {
          mainTimeline.current = gsap.timeline({ defaults: { ease: "power1.out" } })
            .addLabel("reduced-appear", 0)
            .fromTo(stage, { opacity: 0 }, { opacity: 1, duration: 0.24 })
            .to(skip, { autoAlpha: 1, duration: 0.14 }, 0.2)
            .to(query("[data-door-bloom]"), { opacity: 0.22, duration: 0.25 }, 0.3)
            .to(query("[data-door-core]"), { opacity: 0.16, duration: 0.25 }, 0.3)
            .addLabel("reduced-reveal", 0.62)
            .to(root, { opacity: 0, duration: 0.2 }, 0.62)
            .call(() => finish("reduced"));
          return;
        }

        flameLoops(query, mobile);
        starLoops(query);
        if (colorMode === "realistic") fantasyFlameLoops(query, mobile);

        const timeline = gsap.timeline({
          defaults: { ease: "power2.out" },
          scrollTrigger: embedded && scrollBound ? {
            trigger: root.closest("section") ?? root,
            start: "top top",
            end: () => `+=${window.innerHeight * (mobile ? 1.9 : 2.55)}`,
            scrub: 1,
            invalidateOnRefresh: true,
          } : undefined,
        });
        mainTimeline.current = timeline;
        timeline
          .addLabel("appear", 0)
          .set(stage, { opacity: 0, scale: 0.975 })
          .set(query("[data-role='wordmark'], [data-role='subtitle'], [data-role='ornament']"), { opacity: 0, y: 7 })
          .fromTo(query("[data-role='portal']"), { opacity: 0.18 }, { opacity: 1, duration: 0.34 }, 0)
          .to(stage, { opacity: 1, scale: 1, duration: 0.36 }, 0)
          .to(query("[data-role='wordmark']"), { opacity: 1, y: 0, duration: 0.38 }, 0.16)
          .to(query("[data-role='subtitle'], [data-role='ornament']"), { opacity: 1, y: 0, duration: 0.34, stagger: 0.06 }, 0.23)
          .addLabel("world-awakens", 0.32)
          .to(skip, { autoAlpha: 1, duration: 0.22 }, 0.5)
          .to(query("[data-door-bloom]"), { opacity: 0.26, scale: 0.94, duration: 0.72 }, 0.35)
          .to(query("[data-color-atmosphere]"), { opacity: colorMode === "monochrome" ? 0 : colorMode === "realistic" ? 0.82 : 0.52, duration: 0.9 }, 0.3)
          .fromTo(query("[data-key-shine]"), { xPercent: -155, opacity: 0 }, { xPercent: 165, opacity: 0.8, duration: 0.76, ease: "power2.inOut" }, 0.62)
          .addLabel("door-call", 1.1)
          .to(query("[data-star-major]"), { opacity: 1, scale: 1.45, duration: 0.34, stagger: 0.11, yoyo: true, repeat: 1 }, 1.18)
          .to(query("[data-door-light]"), { filter: "brightness(1.32) contrast(.92)", duration: 0.68 }, 1.08)
          .to(query("[data-door-bloom]"), { opacity: 0.56, scale: 1.14, duration: 0.72 }, 1.08)
          .to(query("[data-door-radiance]"), { opacity: 0.38, scale: 1.08, duration: 0.72 }, 1.08)
          .to(query("[data-door-core]"), { opacity: 0.2, scale: 0.92, duration: 0.68 }, 1.08)
          .to(query("[data-vignette]"), { opacity: 0.42, duration: 0.72 }, 1.1)
          .to(stage, {
            scale: 1.07,
            x: () => geometry.current.x * 0.07,
            y: () => geometry.current.y * 0.07,
            duration: 0.7,
            ease: "sine.inOut",
          }, 1.1)
          .addLabel("approach", 1.72)
          .to(stage, {
            transformOrigin: () => `${geometry.current.originX}px ${geometry.current.originY}px`,
            scale: () => geometry.current.scale,
            x: () => geometry.current.x,
            y: () => geometry.current.y,
            duration: 1.42,
            ease: "power4.in",
          }, 1.7)
          .to(query("[data-door-light]"), { filter: "brightness(4.8) contrast(.44) saturate(.35)", duration: 1.34, ease: "power2.in" }, 1.7)
          .to(query("[data-door-bloom]"), { opacity: 1, scale: 3.1, duration: 1.36, ease: "power3.in" }, 1.7)
          .to(query("[data-door-radiance]"), { opacity: 1, scale: 2.55, duration: 1.28, ease: "power3.in" }, 1.76)
          .to(query("[data-door-core]"), { opacity: 1, scale: 1.16, filter: "brightness(2.2) saturate(.28)", duration: 1.12, ease: "power3.in" }, 1.82)
          .to(query("[data-portal-wash]"), { opacity: 0.96, scale: 2.45, duration: 1.25, ease: "power2.in" }, 1.78)
          .to(query("[data-peripheral-blur]"), { opacity: mobile ? 0.32 : 0.58, backdropFilter: `blur(${mobile ? 2 : 4}px)`, duration: 0.92 }, 1.88)
          .addLabel("threshold", 2.96)
          .fromTo(flash, { opacity: 0, clipPath: "circle(0% at 50% 50%)" }, { opacity: 0.98, clipPath: "circle(150% at 50% 50%)", duration: 0.34, ease: "power3.in" }, 2.91)
          .to(root, { opacity: 0, duration: 0.34, ease: "power2.out" }, 3.19)
          .addLabel("reveal", 3.48)
          .call(() => finish("complete"));

        if (!scrollBound) timeline.timeScale(1 / Math.max(0.25, durationScale));
        if (debug) {
          root.dataset.debug = "true";
          window.__LIMINAL_INTRO__ = {
            pause: () => timeline.pause(),
            resume: () => timeline.resume(),
            seek: (time) => timeline.seek(time),
            labels: { ...timeline.labels },
            duration: timeline.duration(),
          };
          console.table(timeline.labels);
          console.info(`[Liminal intro] duration: ${timeline.duration().toFixed(2)}s`);
        }
    });
    criticalCleanup = monitorCriticalImages(root, fallback);

    return () => {
      cancelled = true;
      if (resizeHandler) window.removeEventListener("resize", resizeHandler);
      mm?.revert();
      mainTimeline.current?.kill();
      skipTimeline.current?.kill();
      criticalCleanup?.();
      unlockScroll.current();
      if (debug && typeof window !== "undefined") delete window.__LIMINAL_INTRO__;
    };
  }, [scope, enabled, embedded, scrollBound, colorMode, debug, forceReducedMotion, durationScale, finalizeOnce]);

  const skipIntro = useCallback(() => {
    const root = scope.current;
    if (!root || !enabled) return;
    mainTimeline.current?.kill();
    skipTimeline.current?.kill();
    const flash = root.querySelector<HTMLElement>("[data-flash]");
    const stage = root.querySelector<HTMLElement>("[data-stage]");
    skipTimeline.current = gsap.timeline()
      .to(stage, { scale: 1.025, opacity: 0.72, duration: 0.16, ease: "power1.in" })
      .to(flash, { opacity: 0.72, clipPath: "circle(150% at 50% 50%)", duration: 0.18, ease: "power2.in" }, 0)
      .to(root, { opacity: 0, duration: 0.22, ease: "power1.out" })
      .call(() => {
        root.style.pointerEvents = "none";
        unlockScroll.current();
        finalizeOnce("skip");
      });
  }, [enabled, finalizeOnce, scope]);

  return { skipIntro };
}
