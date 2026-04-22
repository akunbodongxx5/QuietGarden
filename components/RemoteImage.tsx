import { Image as ExpoImage, type ImageContentFit } from 'expo-image';
import { Platform, StyleSheet, View, type ImageStyle, type StyleProp } from 'react-native';

type Props = {
  uri: string;
  style?: StyleProp<ImageStyle>;
  contentFit?: ImageContentFit;
  recyclingKey?: string;
  transition?: number;
  accessibilityElementsHidden?: boolean;
};

function bgSizeFromFit(fit: ImageContentFit | undefined): string {
  switch (fit) {
    case 'contain':
      return 'contain';
    case 'fill':
      return '100% 100%';
    case 'none':
      return 'auto';
    case 'scale-down':
      return 'contain';
    default:
      return 'cover';
  }
}

/**
 * Gambar remote:
 * - **Web**: `View` + `backgroundImage` (RN Web) — lebih stabil daripada `<img>` + flatten style untuk URL Unsplash.
 * - **Native**: `expo-image`.
 */
export function RemoteImage({
  uri,
  style,
  contentFit = 'cover',
  recyclingKey,
  transition,
  accessibilityElementsHidden,
}: Props) {
  if (Platform.OS === 'web') {
    const bgSize = bgSizeFromFit(contentFit);
    const cssUrl = `url(${JSON.stringify(uri)})`;
    return (
      <View
        accessibilityElementsHidden={accessibilityElementsHidden}
        style={[
          style,
          {
            backgroundImage: cssUrl,
            backgroundSize: bgSize,
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          },
        ]}
      />
    );
  }
  return (
    <ExpoImage
      source={{ uri }}
      style={style}
      contentFit={contentFit}
      recyclingKey={recyclingKey ?? uri}
      transition={transition}
      accessibilityElementsHidden={accessibilityElementsHidden}
    />
  );
}
