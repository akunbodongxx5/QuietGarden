import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Animated, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useEffect, useMemo, useRef, useState } from 'react';

import { FadeOnFocus } from '@/components/FadeOnFocus';
import { RemoteImage } from '@/components/RemoteImage';
import { ScreenHeader } from '@/components/ScreenHeader';
import Colors from '@/constants/Colors';
import { radius, shadow, spacing, tabBarFloatPad } from '@/constants/theme';
import { fonts } from '@/constants/typography';
import { STORIES } from '@/data/stories';
import { useFavorites } from '@/hooks/useFavorites';
import { useColorScheme } from '@/components/useColorScheme';

const ALL_CATS = ['Semua', ...Array.from(new Set(STORIES.map((s) => s.category)))];

function readTime(slideCount: number) {
  return `~${slideCount + 1} mnt`;
}

function FeaturedCard({
  s,
  fav,
  anim,
  onPress,
  onFav,
}: {
  s: (typeof STORIES)[number];
  fav: boolean;
  anim: Animated.Value;
  onPress: () => void;
  onFav: () => void;
}) {
  const scale = useRef(new Animated.Value(1)).current;
  const pressIn = () =>
    Animated.spring(scale, { toValue: 0.975, useNativeDriver: true, speed: 30 }).start();
  const pressOut = () =>
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 20 }).start();

  const translateY = anim.interpolate({ inputRange: [0, 1], outputRange: [28, 0] });

  return (
    <Animated.View
      style={[
        styles.featuredWrap,
        shadow.zen,
        { opacity: anim, transform: [{ translateY }, { scale }] },
      ]}>
      <Pressable
        onPress={onPress}
        onPressIn={pressIn}
        onPressOut={pressOut}
        accessibilityRole="button"
        accessibilityLabel={"Baca cerita " + s.title}>
        <RemoteImage uri={s.coverUrl} style={styles.featuredCover} contentFit="cover" transition={400} />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.12)', 'rgba(0,0,0,0.78)']}
          locations={[0.2, 0.5, 1]}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.featuredOverlay}>
          <View style={styles.overlayTop}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{s.category}</Text>
            </View>
            <FavOrb active={fav} onPress={onFav} />
          </View>
          <View style={styles.featuredBottom}>
            <Text style={styles.featuredTitle}>{s.title}</Text>
            <Text style={styles.featuredTagline}>{s.tagline}</Text>
            <View style={styles.readRow}>
              <FontAwesome name="book" size={10} color="rgba(255,255,255,0.65)" />
              <Text style={styles.readLabel}>{readTime(s.slides.length)}</Text>
              <View style={styles.readDot} />
              <Text style={styles.readLabel}>Baca sekarang</Text>
              <FontAwesome name="arrow-right" size={10} color="rgba(255,255,255,0.65)" />
            </View>
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
}

function StoryCard({
  s,
  fav,
  anim,
  onPress,
  onFav,
}: {
  s: (typeof STORIES)[number];
  fav: boolean;
  anim: Animated.Value;
  onPress: () => void;
  onFav: () => void;
}) {
  const scale = useRef(new Animated.Value(1)).current;
  const pressIn = () =>
    Animated.spring(scale, { toValue: 0.975, useNativeDriver: true, speed: 30 }).start();
  const pressOut = () =>
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 20 }).start();

  const translateY = anim.interpolate({ inputRange: [0, 1], outputRange: [24, 0] });

  return (
    <Animated.View
      style={[
        styles.cardWrap,
        shadow.card,
        { opacity: anim, transform: [{ translateY }, { scale }] },
      ]}>
      <Pressable
        onPress={onPress}
        onPressIn={pressIn}
        onPressOut={pressOut}
        accessibilityRole="button"
        accessibilityLabel={"Baca cerita " + s.title}>
        <RemoteImage uri={s.coverUrl} style={styles.cardCover} contentFit="cover" transition={400} />
        <LinearGradient
          colors={['rgba(0,0,0,0.02)', 'rgba(0,0,0,0.22)', 'rgba(0,0,0,0.75)']}
          locations={[0, 0.45, 1]}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.cardOverlay}>
          <View style={styles.overlayTop}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{s.category}</Text>
            </View>
            <FavOrb active={fav} onPress={onFav} />
          </View>
          <View style={styles.cardBottom}>
            <Text style={styles.cardTitle}>{s.title}</Text>
            <Text style={styles.cardTagline}>{s.tagline}</Text>
            <View style={styles.readRow}>
              <FontAwesome name="book" size={10} color="rgba(255,255,255,0.6)" />
              <Text style={styles.readLabel}>{readTime(s.slides.length)}</Text>
              <View style={styles.readDot} />
              <Text style={styles.readLabel}>Baca sekarang</Text>
              <FontAwesome name="arrow-right" size={10} color="rgba(255,255,255,0.6)" />
            </View>
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
}

