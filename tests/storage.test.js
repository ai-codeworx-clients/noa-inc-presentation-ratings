import { describe, test, expect, beforeEach } from 'vitest';
import {
  loadRatings,
  saveRating,
  getRating,
  countRated,
  clearRatings,
} from '../src/storage.js';

function createMockStore() {
  const data = {};
  return {
    getItem:    key       => data[key] ?? null,
    setItem:    (key, val) => { data[key] = String(val); },
    removeItem: key       => { delete data[key]; },
  };
}

describe('loadRatings', () => {
  test('returns empty object when nothing is stored', () => {
    const store = createMockStore();
    expect(loadRatings(store)).toEqual({});
  });

  test('returns empty object when stored value is invalid JSON', () => {
    const store = createMockStore();
    store.setItem('noa_presentation_ratings', 'not-valid-json{{{');
    expect(loadRatings(store)).toEqual({});
  });

  test('returns parsed ratings object', () => {
    const store = createMockStore();
    const data = { 'student-1': { score: 8, notes: 'Great!' } };
    store.setItem('noa_presentation_ratings', JSON.stringify(data));
    expect(loadRatings(store)).toEqual(data);
  });

  test('returns empty object when stored value is null', () => {
    const store = createMockStore();
    expect(loadRatings(store)).toEqual({});
  });
});

describe('saveRating', () => {
  test('stores a rating with score and notes', () => {
    const store = createMockStore();
    saveRating('emma-johnson', 9, 'Excellent delivery', store);
    expect(loadRatings(store)['emma-johnson']).toEqual({ score: 9, notes: 'Excellent delivery' });
  });

  test('stores empty string for notes when notes is undefined', () => {
    const store = createMockStore();
    saveRating('liam-smith', 7, undefined, store);
    expect(loadRatings(store)['liam-smith'].notes).toBe('');
  });

  test('stores empty string for notes when notes is null', () => {
    const store = createMockStore();
    saveRating('liam-smith', 7, null, store);
    expect(loadRatings(store)['liam-smith'].notes).toBe('');
  });

  test('overwrites an existing rating', () => {
    const store = createMockStore();
    saveRating('olivia-williams', 5, 'First thought', store);
    saveRating('olivia-williams', 9, 'Changed mind', store);
    expect(loadRatings(store)['olivia-williams']).toEqual({ score: 9, notes: 'Changed mind' });
  });

  test('stores multiple students without clobbering each other', () => {
    const store = createMockStore();
    saveRating('student-a', 8, 'Notes A', store);
    saveRating('student-b', 5, 'Notes B', store);
    const ratings = loadRatings(store);
    expect(ratings['student-a']).toEqual({ score: 8, notes: 'Notes A' });
    expect(ratings['student-b']).toEqual({ score: 5, notes: 'Notes B' });
    expect(Object.keys(ratings)).toHaveLength(2);
  });

  test('accepts score of 1 (minimum)', () => {
    const store = createMockStore();
    saveRating('student-x', 1, '', store);
    expect(loadRatings(store)['student-x'].score).toBe(1);
  });

  test('accepts score of 10 (maximum)', () => {
    const store = createMockStore();
    saveRating('student-x', 10, '', store);
    expect(loadRatings(store)['student-x'].score).toBe(10);
  });
});

describe('getRating', () => {
  test('returns null for an unrated student', () => {
    const store = createMockStore();
    expect(getRating('unknown-id', store)).toBeNull();
  });

  test('returns the rating object for a rated student', () => {
    const store = createMockStore();
    saveRating('noah-brown', 8, 'Good pacing', store);
    expect(getRating('noah-brown', store)).toEqual({ score: 8, notes: 'Good pacing' });
  });
});

describe('countRated', () => {
  test('returns 0 when no students are rated', () => {
    const store = createMockStore();
    expect(countRated(store)).toBe(0);
  });

  test('returns the correct count after saving ratings', () => {
    const store = createMockStore();
    saveRating('a', 7, '', store);
    saveRating('b', 4, '', store);
    saveRating('c', 9, '', store);
    expect(countRated(store)).toBe(3);
  });

  test('does not double-count when the same student is saved twice', () => {
    const store = createMockStore();
    saveRating('a', 6, '', store);
    saveRating('a', 8, 'Revised', store);
    expect(countRated(store)).toBe(1);
  });
});

describe('clearRatings', () => {
  test('removes all saved ratings', () => {
    const store = createMockStore();
    saveRating('a', 8, '', store);
    saveRating('b', 5, '', store);
    clearRatings(store);
    expect(loadRatings(store)).toEqual({});
    expect(countRated(store)).toBe(0);
  });

  test('is a no-op when there are no ratings', () => {
    const store = createMockStore();
    expect(() => clearRatings(store)).not.toThrow();
    expect(loadRatings(store)).toEqual({});
  });
});
