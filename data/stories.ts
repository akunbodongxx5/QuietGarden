export type StorySlide = {
  order: number;
  text: string;
};

export type Story = {
  id: string;
  title: string;
  category: string;
  tagline: string;
  coverUrl: string;
  slides: StorySlide[];
  ending: string;
};

export const STORIES: Story[] = [
  {
    id: 's1',
    title: 'Bangku Taman',
    category: 'Romantis',
    tagline: 'Dua orang. Tidak ada kata. Cukup.',
    coverUrl:
      'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80&auto=format&fit=crop',
    slides: [
      { order: 1, text: 'Sore terlambat datang hari ini. Langit jingga menyapa pelan.' },
      { order: 2, text: 'Kamu duduk di bangku itu — yang catnya sudah terkelupas di satu ujung.' },
      { order: 3, text: 'Seseorang duduk di sampingmu. Tidak bertanya, tidak menjelaskan diri.' },
      { order: 4, text: 'Hanya duduk. Seperti kamu.' },
    ],
    ending: 'Kadang kehadiran lebih dari kata.',
  },
  {
    id: 's2',
    title: 'Kopi Hangat',
    category: 'Hangat',
    tagline: 'Waktu melambat di sini. Boleh diam sebentar.',
    coverUrl:
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80&auto=format&fit=crop',
    slides: [
      { order: 1, text: 'Hari ini berat, kamu tahu. Tapi cangkir di tanganmu masih mengepul.' },
      { order: 2, text: 'Uapnya naik — memutar pelan sebelum hilang ke udara kamar.' },
      { order: 3, text: 'Di luar, dunia belum selesai berteriak. Di sini, kamu boleh diam.' },
      { order: 4, text: 'Satu tegukan. Semuanya menunggu. Kamu tidak harus terburu.' },
    ],
    ending: 'Hal kecil bisa jadi pelabuhan sejenak.',
  },
  {
    id: 's3',
    title: 'Jendela',
    category: 'Lembut',
    tagline: 'Hujan yang tidak perlu kamu balas.',
    coverUrl:
      'https://images.unsplash.com/photo-1428592953211-077101b2021b?w=800&q=80&auto=format&fit=crop',
    slides: [
      { order: 1, text: 'Hujan tiba tanpa peringatan. Kamu menemukannya sudah ada di jendela.' },
      { order: 2, text: 'Suara tetesannya tidak seragam — ada yang pelan, ada yang cepat.' },
      { order: 3, text: 'Kamu tidak sendirian dengan pikiranmu malam ini. Kamu sedang mendampinginya.' },
      { order: 4, text: 'Biarkan saja. Tidak semua perlu selesai sebelum tidur.' },
    ],
    ending: 'Mendengar diri sendiri juga bentuk perhatian.',
  },
  {
    id: 's4',
    title: 'Hujan Malam',
    category: 'Melankolis',
    tagline: 'Sepi yang berbeda. Malam yang mengizinkan.',
    coverUrl:
      'https://images.unsplash.com/photo-1501691223387-dd0500403074?w=800&q=80&auto=format&fit=crop',
    slides: [
      { order: 1, text: 'Malam ini berbeda. Bukan sunyi biasa — sepi yang punya berat.' },
      { order: 2, text: 'Kamu rebahan dengan lampu menyala, pikiran mengambang tanpa tujuan.' },
      { order: 3, text: 'Hujan di luar terasa seperti percakapan yang tidak perlu kamu balas.' },
      { order: 4, text: 'Cukup hanya menjadi saksi malam yang basah ini.' },
    ],
    ending: 'Beberapa malam memang hanya untuk dilewati.',
  },
  {
    id: 's5',
    title: 'Perpustakaan Sore',
    category: 'Tenang',
    tagline: 'Tidak ada yang menagih. Waktu bergerak lambat.',
    coverUrl:
      'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=800&q=80&auto=format&fit=crop',
    slides: [
      { order: 1, text: 'Rak-rak itu tinggi. Aroma kertas tua mengisi udara diam.' },
      { order: 2, text: 'Kamu tidak terburu mencari judul tertentu — jari menyentuh punggung buku.' },
      { order: 3, text: 'Waktu bergerak lambat di sini. Tidak ada yang menagih apapun.' },
      { order: 4, text: 'Kamu menemukan satu kalimat, berhenti, membacanya dua kali.' },
    ],
    ending: 'Tempat terbaik adalah yang membuatmu melupakan jam.',
  },
  {
    id: 's6',
    title: 'Pantai Sepi',
    category: 'Damai',
    tagline: 'Ombak datang dan pergi tanpa memilih.',
    coverUrl:
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80&auto=format&fit=crop',
    slides: [
      { order: 1, text: 'Kamu tiba ketika matahari sudah hampir di cakrawala.' },
      { order: 2, text: 'Pasirnya dingin di bawah telapak kakimu. Ombak datang, lalu pergi.' },
      { order: 3, text: 'Kamu berdiri di tepi — tidak masuk, tidak mundur.' },
      { order: 4, text: 'Sesaat, semua yang belum selesai terasa... tidak terlalu penting.' },
    ],
    ending: 'Laut tidak pernah meminta kamu menjadi siapa pun.',
  },
];

export function getStoryById(id: string): Story | undefined {
  return STORIES.find((s) => s.id === id);
}
