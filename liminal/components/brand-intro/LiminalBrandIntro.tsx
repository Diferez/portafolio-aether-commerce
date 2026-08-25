"use client";

/* eslint-disable @next/next/no-img-element -- transparent layer composition must preserve exact raster dimensions */

import { useRef, type CSSProperties } from "react";
import manifestJson from "../../manifest.json";
import { FlameFilters } from "./filters/FlameFilters";
import { doorGeometryFor } from "./geometry";
import styles from "./LiminalBrandIntro.module.css";
import type { IntroColorMode, IntroCompletionReason, LiminalLayer, LiminalManifest } from "./types";
import { useLiminalIntro } from "./useLiminalIntro";

const manifest = manifestJson as LiminalManifest;
const criticalLayers = new Set(["01_key", "02_door_light", "07_portal_architecture", "09_wordmark_liminal"]);

interface LiminalBrandIntroProps {
  enabled: boolean;
  embedded?: boolean;
  colorMode?: IntroColorMode;
  debug?: boolean;
  forceReducedMotion?: boolean;
  durationScale?: number;
  onComplete: (reason: IntroCompletionReason) => void;
}

function layerStyle(layer: LiminalLayer): CSSProperties {
  const { width: canvasWidth, height: canvasHeight } = manifest.canvas;
  return {
    "--layer-x": `${(layer.x / canvasWidth) * 100}%`,
    "--layer-y": `${(layer.y / canvasHeight) * 100}%`,
    "--layer-w": `${(layer.width / canvasWidth) * 100}%`,
    "--layer-h": `${(layer.height / canvasHeight) * 100}%`,
    "--origin-x": `${layer.transform_origin.x * 100}%`,
    "--origin-y": `${layer.transform_origin.y * 100}%`,
  } as CSSProperties;
}

function layerSource(layer: LiminalLayer) {
  return `/brands/liminal/intro/layers/${layer.trimmed.split("/").at(-1)}`;
}

function roleFor(layer: LiminalLayer) {
  if (layer.id === "07_portal_architecture") return "portal";
  if (layer.id === "09_wordmark_liminal") return "wordmark";
  if (layer.id === "10_subtitle_accesorios") return "subtitle";
  if (layer.id === "11_bottom_ornament") return "ornament";
  return undefined;
}

function Flame({ layer, side }: { layer: LiminalLayer; side: "left" | "right" }) {
  return (
    <div className={`${styles.layer} ${styles.flameGroup}`} style={layerStyle(layer)} data-flame={side} data-layer-id={layer.id}>
      <span className={styles.ambientLight} data-ambient={side} />
      <span className={styles.outerHalo} data-halo={side} />
      <img className={styles.flameBase} src={layerSource(layer)} alt="" draggable="false" />
      <span className={styles.flameColor} />
      <img className={styles.flameInner} src={layerSource(layer)} alt="" draggable="false" />
      {[0, 1, 2].map((particle) => <span className={styles.flameParticle} data-particle={`${side}-${particle}`} key={particle} />)}
    </div>
  );
}

function DoorLight({ layer }: { layer: LiminalLayer }) {
  return (
    <div className={`${styles.layer} ${styles.doorGroup}`} style={layerStyle(layer)} data-layer-id={layer.id}>
      <span className={styles.doorBloom} data-door-bloom />
      <span className={styles.doorRadiance} data-door-radiance />
      <span className={styles.doorCore} data-door-core />
      <img
        className={styles.layerImage}
        data-door-light
        data-critical="true"
        src={layerSource(layer)}
        alt=""
        draggable="false"
        loading="eager"
        fetchPriority="high"
      />
    </div>
  );
}

function KeyLayer({ layer }: { layer: LiminalLayer }) {
  return (
    <div className={`${styles.layer} ${styles.keyGroup}`} style={layerStyle(layer)} data-layer-id={layer.id}>
      <img className={styles.layerImage} data-critical="true" src={layerSource(layer)} alt="" draggable="false" loading="eager" fetchPriority="high" />
      <span className={styles.keyShine} data-key-shine />
    </div>
  );
}

const stars: ReadonlyArray<{ x: number; y: number; major?: boolean }> = [
  { x: 37.4, y: 25.5, major: true },
  { x: 63.0, y: 25.5, major: true },
  { x: 40.5, y: 22.8 },
  { x: 59.7, y: 22.9 },
  { x: 37.2, y: 35.7 },
  { x: 62.8, y: 35.8 },
] as const;

