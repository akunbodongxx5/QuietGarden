import Svg, { Circle, Ellipse } from 'react-native-svg';

type Props = {
  /** Figur kiri */
  colorA: string;
  /** Figur kanan */
  colorB: string;
  width?: number;
};

/** Dua sosok kartun sangat sederhana — bulat lembut, non-realistis, ramah */
export function GentleFigures({ colorA, colorB, width = 132 }: Props) {
  const h = width * 0.48;
  return (
    <Svg width={width} height={h} viewBox="0 0 140 68" accessibilityLabel="Ilustrasi teman">
      <Circle cx="34" cy="22" r="13" fill={colorA} opacity={0.92} />
      <Ellipse cx="34" cy="48" rx="17" ry="21" fill={colorA} opacity={0.48} />
      <Circle cx="106" cy="22" r="13" fill={colorB} opacity={0.92} />
      <Ellipse cx="106" cy="48" rx="17" ry="21" fill={colorB} opacity={0.48} />
    </Svg>
  );
}
