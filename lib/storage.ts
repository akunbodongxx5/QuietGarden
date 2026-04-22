import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  journalEntries: '@qg/journal_entries',
  favQuotes: '@qg/fav_quotes',
  favStories: '@qg/fav_stories',
  welcomeDismissed: '@qg/welcome_dismissed',
  /** `null` = belum pernah isi; string (boleh kosong) = sudah lewati / simpan */
  userName: '@qg/user_name',
} as const;

export type JournalEntry = {
  id: string;
  createdAt: string;
  text: string;
};

async function getJson<T>(key: string, fallback: T): Promise<T> {
  try {
    const raw = await AsyncStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

async function setJson(key: string, value: unknown) {
  await AsyncStorage.setItem(key, JSON.stringify(value));
}

export async function loadJournalEntries(): Promise<JournalEntry[]> {
  return getJson<JournalEntry[]>(KEYS.journalEntries, []);
}

export async function saveJournalEntries(entries: JournalEntry[]) {
  await setJson(KEYS.journalEntries, entries);
}

export async function loadFavoriteQuoteIds(): Promise<string[]> {
  return getJson<string[]>(KEYS.favQuotes, []);
}

export async function saveFavoriteQuoteIds(ids: string[]) {
  await setJson(KEYS.favQuotes, ids);
}

export async function loadFavoriteStoryIds(): Promise<string[]> {
  return getJson<string[]>(KEYS.favStories, []);
}

export async function saveFavoriteStoryIds(ids: string[]) {
  await setJson(KEYS.favStories, ids);
}

export async function loadWelcomeDismissed(): Promise<boolean> {
  const v = await AsyncStorage.getItem(KEYS.welcomeDismissed);
  return v === '1';
}

export async function setWelcomeDismissed() {
  await AsyncStorage.setItem(KEYS.welcomeDismissed, '1');
}

/** `null` jika pengguna belum pernah menyelesaikan langkah nama */
export async function loadUserName(): Promise<string | null> {
  const v = await AsyncStorage.getItem(KEYS.userName);
  return v;
}

export async function saveUserName(name: string) {
  await AsyncStorage.setItem(KEYS.userName, name.trim());
}

export async function deleteJournalEntry(id: string) {
  // #region agent log
  fetch('http://127.0.0.1:7672/ingest/7b9307eb-4a36-45bc-8461-bcb4180f88ca', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': '01a801' },
    body: JSON.stringify({
      sessionId: '01a801',
      location: 'storage.ts:deleteJournalEntry',
      message: 'deleteJournalEntry called',
      data: { idLen: id.length, hypothesisId: 'H6' },
      timestamp: Date.now(),
    }),
  }).catch(() => {});
  // #endregion
  const entries = await loadJournalEntries();
  await saveJournalEntries(entries.filter((e) => e.id !== id));
}

export async function clearJournalEntries() {
  await saveJournalEntries([]);
}
