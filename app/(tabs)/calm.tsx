import { Audio } from 'expo-av';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { FadeOnFocus } from '@/components/FadeOnFocus';
import { ScreenHeader } from '@/components/ScreenHeader';
import { AMBIENT_TRACKS } from '@/constants/audio';
import Colors from '@/constants/Colors';
import { radius, shadow, spacing, tabBarFloatPad } from '@/constants/theme';
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
  const [trackId, setTrackId] = useState(AMBIENT_TRACKS[0].id);
  const [loading, setLoading] = useState(false);

  const pulse = useRef(new Animated.Value(1)).current;
  const ring1 = useRef(new Animated.Value(1)).current;
  const ring2 = useRef(new Animated.Value(1)).current;
  const ring1Opacity = useRef(new Animated.Value(0)).current;
  const ring2Opacity = useRef(new Animated.Value(0)).current;
  const soundRef = useRef<Audio.Sound | null>(null);

  const selectedTrack = AMBIENT_TRACKS.find((t) => t.id === trackId) ?? AMBIENT_TRACKS[0];

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

  // Pulse + ripple animations when playing
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
        Animated.timing(pulse, { toValue: 1,    duration: 2200, useNativeDriver: true }),
      ])
    );

    const ripple1 = Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(ring1, { toValue: 1.7, duration: 3000, useNativeDriver: true }),
          Animated.sequence([
            Animated.timing(ring1Opacity, { toValue: 0.5, duration: 400,  useNativeDriver: true }),
            Animated.timing(ring1Opacity, { toValue: 0,   duration: 2600, useNativeDriver: true }),
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
        Animated.delay(1500),
        Animated.parallel([
          Animated.timing(ring2, { toValue: 1.7, duration: 3000, useNativeDriver: true }),
          Animated.sequence([
            Animated.timing(ring2Opacity, { toValue: 0.32, duration: 400,  useNativeDriver: true }),
            Animated.timing(ring2Opacity, { toValue: 0,    duration: 2600, useNativeDriver: true }),
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
  }, [playing]);

  const loadTrack = useCallback(async (uri: string) => {
    if (soundRef.current) {
      await soundRef.current.unloadAsync();
      soundRef.current = null;
    }
    const { sound } = await Audio.Sound.createAsync(
      { uri },
      { shouldPlay: false, isLooping: true, volume: 0.5 }
    );
    soundRef.current = sound;
    return sound;
  }, []);

  const togglePlayback = useCallback(async () => {
    try {
      setLoading(true);
      if (!soundRef.current) {
        const sound = await loadTrack(selectedTrack.uri);
        await sound.playAsync();
        setPlaying(true);
      } else {
        const st = await soundRef.current.getStatusAsync();
        if (!st.isLoaded) return;
        if (st.isPlaying) {
          await soundRef.current.pauseAsync();
          setPlaying(false);
        } else {
          await soundRef.current.playAsync();
          setPlaying(true);
        }
      }
    } catch {
      setPlaying(false);
    } finally {
      setLoading(false);
    }
  }, [selectedTrack, loadTrack]);

  const onSelectTrack = useCallback(async (id: string) => {
    if (id === trackId) return;
    const wasPlaying = playing;
    setPlaying(false);
    setLoading(true);
    try {
      const track = AMBIENT_TRACKS.find((t) => t.id === id)!;
      setTrackId(id);
      const sound = await loadTrack(track.uri);
      if (wasPlaying) {
        await sound.playAsync();
        setPlaying(true);
      }
    } catch {
      setPlaying(false);
    } finally {
      setLoading(false);
    }
  }, [trackId, playing, loadTrack]);

  const gradientColors =
    scheme === 'dark'
      ? (['#080F0D', '#0C1814', '#0E1C18'] as const)
      : (['#D0EAE6', '#E2F0EE', '#EEF5F4', '#F5EFE4'] as const);

  return (
    <FadeOnFocus>
      <LinearGradient
        colors={[...gradientColors]}
        locations={scheme === 'dark' ? [0, 0.5, 1] : [0, 0.3, 0.65, 1]}
        style={styles.gradient}>
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
                    styles.favBtn,
                    { backgroundColor: c.backgroundElevated, opacity: pressed ? 0.7 : 1 },
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

          {/* ── AUDIO TRACK SELECTOR ─────────────────────── */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.trackChips}
            style={styles.trackScroll}>
            {AMBIENT_TRACKS.map((track) => {
              const on = trackId === track.id;
              return (
                <Pressable
                  key={track.id}
                  onPress={() => void onSelectTrack(track.id)}
                  accessibilityRole="button"
                  accessibilityState={{ selected: on }}
                  style={[
                    styles.trackChip,
                    {
                      backgroundColor: on ? c.zenFocus : c.backgroundElevated,
                      borderColor: on ? c.zenFocus : c.border,
                    },
                  ]}>
                  <Text style={styles.trackEmoji}>{track.emoji}</Text>
                  <Text style={[styles.trackLabel, { color: on ? '#fff' : c.textSecondary }]}>
                    {track.label}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>

          {/* ── ORB ──────────────────────────────────────── */}
          <View style={styles.orbSection}>
            <View style={styles.orbWrap}>
              <Animated.View
                style={[
                  styles.ring,
                  { borderColor: c.zenFocus, opacity: ring1Opacity, transform: [{ scale: ring1 }] },
                ]}
              />
              <Animated.View
                style={[
                  styles.ring,
                  { borderColor: c.zenFocus, opacity: ring2Opacity, transform: [{ scale: ring2 }] },
                ]}
              />

              <Animated.View style={{ transform: [{ scale: pulse }] }}>
                <Pressable
                  onPress={() => void togglePlayback()}
                  accessibilityRole="button"
                  accessibilityLabel={playing ? 'Jeda suara' : 'Putar ' + selectedTrack.label}>
                  <LinearGradient
                    colors={scheme === 'dark' ? ['#1A3028', '#2A6460'] : ['#2A6460', '#5AADA7']}
                    start={{ x: 0.2, y: 0 }}
                    end={{ x: 0.8, y: 1 }}
                    style={[styles.orb, shadow.zen]}>
                    {loading ? (
                      <Text style={styles.orbEmoji}>{selectedTrack.emoji}</Text>
                    ) : (
                      <FontAwesome
                        name={playing ? 'pause' : 'play'}
                        size={28}
                        color="#fff"
                        style={playing ? undefined : { marginLeft: 4 }}
                      />
                    )}
                  </LinearGradient>
                </Pressable>
              </Animated.View>
            </View>

            <Text style={[styles.orbLabel, { color: c.text }]}>
              {playing ? selectedTrack.label + ' — sedang menemanimu' : selectedTrack.label}
            </Text>
            <Text style={[styles.orbSub, { color: c.textSecondary }]}>
              {playing ? 'Ketuk untuk jeda' : 'Ketuk lingkaran untuk memutar'}
            </Text>
          </View>

          {/* ── DIVIDER ──────────────────────────────────── */}
          <View style={[styles.divider, { backgroundColor: c.border }]} />

          {/* ── MOMEN LEMBUT ─────────────────────────────── */}
          <Text style={[styles.section, { color: c.textSecondary }]}>Momen lembut</Text>
          <View style={styles.list}>
            {SOFT_MOMENTS.map((m) => (
              <View
                key={m.id}
                style={[styles.item, { backgroundColor: c.backgroundElevated }, shadow.card]}>
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
const RING_SIZE = ORB_SIZE * 1.7;

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  scroll: { paddingHorizontal: spacing.md },
  lead: { fontFamily: fonts.ui, fontSize: 15, lineHeight: 23, marginBottom: spacing.lg, maxWidth: 320 },
  favBtn: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center' },

  // Track chips
  trackScroll: { marginHorizontal: -spacing.md, marginBottom: spacing.xl },
  trackChips: { paddingHorizontal: spacing.md, gap: spacing.sm, paddingRight: spacing.xl },
  trackChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingVertical: 9,
    paddingHorizontal: spacing.mlg,
    borderRadius: radius.full,
    borderWidth: 1,
  },
  trackEmoji: { fontSize: 15 },
  trackLabel: { fontFamily: fonts.uiSemi, fontSize: 13 },

  // Orb
  orbSection: { alignItems: 'center', paddingVertical: spacing.xl, marginBottom: spacing.lg },
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
  orbEmoji: { fontSize: 32 },
  orbLabel: { fontFamily: fonts.display, fontSize: 20, letterSpacing: -0.2, marginBottom: 6, textAlign: 'center' },
  orbSub: { fontFamily: fonts.ui, fontSize: 14, letterSpacing: 0.2 },

  divider: { height: 1, marginHorizontal: spacing.md, marginBottom: spacing.xl, opacity: 0.3 },
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
  iconCircle: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  iconEmoji: { fontSize: 18 },
  itemText: { fontFamily: fonts.ui, flex: 1, fontSize: 15, lineHeight: 24 },
});