export function LiminalBrandIntro({ enabled, embedded = false, colorMode = "monochrome", debug = false, forceReducedMotion = false, durationScale = 1, onComplete }: LiminalBrandIntroProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const { skipIntro } = useLiminalIntro({ scope: overlayRef, enabled, embedded, colorMode, debug, forceReducedMotion, durationScale, onComplete });
  const door = doorGeometryFor(colorMode);
  const doorDebugStyle = {
    "--layer-x": `${(door.x / 1536) * 100}%`,
    "--layer-y": `${(door.y / 1536) * 100}%`,
    "--layer-w": `${(door.width / 1536) * 100}%`,
    "--layer-h": `${(door.height / 1536) * 100}%`,
  } as CSSProperties;

  return (
    <div
      ref={overlayRef}
      className={`${styles.overlay} ${embedded ? styles.embedded : ""}`}
      data-liminal-intro
      data-ready={enabled}
      data-color-mode={colorMode}
      data-debug-prop={debug}
      role={embedded ? undefined : "dialog"}
      aria-modal={embedded ? undefined : true}
      aria-label="Introducción de Liminal Accesorios"
    >
      <FlameFilters />
      <img className={styles.fallbackLogo} data-fallback src="/brands/liminal/intro/fallback-logo.png" alt="Liminal Accesorios" />
      <div className={styles.stage} data-stage aria-hidden="true">
        {colorMode === "realistic" && (
          <>
            <img className={styles.fantasyMaster} data-critical="true" src="/brands/liminal/intro/fantasy-master-v3.webp" alt="" draggable="false" loading="eager" fetchPriority="high" />
            <img className={`${styles.fantasyFlame} ${styles.fantasyFlameLeft}`} data-fantasy-flame="left" src="/brands/liminal/intro/fantasy-master-v3.webp" alt="" draggable="false" />
            <img className={`${styles.fantasyFlame} ${styles.fantasyFlameRight}`} data-fantasy-flame="right" src="/brands/liminal/intro/fantasy-master-v3.webp" alt="" draggable="false" />
            <span className={styles.fantasyDoorBloom} data-door-bloom />
            <span className={styles.fantasyDoorRadiance} data-door-radiance />
            <span className={styles.fantasyDoorCore} data-door-core />
          </>
        )}
        <span className={styles.colorAtmosphere} data-color-atmosphere />
        <span className={styles.portalWash} data-portal-wash />
        {manifest.layers.map((layer) => {
          if (layer.id === "01_key") return <KeyLayer layer={layer} key={layer.id} />;
          if (layer.id === "02_door_light") return <DoorLight layer={layer} key={layer.id} />;
          if (layer.id === "03_torch_left_flame") return <Flame layer={layer} side="left" key={layer.id} />;
          if (layer.id === "04_torch_right_flame") return <Flame layer={layer} side="right" key={layer.id} />;
          return (
            <div className={styles.layer} style={layerStyle(layer)} data-role={roleFor(layer)} data-layer-id={layer.id} key={layer.id}>
              <img
                className={styles.layerImage}
                data-critical={criticalLayers.has(layer.id) ? "true" : undefined}
                src={layerSource(layer)}
                alt=""
                draggable="false"
                loading={criticalLayers.has(layer.id) ? "eager" : undefined}
                fetchPriority={criticalLayers.has(layer.id) ? "high" : undefined}
              />
            </div>
          );
        })}
        <div className={styles.starField}>
          {stars.map((star, index) => (
            <span
              className={styles.star}
              data-star
              data-star-major={star.major ? "true" : undefined}
              style={{ "--star-x": `${star.x}%`, "--star-y": `${star.y}%` } as CSSProperties}
              key={`${star.x}-${star.y}-${index}`}
            />
          ))}
        </div>
        <span className={styles.doorDebugBox} style={doorDebugStyle} />
        <span className={styles.doorDebugCenter} style={{ "--center-x": `${(door.focusX / 1536) * 100}%`, "--center-y": `${(door.focusY / 1536) * 100}%` } as CSSProperties} />
      </div>
      <div className={styles.peripheralBlur} data-peripheral-blur aria-hidden="true" />
      <div className={styles.vignette} data-vignette aria-hidden="true" />
      <div className={styles.flash} data-flash aria-hidden="true" />
      {!embedded && <button className={styles.skipButton} data-skip type="button" onClick={skipIntro}>Saltar introducción</button>}
    </div>
  );
}
