import { Image, StyleSheet, View, type ViewProps } from 'react-native';

import { colors, gradients } from '@/src/theme/tokens';

const grain = require('../../assets/images/grain.png');

/** Satin lilac backdrop with film grain and a soft vignette. */
export function AppBackground({ style, children, ...rest }: ViewProps) {
  return (
    <View style={[styles.root, style]} {...rest}>
      <Image
        source={grain}
        resizeMode="repeat"
        style={styles.grain}
        pointerEvents="none"
      />
      <View style={styles.vignette} pointerEvents="none" />
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
  grain: {
    ...StyleSheet.absoluteFill,
    width: '100%',
    height: '100%',
    opacity: 0.9,
  },
  vignette: {
    ...StyleSheet.absoluteFill,
    backgroundImage: gradients.vignette,
  },
});
