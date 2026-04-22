import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { FadeOnFocus } from '@/components/FadeOnFocus';
import { SoftButton } from '@/components/SoftButton';
import { Toast } from '@/components/Toast';
import Colors from '@/constants/Colors';
import { radius, shadow, spacing, tabBarFloatPad } from '@/constants/theme';
import { fonts } from '@/constants/typography';
import {
  pickStarterSentences,
  useWritingPlaceholder,
  type JournalMoodSelection,
  type JournalSceneSelection,
} from '@/lib/writingPlaceholders';
import { loadJournalEntries, saveJournalEntries, type JournalEntry } from '@/lib/storage';
import { useColorScheme } from '@/components/useColorScheme';
import { WritingHelpModal } from '@/components/WritingHelpModal';
import type { WritingMoodId, WritingSceneId } from '@/constants/writingPlaceholders';

const DEFAULT_PROMPT = 'Apa yang kamu rasakan hari ini?';
const REFLECT_PROMPT = 'Setelah membaca kutipan: apa yang muncul di benakmu?';

const MOOD_CHIPS: { id: WritingMoodId; label: string; emoji: string; color: string }[] = [
  { id: 'sad',          label: 'Sedih',         emoji: '🌧',  color: '#6B7FA8' },
  { id: 'calm',         label: 'Tenang',         emoji: '🍃',  color: '#5D7A62' },
  { id: 'overthinking', label: 'Banyak pikiran', emoji: '💭',  color: '#8A6B9A' },
];

const SCENE_CHIPS: { id: WritingSceneId; label: string; emoji: string; color: string }[] = [
  { id: 'rain',   label: 'Hujan',    emoji: '🌧', color: '#5A7A9A' },
  { id: 'sunset', label: 'Senja',    emoji: '🌅', color: '#B87A4A' },
  { id: 'room',   label: 'Ruangan',  emoji: '🕯',  color: '#8A6B50' },
];

