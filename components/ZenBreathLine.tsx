import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View } from 'react-native';

import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import { spacing } from '@/constants/theme';
import { fonts } from '@/constants/typography';

/** Garis napas halus — menggantikan strip blob agar lebih “zen” dan beda feel */
export function ZenBreathLine() {
  const scheme = useColorScheme() ?? 'light';
  const c = Colors[scheme];
  const edge =
    scheme === 'dark' ? 'rgba(168,188,200,0)' : 'rgba(92,122,142,0)';
  const mid = scheme === 'dark' ? 'rgba(168,188,200,0.45)' : 'rgba(92,122,142,0.35)';

  return (
    <View style={styles.wrap} accessibilityElementsHidden>
      <LinearGradient
        colors={[edge, mid, edge]}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={styles.line}
      />
      <View style={styles.dots}>
        <View style={[styles.dot, { backgroundColor: c.blueSoft }]} />
        <View style={[styles.dot, { backgroundColor: c.sage }]} />
        <View style={[styles.dot, { backgroundColor: c.accent }]} />
      </View>
      <Text style={[styles.cute, { color: c.textSecondary }]}>tarik napas pelan… 🌙✨</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    marginBottom: spacing.xl,
    gap: spacing.smd,
  },
  cute: {
    fontFamily: fonts.uiMedium,
    fontSize: 13,
    letterSpacing: 0.4,
    opacity: 0.9,
  },
  line: {
    width: '78%',
    height: 2,
    borderRadius: 2,
  },
  dots: {
    flexDirection: 'row',
    gap: 8,
    opacity: 0.85,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
});
