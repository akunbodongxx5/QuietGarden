import Colors from '@/constants/Colors';

export const spacing = {
  xs: 4,
  sm: 8,
  smd: 12,
  md: 16,
  mlg: 20,
  lg: 24,
  xl: 32,
  xxl: 40,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  /** Sudut besar untuk hero / kartu editorial */
  hero: 28,
  full: 9999,
} as const;

/** Padding bawah konten tab saat tab bar mengambang (aman area + ruang) */
export const tabBarFloatPad = 96;

/** Slow, calm transitions */
export const motion = {
  fadeMs: 380,
  pressMs: 180,
  tabMs: 240,
} as const;

/** Shared card shadow for a consistent premium surface feel. */
export const shadow = {
  /** Bayangan seperti kertas tebal — sangat pelan */
  card: {
    shadowColor: '#3D3429',
    shadowOpacity: 0.06,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  /** Aksen biru-kelabu — kartu & tab mengambang */
  zen: {
    shadowColor: '#3D5A78',
    shadowOpacity: 0.1,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 4,
  },
} as const;

export function useQuietColors(scheme: 'light' | 'dark' = 'light') {
  return Colors[scheme];
}
