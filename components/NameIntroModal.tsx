import { useState } from 'react';
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
  onSave: (name: string) => void;
  onSkip: () => void;
};

export function NameIntroModal({ visible, onSave, onSkip }: Props) {
  const scheme = useColorScheme() ?? 'light';
  const c = Colors[scheme];
  const [value, setValue] = useState('');

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <KeyboardAvoidingView
        style={[styles.backdrop, { backgroundColor: scheme === 'dark' ? 'rgba(10,14,18,0.72)' : 'rgba(45, 58, 72, 0.42)' }]}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={[styles.card, { backgroundColor: c.backgroundElevated, borderColor: c.blueSoft }]}>
          <Text style={[styles.title, { color: c.text }]}>
            Halo 🌸 — perkenalkan, namaku Quietelle ✨
          </Text>
          <Text style={[styles.body, { color: c.textSecondary }]}>Siapa namamu? 💭🙂</Text>
          <TextInput
            value={value}
            onChangeText={setValue}
            placeholder="Tulis nama panggilanmu…"
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
            accessibilityLabel="Nama panggilanmu"
          />
          <View style={styles.row}>
            <SoftButton
              label="Mulai bareng aku 💛"
              variant="primary"
              onPress={() => onSave(value)}
            />
          </View>
          <Pressable onPress={onSkip} style={styles.skip} accessibilityRole="button" accessibilityLabel="Lewati isi nama">
            <Text style={[styles.skipText, { color: c.zenFocus }]}>Lewati dulu</Text>
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
    fontSize: 24,
    lineHeight: 32,
    textAlign: 'center',
    letterSpacing: -0.2,
  },
  body: {
    fontFamily: fonts.ui,
    fontSize: 17,
    lineHeight: 26,
    textAlign: 'center',
    marginBottom: spacing.sm,
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
  skip: { alignSelf: 'center', paddingVertical: spacing.sm },
  skipText: { fontFamily: fonts.uiSemi, fontSize: 15 },
});
