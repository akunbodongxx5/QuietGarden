import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text } from 'react-native';

import Colors from '@/constants/Colors';
import { motion } from '@/constants/theme';
import { fonts } from '@/constants/typography';
import { useColorScheme } from '@/components/useColorScheme';

type Props = {
  message: string;
  visible: boolean;
  onHide?: () => void;
};

export function Toast({ message, visible, onHide }: Props) {
  const opacity = useRef(new Animated.Value(0)).current;
  const scheme = useColorScheme() ?? 'light';
  const c = Colors[scheme];

  useEffect(() => {
    if (!visible || !message) {
      opacity.setValue(0);
      return;
    }
    Animated.timing(opacity, {
      toValue: 1,
      duration: motion.fadeMs * 0.6,
      useNativeDriver: true,
    }).start();
    const t = setTimeout(() => {
      Animated.timing(opacity, {
        toValue: 0,
        duration: motion.fadeMs * 0.6,
        useNativeDriver: true,
      }).start(() => onHide?.());
    }, 2400);
    return () => clearTimeout(t);
  }, [visible, message, opacity, onHide]);

  if (!visible || !message) return null;

  return (
    <Animated.View style={[styles.wrap, { opacity, pointerEvents: 'none' }]}>
      <Text style={[styles.text, { color: c.text, backgroundColor: c.backgroundElevated }]}>{message}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    bottom: 100,
    left: 24,
    right: 24,
    alignItems: 'center',
    zIndex: 50,
  },
  text: {
    fontFamily: fonts.uiMedium,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    overflow: 'hidden',
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
});
