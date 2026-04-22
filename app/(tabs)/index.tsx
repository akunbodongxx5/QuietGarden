import FontAwesome from '@expo/vector-icons/FontAwesome';
import { LinearGradient } from 'expo-linear-gradient';
import { Link, useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AestheticClock } from '@/components/AestheticClock';
import { EditNameModal } from '@/components/EditNameModal';
import { FadeOnFocus } from '@/components/FadeOnFocus';
import { NameIntroModal } from '@/components/NameIntroModal';
import { RemoteImage } from '@/components/RemoteImage';
import { SoftButton } from '@/components/SoftButton';
import { Toast } from '@/components/Toast';
import { ZenBreathLine } from '@/components/ZenBreathLine';
import Colors from '@/constants/Colors';
import { ARTWORK } from '@/constants/artwork';
import { motion, radius, shadow, spacing, tabBarFloatPad } from '@/constants/theme';
import { fonts } from '@/constants/typography';
import { QUOTES } from '@/data/quotes';
import { formatDateId, getPersonalGreeting } from '@/lib/greeting';
import { getQuoteForDateWithOffset } from '@/lib/quoteForDay';
import {
  loadUserName,
  loadWelcomeDismissed,
  saveUserName,
  setWelcomeDismissed,
} from '@/lib/storage';
import { useFavorites } from '@/hooks/useFavorites';
import { useColorScheme } from '@/components/useColorScheme';

type NamePhase = 'load' | 'ask' | 'ready';

