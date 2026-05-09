const STORAGE_KEY = 'noa_presentation_ratings';
const NAMES_KEY = 'noa_participant_names';

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

export function loadNames(store) {
  const s = store ?? localStorage;
  try {
    const raw = s.getItem(NAMES_KEY);
    return raw ? (JSON.parse(raw) ?? {}) : {};
  } catch {
    return {};
  }
}

export function saveName(studentId, name, store) {
  const s = store ?? localStorage;
  const names = loadNames(s);
  if (name) {
    names[studentId] = name;
  } else {
    delete names[studentId];
  }
  s.setItem(NAMES_KEY, JSON.stringify(names));
}

export function clearNames(store) {
  const s = store ?? localStorage;
  s.removeItem(NAMES_KEY);
}
