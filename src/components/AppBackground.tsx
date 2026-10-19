import { StyleSheet, View, type ViewProps } from 'react-native';

import { colors } from '@/src/theme/tokens';

/** Soft vertical wash — atmosphere without a flat single-color fill. */
export function AppBackground({ style, children, ...rest }: ViewProps) {
  return (
    <View style={[styles.root, style]} {...rest}>
      <View style={styles.glowTop} pointerEvents="none" />
      <View style={styles.glowAccent} pointerEvents="none" />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bgBottom,
  },
  glowTop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: colors.bgTop,
    opacity: 0.85,
  },
  glowAccent: {
    position: 'absolute',
    top: -80,
    right: -40,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: colors.accent,
    opacity: 0.12,
  },
});
