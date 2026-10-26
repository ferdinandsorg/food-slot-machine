/**
 * Reel timing. Reels stop left to right: the n-th spinning reel runs
 * REEL_BASE_MS + n * REEL_STAGGER_MS and travels REEL_BASE_LOOPS + n full turns.
 */
export const REEL_BASE_MS = 1100;
export const REEL_STAGGER_MS = 450;
/**
 * Kept low on purpose: faster strips pass more than ~half a food per frame,
 * which the eye reads as running backwards (wagon-wheel effect).
 */
export const REEL_BASE_LOOPS = 1;

/** Pull-back before the run, like a lever releasing the drum. */
export const REEL_WINDUP_MS = 140;
/** Settle back from the overshoot onto the payline. */
export const REEL_SETTLE_MS = 220;

export function reelDuration(order: number): number {
  return REEL_BASE_MS + order * REEL_STAGGER_MS;
}

/** When the reel visibly hits the payline (peak of the overshoot). */
export function reelImpactAt(order: number): number {
  return reelDuration(order) - REEL_SETTLE_MS;
}

export function reelLoops(order: number): number {
  return REEL_BASE_LOOPS + order;
}
