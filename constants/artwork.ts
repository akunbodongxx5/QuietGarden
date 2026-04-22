/**
 * Foto lembut (Unsplash) — dipakai sebagai aksen, bukan hero penuh.
 * Ukuran dibatasi lewat query untuk performa.
 */

const q = '80';
const fmt = 'auto=format&fit=crop';
/** Memaksa browser tidak memakai gambar URL lama dari cache setelah ganti aset/layout */
const bust = 'cb=4';

export const ARTWORK = {
  /** Aksen alam kecil di Hari ini (bundar) */
  todayNature: `https://images.unsplash.com/photo-1518173946683-a1c7842d0eff?w=400&q=${q}&${fmt}&${bust}`,
  /** Hari ini — bunga / cahaya lembut */
  todayHero: `https://images.unsplash.com/photo-1490750967868-88aa4486c0a5?w=900&q=${q}&${fmt}&${bust}`,
  /** Jurnal — dedaunan / tekstur alam */
  journalHeader: `https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=800&q=${q}&${fmt}&${bust}`,
  /** Tenang — pemandangan tenang */
  calmHeader: `https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=900&q=${q}&${fmt}&${bust}`,
} as const;
