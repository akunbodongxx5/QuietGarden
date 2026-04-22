import React, { useEffect, useRef } from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';
import { Animated, View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Colors from '@/constants/Colors';
import { motion, radius, shadow } from '@/constants/theme';
import { fonts } from '@/constants/typography';
import { useColorScheme } from '@/components/useColorScheme';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';

type IconName = React.ComponentProps<typeof FontAwesome>['name'];

function TabIcon({
  name,
  color,
  focused,
  label,
  isCenter,
  scheme,
}: {
  name: IconName;
  color: string;
  focused: boolean;
  label: string;
  isCenter?: boolean;
  scheme: 'light' | 'dark';
}) {
  const scale = useRef(new Animated.Value(focused ? 1.1 : 1)).current;
  const pillOpacity = useRef(new Animated.Value(focused ? 1 : 0)).current;
  const pillScale = useRef(new Animated.Value(focused ? 1 : 0.7)).current;
  const c = Colors[scheme];

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scale, { toValue: focused ? 1.1 : 1, speed: 28, bounciness: 6, useNativeDriver: true }),
      Animated.timing(pillOpacity, { toValue: focused ? 1 : 0, duration: motion.tabMs, useNativeDriver: true }),
      Animated.spring(pillScale, { toValue: focused ? 1 : 0.7, speed: 28, bounciness: 4, useNativeDriver: true }),
    ]).start();
  }, [focused, scale, pillOpacity, pillScale]);

  if (isCenter) {
    return (
      <View style={styles.centerWrap}>
        <Animated.View
          style={[
            styles.centerOrb,
            { backgroundColor: c.tint, ...shadow.zen, transform: [{ scale }] },
          ]}>
          <FontAwesome name={name} size={20} color="#fff" />
        </Animated.View>
        <Text style={[styles.centerLabel, { color: focused ? c.tint : c.tabIconDefault }]}>
          {label}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.tabItem}>
      <Animated.View
        style={[
          styles.pill,
          {
            backgroundColor: scheme === 'dark' ? 'rgba(90,173,167,0.18)' : 'rgba(42,100,96,0.1)',
            opacity: pillOpacity,
            transform: [{ scale: pillScale }],
          },
        ]}
      />
      <Animated.View style={{ transform: [{ scale }] }}>
        <FontAwesome name={name} size={21} color={color} />
      </Animated.View>
      <Text
        style={[
          styles.tabLabel,
          { color, fontFamily: focused ? fonts.uiSemi : fonts.ui, opacity: focused ? 1 : 0.75 },
        ]}>
        {label}
      </Text>
    </View>
  );
}

export default function TabLayout() {
  const colorScheme = useColorScheme() ?? 'light';
  const palette = Colors[colorScheme];
  const insets = useSafeAreaInsets();
  const bottom = Math.max(insets.bottom, 10);

  const tabBg = colorScheme === 'dark' ? 'rgba(30,27,23,0.96)' : 'rgba(255,252,245,0.96)';
  const tabBorder = colorScheme === 'dark' ? 'rgba(58,53,48,0.9)' : 'rgba(221,213,196,0.95)';

  return (
    <Tabs
      screenOptions={{
        animation: 'fade',
        transitionSpec: { animation: 'timing', config: { duration: 260 } },
        tabBarActiveTintColor: palette.zenFocus,
        tabBarInactiveTintColor: palette.tabIconDefault,
        tabBarShowLabel: false,
        tabBarStyle: {
          position: 'absolute',
          left: 16,
          right: 16,
          bottom,
          height: 68,
          paddingTop: 0,
          paddingBottom: 0,
          borderTopWidth: 0,
          borderRadius: radius.hero,
          backgroundColor: tabBg,
          borderWidth: 1,
          borderColor: tabBorder,
          ...shadow.zen,
        },
        tabBarItemStyle: { paddingVertical: 0 },
        headerShown: useClientOnlyValue(false, false),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Hari ini',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="leaf" color={color} focused={focused} label="Hari ini" scheme={colorScheme} />
          ),
        }}
      />
      <Tabs.Screen
        name="stories"
        options={{
          title: 'Cerita',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="book" color={color} focused={focused} label="Cerita" scheme={colorScheme} />
          ),
        }}
      />
      <Tabs.Screen
        name="journal"
        options={{
          title: 'Jurnal',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="pencil" color={color} focused={focused} label="Jurnal" isCenter scheme={colorScheme} />
          ),
        }}
      />
      <Tabs.Screen
        name="calm"
        options={{
          title: 'Tenang',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="headphones" color={color} focused={focused} label="Tenang" scheme={colorScheme} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
    paddingTop: 6,
    position: 'relative',
    minWidth: 54,
  },
  pill: {
    position: 'absolute',
    top: 0,
    width: 48,
    height: 36,
    borderRadius: 18,
  },
  tabLabel: { fontSize: 10, letterSpacing: 0.3 },
  centerWrap: { alignItems: 'center', justifyContent: 'center', gap: 3, paddingTop: 2 },
  centerOrb: { width: 46, height: 46, borderRadius: 23, alignItems: 'center', justifyContent: 'center', marginBottom: 1 },
  centerLabel: { fontSize: 10, fontFamily: fonts.uiSemi, letterSpacing: 0.3 },
});