function FavOrb({ active, onPress }: { active: boolean; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      hitSlop={12}
      accessibilityRole="button"
      accessibilityLabel={active ? 'Hapus dari favorit' : 'Simpan ke favorit'}>
      <View style={[styles.favOrb, active && styles.favOrbOn]}>
        <FontAwesome name={active ? 'heart' : 'heart-o'} size={14} color="#fff" />
      </View>
    </Pressable>
  );
}

export default function StoriesScreen() {
  const insets = useSafeAreaInsets();
  const scheme = useColorScheme() ?? 'light';
  const c = Colors[scheme];
  const router = useRouter();
  const { isStoryFavorite, toggleStory } = useFavorites();
  const [selectedCat, setSelectedCat] = useState('Semua');

  const cardAnims = useRef(STORIES.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    Animated.stagger(
      90,
      cardAnims.map((anim) =>
        Animated.spring(anim, { toValue: 1, useNativeDriver: true, tension: 55, friction: 9 })
      )
    ).start();
  }, []);

  const filtered = useMemo(
    () => (selectedCat === 'Semua' ? STORIES : STORIES.filter((s) => s.category === selectedCat)),
    [selectedCat]
  );

  const gradientColors =
    scheme === 'dark'
      ? (['#1A1815', '#1E1C19', '#252220'] as const)
      : (['#EDE5D8', '#F0EBE0', '#F5EFE4'] as const);

  return (
    <FadeOnFocus>
      <LinearGradient colors={[...gradientColors]} style={styles.gradient}>
        <ScrollView
          contentContainerStyle={[
            styles.scroll,
            {
              paddingTop: insets.top + spacing.md,
              paddingBottom: tabBarFloatPad + spacing.lg,
            },
          ]}
          showsVerticalScrollIndicator={false}>

          {/* HEADER */}
          <View style={styles.headerWrap}>
            <ScreenHeader
              title="Cerita"
              right={
                <Link href="/favorites" asChild>
                  <Pressable accessibilityRole="button" accessibilityLabel="Favorit" hitSlop={12}>
                    <FontAwesome name="heart" size={20} color={c.accent} />
                  </Pressable>
                </Link>
              }
            />
          </View>

          {/* CATEGORY CHIPS */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chips}
            style={styles.chipsScroll}>
            {ALL_CATS.map((cat) => {
              const on = selectedCat === cat;
              return (
                <Pressable
                  key={cat}
                  onPress={() => setSelectedCat(cat)}
                  accessibilityRole="button"
                  accessibilityState={{ selected: on }}
                  style={[
                    styles.chip,
                    {
                      backgroundColor: on ? c.zenFocus : c.backgroundElevated,
                      borderColor: on ? c.zenFocus : c.border,
                    },
                  ]}>
                  <Text
                    style={[
                      styles.chipLabel,
                      { color: on ? '#fff' : c.textSecondary },
                    ]}>
                    {cat}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>

          {/* COUNT */}
          <Text style={[styles.countLabel, { color: c.textSecondary }]}>
            {filtered.length} cerita
          </Text>

          {/* STORY CARDS */}
          <View style={styles.list}>
            {filtered.map((s, i) => {
              const globalIndex = STORIES.indexOf(s);
              const anim = cardAnims[globalIndex];
              const isFeatured = i === 0;

              return isFeatured ? (
                <FeaturedCard
                  key={s.id}
                  s={s}
                  fav={isStoryFavorite(s.id)}
                  anim={anim}
                  onPress={() => router.push(('/story/' + s.id) as any)}
                  onFav={() => toggleStory(s.id)}
                />
              ) : (
                <StoryCard
                  key={s.id}
                  s={s}
                  fav={isStoryFavorite(s.id)}
                  anim={anim}
                  onPress={() => router.push(('/story/' + s.id) as any)}
                  onFav={() => toggleStory(s.id)}
                />
              );
            })}
          </View>

        </ScrollView>
      </LinearGradient>
    </FadeOnFocus>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  scroll: { paddingHorizontal: spacing.md },
  headerWrap: { marginBottom: 0 },

  // Category filter
  chipsScroll: { marginHorizontal: -spacing.md, marginBottom: spacing.sm },
  chips: { paddingHorizontal: spacing.md, gap: spacing.sm, paddingRight: spacing.xl },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: spacing.mlg,
    borderRadius: radius.full,
    borderWidth: 1,
  },
  chipLabel: { fontFamily: fonts.uiSemi, fontSize: 13 },

  countLabel: {
    fontFamily: fonts.ui,
    fontSize: 12,
    letterSpacing: 0.5,
    marginBottom: spacing.mlg,
    marginTop: spacing.xs,
  },

  // List
  list: { gap: spacing.mlg },

  // Featured card
  featuredWrap: { borderRadius: radius.hero, overflow: 'hidden' },
  featuredCover: { width: '100%', height: 290 },
  featuredOverlay: {
    ...StyleSheet.absoluteFillObject,
    padding: spacing.mlg,
    justifyContent: 'space-between',
  },
  featuredBottom: { gap: 8 },
  featuredTitle: {
    fontFamily: fonts.display,
    fontSize: 32,
    lineHeight: 40,
    color: '#fff',
    letterSpacing: -0.4,
    textShadowColor: 'rgba(0,0,0,0.4)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 8,
  },
  featuredTagline: {
    fontFamily: fonts.ui,
    fontSize: 14,
    lineHeight: 20,
    color: 'rgba(255,255,255,0.78)',
    letterSpacing: 0.1,
  },

  // Regular card
  cardWrap: { borderRadius: radius.xl, overflow: 'hidden' },
  cardCover: { width: '100%', height: 210 },
  cardOverlay: {
    ...StyleSheet.absoluteFillObject,
    padding: spacing.mlg,
    justifyContent: 'space-between',
  },
  cardBottom: { gap: 6 },
  cardTitle: {
    fontFamily: fonts.display,
    fontSize: 24,
    lineHeight: 30,
    color: '#fff',
    letterSpacing: -0.3,
    textShadowColor: 'rgba(0,0,0,0.35)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 6,
  },
  cardTagline: {
    fontFamily: fonts.ui,
    fontSize: 13,
    lineHeight: 18,
    color: 'rgba(255,255,255,0.72)',
  },

  // Shared overlay pieces
  overlayTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  badge: {
    backgroundColor: 'rgba(255,255,255,0.16)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.28)',
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: radius.full,
  },
  badgeText: {
    fontFamily: fonts.uiSemi,
    fontSize: 11,
    color: '#fff',
    letterSpacing: 0.6,
    textTransform: 'capitalize',
  },
  favOrb: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.22)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  favOrbOn: {
    backgroundColor: 'rgba(190,80,90,0.62)',
    borderColor: 'rgba(255,120,120,0.38)',
  },
  readRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  readLabel: {
    fontFamily: fonts.uiSemi,
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    letterSpacing: 0.2,
  },
  readDot: {
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
});
