import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, Text, View, type ViewStyle } from 'react-native';

import Colors from '@/constants/Colors';
import { radius, shadow, spacing } from '@/constants/theme';
import { fonts } from '@/constants/typography';
import { useColorScheme } from '@/components/useColorScheme';

type Variant = 'primary' | 'secondary' | 'ghost';

type Props = {
  label: string;
  onPress: () => void;
  variant?: Variant;
  disabled?: boolean;
  style?: ViewStyle;
  accessibilityLabel?: string;
};

export function SoftButton({
  label,
  onPress,
  variant = 'primary',
  disabled,
  style,
  accessibilityLabel,
}: Props) {
  const scheme = useColorScheme() ?? 'light';
  const c = Colors[scheme];

  const fg = variant === 'primary' ? '#FCFAF8' : variant === 'secondary' ? c.zenFocus : c.zenFocus;
  const borderColor = variant === 'ghost' ? c.blueSoft : 'transparent';
  const borderWidth = variant === 'ghost' ? 1.5 : 0;

  const gradientColors: [string, string] =
    scheme === 'dark'
      ? ['#6A94B0', '#4A6B84']
      : ['#6A94B0', '#4A6678'];

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        {
          borderWidth,
          borderColor,
          opacity: disabled ? 0.45 : pressed ? 0.88 : 1,
          transform: [{ scale: pressed ? 0.975 : 1 }],
          backgroundColor:
            variant === 'secondary' ? c.blueWash : 'transparent',
        },
        variant === 'primary' ? shadow.card : null,
        style,
      ]}>
      {variant === 'primary' ? (
        <LinearGradient
          colors={gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[StyleSheet.absoluteFill, { borderRadius: radius.full }]}
        />
      ) : null}
      <Text style={[styles.label, { color: fg }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: spacing.smd,
    paddingHorizontal: spacing.mlg + 4,
    borderRadius: radius.full,
    minHeight: 46,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  label: {
    fontFamily: fonts.uiSemi,
    fontSize: 15,
    letterSpacing: 0.4,
  },
});
