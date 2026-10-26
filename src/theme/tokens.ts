/**
 * Visual direction: chrome slot machine on deep berry — raspberry accent,
 * warm-white marquee bulbs, hot pink for held reels. Mirrors the
 * "Food Slot Tokens" variables in Figma.
 */
export const colors = {
  bgTop: '#7A0F3A',
  bgBottom: '#25061A',
  surface: 'rgba(255, 244, 247, 0.08)',
  surfaceStrong: 'rgba(255, 244, 247, 0.14)',
  accent: '#D61F5E',
  accentPressed: '#9E1245',
  accentGlow: 'rgba(214, 31, 94, 0.5)',
  highlight: '#FF6FA3',
  bulb: '#FFE7D1',
  text: '#FFF4F7',
  textMuted: 'rgba(255, 244, 247, 0.68)',
  ink: '#22101A',
  chromeLight: '#F7F7F5',
  chromeMid: '#C3C7CB',
  chromeDark: '#6F747A',
  cabinetInset: '#160611',
  reelFace: '#FBF7F2',
  reelBorder: 'rgba(255, 244, 247, 0.18)',
  danger: '#E07060',
  success: '#6FBF8A',
};

/** CSS gradients (React Native `backgroundImage`). */
export const gradients = {
  background: `linear-gradient(to bottom, ${colors.bgTop}, ${colors.bgBottom})`,
  chrome: `linear-gradient(to bottom, ${colors.chromeLight} 0%, ${colors.chromeMid} 45%, ${colors.chromeDark} 55%, ${colors.chromeMid} 80%, ${colors.chromeLight} 100%)`,
  /** Darkens reel top and bottom so the strip reads as a curved drum. */
  reelCurve:
    'linear-gradient(to bottom, rgba(22,6,17,0.88) 0%, rgba(22,6,17,0.22) 24%, rgba(255,255,255,0.14) 50%, rgba(22,6,17,0.22) 76%, rgba(22,6,17,0.88) 100%)',
  /** Lit face of the spin key: bright top, deep bottom. */
  spinFace: `linear-gradient(to bottom, #FF5C93 0%, ${colors.accent} 50%, ${colors.accentPressed} 100%)`,
};

export const fonts = {
  /** Uncut Sans (variable) — all regular UI text. */
  body: 'UncutSans',
  /** Modak — display headline on the marquee. Placeholder until final pick. */
  display: 'Modak_400Regular',
};

export const spacing = {
  xxs: 2,
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
  xl: 28,
};

export const typography = {
  marquee: {
    fontFamily: fonts.display,
    fontSize: 29,
    textTransform: 'uppercase' as const,
  },
  spinLabel: {
    fontFamily: fonts.body,
    fontSize: 24,
    fontWeight: '700' as const,
    letterSpacing: 2,
    textTransform: 'uppercase' as const,
  },
  headline: {
    fontFamily: fonts.body,
    fontSize: 18,
    fontWeight: '700' as const,
  },
  body: {
    fontFamily: fonts.body,
    fontSize: 15,
    fontWeight: '400' as const,
  },
  hint: {
    fontFamily: fonts.body,
    fontSize: 13,
    fontWeight: '400' as const,
  },
  label: {
    fontFamily: fonts.body,
    fontSize: 10,
    fontWeight: '700' as const,
    letterSpacing: 0.4,
    textTransform: 'uppercase' as const,
  },
  foodName: {
    fontFamily: fonts.body,
    fontSize: 14,
    fontWeight: '700' as const,
  },
};
