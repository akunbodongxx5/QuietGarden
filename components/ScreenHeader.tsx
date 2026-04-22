import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import { spacing } from '@/constants/theme';
import { fonts } from '@/constants/typography';

type Props = {
  title: string;
  eyebrow?: string;
  right?: ReactNode;
};

export function ScreenHeader({ title, eyebrow = 'Quiet Garden', right }: Props) {
  const scheme = useColorScheme() ?? 'light';
  const c = Colors[scheme];

  return (
    <View style={styles.row}>
      <View style={styles.textCol}>
        <Text style={[styles.eyebrow, { color: c.zenFocus }]}>{eyebrow.toUpperCase()}</Text>
        <Text style={[styles.title, { color: c.text }]}>{title}</Text>
      </View>
      {right ? <View style={styles.right}>{right}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginBottom: spacing.mlg,
    gap: spacing.md,
  },
  textCol: { flex: 1 },
  right: { paddingBottom: 6 },
  eyebrow: {
    fontFamily: fonts.uiSemi,
    fontSize: 10,
    letterSpacing: 2.4,
    marginBottom: 4,
    opacity: 0.9,
  },
  title: {
    fontFamily: fonts.display,
    fontSize: 34,
    letterSpacing: -0.3,
    lineHeight: 42,
  },
});
