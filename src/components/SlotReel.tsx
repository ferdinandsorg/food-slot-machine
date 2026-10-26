import { useEffect, useMemo, useRef, useState } from 'react';
import {
  type GestureResponderEvent,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Animated, {
  Easing,
  interpolate,
  useAnimatedReaction,
  useFrameCallback,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import { FoodImage } from './FoodImage';
import { getFoodsByCategory } from '@/src/data/loadFoods';
import type { Food, FoodCategory } from '@/src/data/types';
import * as feedback from '@/src/features/spin/feedback';
import { REEL_SETTLE_MS, REEL_WINDUP_MS } from '@/src/features/spin/spinTiming';
import type {
  ReelSpin,
  SpinDirection,
} from '@/src/features/spin/useSlotMachine';
import {
  colors,
  gradients,
  radii,
  spacing,
  typography,
} from '@/src/theme/tokens';

export const REEL_ITEM_HEIGHT = 140;
/** Center item fully visible, neighbours peek in above and below. */
export const REEL_WINDOW_HEIGHT = Math.round(REEL_ITEM_HEIGHT * 1.65);

/** Strip copies: one buffer above + enough turns for the longest spin. */
const STRIP_COPIES = 8;
/** How far (in items) the reel overshoots before settling back. */
const OVERSHOOT = 0.18;
/** Half-height of the payline arrows shown on a held reel. */
const MARKER_SIZE = 8;
/** Chrome rim around each reel window. */
const FRAME = 2;
const HOLD_FADE_MS = 180;
/** Shortest flick (px) that can count as a swipe if it is fast enough. */
const SWIPE_START_PX = 12;
/** A release past this distance always spins the reel. */
const SWIPE_MIN_PX = 28;
/** px per ms — a quick short flick also spins. */
const SWIPE_MIN_VELOCITY = 0.35;

type Props = {
  category: FoodCategory;
  food: Food;
  spin: ReelSpin;
  locked: boolean;
  /** A new value backlights the reel pink (with a glow) to celebrate the result. */
  celebrateKey: number;
  disabled?: boolean;
  /** Tapping the reel toggles hold. */
  onPress: () => void;
  /** A vertical flick spins this reel in the flick's direction. */
  onSwipe: (direction: SpinDirection) => void;
};

export function SlotReel({
  category,
  food,
  spin,
  locked,
  celebrateKey,
  disabled,
  onPress,
  onSwipe,
}: Props) {
  const reduceMotion = useReducedMotion();
  const pool = useMemo(() => getFoodsByCategory(category), [category]);
  const strip = useMemo(
    () => Array.from({ length: STRIP_COPIES }, () => pool).flat(),
    [pool],
  );
  const count = pool.length;
  const indexOf = (target: Food) =>
    Math.max(
      0,
      pool.findIndex((item) => item.id === target.id),
    );

  // Position in strip items; the base copy (count … 2*count-1) is the resting range.
  const position = useSharedValue(count + indexOf(food));
  const running = useSharedValue(false);
  const windowOpacity = useSharedValue(1);
  const held = useSharedValue(locked ? 1 : 0);
  const flash = useSharedValue(0);
  // Strip speed (foods per second) for the motion-blur fade.
  const speed = useSharedValue(0);
  const lastPosition = useSharedValue(position.value);

  useFrameCallback((frame) => {
    const dt = frame.timeSincePreviousFrame ?? 16;
    if (dt > 0) {
      speed.value = (Math.abs(position.value - lastPosition.value) / dt) * 1000;
    }
    lastPosition.value = position.value;
  });

  // The reel owns the touch itself (capture), so a drag can't be cancelled
  // by a child; tap vs. swipe is decided on release from distance and speed.
  const [pressed, setPressed] = useState(false);
  const pressStart = useRef({ y: 0, t: 0 });
  const responder = {
    onStartShouldSetResponderCapture: () => !disabled,
    onResponderTerminationRequest: () => false,
    onResponderGrant: (e: GestureResponderEvent) => {
      pressStart.current = { y: e.nativeEvent.pageY, t: Date.now() };
      setPressed(true);
    },
    onResponderTerminate: () => setPressed(false),
    onResponderRelease: (e: GestureResponderEvent) => {
      setPressed(false);
      const dy = e.nativeEvent.pageY - pressStart.current.y;
      const dt = Math.max(1, Date.now() - pressStart.current.t);
      const isSwipe =
        Math.abs(dy) >= SWIPE_MIN_PX ||
        (Math.abs(dy) >= SWIPE_START_PX &&
          Math.abs(dy) / dt >= SWIPE_MIN_VELOCITY);
      if (isSwipe) {
        // Strip follows the finger: swipe down = foods run top to bottom (-1).
        onSwipe(dy < 0 ? 1 : -1);
      } else {
        onPress();
      }
    },
  };
  useEffect(() => {
    if (spin.key === 0) {
      return;
    }

    const targetIndex = indexOf(food);
    const startIndex = ((Math.round(position.value) % count) + count) % count;
    const dir = spin.direction;
    // Moving down needs strip below the start, so begin from a high copy.
    const start =
      dir === 1 ? count + startIndex : count * (STRIP_COPIES - 2) + startIndex;

    if (reduceMotion) {
      // No travel: dip, swap, return — same information without motion.
      windowOpacity.value = withSequence(
        withTiming(0.25, { duration: 160 }),
        withTiming(1, { duration: 240 }),
      );
      setTimeout(() => {
        position.value = count + targetIndex;
      }, 160);
      return;
    }

    const delta =
      dir === 1
        ? (targetIndex - startIndex + count) % count
        : (startIndex - targetIndex + count) % count;
    const end = start + dir * (spin.loops * count + delta);
    const runMs = Math.max(
      300,
      spin.durationMs - REEL_WINDUP_MS - REEL_SETTLE_MS,
    );

    position.value = start;
    running.value = true;
    position.value = withSequence(
      // Small pull back, like a lever releasing the drum.
      withTiming(start - dir * 0.3, {
        duration: REEL_WINDUP_MS,
        easing: Easing.inOut(Easing.quad),
      }),
      withTiming(end + dir * OVERSHOOT, {
        duration: runMs,
        // Quad ease-out has the lowest peak speed (2× average) of the decel
        // curves, so the strip stays readable instead of strobing backwards.
        easing: Easing.out(Easing.quad),
      }),
      withTiming(
        end,
        { duration: REEL_SETTLE_MS, easing: Easing.out(Easing.quad) },
        (finished) => {
          running.value = false;
          if (finished) {
            // Jump back to the identical item in the base copy.
            position.value = count + targetIndex;
          }
        },
      ),
    );
    // Only a new spin key should start the animation.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spin.key]);

  // Tick each time a food crosses the payline while the reel runs.
  useAnimatedReaction(
    () => Math.round(position.value),
    (current, previous) => {
      if (running.value && previous !== null && current !== previous) {
        scheduleOnRN(feedback.tick);
      }
    },
  );

  useEffect(() => {
    held.value = withTiming(locked ? 1 : 0, { duration: HOLD_FADE_MS });
  }, [locked, held]);

  useEffect(() => {
    if (celebrateKey === 0) {
      return;
    }
    flash.value = reduceMotion
      ? withSequence(
          withTiming(0.55, { duration: 120 }),
          withTiming(0, { duration: 600 }),
        )
      : withSequence(
          withTiming(0.75, { duration: 110 }),
          withTiming(0.15, { duration: 160 }),
          withTiming(0.6, { duration: 110 }),
          withTiming(0, { duration: 480 }),
        );
  }, [celebrateKey, flash, reduceMotion]);

  const stripStyle = useAnimatedStyle(() => ({
    // Fade the foods at full speed — reads as motion blur and hides strobing.
    opacity: interpolate(speed.value, [8, 26], [1, 0.4], 'clamp'),
    transform: [
      {
        translateY:
          REEL_WINDOW_HEIGHT / 2 -
          REEL_ITEM_HEIGHT / 2 -
          position.value * REEL_ITEM_HEIGHT,
      },
    ],
  }));
  const windowStyle = useAnimatedStyle(() => ({
    opacity: windowOpacity.value,
  }));
  const holdFrameStyle = useAnimatedStyle(() => ({ opacity: held.value }));
  // Arrows slide in from the rim onto the payline.
  const markerLeftStyle = useAnimatedStyle(() => ({
    opacity: held.value,
    transform: [{ translateX: (held.value - 1) * MARKER_SIZE }],
  }));
  const markerRightStyle = useAnimatedStyle(() => ({
    opacity: held.value,
    transform: [{ translateX: (1 - held.value) * MARKER_SIZE }],
  }));
  const flashStyle = useAnimatedStyle(() => ({ opacity: flash.value }));

  return (
    <View
      {...responder}
      // Held reel draws above its neighbours so its glow isn't cut off.
      style={[styles.gestureArea, locked && styles.frameRaised]}>
      <Animated.View
        pointerEvents="none"
        style={[styles.resultGlow, flashStyle]}
      />
      <View
        // Touches are handled by the wrapper above; this view only carries
        // the VoiceOver semantics (activate = hold, custom action = spin).
        accessible
        accessibilityRole="switch"
        accessibilityState={{ checked: locked, disabled }}
        accessibilityLabel={`${food.name} festhalten`}
        accessibilityHint="Nach oben oder unten wischen dreht diese Walze"
        accessibilityActions={[
          { name: 'activate' },
          { name: 'spin', label: 'Walze drehen' },
        ]}
        onAccessibilityAction={(e) => {
          if (disabled) return;
          if (e.nativeEvent.actionName === 'activate') onPress();
          if (e.nativeEvent.actionName === 'spin') onSwipe(1);
        }}
        style={[styles.frame, pressed && styles.pressed]}>
        <Animated.View
          pointerEvents="none"
          style={[styles.holdFrame, holdFrameStyle]}
        />
        <Animated.View style={[styles.window, windowStyle]}>
          {/* Result light sits behind the foods so they stay readable. */}
          <Animated.View
            pointerEvents="none"
            style={[styles.flash, flashStyle]}
          />
          <Animated.View style={stripStyle}>
            {strip.map((item, index) => (
              <View key={`${item.id}-${index}`} style={styles.item}>
                <FoodImage
                  imageKey={item.imageKey}
                  emoji={item.emoji}
                  name={item.name}
                  size={76}
                />
                <Text
                  style={styles.name}
                  numberOfLines={2}
                  adjustsFontSizeToFit
                  minimumFontScale={0.75}>
                  {item.name}
                </Text>
              </View>
            ))}
          </Animated.View>
          <View pointerEvents="none" style={styles.curve} />
          <Animated.View
            pointerEvents="none"
            style={[styles.marker, styles.markerLeft, markerLeftStyle]}
          />
          <Animated.View
            pointerEvents="none"
            style={[styles.marker, styles.markerRight, markerRightStyle]}
          />
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  gestureArea: {
    flex: 1,
    // Dragging must not start a text selection (web) — it would cancel the swipe.
    userSelect: 'none',
  },
  // No flex here: inside the column wrapper `flex: 1` collapses the reel to
  // zero height on native (the wrapper has no fixed height). Width stretches.
  frame: {
    padding: FRAME,
    borderRadius: radii.md,
    boxShadow: '0 3px 6px rgba(0, 0, 0, 0.55)',
    backgroundImage: gradients.chrome,
  },
  frameRaised: {
    zIndex: 1,
  },
  /** Pink rim fading in over the chrome while the reel is held. */
  holdFrame: {
    ...StyleSheet.absoluteFill,
    borderRadius: radii.md,
    backgroundColor: colors.highlight,
    boxShadow: `0 0 10px ${colors.highlight}`,
  },
  pressed: {
    transform: [{ scale: 0.98 }],
  },
  /** Payline arrows inside the window, pointing at the held food. */
  marker: {
    position: 'absolute',
    top: REEL_WINDOW_HEIGHT / 2 - MARKER_SIZE,
    width: 0,
    height: 0,
    borderTopWidth: MARKER_SIZE,
    borderBottomWidth: MARKER_SIZE,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
  },
  markerLeft: {
    left: 0,
    borderLeftWidth: MARKER_SIZE * 1.3,
    borderLeftColor: colors.highlight,
  },
  markerRight: {
    right: 0,
    borderRightWidth: MARKER_SIZE * 1.3,
    borderRightColor: colors.highlight,
  },
  window: {
    height: REEL_WINDOW_HEIGHT,
    overflow: 'hidden',
    borderRadius: radii.md - FRAME,
    backgroundColor: colors.reelFace,
    // Satin metal drum: brightest across the payline.
    backgroundImage: `linear-gradient(to right, #CFC8DA 0%, ${colors.reelFace} 22%, #FFFFFF 50%, ${colors.reelFace} 78%, #CFC8DA 100%)`,
  },
  item: {
    height: REEL_ITEM_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.xs,
  },
  name: {
    ...typography.foodName,
    color: colors.ink,
    textAlign: 'center',
  },
  curve: {
    ...StyleSheet.absoluteFill,
    backgroundImage: gradients.reelCurve,
  },
  /** Pink backlight behind the foods when the result lands. */
  flash: {
    ...StyleSheet.absoluteFill,
    backgroundImage: `radial-gradient(ellipse 85% 65% at 50% 48%, rgba(255, 140, 190, 0.95) 0%, ${colors.highlight} 70%, rgba(180, 20, 95, 1) 100%)`,
  },
  /** Pink glow around the reel, in step with the backlight. */
  resultGlow: {
    ...StyleSheet.absoluteFill,
    borderRadius: radii.md,
    backgroundColor: colors.highlight,
    boxShadow: `0 0 18px 4px ${colors.highlight}`,
  },
});
