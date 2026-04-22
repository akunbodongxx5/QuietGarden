export type SoftMoment = {
  id: string;
  text: string;
  category: string;
};

export const SOFT_MOMENTS: SoftMoment[] = [
  { id: 'm1', text: 'Duduk tanpa distraksi selama 2 menit — hanya napas dan ruang di sekitarmu.', category: 'hadir' },
  { id: 'm2', text: 'Lihat langit sore sejenak, tanpa perlu mengabadikannya.', category: 'alam' },
  { id: 'm3', text: 'Dengarkan satu lagu pelan, volume rendah, tanpa melakukan hal lain.', category: 'suara' },
  { id: 'm4', text: 'Minum sesuatu yang hangat dan rasakan suhunya perlahan.', category: 'tubuh' },
  { id: 'm5', text: 'Tulis satu kalimat tentang apa yang kamu rasakan — tidak perlu indah.', category: 'refleksi' },
];