export default function JournalScreen() {
  const insets = useSafeAreaInsets();
  const scheme = useColorScheme() ?? 'light';
  const c = Colors[scheme];
  const router = useRouter();
  const params = useLocalSearchParams<{ reflect?: string }>();

  const [text, setText] = useState('');
  const [prompt, setPrompt] = useState(DEFAULT_PROMPT);
  const [toast, setToast] = useState({ visible: false, msg: '' });
  const [mood, setMood] = useState<JournalMoodSelection>(null);
  const [scene, setScene] = useState<JournalSceneSelection>(null);
  const [helpOpen, setHelpOpen] = useState(false);

  const dynamicPlaceholder = useWritingPlaceholder(scene, mood);
  const helpStarters = useMemo(() => pickStarterSentences(scene, mood, 5), [scene, mood, helpOpen]);

  useEffect(() => {
    if (params.reflect === '1') setPrompt(REFLECT_PROMPT);
    else setPrompt(DEFAULT_PROMPT);
  }, [params.reflect]);

  const toggleMood = useCallback((id: WritingMoodId) => setMood((m) => (m === id ? null : id)), []);
  const toggleScene = useCallback((id: WritingSceneId) => setScene((s) => (s === id ? null : id)), []);

  const applyStarterLine = useCallback((line: string) => {
    setText((prev) => {
      const t = prev.trim();
      return !t ? line : `${t}\n\n${line}`;
    });
  }, []);

  const save = useCallback(async () => {
    const trimmed = text.trim();
    if (!trimmed) { setToast({ visible: true, msg: 'Tulis sedikit saja dulu, lalu simpan.' }); return; }
    const entries = await loadJournalEntries();
    const next: JournalEntry = { id: `${Date.now()}`, createdAt: new Date().toISOString(), text: trimmed };
    await saveJournalEntries([next, ...entries]);
    setText('');
    setToast({ visible: true, msg: 'Jurnal tersimpan.' });
  }, [text]);

  // Notebook background: warm dark in dark mode, warm light in light mode
  const notebookBg    = scheme === 'dark' ? '#1E1A16' : '#FBF5E8';
  const notebookLine  = scheme === 'dark' ? 'rgba(90,173,167,0.08)' : 'rgba(42,100,96,0.07)';
  const notebookText  = scheme === 'dark' ? '#E8E0D4' : '#2A221C';
  const bgGradient =
    scheme === 'dark'
      ? (['#1A1815', '#1E1C19', '#252220'] as const)
      : (['#EDE5D8', '#F0EBE0', '#F5EFE4'] as const);

  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;

  return (
    <FadeOnFocus>
      <LinearGradient colors={[...bgGradient]} style={styles.gradient}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={insets.top}>
          <ScrollView
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{
              paddingTop: insets.top + spacing.md,
              paddingBottom: tabBarFloatPad + spacing.xl,
            }}
            showsVerticalScrollIndicator={false}>

            {/* ── HEADER ──────────────────────────────────────── */}
            <View style={[styles.header, { paddingHorizontal: spacing.md }]}>
              <View>
                <Text style={[styles.headerEyebrow, { color: c.zenFocus }]}>QUIET GARDEN</Text>
                <Text style={[styles.headerTitle, { color: c.text }]}>Jurnal</Text>
              </View>
              <View style={styles.headerActions}>
                <Pressable
                  onPress={() => router.push('/journal-history')}
                  hitSlop={12}
                  accessibilityRole="button"
                  accessibilityLabel="Riwayat jurnal"
                  style={({ pressed }) => [styles.iconBtn, { backgroundColor: c.backgroundElevated, opacity: pressed ? 0.7 : 1 }, shadow.card]}>
                  <FontAwesome name="clock-o" size={18} color={c.zenFocus} />
                </Pressable>
                <Link href="/favorites" asChild>
                  <Pressable
                    hitSlop={12}
                    accessibilityRole="button"
                    accessibilityLabel="Favorit"
                    style={({ pressed }) => [styles.iconBtn, { backgroundColor: c.backgroundElevated, opacity: pressed ? 0.7 : 1 }, shadow.card]}>
                    <FontAwesome name="heart" size={17} color={c.accent} />
                  </Pressable>
                </Link>
              </View>
            </View>

            {/* ── PROMPT CARD ─────────────────────────────────── */}
            <View style={{ paddingHorizontal: spacing.md }}>
              <View style={[styles.promptCard, { backgroundColor: c.backgroundElevated }, shadow.card]}>
                <LinearGradient
                  colors={scheme === 'dark' ? ['#2A6460', '#3E8A84'] : ['#2A6460', '#4A8A84']}
                  start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                  style={styles.promptAccent}
                />
                <Text style={[styles.promptText, { color: c.text }]}>{prompt}</Text>
                <Text style={[styles.promptHint, { color: c.textSecondary }]}>
                  Cukup satu kalimat — tidak perlu sempurna.
                </Text>
              </View>
            </View>

            {/* ── CHIPS SECTION ───────────────────────────────── */}
            <View style={[styles.chipsSection, { paddingHorizontal: spacing.md }]}>
              <Text style={[styles.chipGroupLabel, { color: c.textSecondary }]}>Adegan</Text>
              <View style={styles.chipsRow}>
                {SCENE_CHIPS.map(({ id, label, emoji, color }) => {
                  const on = scene === id;
                  return (
                    <Pressable
                      key={id}
                      onPress={() => toggleScene(id)}
                      accessibilityRole="button"
                      accessibilityState={{ selected: on }}
                      accessibilityLabel={`Adegan ${label}`}
                      style={[
                        styles.chip,
                        {
                          backgroundColor: on ? color + '22' : c.backgroundElevated,
                          borderColor: on ? color : c.border,
                          borderWidth: on ? 1.5 : 1,
                        },
                      ]}>
                      <Text style={styles.chipEmoji}>{emoji}</Text>
                      <Text style={[styles.chipLabel, { color: on ? color : c.text }]}>{label}</Text>
                    </Pressable>
                  );
                })}
              </View>

              <Text style={[styles.chipGroupLabel, { color: c.textSecondary }]}>Suasana hati</Text>
              <View style={styles.chipsRow}>
                {MOOD_CHIPS.map(({ id, label, emoji, color }) => {
                  const on = mood === id;
                  return (
                    <Pressable
                      key={id}
                      onPress={() => toggleMood(id)}
                      accessibilityRole="button"
                      accessibilityState={{ selected: on }}
                      accessibilityLabel={`Suasana ${label}`}
                      style={[
                        styles.chip,
                        {
                          backgroundColor: on ? color + '22' : c.backgroundElevated,
                          borderColor: on ? color : c.border,
                          borderWidth: on ? 1.5 : 1,
                        },
                      ]}>
                      <Text style={styles.chipEmoji}>{emoji}</Text>
                      <Text style={[styles.chipLabel, { color: on ? color : c.text }]}>{label}</Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            {/* ── NOTEBOOK INPUT ──────────────────────────────── */}
            <View style={{ paddingHorizontal: spacing.md }}>
              <View style={[styles.notebook, { backgroundColor: notebookBg }, shadow.zen]}>
                {/* Notebook header bar */}
                <View style={[styles.notebookHeader, { borderBottomColor: notebookLine }]}>
                  <View style={[styles.notebookDot, { backgroundColor: c.zenFocus + '60' }]} />
                  <View style={[styles.notebookDot, { backgroundColor: c.zenFocus + '40' }]} />
                  <View style={[styles.notebookDot, { backgroundColor: c.zenFocus + '25' }]} />
                  <View style={{ flex: 1 }} />
                  <Pressable
                    onPress={() => setHelpOpen(true)}
                    accessibilityRole="button"
                    accessibilityLabel="Bantuan menulis"
                    style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}>
                    <Text style={[styles.helpLink, { color: c.zenFocus }]}>Butuh bantuan?</Text>
                  </Pressable>
                </View>

                {/* Lines simulation */}
                {Array.from({ length: 10 }).map((_, i) => (
                  <View
                    key={i}
                    style={[
                      styles.notebookLine,
                      { top: 68 + i * 32, backgroundColor: notebookLine },
                    ]}
                    pointerEvents="none"
                  />
                ))}

                <TextInput
                  value={text}
                  onChangeText={setText}
                  placeholder={dynamicPlaceholder}
                  placeholderTextColor={scheme === 'dark' ? '#5A5248' : '#B0A898'}
                  multiline
                  textAlignVertical="top"
                  accessibilityLabel={`${prompt} Bidang tulis jurnal`}
                  style={[
                    styles.notebookInput,
                    { color: notebookText, fontFamily: fonts.display },
                  ]}
                />

                {/* Footer */}
                <View style={[styles.notebookFooter, { borderTopColor: notebookLine }]}>
                  <Text style={[styles.wordCount, { color: c.textSecondary }]}>
                    {text.length === 0 ? 'Mulai menulis…' : `${wordCount} kata · ${text.length} karakter`}
                  </Text>
                  <View style={[styles.penIndicator, { backgroundColor: c.zenFocus + '30' }]}>
                    <FontAwesome name="pencil" size={11} color={c.zenFocus} />
                  </View>
                </View>
              </View>
            </View>

            {/* ── SAVE BUTTON ─────────────────────────────────── */}
            <View style={[styles.saveWrap, { paddingHorizontal: spacing.md }]}>
              <SoftButton label="Simpan catatan" variant="primary" onPress={save} />
            </View>

          </ScrollView>

          <Toast
            visible={toast.visible}
            message={toast.msg}
            onHide={() => setToast((t) => ({ ...t, visible: false }))}
          />

          <WritingHelpModal
            visible={helpOpen}
            title="Kalimat pembuka"
            starters={helpStarters}
            onClose={() => setHelpOpen(false)}
            onPick={applyStarterLine}
          />
        </KeyboardAvoidingView>
      </LinearGradient>
    </FadeOnFocus>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: spacing.mlg,
  },
  headerEyebrow: { fontFamily: fonts.uiSemi, fontSize: 10, letterSpacing: 2.2, textTransform: 'uppercase', marginBottom: 4 },
  headerTitle: { fontFamily: fonts.display, fontSize: 34, letterSpacing: -0.3, lineHeight: 42 },
  headerActions: { flexDirection: 'row', gap: spacing.sm, paddingBottom: 6 },
  iconBtn: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center' },

  // Prompt card
  promptCard: {
    borderRadius: radius.xl,
    padding: spacing.mlg,
    paddingTop: spacing.mlg + 4,
    marginBottom: spacing.mlg,
    overflow: 'hidden',
  },
  promptAccent: { position: 'absolute', top: 0, left: 0, right: 0, height: 3 },
  promptText: { fontFamily: fonts.uiSemi, fontSize: 17, lineHeight: 26, marginBottom: spacing.xs },
  promptHint: { fontFamily: fonts.ui, fontSize: 13, lineHeight: 20 },

  // Chips
  chipsSection: { marginBottom: spacing.mlg },
  chipGroupLabel: { fontFamily: fonts.uiSemi, fontSize: 10, letterSpacing: 1.8, textTransform: 'uppercase', marginBottom: spacing.sm },
  chipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.md },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 9, paddingHorizontal: spacing.md, borderRadius: radius.full },
  chipEmoji: { fontSize: 15 },
  chipLabel: { fontFamily: fonts.uiSemi, fontSize: 13 },

  // Notebook input
  notebook: {
    borderRadius: radius.hero,
    overflow: 'hidden',
    marginBottom: spacing.lg,
    position: 'relative',
  },
  notebookHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: spacing.mlg,
    paddingVertical: spacing.smd,
    borderBottomWidth: 1,
  },
  notebookDot: { width: 10, height: 10, borderRadius: 5 },
  helpLink: { fontFamily: fonts.uiSemi, fontSize: 13 },
  notebookLine: {
    position: 'absolute',
    left: spacing.mlg,
    right: spacing.mlg,
    height: 1,
  },
  notebookInput: {
    minHeight: 280,
    padding: spacing.mlg,
    paddingTop: spacing.md,
    fontSize: 18,
    lineHeight: 32,
    zIndex: 1,
  },
  notebookFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.mlg,
    paddingVertical: spacing.sm,
    borderTopWidth: 1,
  },
  wordCount: { fontFamily: fonts.ui, fontSize: 12 },
  penIndicator: { width: 26, height: 26, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },

  // Save
  saveWrap: {},
});
