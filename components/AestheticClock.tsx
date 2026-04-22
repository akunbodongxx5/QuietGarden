import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import { fonts } from '@/constants/typography';
import { spacing } from '@/constants/theme';

type Props = {
  /** heroMode: tampil di atas gambar — pakai warna putih */
  heroMode?: boolean;
};

export function AestheticClock({ heroMode }: Props) {
  const scheme = useColorScheme() ?? 'light';
  const c = Colors[scheme];
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const pad = (n: number) => String(n).padStart(2, '0');
  const hms = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;

  if (heroMode) {
    return (
      <View style={heroStyles.wrap} accessibilityRole="text" accessibilityLabel={`Jam ${hms}`}>
        <Text style={heroStyles.digits}>{hms}</Text>
        <Text style={heroStyles.caption}>waktu lokal kamu</Text>
      </View>
    );
  }

  return (
    <View style={styles.wrap} accessibilityRole="text" accessibilityLabel={`Jam ${hms}`}>
      <Text style={[styles.digits, { color: c.zenFocus }]}>{hms}</Text>
      <Text style={[styles.caption, { color: c.textSecondary }]}>waktu lokal kamu</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'flex-start',
    marginTop: spacing.smd,
    marginBottom: spacing.xl,
    gap: 4,
  },
  digits: {
    fontFamily: fonts.display,
    fontSize: 36,
    letterSpacing: 3,
  },
  caption: {
    fontFamily: fonts.uiMedium,
    fontSize: 12,
    letterSpacing: 0.8,
    opacity: 0.85,
  },
});

const heroStyles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    gap: 6,
  },
  digits: {
    fontFamily: fonts.display,
    fontSize: 52,
    letterSpacing: 4,
    color: '#fff',
    textShadowColor: 'rgba(0,0,0,0.4)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 12,
  },
  caption: {
    fontFamily: fonts.uiMedium,
    fontSize: 12,
    letterSpacing: 1.6,
    color: 'rgba(255,255,255,0.7)',
    textTransform: 'uppercase',
  },
});
