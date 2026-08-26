"use client";

/* eslint-disable @next/next/no-img-element -- local product captures preserve their exact framing. */

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLayoutEffect, useRef } from "react";
import type { AetherNarrativeContent, AetherNarrativeStep } from "@/types/content";

gsap.registerPlugin(ScrollTrigger);

type AetherNarrativeSectionProps = {
  content: AetherNarrativeContent;
};

const steps = ["intro", "storefront", "customer-assistant", "administration", "operational-assistant", "closing"] as const;

export function AetherNarrativeSection({ content }: AetherNarrativeSectionProps) {
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
          end: () => `+=${window.innerHeight * (compact.matches ? 5.8 : 6.45)}`,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      gsap.set(query("[data-aether-copy]"), { autoAlpha: 0, y: 22 });
      gsap.set(query("[data-aether-storefront], [data-aether-admin]"), { autoAlpha: 0, y: 14, scale: 0.975 });
      gsap.set(query("[data-aether-store-chat], [data-aether-admin-chat]"), { autoAlpha: 0, y: 24, scale: 0.94 });
      gsap.set(query("[data-aether-dark-wash]"), { autoAlpha: 0 });

      timeline
        .to(query('[data-aether-copy="intro"]'), { autoAlpha: 1, y: 0, duration: 0.5 }, 0.04)
        .to(query("[data-aether-storefront]"), { autoAlpha: 1, y: 0, scale: 1, duration: 0.58 }, 0.28)
        .addLabel("storefront", 1.02)
        .to(query('[data-aether-copy="intro"]'), { autoAlpha: 0, y: -14, duration: 0.32 }, "storefront")
        .to(query('[data-aether-copy="storefront"]'), { autoAlpha: 1, y: 0, duration: 0.48 }, "storefront+=0.1")
        .addLabel("storefront-assistant", 2.02)
        .to(query('[data-aether-copy="storefront"]'), { autoAlpha: 0, y: -14, duration: 0.32 }, "storefront-assistant")
        .to(query("[data-aether-storefront]"), { autoAlpha: 0.58, xPercent: compact.matches ? 0 : 2, y: 8, scale: 0.94, duration: 0.52 }, "storefront-assistant")
        .to(query("[data-aether-store-chat]"), { autoAlpha: 1, y: 0, scale: 1, duration: 0.56 }, "storefront-assistant+=0.08")
        .to(query('[data-aether-copy="customer-assistant"]'), { autoAlpha: 1, y: 0, duration: 0.48 }, "storefront-assistant+=0.12")
        .addLabel("administration", 3.25)
        .to(query('[data-aether-copy="customer-assistant"]'), { autoAlpha: 0, y: -14, duration: 0.3 }, "administration")
        .to(query("[data-aether-storefront], [data-aether-store-chat]"), { autoAlpha: 0, y: -8, scale: 0.96, duration: 0.42 }, "administration")
        .to(query("[data-aether-dark-wash]"), { autoAlpha: 1, duration: 0.3 }, "administration+=0.1")
        .to(query("[data-aether-admin]"), { autoAlpha: 1, y: 0, scale: 1, duration: 0.54 }, "administration+=0.2")
        .to(query('[data-aether-copy="administration"]'), { autoAlpha: 1, y: 0, duration: 0.48 }, "administration+=0.28")
        .addLabel("admin-assistant", 4.35)
        .to(query('[data-aether-copy="administration"]'), { autoAlpha: 0, y: -14, duration: 0.3 }, "admin-assistant")
        .to(query("[data-aether-admin]"), { autoAlpha: 0.58, y: 8, scale: 0.94, duration: 0.52 }, "admin-assistant")
        .to(query("[data-aether-admin-chat]"), { autoAlpha: 1, y: 0, scale: 1, duration: 0.56 }, "admin-assistant+=0.08")
        .to(query('[data-aether-copy="operational-assistant"]'), { autoAlpha: 1, y: 0, duration: 0.48 }, "admin-assistant+=0.12")
        .addLabel("closing", 5.42)
        .to(query('[data-aether-copy="operational-assistant"]'), { autoAlpha: 0, y: -14, duration: 0.3 }, "closing")
        .to(query("[data-aether-admin]"), { autoAlpha: 0.32, y: 12, scale: 0.91, duration: 0.46 }, "closing")
        .to(query("[data-aether-admin-chat]"), { autoAlpha: 0.72, y: 8, scale: 0.96, duration: 0.46 }, "closing")
        .to(query('[data-aether-copy="closing"]'), { autoAlpha: 1, y: 0, duration: 0.56 }, "closing+=0.12")
        .to({}, { duration: 0.45 });
    }, section);

    return () => context.revert();
  }, []);

  const stepContent: Record<(typeof steps)[number], AetherNarrativeStep> = {
    intro: content.intro,
    storefront: content.storefront,
    "customer-assistant": content.customerAssistant,
    administration: content.administration,
    "operational-assistant": content.operationalAssistant,
    closing: content.closing,
  };

  return (
    <section className="aether-narrative-section" ref={sectionRef} aria-labelledby="aether-narrative-title">
      <div className="aether-narrative-frame section-frame">
        <AetherVisuals content={content} />

        <div className="aether-narrative-copy">
          {steps.map((step) => (
            <AetherCopy
              key={step}
              step={step}
              content={stepContent[step]}
              headingId={step === "intro" ? "aether-narrative-title" : undefined}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function AetherCopy({ step, content, headingId }: { step: string; content: AetherNarrativeStep; headingId?: string }) {
  return (
    <div className="aether-stage-copy" data-aether-copy={step}>
      <p className="aether-eyebrow">{content.eyebrow}</p>
      <h2 id={headingId}>{content.title}</h2>
      <div className="aether-stage-description">
        {content.paragraphs.map((paragraph, index) => (
          <p key={paragraph} className={step === "operational-assistant" && index < 2 ? "aether-question" : undefined}>
            {paragraph}
          </p>
        ))}
        {content.emphasis ? <p className="aether-emphasis">{content.emphasis}</p> : null}
      </div>
    </div>
  );
}

function AetherVisuals({ content }: { content: AetherNarrativeContent }) {
  return (
    <div className="aether-visual-panel" aria-label={content.visuals.sequenceLabel}>
      <div className="aether-dark-wash" data-aether-dark-wash aria-hidden="true" />
      <figure className="aether-screen aether-storefront" data-aether-storefront>
        <img src="/images/aether/storefront.png" alt={content.visuals.storefrontAlt} loading="lazy" decoding="async" />
      </figure>
      <figure className="aether-screen aether-store-chat" data-aether-store-chat>
        <img src="/images/aether/storefront-assistant.png" alt={content.visuals.storefrontAssistantAlt} loading="lazy" decoding="async" />
      </figure>
      <figure className="aether-screen aether-admin" data-aether-admin>
        <img src="/images/aether/admin-dashboard.png" alt={content.visuals.administrationAlt} loading="lazy" decoding="async" />
      </figure>
      <figure className="aether-screen aether-admin-chat" data-aether-admin-chat>
        <img src="/images/aether/admin-assistant.png" alt={content.visuals.administrationAssistantAlt} loading="lazy" decoding="async" />
      </figure>
    </div>
  );
}
