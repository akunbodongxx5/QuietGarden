import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, View } from 'react-native';

import { RemoteImage } from '@/components/RemoteImage';
import { radius, spacing } from '@/constants/theme';

const R = radius.hero;

type Props = {
  uri: string;
  height?: number;
  scheme: 'light' | 'dark';
};

/**
 * Banner foto lembut + fade ke background — supaya warna hidup tanpa mendominasi.
 */
export function SoftImageBanner({ uri, height = 152, scheme }: Props) {
  const fade =
    scheme === 'dark'
      ? (['transparent', 'rgba(42,47,52,0.9)'] as const)
      : (['transparent', 'rgba(250,248,245,0.93)'] as const);

  const baseBg = scheme === 'dark' ? '#323940' : '#D8E4EE';

  return (
    <View style={[styles.wrap, { height, backgroundColor: baseBg }]} accessibilityElementsHidden>
      <RemoteImage
        uri={uri}
        style={styles.img}
        contentFit="cover"
        transition={280}
        recyclingKey={uri}
      />
      <LinearGradient colors={fade} style={StyleSheet.absoluteFill} />
    </View>
  );
}

const styles = StyleSheet.create({
  /** Tanpa shadow — hindari kesan “kotak kartu” saat foto belum terlihat */
  wrap: {
    position: 'relative',
    borderRadius: R,
    overflow: 'hidden',
    width: '100%',
    marginBottom: spacing.md,
  },
  img: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
});
