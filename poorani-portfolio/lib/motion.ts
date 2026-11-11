// Shared motion helpers
export const EASE = [0.76, 0, 0.24, 1] as const;
let transitioning = false;
export const setTransitioning = (v: boolean) => { transitioning = v; };
/** Delay for a page's intro so it plays after the channel-change curtain lifts. */
export const introDelay = () => (transitioning ? 0.75 : 0.25);
export const prefersReduced = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
export const isFinePointer = () =>
  typeof window !== "undefined" && window.matchMedia("(hover: hover) and (pointer: fine)").matches;
