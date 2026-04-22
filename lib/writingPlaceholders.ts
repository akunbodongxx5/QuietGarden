import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

import {
  WRITING_PLACEHOLDERS,
  type WritingMoodId,
  type WritingSceneId,
} from '@/constants/writingPlaceholders';

const STORAGE_KEY = '@qg/writing_placeholder_last';

export type JournalMoodSelection = WritingMoodId | null;
export type JournalSceneSelection = WritingSceneId | null;

function getPool(scene: JournalSceneSelection, mood: JournalMoodSelection): string[] {
  if (scene && scene in WRITING_PLACEHOLDERS.scene) {
    return [...WRITING_PLACEHOLDERS.scene[scene]];
  }
  if (mood && mood in WRITING_PLACEHOLDERS.mood) {
    return [...WRITING_PLACEHOLDERS.mood[mood]];
  }
  return [...WRITING_PLACEHOLDERS.default];
}

/** Storage bucket for last-shown placeholder (avoid immediate repeat). */
function categoryKey(scene: JournalSceneSelection, mood: JournalMoodSelection): string {
  if (scene) return `scene:${scene}`;
  if (mood) return `mood:${mood}`;
  return 'default';
}

async function loadLastMap(): Promise<Record<string, string>> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as unknown;
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed)
      ? (parsed as Record<string, string>)
      : {};
  } catch {
    return {};
  }
}

async function rememberLast(category: string, placeholder: string) {
  const map = await loadLastMap();
  map[category] = placeholder;
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(map));
}

/**
 * Picks one placeholder for the current scene/mood priority (scene > mood > default).
 * Avoids repeating the last one used for the same category when possible.
 */
export async function pickWritingPlaceholder(
  scene: JournalSceneSelection,
  mood: JournalMoodSelection
): Promise<string> {
  const pool = getPool(scene, mood);
  if (pool.length === 0) {
    return WRITING_PLACEHOLDERS.default[0];
  }
  const cat = categoryKey(scene, mood);
  const lastMap = await loadLastMap();
  const last = lastMap[cat];
  const candidates = pool.filter((p) => p !== last);
  const pickFrom = candidates.length > 0 ? candidates : pool;
  const chosen = pickFrom[Math.floor(Math.random() * pickFrom.length)];
  await rememberLast(cat, chosen);
  return chosen;
}

/** Pool for the current context (for "Need help" starters). */
export function getPlaceholderPool(scene: JournalSceneSelection, mood: JournalMoodSelection): string[] {
  return getPool(scene, mood);
}

/**
 * Up to `limit` starters, shuffled, for the help sheet.
 */
export function pickStarterSentences(
  scene: JournalSceneSelection,
  mood: JournalMoodSelection,
  limit = 5
): string[] {
  const pool = getPool(scene, mood);
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(limit, shuffled.length));
}

/** Placeholder string for current scene/mood; updates when context changes. */
export function useWritingPlaceholder(
  scene: JournalSceneSelection,
  mood: JournalMoodSelection
): string {
  const [placeholder, setPlaceholder] = useState<string>(WRITING_PLACEHOLDERS.default[0]);

  useEffect(() => {
    let cancelled = false;
    void pickWritingPlaceholder(scene, mood).then((p) => {
      if (!cancelled) setPlaceholder(p);
    });
    return () => {
      cancelled = true;
    };
  }, [scene, mood]);

  return placeholder;
}
