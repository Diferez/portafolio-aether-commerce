"use client";

/* eslint-disable @next/next/no-img-element -- the original Liminal composition is a local raster artwork. */

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useCallback, useLayoutEffect, useRef } from "react";
import { LiminalBrandIntro } from "@/liminal/components/brand-intro/LiminalBrandIntro";
import type { NarrativeContent } from "@/types/content";

gsap.registerPlugin(ScrollTrigger);

type NarrativeSectionProps = {
  content: NarrativeContent;
};

export function NarrativeSection({ content }: NarrativeSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const liminalTimelineRef = useRef<gsap.core.Timeline | null>(null);
  const liminalProgressRef = useRef(0);
  const setLiminalTimeline = useCallback((timeline: gsap.core.Timeline) => {
    liminalTimelineRef.current = timeline;
    timeline.progress(liminalProgressRef.current).pause();
  }, []);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const context = gsap.context(() => {
      const query = gsap.utils.selector(section);
      const compact = window.matchMedia("(max-width: 48rem)");
      const timeline = gsap.timeline({
        defaults: { ease: "power2.out" },
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${window.innerHeight * (compact.matches ? 1.9 : 2.55)}`,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });
      const synchronizeLiminal = () => {
        const start = 0.32;
        const end = 2.62;
        const progress = gsap.utils.clamp(0, 1, (timeline.time() - start) / (end - start));
        liminalProgressRef.current = progress;
        liminalTimelineRef.current?.progress(progress).pause();
      };

      gsap.set(query("[data-narrative-enter]"), { autoAlpha: 0, y: 20 });
      gsap.set(query("[data-liminal]"), { autoAlpha: 0, xPercent: 0, scale: 0.84 });
      gsap.set(query("[data-resolution]"), { autoAlpha: 0, y: 22 });
      gsap.set(query("[data-project-bridge]"), { autoAlpha: 0, y: 28 });

      timeline
        .addLabel("entry", 0)
        .to(query("[data-eyebrow]"), { autoAlpha: 1, y: 0, duration: 0.5 }, "entry")
        .to(query("[data-title]"), { autoAlpha: 1, y: 0, duration: 0.72 }, "entry+=0.13")
        .addLabel("message", 0.24)
        .to(query("[data-description-one]"), { autoAlpha: 1, y: 0, duration: 0.45 }, "message")
        .to(query("[data-description-two]"), { autoAlpha: 1, y: 0, duration: 0.45 }, "message+=0.11")
        .to(query("[data-liminal]"), { autoAlpha: 1, xPercent: 0, scale: 1, duration: 0.48 }, "message+=0.08")
        .addLabel("transform", 0.5)
        .to(query("[data-description-one], [data-description-two]"), { autoAlpha: 0, y: -14, duration: 0.4 }, "transform")
        .to(query("[data-title]"), { xPercent: compact.matches ? 0 : -12, yPercent: compact.matches ? -16 : 0, autoAlpha: 0.2, duration: 0.58 }, "message+=0.08")
        .addLabel("resolution", 1.78)
        .to(query("[data-title], [data-eyebrow]"), { autoAlpha: 0, duration: 0.34 }, "resolution")
        .to(query("[data-resolution-one]"), { autoAlpha: 1, y: 0, duration: 0.5 }, "resolution+=0.08")
        .to(query("[data-resolution-two]"), { autoAlpha: 1, y: 0, duration: 0.58 }, "resolution+=0.23")
        .addLabel("projects", 2.66)
        .to(query("[data-resolution]"), { autoAlpha: 0, y: -16, duration: 0.38 }, "projects")
        .to(query("[data-project-bridge]"), { autoAlpha: 1, y: 0, duration: 0.56 }, "projects+=0.17");

      timeline.eventCallback("onUpdate", synchronizeLiminal);
      synchronizeLiminal();
    }, section);

    return () => context.revert();
  }, []);

  return (
    <section className="narrative-section" ref={sectionRef} aria-labelledby="narrative-title">
      <div className="narrative-frame section-frame">
        <div className="narrative-copy">
          <p className="narrative-eyebrow" data-narrative-enter data-eyebrow>{content.eyebrow}</p>
          <h2 id="narrative-title" data-narrative-enter data-title>{content.title}</h2>
          <div className="narrative-description" aria-label={content.title}>
            <p data-narrative-enter data-description-one>{content.descriptionOne}</p>
            <p data-narrative-enter data-description-two>{content.descriptionTwo}</p>
          </div>
        </div>

        <LiminalCanvas onTimelineReady={setLiminalTimeline} />

        <div className="narrative-resolution" data-resolution aria-live="polite">
          <p data-resolution-one>{content.firstStatement}</p>
          <p data-resolution-two>{content.secondStatement}</p>
        </div>

        <div className="project-bridge" data-project-bridge>
          <span>→</span>
          <h2>{content.projectTitle}</h2>
          <p>{content.projectDescription}</p>
        </div>
      </div>
    </section>
  );
}

function LiminalCanvas({ onTimelineReady }: { onTimelineReady: (timeline: gsap.core.Timeline) => void }) {
  return (
    <figure className="liminal-canvas" data-liminal aria-label="Liminal, animación a color controlada por el desplazamiento">
      <LiminalBrandIntro enabled embedded controlled colorMode="realistic" onTimelineReady={onTimelineReady} onComplete={() => undefined} />
    </figure>
  );
}
