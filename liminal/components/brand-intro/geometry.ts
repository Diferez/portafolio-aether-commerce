import type { IntroColorMode } from "./types";

export interface DoorGeometry {
  x: number;
  y: number;
  width: number;
  height: number;
  focusX: number;
  focusY: number;
}

export const STANDARD_DOOR_GEOMETRY: DoorGeometry = Object.freeze({
  x: 660,
  y: 321,
  width: 217,
  height: 461,
  focusX: 768.5,
  focusY: 574.55,
});

export const REALISTIC_DOOR_GEOMETRY: DoorGeometry = Object.freeze({
  x: 555,
  y: 318,
  width: 426,
  height: 520,
  focusX: 768,
  focusY: 758,
});

export function doorGeometryFor(colorMode: IntroColorMode): DoorGeometry {
  return colorMode === "realistic" ? REALISTIC_DOOR_GEOMETRY : STANDARD_DOOR_GEOMETRY;
}
