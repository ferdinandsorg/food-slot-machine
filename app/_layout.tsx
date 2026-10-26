import { Modak_400Regular } from '@expo-google-fonts/modak';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { colors, fonts } from '@/src/theme/tokens';

export { ErrorBoundary } from 'expo-router';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    UncutSans: require('../assets/fonts/UncutSans-Variable.ttf'),
    Modak_400Regular,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.bgBottom },
          headerTintColor: colors.text,
          headerTitleStyle: { fontFamily: fonts.body, fontWeight: '700' },
          contentStyle: { backgroundColor: colors.bgBottom },
        }}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen
          name="settings"
          options={{ title: 'Einstellungen', presentation: 'modal' }}
        />
        <Stack.Screen
          name="motion-debug"
          options={{ title: 'Motion Debug', presentation: 'modal' }}
        />
      </Stack>
    </>
  );
}
