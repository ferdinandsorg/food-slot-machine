import { useCallback, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { AppBackground } from '@/src/components/AppBackground';
import {
  MOTION_COOLDOWN_MS,
  MOTION_THRESHOLD,
} from '@/src/sensors/motionConfig';
import {
  useForwardThrust,
  type MotionDebugSample,
} from '@/src/sensors/useForwardThrust';
import { colors, radii, spacing, typography } from '@/src/theme/tokens';

export default function MotionDebugScreen() {
  const [sample, setSample] = useState<MotionDebugSample | null>(null);
  const [hits, setHits] = useState(0);

  const onSample = useCallback((next: MotionDebugSample) => {
    setSample(next);
  }, []);

  const onThrust = useCallback(() => {
    setHits((n) => n + 1);
  }, []);

  useForwardThrust({
    enabled: true,
    onThrust,
    onSample,
  });

  return (
    <AppBackground>
      <View style={styles.container}>
        <Text style={styles.heading}>DeviceMotion</Text>
        <Text style={styles.meta}>
          Threshold {MOTION_THRESHOLD} m/s² · Cooldown {MOTION_COOLDOWN_MS} ms
        </Text>

        <View style={styles.grid}>
          <Metric label="X" value={sample?.x} />
          <Metric label="Y" value={sample?.y} />
          <Metric label="Z" value={sample?.z} />
          <Metric label="|a|" value={sample?.magnitude} />
        </View>

        <View
          style={[
            styles.flash,
            sample?.triggered ? styles.flashOn : styles.flashOff,
          ]}>
          <Text
            style={[
              styles.flashText,
              sample?.triggered && styles.flashTextOn,
            ]}>
            {sample?.triggered ? 'TRIGGER' : 'idle'}
          </Text>
        </View>

        <Text style={styles.hits}>Auslösungen: {hits}</Text>
        <Text style={styles.hint}>
          Schiebe das iPhone bewusst nach vorne. Tippen und Gehen sollten
          möglichst nicht auslösen.
        </Text>
      </View>
    </AppBackground>
  );
}

function Metric({ label, value }: { label: string; value?: number }) {
  return (
    <View style={styles.metric}>
      <Text style={styles.metricLabel}>{label}</Text>
      <Text style={styles.metricValue}>
        {value === undefined ? '—' : value.toFixed(2)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.lg,
    gap: spacing.md,
  },
  heading: {
    ...typography.brand,
    fontSize: 28,
    color: colors.text,
  },
  meta: {
    ...typography.body,
    color: colors.textMuted,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  metric: {
    width: '47%',
    backgroundColor: colors.surfaceStrong,
    borderRadius: radii.md,
    padding: spacing.md,
  },
  metricLabel: {
    ...typography.label,
    color: colors.textMuted,
  },
  metricValue: {
    ...typography.headline,
    color: colors.text,
    fontVariant: ['tabular-nums'],
    marginTop: spacing.xs,
  },
  flash: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.lg,
    borderRadius: radii.lg,
  },
  flashOn: {
    backgroundColor: colors.accent,
  },
  flashOff: {
    backgroundColor: colors.surface,
  },
  flashText: {
    ...typography.headline,
    color: colors.text,
  },
  flashTextOn: {
    color: colors.bgBottom,
  },
  hits: {
    ...typography.headline,
    color: colors.text,
  },
  hint: {
    ...typography.body,
    color: colors.textMuted,
  },
});
