/**
 * Visual direction: casino at dusk — satin lilac metal under soft light,
 * deep plum shadows, film grain. Toy-like 3D keys (glossy jelly caps in
 * recessed metal wells). Mirrors the "Food Slot Tokens" variables in Figma.
 */
export const colors = {
  bgTop: '#B7A9D6',
  bgMid: '#6C5E8F',
  bgBottom: '#1E1729',
  surface: 'rgba(246, 242, 251, 0.08)',
  surfaceStrong: 'rgba(246, 242, 251, 0.16)',
  /** Spin key cap: luminous azure. */
  accent: '#2FB2EE',
  accentLight: '#9BB7FF',
  accentPressed: '#0F5E92',
  accentGlow: 'rgba(70, 190, 255, 0.5)',
  /** Held reels: hot pink. */
  highlight: '#E73387',
  bulb: '#FFE9D2',
  text: '#F6F2FB',
  textMuted: 'rgba(246, 242, 251, 0.66)',
  ink: '#1D1826',
  inkMuted: 'rgba(29, 24, 38, 0.55)',
  chromeLight: '#F5F2F9',
  chromeMid: '#BDB4CD',
  chromeDark: '#5F5672',
  plate: '#2A2138',
  cabinetInset: '#15101D',
  reelFace: '#F2EEF7',
  reelBorder: 'rgba(246, 242, 251, 0.18)',
  danger: '#E07060',
  success: '#6FBF8A',
};

/** CSS gradients (React Native `backgroundImage`). */
export const gradients = {
  /** Satin lilac backdrop: light from the top left, plum falling into shadow. */
  background: [
    'radial-gradient(ellipse 90% 60% at 20% 8%, rgba(236,226,255,0.55) 0%, rgba(236,226,255,0) 70%)',
    'radial-gradient(ellipse 120% 70% at 50% 110%, rgba(10,6,16,0.75) 0%, rgba(10,6,16,0) 65%)',
    `linear-gradient(to bottom, ${colors.bgTop} 0%, ${colors.bgMid} 48%, ${colors.bgBottom} 100%)`,
  ].join(', '),
  /** Edge darkening that frames the machine. */
  vignette:
    'radial-gradient(ellipse 85% 75% at 50% 45%, rgba(18,12,26,0) 55%, rgba(18,12,26,0.6) 100%)',
  /** Brushed, lilac-tinted metal. */
  chrome: `linear-gradient(to bottom, ${colors.chromeLight} 0%, #DCD5E6 18%, ${colors.chromeMid} 46%, ${colors.chromeDark} 54%, ${colors.chromeMid} 78%, ${colors.chromeLight} 100%)`,
  /** Cabinet body: rounded metal block lit from above. */
  cabinet:
    'linear-gradient(to bottom, #F3EFF8 0%, #CFC7DC 22%, #A79DBA 60%, #7D7393 100%)',
  /** Recessed well around a key: darker at the top, catching light below. */
  well: 'linear-gradient(to bottom, #3B3248 0%, #6E6482 55%, #D9D2E4 100%)',
  /** Darkens reel top and bottom so the strip reads as a metal drum. */
  reelCurve:
    // Light band sits high on the drum (lit from above), per Figma v2.
    'linear-gradient(to bottom, rgba(21,16,29,0.92) 0%, rgba(21,16,29,0.35) 20%, rgba(255,255,255,0.18) 33%, rgba(255,255,255,0.05) 62%, rgba(21,16,29,0.35) 80%, rgba(21,16,29,0.92) 100%)',
  /** Spin cap: soft dome in the accent blue, lighter where the light hits. */
  spinCap: `radial-gradient(ellipse 90% 90% at 42% 32%, #8FD6F6 0%, ${colors.accent} 62%, #2192CC 100%)`,
  /** Satin chrome bezel ring around the spin cap. */
  bezel:
    'linear-gradient(160deg, #FAF8FC 0%, #D9D4E1 35%, #ABA5B7 70%, #8B8599 100%)',
  plate: 'linear-gradient(to bottom, #3A2F4C 0%, #2A2138 55%, #1C1526 100%)',
};

export const fonts = {
  /** Uncut Sans (variable) — all text, headlines included. */
  body: 'UncutSans',
};

/** Uncut Sans ss02: the alternate Y/y. Applied to every text style. */
const uncutFeatures = { fontVariant: ['stylistic-two' as const] };

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
  xl: 30,
};

export const typography = {
  marquee: {
    fontFamily: fonts.body,
    ...uncutFeatures,
    fontSize: 22,
    fontWeight: '700' as const,
    letterSpacing: 0,
    textTransform: 'uppercase' as const,
  },
  display: {
    fontFamily: fonts.body,
    ...uncutFeatures,
    fontSize: 22,
    fontWeight: '600' as const,
    letterSpacing: -0.3,
  },
  spinLabel: {
    fontFamily: fonts.body,
    ...uncutFeatures,
    fontSize: 21,
    fontWeight: '600' as const,
    letterSpacing: 0.2,
  },
  headline: {
    fontFamily: fonts.body,
    ...uncutFeatures,
    fontSize: 18,
    fontWeight: '700' as const,
  },
  body: {
    fontFamily: fonts.body,
    ...uncutFeatures,
    fontSize: 15,
    fontWeight: '400' as const,
  },
  hint: {
    fontFamily: fonts.body,
    ...uncutFeatures,
    fontSize: 13,
    fontWeight: '400' as const,
  },
  label: {
    fontFamily: fonts.body,
    ...uncutFeatures,
    fontSize: 10,
    fontWeight: '700' as const,
    letterSpacing: 1.2,
    textTransform: 'uppercase' as const,
  },
  foodName: {
    fontFamily: fonts.body,
    ...uncutFeatures,
    fontSize: 14,
    fontWeight: '700' as const,
  },
};
