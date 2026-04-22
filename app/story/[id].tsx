import FontAwesome from '@expo/vector-icons/FontAwesome';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useMemo, useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { RemoteImage } from '@/components/RemoteImage';
import Colors from '@/constants/Colors';
import { motion, radius, shadow, spacing } from '@/constants/theme';
import { fonts } from '@/constants/typography';
import { getStoryById } from '@/data/stories';
import { useFavorites } from '@/hooks/useFavorites';
import { useColorScheme } from '@/components/useColorScheme';
import { SoftButton } from '@/components/SoftButton';

const GRADIENTS = [
  ['#EDE4DA', '#E4EBE2', '#E8E0DC'] as const,
  ['#E8E2DE', '#E2E8EA', '#E5DFE2'] as const,
  ['#EDE4E0', '#E8E4DE', '#EDE4DA'] as const,
];

export default function StoryReaderScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const scheme = useColorScheme() ?? 'light';
  const c = Colors[scheme];
  const story = useMemo(() => (id ? getStoryById(String(id)) : undefined), [id]);
  const [index, setIndex] = useState(0);
  const { isStoryFavorite, toggleStory } = useFavorites();
  const slideOpacity = useRef(new Animated.Value(1)).current;

  if (!story) {
    return (
      <View style={[styles.fallback, { backgroundColor: c.background, paddingTop: insets.top }]}>
        <Stack.Screen options={{ title: '' }} />
        <Text style={{ fontFamily: fonts.ui, color: c.text }}>Cerita tidak ditemukan.</Text>
        <SoftButton label="Kembali" variant="secondary" onPress={() => router.back()} />
      </View>
    );
  }

  const slides = [...story.slides].sort((a, b) => a.order - b.order);
  const step = index < slides.length ? 'slide' : 'ending';
  const fav = isStoryFavorite(story.id);

  const grad = GRADIENTS[index % GRADIENTS.length];
  const darkGrad = (['#2C332E', '#323A34', '#2E3530'] as const);

  const goNext = useCallback(() => {
    if (step !== 'slide') return;
    Animated.timing(slideOpacity, {
      toValue: 0,
      duration: motion.fadeMs * 0.45,
      useNativeDriver: true,
    }).start(() => {
      if (index < slides.length - 1) setIndex((i) => i + 1);
      else setIndex(slides.length);
      Animated.timing(slideOpacity, {
        toValue: 1,
        duration: motion.fadeMs * 0.55,
        useNativeDriver: true,
      }).start();
    });
  }, [index, slideOpacity, slides.length, step]);

  return (
    <LinearGradient colors={scheme === 'dark' ? [...darkGrad] : [...grad]} style={styles.gradient}>
      <RemoteImage
        uri={story.coverUrl}
        style={[StyleSheet.absoluteFillObject, styles.coverBg, { opacity: scheme === 'dark' ? 0.14 : 0.26 }]}
        contentFit="cover"
        transition={320}
        accessibilityElementsHidden
      />
      <Stack.Screen options={{ headerShown: false }} />
      <View style={[styles.top, { paddingTop: insets.top + spacing.sm }]}>
        <Pressable
          onPress={() => router.back()}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel="Kembali ke daftar cerita">
          <FontAwesome name="chevron-left" size={22} color={c.text} />
        </Pressable>
        <Text style={[styles.progress, { color: c.textSecondary }]}>
          {step === 'slide' ? `${index + 1} / ${slides.length}` : 'Penutup'}
        </Text>
        <Pressable
          onPress={() => toggleStory(story.id)}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel={fav ? 'Hapus dari favorit' : 'Simpan ke favorit'}>
          <FontAwesome name={fav ? 'heart' : 'heart-o'} size={22} color={fav ? c.accent : c.text} />
        </Pressable>
      </View>

      <Pressable
        style={styles.body}
        onPress={goNext}
        accessibilityRole="button"
        accessibilityLabel={step === 'slide' ? 'Ketuk untuk lanjut' : undefined}>
        {step === 'slide' && slides[index] && (
          <Animated.Text style={[styles.slideText, { color: c.text, opacity: slideOpacity }]}>
            {slides[index].text}
          </Animated.Text>
        )}
        {step === 'ending' && (
          <View style={[styles.endingCard, { backgroundColor: c.backgroundElevated, borderColor: c.border }]}>
            <Text style={[styles.endingLabel, { color: c.textSecondary }]}>Penutup</Text>
            <Text style={[styles.endingText, { color: c.text }]}>{story.ending}</Text>
            <SoftButton label="Selesai" variant="primary" onPress={() => router.back()} />
          </View>
        )}
      </Pressable>

      {step === 'slide' && (
        <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.md }]}>
          <View
            style={styles.dots}
            accessible
            accessibilityLabel={`Slide ${index + 1} dari ${slides.length}`}>
            {slides.map((_, i) => (
              <View
                key={i}
                style={[
                  styles.dot,
                  {
                    backgroundColor: i === index ? c.zenFocus : c.border,
                    opacity: i === index ? 1 : 0.45,
                  },
                ]}
              />
            ))}
          </View>
          <Text style={[styles.hint, { color: c.textSecondary }]}>Ketuk di mana saja untuk lanjut</Text>
        </View>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1, overflow: 'hidden', position: 'relative' },
  coverBg: { width: '100%', height: '100%' },
  top: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
  },
  progress: { fontFamily: fonts.uiSemi, fontSize: 14 },
  body: { flex: 1, justifyContent: 'center', paddingHorizontal: spacing.xl },
  slideText: {
    fontFamily: fonts.display,
    fontSize: 24,
    lineHeight: 38,
    textAlign: 'center',
    letterSpacing: 0.12,
  },
  endingCard: {
    borderRadius: radius.lg,
    padding: spacing.xl,
    borderWidth: 1,
    gap: spacing.smd,
    ...shadow.card,
  },
  endingLabel: {
    fontFamily: fonts.uiSemi,
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  endingText: { fontFamily: fonts.display, fontSize: 20, lineHeight: 30 },
  footer: { alignItems: 'center', gap: spacing.smd },
  dots: { flexDirection: 'row', gap: 6, alignItems: 'center' },
  dot: { width: 7, height: 7, borderRadius: 4 },
  hint: { fontFamily: fonts.ui, fontSize: 14 },
  fallback: { flex: 1, padding: spacing.lg, gap: spacing.md, justifyContent: 'center' },
});
