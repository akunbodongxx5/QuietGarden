import { Audio } from 'expo-av';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { FadeOnFocus } from '@/components/FadeOnFocus';
import { ScreenHeader } from '@/components/ScreenHeader';
import { AMBIENT_DEMO_URI } from '@/constants/audio';
import Colors from '@/constants/Colors';
import { motion, radius, shadow, spacing, tabBarFloatPad } from '@/constants/theme';
import { fonts } from '@/constants/typography';
import { SOFT_MOMENTS } from '@/data/softMoments';
import { useColorScheme } from '@/components/useColorScheme';

const MOMENT_ICONS: Record<string, string> = {
  hadir: '🍃',
  alam: '🌅',
  suara: '🎵',
  tubuh: '☕',
  refleksi: '✏️',
};

export default function CalmScreen() {
  const insets = useSafeAreaInsets();
  const scheme = useColorScheme() ?? 'light';
  const c = Colors[scheme];
  const [playing, setPlaying] = useState(false);
  const pulse = useRef(new Animated.Value(1)).current;
  const ring1 = useRef(new Animated.Value(1)).current;
  const ring2 = useRef(new Animated.Value(1)).current;
  const ring1Opacity = useRef(new Animated.Value(0)).current;
  const ring2Opacity = useRef(new Animated.Value(0)).current;
  const soundRef = useRef<Audio.Sound | null>(null);

  useEffect(() => {
    void Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: false,
    });
  }, []);

  useEffect(() => {
    return () => {
      void soundRef.current?.unloadAsync();
      soundRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!playing) {
      pulse.setValue(1);
      ring1.setValue(1);
      ring2.setValue(1);
      ring1Opacity.setValue(0);
      ring2Opacity.setValue(0);
      return;
    }

    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.06, duration: 2200, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1, duration: 2200, useNativeDriver: true }),
      ])
    );

    const ripple1 = Animated.loop(
      Animated.sequence([
        Animated.delay(0),
        Animated.parallel([
          Animated.timing(ring1, { toValue: 1.6, duration: 2800, useNativeDriver: true }),
          Animated.sequence([
            Animated.timing(ring1Opacity, { toValue: 0.45, duration: 400, useNativeDriver: true }),
            Animated.timing(ring1Opacity, { toValue: 0, duration: 2400, useNativeDriver: true }),
          ]),
        ]),
        Animated.parallel([
          Animated.timing(ring1, { toValue: 1, duration: 0, useNativeDriver: true }),
          Animated.timing(ring1Opacity, { toValue: 0, duration: 0, useNativeDriver: true }),
        ]),
      ])
    );

    const ripple2 = Animated.loop(
      Animated.sequence([
        Animated.delay(1400),
        Animated.parallel([
          Animated.timing(ring2, { toValue: 1.6, duration: 2800, useNativeDriver: true }),
          Animated.sequence([
            Animated.timing(ring2Opacity, { toValue: 0.3, duration: 400, useNativeDriver: true }),
            Animated.timing(ring2Opacity, { toValue: 0, duration: 2400, useNativeDriver: true }),
          ]),
        ]),
        Animated.parallel([
          Animated.timing(ring2, { toValue: 1, duration: 0, useNativeDriver: true }),
          Animated.timing(ring2Opacity, { toValue: 0, duration: 0, useNativeDriver: true }),
        ]),
      ])
    );

    pulseLoop.start();
    ripple1.start();
    ripple2.start();
    return () => { pulseLoop.stop(); ripple1.stop(); ripple2.stop(); };
  }, [playing, pulse, ring1, ring2, ring1Opacity, ring2Opacity]);

  const togglePlayback = useCallback(async () => {
    // #region agent log
    fetch('http://127.0.0.1:7672/ingest/7b9307eb-4a36-45bc-8461-bcb4180f88ca', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': '01a801' },
      body: JSON.stringify({
        sessionId: '01a801',
        location: 'calm.tsx:togglePlayback',
        message: 'togglePlayback invoked',
        data: { hypothesisId: 'H4', runId: 'post-fix' },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion
    try {
      if (!soundRef.current) {
        const { sound } = await Audio.Sound.createAsync(
          { uri: AMBIENT_DEMO_URI },
          { shouldPlay: false, isLooping: true, volume: 0.45 }
        );
        soundRef.current = sound;
      }
      const s = soundRef.current;
      const st = await s.getStatusAsync();
      if (!st.isLoaded) return;
      if (st.isPlaying) {
        await s.pauseAsync();
        setPlaying(false);
      } else {
        await s.playAsync();
        setPlaying(true);
      }
    } catch {
      setPlaying(false);
    }
  }, []);

  const gradientColors =
    scheme === 'dark'
      ? (['#0F1A18', '#141F1D', '#1A1815'] as const)
      : (['#D8EDEA', '#E4F0EE', '#EEF5F4', '#F5EFE4'] as const);

  const orbBg = scheme === 'dark' ? c.backgroundElevated : '#fff';
  const orbRingColor = c.zenFocus;

  return (
    <FadeOnFocus>
      <LinearGradient colors={[...gradientColors]} locations={scheme === 'dark' ? [0, 0.5, 1] : [0, 0.3, 0.65, 1]} style={styles.gradient}>
        <ScrollView
          contentContainerStyle={[
            styles.scroll,
            {
              paddingTop: insets.top + spacing.md,
              paddingBottom: tabBarFloatPad + spacing.lg,
            },
          ]}
          showsVerticalScrollIndicator={false}>
          <ScreenHeader
            title="Tenang"
            right={
              <Link href="/favorites" asChild>
                <Pressable
                  hitSlop={12}
                  accessibilityRole="button"
                  accessibilityLabel="Favorit"
                  style={({ pressed }) => [
                    { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center', backgroundColor: c.backgroundElevated, opacity: pressed ? 0.7 : 1 },
                    shadow.card,
                  ]}>
                  <FontAwesome name="heart" size={17} color={c.accent} />
                </Pressable>
              </Link>
            }
          />

          <Text style={[styles.lead, { color: c.textSecondary }]}>
            Bukan daftar tugas — hanya pengingat pelan.
          </Text>

          {/* Meditation Orb */}
          <View style={styles.orbSection}>
            <View style={styles.orbWrap}>
              {/* Ripple rings */}
              <Animated.View
                style={[
                  styles.ring,
                  {
                    borderColor: orbRingColor,
                    opacity: ring1Opacity,
                    transform: [{ scale: ring1 }],
                  },
                ]}
              />
              <Animated.View
                style={[
                  styles.ring,
                  {
                    borderColor: orbRingColor,
                    opacity: ring2Opacity,
                    transform: [{ scale: ring2 }],
                  },
                ]}
              />

              {/* Center orb */}
              <Animated.View style={{ transform: [{ scale: pulse }] }}>
                <Pressable
                  onPress={() => void togglePlayback()}
                  accessibilityRole="button"
                  accessibilityLabel={playing ? 'Jeda suara suasana' : 'Putar suara suasana pelan'}>
                  <LinearGradient
                    colors={
                      scheme === 'dark'
                        ? [c.blueDeep, c.zenFocus]
                        : ['#6A94B0', c.blueDeep]
                    }
                    start={{ x: 0.2, y: 0 }}
                    end={{ x: 0.8, y: 1 }}
                    style={[styles.orb, shadow.zen]}>
                    <FontAwesome
                      name={playing ? 'pause' : 'play'}
                      size={28}
                      color="#fff"
                      style={playing ? undefined : { marginLeft: 4 }}
                    />
                  </LinearGradient>
                </Pressable>
              </Animated.View>
            </View>

            <Text style={[styles.orbLabel, { color: c.text }]}>
              {playing ? 'Sedang menemanimu…' : 'Suara suasana'}
            </Text>
            <Text style={[styles.orbSub, { color: c.textSecondary }]}>
              {playing
                ? 'Ketuk untuk jeda'
                : 'Ketuk lingkaran untuk memutar'}
            </Text>
          </View>

          {/* Divider */}
          <View style={[styles.divider, { backgroundColor: c.border }]} />

          <Text style={[styles.section, { color: c.textSecondary }]}>Momen lembut</Text>
          <View style={styles.list}>
            {SOFT_MOMENTS.map((m) => (
              <View
                key={m.id}
                style={[
                  styles.item,
                  { backgroundColor: orbBg },
                  shadow.card,
                ]}>
                <View style={[styles.iconCircle, { backgroundColor: c.blueMist }]}>
                  <Text style={styles.iconEmoji}>{MOMENT_ICONS[m.category] ?? '✨'}</Text>
                </View>
                <Text style={[styles.itemText, { color: c.text }]}>{m.text}</Text>
              </View>
            ))}
          </View>
        </ScrollView>
      </LinearGradient>
    </FadeOnFocus>
  );
}

const ORB_SIZE = 120;
const RING_SIZE = ORB_SIZE * 1.65;

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  scroll: { paddingHorizontal: spacing.md },
  lead: { fontFamily: fonts.ui, fontSize: 15, lineHeight: 23, marginBottom: spacing.xl, maxWidth: 320 },

  orbSection: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    marginBottom: spacing.xl,
  },
  orbWrap: {
    width: RING_SIZE,
    height: RING_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  ring: {
    position: 'absolute',
    width: RING_SIZE,
    height: RING_SIZE,
    borderRadius: RING_SIZE / 2,
    borderWidth: 1.5,
  },
  orb: {
    width: ORB_SIZE,
    height: ORB_SIZE,
    borderRadius: ORB_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orbLabel: {
    fontFamily: fonts.display,
    fontSize: 20,
    letterSpacing: -0.2,
    marginBottom: 6,
  },
  orbSub: {
    fontFamily: fonts.ui,
    fontSize: 14,
    letterSpacing: 0.2,
  },

  divider: {
    height: 1,
    marginHorizontal: spacing.md,
    marginBottom: spacing.xl,
    opacity: 0.4,
  },

  section: {
    fontFamily: fonts.uiSemi,
    fontSize: 11,
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: spacing.smd,
  },
  list: { gap: spacing.smd },
  item: {
    flexDirection: 'row',
    gap: spacing.md,
    padding: spacing.mlg,
    borderRadius: radius.xl,
    alignItems: 'flex-start',
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  iconEmoji: { fontSize: 18 },
  itemText: { fontFamily: fonts.ui, flex: 1, fontSize: 15, lineHeight: 24 },
});
