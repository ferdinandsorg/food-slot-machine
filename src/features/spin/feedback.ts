import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

/**
 * Single owner for all haptic feedback. Each export is one semantic event;
 * the rarity gradient runs tick < hold < reelStop < spinStart < result.
 */

const HAPTICS_KEY = 'foodslot.hapticsEnabled';
/** Minimum gap between reel ticks so fast spins don't flood the engine. */
const TICK_MIN_GAP_MS = 55;

let enabled = true;
let lastTick = 0;

void AsyncStorage.getItem(HAPTICS_KEY)
  .then((value) => {
    if (value !== null) enabled = value === 'true';
  })
  .catch(() => undefined);

export async function loadHapticsEnabled(): Promise<boolean> {
  try {
    const value = await AsyncStorage.getItem(HAPTICS_KEY);
    return value === null ? true : value === 'true';
  } catch {
    return true;
  }
}

export async function saveHapticsEnabled(value: boolean): Promise<void> {
  enabled = value;
  await AsyncStorage.setItem(HAPTICS_KEY, value ? 'true' : 'false');
}

function canPlay() {
  return enabled && Platform.OS !== 'web';
}

function impact(style: Haptics.ImpactFeedbackStyle) {
  if (!canPlay()) return;
  void Haptics.impactAsync(style).catch(() => undefined);
}

function notify(type: Haptics.NotificationFeedbackType) {
  if (!canPlay()) return;
  void Haptics.notificationAsync(type).catch(() => undefined);
}

/** A food passes the payline while spinning. */
export function tick() {
  if (!canPlay()) return;
  const now = Date.now();
  if (now - lastTick < TICK_MIN_GAP_MS) return;
  lastTick = now;
  void Haptics.selectionAsync().catch(() => undefined);
}

export function holdToggled() {
  impact(Haptics.ImpactFeedbackStyle.Light);
}

/** A reel hits the payline (fired at the overshoot, not after settling). */
export function reelStop() {
  impact(Haptics.ImpactFeedbackStyle.Rigid);
}

export function spinStart() {
  impact(Haptics.ImpactFeedbackStyle.Medium);
}

/** The full meal is set — the biggest moment in the app. */
export function result() {
  impact(Haptics.ImpactFeedbackStyle.Heavy);
  setTimeout(() => notify(Haptics.NotificationFeedbackType.Success), 120);
}

/** The combination on the reels was saved. */
export function saved() {
  notify(Haptics.NotificationFeedbackType.Success);
}

/** Spin pressed while every reel is held. */
export function denied() {
  notify(Haptics.NotificationFeedbackType.Warning);
}
