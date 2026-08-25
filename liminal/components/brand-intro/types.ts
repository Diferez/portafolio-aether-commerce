export type IntroCompletionReason = "complete" | "skip" | "reduced" | "fallback";
export type IntroColorMode = "monochrome" | "duotone" | "realistic";

export interface TransformOrigin { x: number; y: number }

export interface LiminalLayer {
  id: string;
  description: string;
  full_canvas: string;
  trimmed: string;
  x: number;
  y: number;
  width: number;
  height: number;
  transform_origin: TransformOrigin;
}

export interface LiminalManifest {
  brand: string;
  canvas: { width: number; height: number };
  background: string;
  layers: LiminalLayer[];
}

export interface IntroDebugHandle {
  pause: () => void;
  resume: () => void;
  seek: (time: number) => void;
  labels: Record<string, number>;
  duration: number;
}

declare global {
  interface Window { __LIMINAL_INTRO__?: IntroDebugHandle }
}
