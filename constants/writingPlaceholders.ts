/**
 * Dynamic journal writing placeholders — scene > mood > default.
 */
export const WRITING_PLACEHOLDERS = {
  default: [
    'Aku tidak tahu harus mulai dari mana, tapi hari ini terasa…',
    'Kadang aku merasa…',
    'Yang sebenarnya ingin aku katakan adalah…',
  ],
  mood: {
    sad: [
      'Hari ini terasa lebih berat dari biasanya…',
      'Aku ingin menangis tapi…',
    ],
    calm: [
      'Hari ini terasa tenang, seperti…',
      'Aku bersyukur untuk…',
    ],
    overthinking: [
      'Aku terus memikirkan…',
      'Hal yang belum bisa aku lepaskan adalah…',
    ],
  },
  scene: {
    rain: ['Hujan malam ini membuatku merasa…'],
    sunset: ['Hari ini berakhir dengan perasaan…'],
    room: ['Di dalam keheningan ini, aku berpikir tentang…'],
  },
} as const;

export type WritingMoodId = keyof typeof WRITING_PLACEHOLDERS.mood;
export type WritingSceneId = keyof typeof WRITING_PLACEHOLDERS.scene;
