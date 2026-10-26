import { StyleSheet, View, type ViewProps } from 'react-native';

import { colors, gradients } from '@/src/theme/tokens';

/** Deep wine wash with a soft warm glow behind the machine. */
export function AppBackground({ style, children, ...rest }: ViewProps) {
  return (
    <View style={[styles.root, style]} {...rest}>
      <View style={styles.glow} pointerEvents="none" />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bgBottom,
    backgroundImage: gradients.background,
  },
  glow: {
    position: 'absolute',
    top: '18%',
    left: '-20%',
    width: '140%',
    aspectRatio: 1,
    borderRadius: 9999,
    backgroundImage:
      'radial-gradient(circle, rgba(255, 120, 90, 0.22) 0%, rgba(255, 120, 90, 0) 65%)',
  },
});
