/**
 * Visual direction: warm kitchen light on deep olive — playful, not purple/cream-AI default.
 */
export const colors = {
  bgTop: '#1A2E24',
  bgBottom: '#0F1A14',
  surface: 'rgba(255, 248, 235, 0.08)',
  surfaceStrong: 'rgba(255, 248, 235, 0.14)',
  accent: '#E8A838',
  accentPressed: '#C48A28',
  text: '#FFF8EB',
  textMuted: 'rgba(255, 248, 235, 0.65)',
  reelBg: '#243B30',
  reelBorder: 'rgba(232, 168, 56, 0.35)',
  danger: '#E07060',
  success: '#6FBF8A',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const radii = {
  sm: 8,
  md: 14,
  lg: 22,
};

export const typography = {
  brand: {
    fontSize: 34,
    fontWeight: '700' as const,
    letterSpacing: -0.5,
  },
  headline: {
    fontSize: 18,
    fontWeight: '600' as const,
  },
  body: {
    fontSize: 15,
    fontWeight: '400' as const,
  },
  label: {
    fontSize: 12,
    fontWeight: '600' as const,
    letterSpacing: 0.8,
    textTransform: 'uppercase' as const,
  },
  foodName: {
    fontSize: 14,
    fontWeight: '600' as const,
  },
};
