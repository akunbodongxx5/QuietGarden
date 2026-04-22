import type { Quote } from '@/data/quotes';

/** Deterministic quote per calendar day (stable across restarts). */
export function getQuoteForDate(date: Date, quotes: Quote[]): Quote {
  if (quotes.length === 0) {
    return { id: 'empty', text: 'Hari ini istirahat dulu, ya.', category: 'tenang' };
  }
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  const dayOfYear = Math.floor(diff / 86400000);
  const idx = Math.abs(dayOfYear) % quotes.length;
  return quotes[idx];
}

/** Alternate quotes for "another quote" without changing the daily seed — cycles through pool. */
export function getQuoteForDateWithOffset(
  date: Date,
  quotes: Quote[],
  offset: number
): Quote {
  if (quotes.length === 0) {
    return getQuoteForDate(date, quotes);
  }
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  const dayOfYear = Math.floor(diff / 86400000);
  const base = Math.abs(dayOfYear) % quotes.length;
  const idx = (base + offset) % quotes.length;
  return quotes[idx];
}
