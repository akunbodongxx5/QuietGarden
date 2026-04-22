export type Quote = {
  id: string;
  text: string;
  category: string;
};

/** Seeded quotes — daily pick is deterministic by date */
export const QUOTES: Quote[] = [
  { id: 'q1', text: 'Berjalan pelan juga perjalanan.', category: 'tenang' },
  { id: 'q2', text: 'Kamu tidak perlu sempurna untuk layak dicintai.', category: 'hangat' },
  { id: 'q3', text: 'Hari ini cukup. Kamu juga cukup.', category: 'lembut' },
  { id: 'q4', text: 'Kadang yang kamu butuhkan hanya jeda, bukan jawaban.', category: 'refleksi' },
  { id: 'q5', text: 'Perlahan bukan berarti ketinggalan.', category: 'tenang' },
  { id: 'q6', text: 'Hatimu boleh lelah. Tidak apa-apa.', category: 'hangat' },
  { id: 'q7', text: 'Senja tidak buru-buru. Kamu juga tidak harus.', category: 'tenang' },
  { id: 'q8', text: 'Kehadiranmu sudah cukup berarti.', category: 'hangat' },
  { id: 'q9', text: 'Tulis pelan. Rasakan pelan.', category: 'refleksi' },
  { id: 'q10', text: 'Bukan setiap hari harus produktif. Beberapa hari hanya untuk bernapas.', category: 'lembut' },
  { id: 'q11', text: 'Kamu boleh memilih dirimu sendiri hari ini.', category: 'hangat' },
  { id: 'q12', text: 'Rindu pada ketenangan itu wajar.', category: 'tenang' },
  { id: 'q13', text: 'Satu kalimat jujur lebih berharga dari seratus yang dipaksakan.', category: 'refleksi' },
  { id: 'q14', text: 'Dunia bisa menunggu. Kamu juga boleh berhenti sejenak.', category: 'lembut' },
  { id: 'q15', text: 'Lembut pada diri sendiri adalah keberanian.', category: 'hangat' },
  { id: 'q16', text: 'Tidak semua pertanyaan harus dijawab malam ini.', category: 'tenang' },
  { id: 'q17', text: 'Yang kecil dan tulus tetap berarti.', category: 'hangat' },
  { id: 'q18', text: 'Kamu layak mendapat ruang yang aman.', category: 'lembut' },
  { id: 'q19', text: 'Biarkan hari ini sederhana.', category: 'tenang' },
  { id: 'q20', text: 'Kadang tenang dimulai dari satu tarikan napas.', category: 'refleksi' },
];
