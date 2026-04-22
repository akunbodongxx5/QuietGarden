import {
  Lora_400Regular,
  Lora_500Medium,
} from '@expo-google-fonts/lora';
import {
  Nunito_400Regular,
  Nunito_500Medium,
  Nunito_600SemiBold,
} from '@expo-google-fonts/nunito';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { ThemeProvider, DefaultTheme, DarkTheme, type Theme } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useMemo } from 'react';
import 'react-native-reanimated';

import Colors from '@/constants/Colors';
import { fonts } from '@/constants/typography';
import { useColorScheme } from '@/components/useColorScheme';

export { ErrorBoundary } from 'expo-router';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
    Nunito_400Regular,
    Nunito_500Medium,
    Nunito_600SemiBold,
    Lora_400Regular,
    Lora_500Medium,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) SplashScreen.hideAsync();
  }, [loaded]);

  if (!loaded) return null;

  return <RootLayoutNav />;
}

function navTheme(scheme: 'light' | 'dark'): Theme {
  const c = Colors[scheme];
  const base = scheme === 'dark' ? DarkTheme : DefaultTheme;
  return {
    ...base,
    colors: {
      ...base.colors,
      primary: c.tint,
      background: c.background,
      card: c.backgroundElevated,
      text: c.text,
      border: c.border,
      notification: c.accent,
    },
  };
}

function RootLayoutNav() {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = useMemo(() => navTheme(colorScheme), [colorScheme]);
  const c = Colors[colorScheme];

  return (
    <ThemeProvider value={theme}>
      <Stack
        screenOptions={{
          contentStyle: { backgroundColor: c.background },
          headerStyle: { backgroundColor: c.background },
          headerTintColor: c.text,
          headerTitleStyle: {
            fontFamily: fonts.uiSemi,
            fontWeight: '600',
            fontSize: 18,
          },
          headerShadowVisible: false,
          animation: 'fade',
        }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="story/[id]"
          options={{
            headerShown: false,
            animation: 'fade',
            contentStyle: { backgroundColor: 'transparent' },
          }}
        />
        <Stack.Screen
          name="journal-history"
          options={{
            title: 'Riwayat',
            presentation: 'card',
          }}
        />
        <Stack.Screen
          name="favorites"
          options={{
            title: 'Favorit',
            presentation: 'modal',
          }}
        />
      </Stack>
    </ThemeProvider>
  );
}
