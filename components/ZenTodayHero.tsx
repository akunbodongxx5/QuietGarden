import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, View } from 'react-native';

import { GentleFigures } from '@/components/GentleFigures';
import { RemoteImage } from '@/components/RemoteImage';
import { useColorScheme } from '@/components/useColorScheme';
import { ARTWORK } from '@/constants/artwork';
import Colors from '@/constants/Colors';
import { radius, spacing } from '@/constants/theme';

const HERO_H = 248;

/**
 * Foto alam lebar + figur kartun di tepi — beda dari layout “kartu kecil” sebelumnya.
 */
export function ZenTodayHero() {
  const scheme = useColorScheme() ?? 'light';
  const c = Colors[scheme];
  const fade =
    scheme === 'dark'
      ? (['transparent', 'rgba(20,26,34,0.2)', 'rgba(42,47,52,0.55)', c.background] as const)
      : (['transparent', 'rgba(255,252,249,0.1)', 'rgba(237,243,247,0.5)', c.background] as const);

  return (
    <View style={styles.bleed} accessibilityElementsHidden>
      <View style={[styles.frame, { backgroundColor: c.blueWash }]}>
        <RemoteImage
          uri={ARTWORK.todayHero}
          style={styles.heroImg}
          contentFit="cover"
          transition={360}
          recyclingKey={ARTWORK.todayHero}
        />
        <LinearGradient colors={fade} locations={[0, 0.4, 0.78, 1]} style={StyleSheet.absoluteFill} />
        <View style={styles.figures}>
          <GentleFigures colorA={c.blueSoft} colorB={c.sage} width={176} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bleed: {
    marginHorizontal: -spacing.md,
    marginBottom: spacing.lg,
  },
  frame: {
    position: 'relative',
    height: HERO_H,
    borderBottomLeftRadius: radius.hero,
    borderBottomRightRadius: radius.hero,
    overflow: 'hidden',
  },
  heroImg: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  figures: {
    position: 'absolute',
    bottom: 4,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
});