export default function TodayScreen() {
  const insets = useSafeAreaInsets();
  const scheme = useColorScheme() ?? 'light';
  const c = Colors[scheme];
  const router = useRouter();
  const { toggleQuote, isQuoteFavorite, ready } = useFavorites();

  const [tick, setTick] = useState(() => new Date());
  const [offset, setOffset] = useState(0);
  const quoteOpacity = useRef(new Animated.Value(1)).current;
  const savePulse = useRef(new Animated.Value(1)).current;
  const heroScale = useRef(new Animated.Value(1)).current;

  const [namePhase, setNamePhase] = useState<NamePhase>('load');
  const [userName, setUserName] = useState('');
  const [toast, setToast] = useState<{ visible: boolean; msg: string }>({ visible: false, msg: '' });
  const [welcome, setWelcome] = useState<boolean | null>(null);
  const [editNameOpen, setEditNameOpen] = useState(false);

  const quote = useMemo(
    () => getQuoteForDateWithOffset(tick, QUOTES, offset),
    [tick, offset]
  );

  useEffect(() => {
    const id = setInterval(() => setTick(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    Promise.all([loadUserName(), loadWelcomeDismissed()]).then(([n, w]) => {
      if (n === null) setNamePhase('ask');
      else { setUserName(n); setNamePhase('ready'); }
      setWelcome(w);
    });
  }, []);

  const crossfadeQuote = useCallback(
    (next: () => void) => {
      Animated.timing(quoteOpacity, { toValue: 0, duration: motion.fadeMs * 0.45, useNativeDriver: true }).start(() => {
        next();
        Animated.timing(quoteOpacity, { toValue: 1, duration: motion.fadeMs * 0.55, useNativeDriver: true }).start();
      });
    },
    [quoteOpacity]
  );

  const pulseSave = useCallback(() => {
    Animated.sequence([
      Animated.timing(savePulse, { toValue: 1.14, duration: 110, useNativeDriver: true }),
      Animated.timing(savePulse, { toValue: 1, duration: 190, useNativeDriver: true }),
    ]).start();
  }, [savePulse]);

  const onSaveName = useCallback((raw: string) => {
    const t = raw.trim();
    saveUserName(t);
    setUserName(t);
    setNamePhase('ready');
  }, []);

  const onSkipName = useCallback(() => {
    saveUserName('');
    setUserName('');
    setNamePhase('ready');
  }, []);

  const fav = ready && isQuoteFavorite(quote.id);

  // Gradient for the main bg
  const bgGradient =
    scheme === 'dark'
      ? (['#1A1815', '#1E1C19', '#252220'] as const)
      : (['#EDE5D8', '#F0EBE0', '#F5EFE4'] as const);

  // Hero image overlay gradient (bottom fade)
  const heroFade =
    scheme === 'dark'
      ? (['transparent', 'rgba(26,24,21,0.5)', 'rgba(26,24,21,0.95)', '#1A1815'] as const)
      : (['transparent', 'rgba(237,229,216,0.35)', 'rgba(237,229,216,0.85)', '#EDE5D8'] as const);

  if (namePhase === 'load') {
    return (
      <LinearGradient colors={[...bgGradient]} style={styles.gradient}>
        <View style={[styles.loading, { paddingTop: insets.top }]}>
          <ActivityIndicator size="large" color={c.zenFocus} />
        </View>
      </LinearGradient>
    );
  }

  return (
    <FadeOnFocus>
      <NameIntroModal visible={namePhase === 'ask'} onSave={onSaveName} onSkip={onSkipName} />
      <EditNameModal
        visible={editNameOpen}
        initialName={userName}
        onClose={() => setEditNameOpen(false)}
        onSave={(name) => {
          saveUserName(name);
          setUserName(name);
          setEditNameOpen(false);
          setToast({ visible: true, msg: name ? 'Nama tersimpan.' : 'Nama dihapus dari sapaan.' });
        }}
      />

      <LinearGradient colors={[...bgGradient]} style={styles.gradient}>
        <ScrollView
          contentContainerStyle={[
            styles.scroll,
            { paddingBottom: tabBarFloatPad + spacing.lg },
          ]}
          showsVerticalScrollIndicator={false}>

          {/* ── CINEMATIC HERO ───────────────────────────────── */}
          <View style={[styles.hero, { marginTop: 0 }]}>
            <Animated.View style={[StyleSheet.absoluteFill, { transform: [{ scale: heroScale }] }]}>
              <RemoteImage
                uri={ARTWORK.todayHero}
                style={StyleSheet.absoluteFill}
                contentFit="cover"
                transition={400}
              />
            </Animated.View>

            {/* Top bar: brand + favorite */}
            <View style={[styles.heroTopBar, { paddingTop: insets.top + spacing.md }]}>
              <View style={styles.brandBadge}>
                <Text style={styles.brandBadgeText}>QUIET GARDEN</Text>
              </View>
              <Link href="/favorites" asChild>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Buka favorit"
                  hitSlop={12}
                  style={({ pressed }) => [styles.heroFavBtn, { opacity: pressed ? 0.7 : 1 }]}>
                  <Animated.View style={{ transform: [{ scale: savePulse }] }}>
                    <FontAwesome name={fav ? 'heart' : 'heart-o'} size={19} color="#fff" />
                  </Animated.View>
                </Pressable>
              </Link>
            </View>

            {/* Centered time display */}
            <View style={styles.heroCenter}>
              <AestheticClock heroMode />
            </View>

            {/* Bottom gradient + greeting */}
            <LinearGradient colors={[...heroFade]} locations={[0, 0.45, 0.78, 1]} style={styles.heroFade}>
              <Text style={[styles.heroDate, { color: scheme === 'dark' ? 'rgba(240,235,226,0.65)' : 'rgba(38,33,28,0.55)' }]}>
                {formatDateId(tick).toUpperCase()}
              </Text>
              <Text style={[styles.heroGreeting, { color: scheme === 'dark' ? '#F0EBE2' : c.text }]}>
                {getPersonalGreeting(tick, userName)}
              </Text>
              {namePhase === 'ready' && (
                <Pressable
                  onPress={() => setEditNameOpen(true)}
                  accessibilityRole="button"
                  style={({ pressed }) => [styles.nameEditRow, { opacity: pressed ? 0.6 : 1 }]}>
                  <FontAwesome name="pencil" size={12} color={c.zenFocus} />
                  <Text style={[styles.nameEditText, { color: c.zenFocus }]}>
                    {userName.trim() ? 'Ubah nama' : 'Tambah nama'}
                  </Text>
                </Pressable>
              )}
            </LinearGradient>
          </View>

          {/* ── BREATH LINE ───────────────────────────────────── */}
          <View style={{ paddingHorizontal: spacing.md, marginTop: spacing.md }}>
            <ZenBreathLine />
          </View>

          {/* ── WELCOME BANNER (jika baru) ────────────────────── */}
          {welcome === false && namePhase === 'ready' && (
            <View style={[styles.welcomeBanner, { backgroundColor: c.zenCard, borderColor: c.zenFocus }]}>
              <Text style={[styles.welcomeText, { color: c.textSecondary }]}>
                Aku Quietelle — teman harianmu yang pelan. Tanpa akun, cukup napas dan tulisan.
              </Text>
              <SoftButton
                label="Siap"
                variant="secondary"
                onPress={() => { setWelcomeDismissed(); setWelcome(true); }}
              />
            </View>
          )}

          {/* ── QUOTE CARD ────────────────────────────────────── */}
          <View style={{ paddingHorizontal: spacing.md }}>
            <View
              style={[
                styles.quoteCard,
                { backgroundColor: c.backgroundElevated },
                shadow.zen,
              ]}>
              {/* Gradient accent top bar */}
              <LinearGradient
                colors={scheme === 'dark' ? ['#2A6460', '#3E8A84'] : ['#2A6460', '#5AADA7']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.quoteAccentBar}
              />

              {/* Big decorative quote mark */}
              <Text style={[styles.bigQuoteMark, { color: c.zenFocus }]}>{'"'}</Text>

              <Text style={[styles.quoteEyebrow, { color: c.zenFocus }]}>KUTIPAN HARI INI</Text>

              <Animated.View style={{ opacity: quoteOpacity }}>
                <Text style={[styles.quoteText, { color: c.text }]}>{quote.text}</Text>
                <View style={[styles.categoryChip, { backgroundColor: c.blueMist }]}>
                  <Text style={[styles.categoryChipText, { color: c.zenFocus }]}>{quote.category}</Text>
                </View>
              </Animated.View>

              <View style={styles.quoteActions}>
                <SoftButton
                  label={fav ? 'Tersimpan' : 'Simpan'}
                  variant={fav ? 'secondary' : 'primary'}
                  onPress={() => {
                    const was = fav;
                    toggleQuote(quote.id);
                    pulseSave();
                    setToast({ visible: true, msg: was ? 'Dihapus dari favorit' : 'Disimpan ke favorit' });
                  }}
                  accessibilityLabel={fav ? 'Hapus kutipan dari favorit' : 'Simpan kutipan ke favorit'}
                />
                <SoftButton
                  label="Renungkan"
                  variant="ghost"
                  onPress={() => router.push('/journal?reflect=1')}
                />
              </View>

              <Pressable
                onPress={() => crossfadeQuote(() => setOffset((o) => o + 1))}
                accessibilityRole="button"
                accessibilityLabel="Kutipan lain untuk hari ini"
                style={({ pressed }) => [styles.nextQuoteRow, { opacity: pressed ? 0.5 : 1 }]}>
                <View style={[styles.nextQuoteDivider, { backgroundColor: c.border }]} />
                <Text style={[styles.nextQuoteText, { color: c.textSecondary }]}>kutipan lain</Text>
                <FontAwesome name="long-arrow-right" size={13} color={c.textSecondary} />
              </Pressable>
            </View>
          </View>

          {/* ── QUICK ACTIONS ──────────────────────────────────── */}
          <View style={[styles.quickRow, { paddingHorizontal: spacing.md }]}>
            <Pressable
              onPress={() => router.push('/journal')}
              accessibilityRole="button"
              accessibilityLabel="Tulis jurnal sekarang"
              style={({ pressed }) => [
                styles.quickCard,
                { backgroundColor: c.backgroundElevated, opacity: pressed ? 0.82 : 1 },
                shadow.card,
              ]}>
              <LinearGradient
                colors={scheme === 'dark' ? ['#2A6460', '#1E2E2D'] : ['#2A6460', '#3E8A84']}
                style={styles.quickIconBg}>
                <FontAwesome name="pencil" size={16} color="#fff" />
              </LinearGradient>
              <View style={styles.quickTextCol}>
                <Text style={[styles.quickTitle, { color: c.text }]}>Jurnal</Text>
                <Text style={[styles.quickSub, { color: c.textSecondary }]}>Tulis perasaanmu</Text>
              </View>
              <FontAwesome name="chevron-right" size={12} color={c.textSecondary} />
            </Pressable>

            <Pressable
              onPress={() => router.push('/calm')}
              accessibilityRole="button"
              accessibilityLabel="Masuk ke mode tenang"
              style={({ pressed }) => [
                styles.quickCard,
                { backgroundColor: c.backgroundElevated, opacity: pressed ? 0.82 : 1 },
                shadow.card,
              ]}>
              <LinearGradient
                colors={scheme === 'dark' ? ['#3E5942', '#1E2E1F'] : ['#5D7A62', '#7A9B7D']}
                style={styles.quickIconBg}>
                <FontAwesome name="headphones" size={16} color="#fff" />
              </LinearGradient>
              <View style={styles.quickTextCol}>
                <Text style={[styles.quickTitle, { color: c.text }]}>Tenang</Text>
                <Text style={[styles.quickSub, { color: c.textSecondary }]}>Suara & momen</Text>
              </View>
              <FontAwesome name="chevron-right" size={12} color={c.textSecondary} />
            </Pressable>
          </View>

        </ScrollView>

        <Toast
          visible={toast.visible}
          message={toast.msg}
          onHide={() => setToast((t) => ({ ...t, visible: false }))}
        />
      </LinearGradient>
    </FadeOnFocus>
  );
}

const HERO_H = 380;

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  scroll: {},

  // ── Hero
  hero: {
    height: HERO_H,
    overflow: 'hidden',
    position: 'relative',
  },
  heroTopBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    zIndex: 10,
  },
  brandBadge: {
    backgroundColor: 'rgba(0,0,0,0.28)',
    borderRadius: radius.full,
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  brandBadgeText: {
    fontFamily: fonts.uiSemi,
    fontSize: 10,
    letterSpacing: 2.4,
    color: '#fff',
  },
  heroFavBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(0,0,0,0.28)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroCenter: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 5,
  },
  heroFade: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingTop: 60,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.lg,
    zIndex: 8,
  },
  heroDate: {
    fontFamily: fonts.uiSemi,
    fontSize: 10,
    letterSpacing: 2,
    marginBottom: 6,
  },
  heroGreeting: {
    fontFamily: fonts.display,
    fontSize: 32,
    letterSpacing: -0.4,
    lineHeight: 40,
    marginBottom: 8,
  },
  nameEditRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
  },
  nameEditText: { fontFamily: fonts.uiSemi, fontSize: 13 },

  // ── Welcome banner
  welcomeBanner: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.lg,
    padding: spacing.mlg,
    borderRadius: radius.xl,
    borderWidth: 1,
    gap: spacing.smd,
  },
  welcomeText: { fontFamily: fonts.ui, fontSize: 15, lineHeight: 23 },

  // ── Quote card
  quoteCard: {
    borderRadius: radius.hero,
    paddingTop: spacing.xl + 4,
    paddingHorizontal: spacing.mlg,
    paddingBottom: spacing.mlg,
    overflow: 'hidden',
    marginBottom: spacing.lg,
  },
  quoteAccentBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
  },
  bigQuoteMark: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.mlg,
    fontFamily: fonts.display,
    fontSize: 80,
    lineHeight: 84,
    opacity: 0.06,
  },
  quoteEyebrow: {
    fontFamily: fonts.uiSemi,
    fontSize: 10,
    letterSpacing: 2.2,
    marginBottom: spacing.md,
  },
  quoteText: {
    fontFamily: fonts.display,
    fontSize: 22,
    lineHeight: 34,
    letterSpacing: 0.1,
    marginBottom: spacing.mlg,
    paddingRight: spacing.md,
  },
  categoryChip: {
    alignSelf: 'flex-start',
    paddingVertical: 5,
    paddingHorizontal: 14,
    borderRadius: radius.full,
    marginBottom: spacing.lg,
  },
  categoryChipText: { fontFamily: fonts.uiSemi, fontSize: 12, letterSpacing: 0.5, textTransform: 'capitalize' },
  quoteActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.smd,
    marginBottom: spacing.lg,
  },
  nextQuoteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  nextQuoteDivider: { flex: 1, height: 1, opacity: 0.4 },
  nextQuoteText: { fontFamily: fonts.uiSemi, fontSize: 13, letterSpacing: 0.3 },

  // ── Quick actions
  quickRow: {
    gap: spacing.smd,
  },
  quickCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.mlg,
    borderRadius: radius.xl,
  },
  quickIconBg: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickTextCol: { flex: 1 },
  quickTitle: { fontFamily: fonts.uiSemi, fontSize: 15 },
  quickSub: { fontFamily: fonts.ui, fontSize: 13, marginTop: 2 },
});
