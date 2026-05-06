const STORAGE_KEY = 'noa_presentation_ratings';

export function loadRatings(store) {
  const s = store ?? localStorage;
  try {
    const raw = s.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) ?? {}) : {};
  } catch {
    return {};
  }
}

export function saveRating(studentId, score, notes, store) {
  const s = store ?? localStorage;
  const ratings = loadRatings(s);
  ratings[studentId] = { score, notes: notes ?? '' };
  s.setItem(STORAGE_KEY, JSON.stringify(ratings));
}

export function getRating(studentId, store) {
  return loadRatings(store ?? localStorage)[studentId] ?? null;
}

export function countRated(store) {
  return Object.keys(loadRatings(store ?? localStorage)).length;
}

export function clearRatings(store) {
  const s = store ?? localStorage;
  s.removeItem(STORAGE_KEY);
}
