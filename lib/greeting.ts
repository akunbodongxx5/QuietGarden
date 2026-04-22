/** Indonesian locale strings for Today header */
export function getGreeting(date: Date = new Date()): string {
  const h = date.getHours();
  if (h < 11) return 'Selamat pagi';
  if (h < 15) return 'Selamat siang';
  if (h < 18) return 'Selamat sore';
  return 'Selamat malam';
}

/** Salam + nama (jika ada), mis. "Selamat malam, Dinda" */
export function getPersonalGreeting(date: Date, name?: string | null): string {
  const base = getGreeting(date);
  const n = name?.trim();
  if (n) return `${base}, ${n}`;
  return base;
}

export function formatDateId(date: Date = new Date()): string {
  try {
    return new Intl.DateTimeFormat('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(date);
  } catch {
    return date.toLocaleDateString();
  }
}
