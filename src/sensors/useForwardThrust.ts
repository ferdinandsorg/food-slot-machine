import { useEffect, useRef } from 'react';
import { Platform } from 'react-native';

import {
  FORWARD_AXIS_DOMINANCE,
  MOTION_COOLDOWN_MS,
  MOTION_THRESHOLD,
  MOTION_UPDATE_INTERVAL_MS,
} from './motionConfig';

export type MotionDebugSample = {
  x: number;
  y: number;
  z: number;
  magnitude: number;
  triggered: boolean;
};

type Options = {
  enabled: boolean;
  onThrust: () => void;
  onSample?: (sample: MotionDebugSample) => void;
};

function isForwardThrust(x: number, y: number, z: number): boolean {
  const magnitude = Math.sqrt(x * x + y * y + z * z);
  if (magnitude < MOTION_THRESHOLD) {
    return false;
  }

  const absX = Math.abs(x);
  const absY = Math.abs(y);
  const absZ = Math.abs(z);
  const dominant = absZ >= absX && absZ >= absY;
  const forwardEnough = absZ / magnitude >= FORWARD_AXIS_DOMINANCE;
  // Negative Z ≈ push away from body in portrait.
  const pushedForward = z < 0;

  return dominant && forwardEnough && pushedForward;
}

/**
 * Detects a deliberate forward phone thrust using DeviceMotion user-acceleration.
 * Always pair with a button fallback for accessibility and simulator use.
 * No-ops on web — expo-sensors is native-only.
 */
export function useForwardThrust({ enabled, onThrust, onSample }: Options): void {
  const onThrustRef = useRef(onThrust);
  const onSampleRef = useRef(onSample);
  const lastTriggerRef = useRef(0);

  useEffect(() => {
    onThrustRef.current = onThrust;
  }, [onThrust]);

  useEffect(() => {
    onSampleRef.current = onSample;
  }, [onSample]);

  useEffect(() => {
    if (!enabled || Platform.OS === 'web') {
      return;
    }

    let subscription: { remove: () => void } | null = null;
    let cancelled = false;

    async function start() {
      try {
        // Dynamic import keeps the native module off the web critical path.
        const { DeviceMotion } = await import('expo-sensors');
        if (cancelled) {
          return;
        }

        const available = await DeviceMotion.isAvailableAsync();
        if (!available || cancelled) {
          return;
        }

        const permission = await DeviceMotion.requestPermissionsAsync();
        if (!permission.granted || cancelled) {
          return;
        }

        DeviceMotion.setUpdateInterval(MOTION_UPDATE_INTERVAL_MS);
        subscription = DeviceMotion.addListener((data) => {
          const accel = data.acceleration;
          if (!accel) {
            return;
          }

          const { x, y, z } = accel;
          const magnitude = Math.sqrt(x * x + y * y + z * z);
          const triggered = isForwardThrust(x, y, z);
          onSampleRef.current?.({ x, y, z, magnitude, triggered });

          if (!triggered) {
            return;
          }

          const now = Date.now();
          if (now - lastTriggerRef.current < MOTION_COOLDOWN_MS) {
            return;
          }

          lastTriggerRef.current = now;
          onThrustRef.current();
        });
      } catch {
        // Sensor unavailable — button fallback remains.
      }
    }

    start();

    return () => {
      cancelled = true;
      subscription?.remove();
    };
  }, [enabled]);
}
