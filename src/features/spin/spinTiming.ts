/**
 * Reel timing. Reels stop left to right: the n-th spinning reel runs
 * REEL_BASE_MS + n * REEL_STAGGER_MS and travels REEL_BASE_LOOPS + n full turns.
 */
export const REEL_BASE_MS = 1100;
export const REEL_STAGGER_MS = 450;
export const REEL_BASE_LOOPS = 2;

export function reelDuration(order: number): number {
  return REEL_BASE_MS + order * REEL_STAGGER_MS;
}

export function reelLoops(order: number): number {
  return REEL_BASE_LOOPS + order;
}
