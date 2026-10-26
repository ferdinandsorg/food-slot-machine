import { SymbolView, type SymbolViewProps } from 'expo-symbols';
import type { ColorValue } from 'react-native';

/**
 * Icons used in the app: Apple SF Symbol name on iOS, closest Material
 * symbol on Android/web (expo-symbols renders those there).
 */
const ICONS = {
  lock: { ios: 'lock.fill', android: 'lock', web: 'lock' },
  lockOpen: { ios: 'lock.open', android: 'lock_open', web: 'lock_open' },
  settings: { ios: 'gearshape.fill', android: 'settings', web: 'settings' },
  bookmark: {
    ios: 'bookmark',
    android: 'bookmark_border',
    web: 'bookmark_border',
  },
  bookmarkFill: { ios: 'bookmark.fill', android: 'bookmark', web: 'bookmark' },
  savedList: {
    ios: 'list.bullet.rectangle',
    android: 'bookmarks',
    web: 'bookmarks',
  },
  trash: { ios: 'trash', android: 'delete', web: 'delete' },
  foodPlaceholder: {
    ios: 'fork.knife',
    android: 'restaurant',
    web: 'restaurant',
  },
} as const satisfies Record<string, SymbolViewProps['name']>;

export type IconName = keyof typeof ICONS;

type Props = {
  name: IconName;
  size?: number;
  color: ColorValue;
  weight?: SymbolViewProps['weight'];
};

export function SFIcon({ name, size = 22, color, weight = 'medium' }: Props) {
  return (
    <SymbolView
      name={ICONS[name]}
      size={size}
      tintColor={color}
      weight={weight}
      resizeMode="scaleAspectFit"
      // Native symbol views need an explicit frame to take part in layout.
      style={{ width: size, height: size }}
    />
  );
}
