"use client";

/* eslint-disable @next/next/no-img-element -- the original Liminal composition is a local raster artwork. */

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLayoutEffect, useRef } from "react";
import type { NarrativeContent } from "@/types/content";

gsap.registerPlugin(ScrollTrigger);

type NarrativeSectionProps = {
  content: NarrativeContent;
};

export function NarrativeSection({ content }: NarrativeSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);

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

      gsap.set(query("[data-narrative-enter]"), { autoAlpha: 0, y: 20 });
      gsap.set(query("[data-liminal]"), { autoAlpha: 0, xPercent: compact.matches ? 0 : 8, scale: 0.84 });
      gsap.set(query("[data-liminal-art]"), { scale: 0.94, transformOrigin: "50% 54%" });
      gsap.set(query("[data-liminal-flame]"), { autoAlpha: 0.38, transformOrigin: "50% 88%" });
      gsap.set(query("[data-liminal-stage]"), { transformOrigin: "50% 55%" });
      gsap.set(query("[data-portal-wash], [data-door-bloom], [data-door-radiance], [data-door-core]"), { autoAlpha: 0, transformOrigin: "50% 55%" });
      gsap.set(query("[data-liminal-glow]"), { autoAlpha: 0, scale: 0.65 });
      gsap.set(query("[data-resolution]"), { autoAlpha: 0, y: 22 });
      gsap.set(query("[data-project-bridge]"), { autoAlpha: 0, y: 28 });

      timeline
        .addLabel("entry", 0)
        .to(query("[data-eyebrow]"), { autoAlpha: 1, y: 0, duration: 0.5 }, "entry")
        .to(query("[data-title]"), { autoAlpha: 1, y: 0, duration: 0.72 }, "entry+=0.13")
        .addLabel("message", 0.24)
        .to(query("[data-description-one]"), { autoAlpha: 1, y: 0, duration: 0.45 }, "message")
        .to(query("[data-description-two]"), { autoAlpha: 1, y: 0, duration: 0.45 }, "message+=0.11")
        .to(query("[data-liminal]"), { autoAlpha: 1, xPercent: 0, scale: 1, duration: 0.7 }, "message+=0.08")
        .addLabel("transform", 1.12)
        .to(query("[data-description-one], [data-description-two]"), { autoAlpha: 0, y: -14, duration: 0.4 }, "transform")
        .to(query("[data-title]"), { xPercent: compact.matches ? 0 : -12, yPercent: compact.matches ? -16 : 0, autoAlpha: 0.35, duration: 0.7 }, "transform")
        .to(query("[data-liminal]"), { xPercent: compact.matches ? 0 : -19, yPercent: compact.matches ? 9 : 0, scale: compact.matches ? 1.36 : 1.72, duration: 1.15, ease: "power2.inOut" }, "transform")
        .to(query("[data-liminal-art]"), { scale: 1.23, duration: 1.15, ease: "power2.inOut" }, "transform")
        .to(query("[data-liminal-stage]"), { scale: 1.16, duration: 0.58, ease: "sine.inOut" }, "transform+=0.08")
        .to(query("[data-liminal-flame='left']"), { autoAlpha: 0.78, scaleX: 0.97, scaleY: 1.08, rotation: -1.2, y: -5, duration: 0.9, ease: "sine.inOut" }, "transform+=0.08")
        .to(query("[data-liminal-flame='right']"), { autoAlpha: 0.75, scaleX: 1.035, scaleY: 1.07, rotation: 1.05, y: -4, duration: 0.94, ease: "sine.inOut" }, "transform+=0.13")
        .to(query("[data-door-bloom]"), { autoAlpha: 0.92, scale: 2.9, duration: 0.96, ease: "power3.in" }, "transform+=0.2")
        .to(query("[data-door-radiance]"), { autoAlpha: 0.8, scale: 2.25, duration: 0.92, ease: "power3.in" }, "transform+=0.25")
        .to(query("[data-door-core]"), { autoAlpha: 0.92, scale: 1.16, duration: 0.82, ease: "power3.in" }, "transform+=0.3")
        .to(query("[data-portal-wash]"), { autoAlpha: 0.86, scale: 2.35, duration: 0.94, ease: "power2.in" }, "transform+=0.28")
        .to(query("[data-liminal-glow]"), { autoAlpha: 0.92, scale: 1.28, duration: 0.86 }, "transform+=0.15")
        .addLabel("resolution", 2.32)
        .to(query("[data-title], [data-eyebrow]"), { autoAlpha: 0, duration: 0.34 }, "resolution")
        .to(query("[data-resolution-one]"), { autoAlpha: 1, y: 0, duration: 0.5 }, "resolution+=0.08")
        .to(query("[data-resolution-two]"), { autoAlpha: 1, y: 0, duration: 0.58 }, "resolution+=0.23")
        .addLabel("projects", 3.18)
        .to(query("[data-liminal]"), { autoAlpha: 0.26, xPercent: compact.matches ? 0 : -30, yPercent: compact.matches ? 19 : 0, scale: compact.matches ? 1.5 : 1.9, duration: 0.56 }, "projects")
        .to(query("[data-resolution]"), { autoAlpha: 0, y: -16, duration: 0.38 }, "projects")
        .to(query("[data-project-bridge]"), { autoAlpha: 1, y: 0, duration: 0.56 }, "projects+=0.17");
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

        <LiminalCanvas />

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

function LiminalCanvas() {
  return (
    <figure className="liminal-canvas" data-liminal aria-label="Liminal, animación a color controlada por el desplazamiento">
      <span className="liminal-glow" data-liminal-glow aria-hidden="true" />
      <div className="liminal-art" data-liminal-art aria-hidden="true">
        <div className="liminal-stage" data-liminal-stage>
          <img className="liminal-master" src="/images/liminal-realistic-v3.webp" alt="" draggable="false" />
          <span className="liminal-portal-wash" data-portal-wash />
          <span className="liminal-door-bloom" data-door-bloom />
          <span className="liminal-door-radiance" data-door-radiance />
          <span className="liminal-door-core" data-door-core />
        <img className="liminal-flame liminal-flame-left" data-liminal-flame="left" src="/images/liminal-realistic-v3.webp" alt="" draggable="false" />
        <img className="liminal-flame liminal-flame-right" data-liminal-flame="right" src="/images/liminal-realistic-v3.webp" alt="" draggable="false" />
        </div>
      </div>
    </figure>
  );
}
