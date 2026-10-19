import AsyncStorage from '@react-native-async-storage/async-storage';

import { MOTION_SETTINGS_KEY } from './motionConfig';

export async function loadMotionEnabled(): Promise<boolean> {
  try {
    const value = await AsyncStorage.getItem(MOTION_SETTINGS_KEY);
    if (value === null) {
      return true;
    }
    return value === 'true';
  } catch {
    return true;
  }
}

export async function saveMotionEnabled(enabled: boolean): Promise<void> {
  await AsyncStorage.setItem(MOTION_SETTINGS_KEY, enabled ? 'true' : 'false');
}
