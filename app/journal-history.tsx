import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import { Stack, useRouter } from 'expo-router';
import { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import Colors from '@/constants/Colors';
import { radius, shadow, spacing } from '@/constants/theme';
import { fonts } from '@/constants/typography';
import { formatDateId } from '@/lib/greeting';
import {
  clearJournalEntries,
  deleteJournalEntry,
  loadJournalEntries,
  type JournalEntry,
} from '@/lib/storage';
import { useColorScheme } from '@/components/useColorScheme';

export default function JournalHistoryScreen() {
  const scheme = useColorScheme() ?? 'light';
  const c = Colors[scheme];
  const router = useRouter();
  const navigation = useNavigation();
  const [entries, setEntries] = useState<JournalEntry[]>([]);

  const refresh = useCallback(async () => {
    const list = await loadJournalEntries();
    setEntries(list);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const confirmDeleteOne = useCallback(
    (item: JournalEntry) => {
      // #region agent log
      fetch('http://127.0.0.1:7672/ingest/7b9307eb-4a36-45bc-8461-bcb4180f88ca', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': '01a801' },
        body: JSON.stringify({
          sessionId: '01a801',
          location: 'journal-history.tsx:confirmDeleteOne',
          message: 'confirmDeleteOne called',
          data: { idLen: item.id.length, hypothesisId: 'H5', web: Platform.OS === 'web' },
          timestamp: Date.now(),
        }),
      }).catch(() => {});
      // #endregion
      const runDelete = async () => {
        // #region agent log
        fetch('http://127.0.0.1:7672/ingest/7b9307eb-4a36-45bc-8461-bcb4180f88ca', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': '01a801' },
          body: JSON.stringify({
            sessionId: '01a801',
            location: 'journal-history.tsx:deleteConfirmed',
            message: 'delete confirmed',
            data: { hypothesisId: 'H5', runId: 'post-fix' },
            timestamp: Date.now(),
          }),
        }).catch(() => {});
        // #endregion
        await deleteJournalEntry(item.id);
        await refresh();
      };

      if (Platform.OS === 'web' && typeof window !== 'undefined') {
        if (
          window.confirm('Hapus catatan ini?\n\nTindakan ini tidak bisa dibatalkan.')
        ) {
          void runDelete();
        }
        return;
      }

      Alert.alert(
        'Hapus catatan ini?',
        'Tindakan ini tidak bisa dibatalkan.',
        [
          { text: 'Batal', style: 'cancel' },
          {
            text: 'Hapus',
            style: 'destructive',
            onPress: () => void runDelete(),
          },
        ]
      );
    },
    [refresh]
  );

  const confirmClearAll = useCallback(() => {
    if (entries.length === 0) return;
    const runClear = async () => {
      await clearJournalEntries();
      await refresh();
    };

    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      if (
        window.confirm(
          `Hapus semua riwayat?\n\n${entries.length} catatan akan dihapus permanen.`
        )
      ) {
        void runClear();
      }
      return;
    }

    Alert.alert(
      'Hapus semua riwayat?',
      `${entries.length} catatan akan dihapus permanen.`,
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus semua',
          style: 'destructive',
          onPress: () => void runClear(),
        },
      ]
    );
  }, [entries.length, refresh]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight:
        entries.length > 0
          ? () => (
              <Pressable
                onPress={confirmClearAll}
                accessibilityRole="button"
                accessibilityLabel="Hapus semua riwayat jurnal"
                hitSlop={12}
                style={({ pressed }) => ({ opacity: pressed ? 0.65 : 1, paddingHorizontal: spacing.sm })}>
                <Text style={[styles.headerBtn, { color: c.zenFocus }]}>Hapus semua</Text>
              </Pressable>
            )
          : undefined,
    });
  }, [navigation, entries.length, c.zenFocus, confirmClearAll]);

  return (
    <View style={[styles.root, { backgroundColor: c.background }]}>
      <Stack.Screen
        options={{
          title: 'Riwayat',
          headerShadowVisible: false,
          headerStyle: { backgroundColor: c.background },
          headerTintColor: c.text,
        }}
      />
      <FlatList
        data={entries}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: spacing.xl, paddingHorizontal: spacing.md }}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={[styles.emptyEmoji, { color: c.textSecondary }]}>📝✨</Text>
            <Text style={[styles.emptyTitle, { color: c.text }]}>Belum ada catatan</Text>
            <Text style={[styles.emptyBody, { color: c.textSecondary }]}>
              Mulai dari satu kalimat saja di halaman Jurnal.
            </Text>
            <Pressable onPress={() => router.back()} accessibilityRole="button">
              <Text style={[styles.link, { color: c.zenFocus }]}>Kembali ke Jurnal</Text>
            </Pressable>
          </View>
        }
        renderItem={({ item }) => {
          const d = new Date(item.createdAt);
          return (
            <View
              style={[
                styles.card,
                { backgroundColor: c.backgroundElevated, borderColor: c.border },
                shadow.card,
              ]}>
              <View style={styles.cardTop}>
                <Text style={[styles.date, { color: c.textSecondary }]}>{formatDateId(d)}</Text>
                <Pressable
                  onPress={() => {
                    // #region agent log
                    fetch('http://127.0.0.1:7672/ingest/7b9307eb-4a36-45bc-8461-bcb4180f88ca', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': '01a801' },
                      body: JSON.stringify({
                        sessionId: '01a801',
                        location: 'journal-history.tsx:trashPress',
                        message: 'trash icon pressed',
                        data: { hypothesisId: 'H6' },
                        timestamp: Date.now(),
                      }),
                    }).catch(() => {});
                    // #endregion
                    confirmDeleteOne(item);
                  }}
                  hitSlop={10}
                  accessibilityRole="button"
                  accessibilityLabel="Hapus catatan ini">
                  <FontAwesome name="trash-o" size={20} color={c.zenFocus} />
                </Pressable>
              </View>
              <Text style={[styles.preview, { color: c.text }]} numberOfLines={12}>
                {item.text}
              </Text>
            </View>
          );
        }}
        ItemSeparatorComponent={() => <View style={{ height: spacing.smd }} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  headerBtn: { fontFamily: fonts.uiSemi, fontSize: 15 },
  card: {
    padding: spacing.mlg,
    borderRadius: radius.lg,
    borderWidth: 1,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.smd,
  },
  date: { fontFamily: fonts.uiMedium, fontSize: 13, flex: 1 },
  preview: { fontFamily: fonts.ui, fontSize: 16, lineHeight: 25 },
  empty: {
    paddingVertical: spacing.xl * 2,
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  emptyEmoji: { fontSize: 36, marginBottom: spacing.sm },
  emptyTitle: { fontFamily: fonts.uiSemi, fontSize: 18 },
  emptyBody: {
    fontFamily: fonts.ui,
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 23,
  },
  link: { fontFamily: fonts.uiSemi, fontSize: 16, marginTop: spacing.sm },
});
