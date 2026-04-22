import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Colors from '@/constants/Colors';
import { radius, spacing } from '@/constants/theme';
import { fonts } from '@/constants/typography';
import { useColorScheme } from '@/components/useColorScheme';

type Props = {
  visible: boolean;
  title: string;
  starters: string[];
  onPick: (sentence: string) => void;
  onClose: () => void;
};

export function WritingHelpModal({ visible, title, starters, onPick, onClose }: Props) {
  const insets = useSafeAreaInsets();
  const scheme = useColorScheme() ?? 'light';
  const c = Colors[scheme];

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose} accessibilityLabel="Tutup">
        <Pressable
          style={[
            styles.sheet,
            {
              paddingBottom: Math.max(insets.bottom, spacing.md) + spacing.sm,
              backgroundColor: c.backgroundElevated,
              borderColor: c.border,
            },
          ]}
          onPress={(e) => e.stopPropagation()}>
          <View style={[styles.handle, { backgroundColor: c.border }]} />
          <Text style={[styles.title, { color: c.text }]}>{title}</Text>
          <Text style={[styles.sub, { color: c.textSecondary }]}>
            Pilih satu untuk mengisi kolom — teks yang sudah ada tidak akan dihapus.
          </Text>
          <ScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            style={styles.list}>
            {starters.map((line, i) => (
              <Pressable
                key={`${i}-${line.slice(0, 24)}`}
                onPress={() => {
                  onPick(line);
                  onClose();
                }}
                style={({ pressed }) => [
                  styles.row,
                  {
                    backgroundColor: pressed ? c.blueWash : c.background,
                    borderColor: c.border,
                  },
                ]}
                accessibilityRole="button"
                accessibilityLabel={`Gunakan kalimat: ${line}`}>
                <Text style={[styles.rowText, { color: c.text }]} numberOfLines={3}>
                  {line}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
          <Pressable
            onPress={onClose}
            style={({ pressed }) => [styles.closeBtn, { opacity: pressed ? 0.75 : 1 }]}
            accessibilityRole="button"
            accessibilityLabel="Tutup bantuan">
            <Text style={[styles.closeLabel, { color: c.zenFocus }]}>Tutup</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(45, 48, 52, 0.45)',
  },
  sheet: {
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    borderWidth: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    maxHeight: '72%',
  },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    marginBottom: spacing.md,
  },
  title: {
    fontFamily: fonts.uiSemi,
    fontSize: 18,
    marginBottom: spacing.xs,
  },
  sub: {
    fontFamily: fonts.ui,
    fontSize: 14,
    lineHeight: 21,
    marginBottom: spacing.md,
  },
  list: { maxHeight: 360 },
  row: {
    borderWidth: 1,
    borderRadius: radius.md,
    paddingVertical: spacing.mlg,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  rowText: {
    fontFamily: fonts.ui,
    fontSize: 16,
    lineHeight: 24,
  },
  closeBtn: {
    alignSelf: 'center',
    paddingVertical: spacing.md,
  },
  closeLabel: {
    fontFamily: fonts.uiSemi,
    fontSize: 16,
  },
});
