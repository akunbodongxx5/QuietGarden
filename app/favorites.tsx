import { Stack, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import { RemoteImage } from '@/components/RemoteImage';
import Colors from '@/constants/Colors';
import { radius, shadow, spacing } from '@/constants/theme';
import { fonts } from '@/constants/typography';
import { QUOTES } from '@/data/quotes';
import { STORIES } from '@/data/stories';
import { useFavorites } from '@/hooks/useFavorites';
import { useColorScheme } from '@/components/useColorScheme';

type Tab = 'quotes' | 'stories';

export default function FavoritesScreen() {
  const scheme = useColorScheme() ?? 'light';
  const c = Colors[scheme];
  const router = useRouter();
  const { quoteIds, storyIds, ready } = useFavorites();
  const [tab, setTab] = useState<Tab>('quotes');

  const quoteItems = useMemo(
    () => quoteIds.map((id) => QUOTES.find((q) => q.id === id)).filter(Boolean) as typeof QUOTES,
    [quoteIds]
  );
  const storyItems = useMemo(
    () => storyIds.map((id) => STORIES.find((s) => s.id === id)).filter(Boolean) as typeof STORIES,
    [storyIds]
  );

  return (
    <View style={[styles.root, { backgroundColor: c.background }]}>
      <Stack.Screen
        options={{
          headerShadowVisible: false,
          headerStyle: { backgroundColor: c.background },
          headerTintColor: c.text,
        }}
      />

      <View style={[styles.segment, { backgroundColor: c.wash }]}>
        <Pressable
          onPress={() => setTab('quotes')}
          style={[
            styles.segBtn,
            tab === 'quotes' && { backgroundColor: c.backgroundElevated },
            { borderColor: c.border },
          ]}
          accessibilityRole="button"
          accessibilityState={{ selected: tab === 'quotes' }}>
          <Text style={[styles.segText, { color: c.text }]}>Kutipan</Text>
        </Pressable>
        <Pressable
          onPress={() => setTab('stories')}
          style={[
            styles.segBtn,
            tab === 'stories' && { backgroundColor: c.backgroundElevated },
            { borderColor: c.border },
          ]}
          accessibilityRole="button"
          accessibilityState={{ selected: tab === 'stories' }}>
          <Text style={[styles.segText, { color: c.text }]}>Cerita</Text>
        </Pressable>
      </View>

      {!ready ? (
        <Text style={{ fontFamily: fonts.ui, color: c.textSecondary, padding: spacing.md }}>Memuat…</Text>
      ) : tab === 'quotes' ? (
        <FlatList
          data={quoteItems}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: spacing.md, paddingBottom: spacing.xl, flexGrow: 1 }}
          ListEmptyComponent={
            <Text style={[styles.empty, { color: c.textSecondary }]}>
              Belum ada kutipan favorit. Sentuh &quot;Simpan&quot; di halaman Hari ini.
            </Text>
          }
          renderItem={({ item }) => (
            <View style={[styles.quoteCard, { borderColor: c.border, backgroundColor: c.backgroundElevated }]}>
              <Text style={[styles.quoteText, { color: c.text }]}>&ldquo;{item.text}&rdquo;</Text>
              <Text style={[styles.meta, { color: c.textSecondary }]}>{item.category}</Text>
            </View>
          )}
          ItemSeparatorComponent={() => <View style={{ height: spacing.sm }} />}
        />
      ) : (
        <FlatList
          data={storyItems}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: spacing.md, paddingBottom: spacing.xl, flexGrow: 1 }}
          ListEmptyComponent={
            <Text style={[styles.empty, { color: c.textSecondary }]}>
              Belum ada cerita favorit. Sentuh ikon hati di daftar Cerita.
            </Text>
          }
          renderItem={({ item }) => (
            <Pressable
              onPress={() => router.push(`/story/${item.id}`)}
              style={[styles.storyRow, { borderColor: c.border, backgroundColor: c.backgroundElevated }]}>
              <View style={styles.storyThumbWrap}>
                <RemoteImage
                  uri={item.coverUrl}
                  style={styles.storyThumb}
                  contentFit="cover"
                  transition={220}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.storyTitle, { color: c.text }]}>{item.title}</Text>
                <Text style={[styles.meta, { color: c.zenFocus }]}>{item.category}</Text>
              </View>
            </Pressable>
          )}
          ItemSeparatorComponent={() => <View style={{ height: spacing.sm }} />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  segment: {
    flexDirection: 'row',
    marginHorizontal: spacing.md,
    marginBottom: spacing.smd,
    padding: 4,
    borderRadius: radius.md,
    gap: 4,
  },
  segBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: radius.sm,
    borderWidth: 1,
    alignItems: 'center',
  },
  segText: { fontFamily: fonts.uiSemi, fontSize: 15 },
  quoteCard: {
    padding: spacing.mlg,
    borderRadius: radius.lg,
    borderWidth: 1,
    ...shadow.card,
  },
  quoteText: { fontFamily: fonts.display, fontSize: 18, lineHeight: 29 },
  meta: { fontFamily: fonts.ui, marginTop: spacing.sm, fontSize: 13 },
  storyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.smd,
    padding: spacing.mlg,
    borderRadius: radius.lg,
    borderWidth: 1,
    ...shadow.card,
  },
  storyThumbWrap: {
    width: 56,
    height: 56,
    borderRadius: radius.md,
    overflow: 'hidden',
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  storyThumb: { width: '100%', height: '100%' },
  storyTitle: { fontFamily: fonts.uiSemi, fontSize: 18 },
  empty: { fontFamily: fonts.ui, padding: spacing.lg, fontSize: 15, lineHeight: 23 },
});
