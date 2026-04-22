import { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { SoftButton } from '@/components/SoftButton';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import { radius, spacing } from '@/constants/theme';
import { fonts } from '@/constants/typography';

type Props = {
  visible: boolean;
  initialName: string;
  onClose: () => void;
  onSave: (name: string) => void;
};

export function EditNameModal({ visible, initialName, onClose, onSave }: Props) {
  const scheme = useColorScheme() ?? 'light';
  const c = Colors[scheme];
  const [value, setValue] = useState(initialName);

  useEffect(() => {
    if (visible) setValue(initialName);
  }, [visible, initialName]);

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={[
          styles.backdrop,
          {
            backgroundColor: scheme === 'dark' ? 'rgba(10,14,18,0.72)' : 'rgba(45, 58, 72, 0.42)',
          },
        ]}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={[styles.card, { backgroundColor: c.backgroundElevated, borderColor: c.blueSoft }]}>
          <Text style={[styles.title, { color: c.text }]}>Nama panggilanmu ✨</Text>
          <Text style={[styles.body, { color: c.textSecondary }]}>
            Quietelle akan memanggilmu di sapaan harian 💛
          </Text>
          <TextInput
            value={value}
            onChangeText={setValue}
            placeholder="Contoh: Dinda, Kak, atau nama kamu…"
            placeholderTextColor={c.textSecondary}
            style={[
              styles.input,
              {
                color: c.text,
                borderColor: c.border,
                backgroundColor: c.zenCard,
              },
            ]}
            autoCapitalize="words"
            autoCorrect={false}
            maxLength={32}
            accessibilityLabel="Edit nama panggilan"
          />
          <View style={styles.row}>
            <SoftButton label="Simpan" variant="primary" onPress={() => onSave(value.trim())} />
          </View>
          <View style={styles.secondRow}>
            <SoftButton label="Batal" variant="secondary" onPress={onClose} />
          </View>
          <Pressable
            onPress={() => onSave('')}
            style={styles.clear}
            accessibilityRole="button"
            accessibilityLabel="Hapus nama dari sapaan">
            <Text style={[styles.clearText, { color: c.textSecondary }]}>Hapus nama dari sapaan</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'center',
    padding: spacing.md,
  },
  card: {
    borderRadius: radius.hero,
    padding: spacing.xl,
    borderWidth: 1,
    gap: spacing.md,
    maxWidth: 400,
    alignSelf: 'center',
    width: '100%',
  },
  title: {
    fontFamily: fonts.display,
    fontSize: 22,
    lineHeight: 30,
    textAlign: 'center',
    letterSpacing: -0.2,
  },
  body: {
    fontFamily: fonts.ui,
    fontSize: 15,
    lineHeight: 23,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderRadius: radius.lg,
    paddingVertical: spacing.smd,
    paddingHorizontal: spacing.mlg,
    fontFamily: fonts.uiMedium,
    fontSize: 17,
    marginTop: spacing.xs,
  },
  row: { marginTop: spacing.smd },
  secondRow: { marginTop: spacing.xs },
  clear: { alignSelf: 'center', paddingVertical: spacing.sm },
  clearText: { fontFamily: fonts.ui, fontSize: 13, textDecorationLine: 'underline' },
});
