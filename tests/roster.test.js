import { describe, test, expect } from 'vitest';
import { STUDENTS } from '../src/roster.js';

describe('STUDENTS roster', () => {
  test('has exactly 23 students', () => {
    expect(STUDENTS).toHaveLength(23);
  });

  test('every student has a non-empty string id', () => {
    for (const s of STUDENTS) {
      expect(typeof s.id).toBe('string');
      expect(s.id.length).toBeGreaterThan(0);
    }
  });

  test('every student has a non-empty string name', () => {
    for (const s of STUDENTS) {
      expect(typeof s.name).toBe('string');
      expect(s.name.length).toBeGreaterThan(0);
    }
  });

  test('all student ids are unique', () => {
    const ids = STUDENTS.map(s => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  test('all student names are unique', () => {
    const names = STUDENTS.map(s => s.name);
    expect(new Set(names).size).toBe(names.length);
  });

  test('ids use lowercase kebab-case format', () => {
    for (const s of STUDENTS) {
      expect(s.id).toMatch(/^[a-z][a-z0-9-]*$/);
    }
  });

  test('names have at least a first and last name', () => {
    for (const s of STUDENTS) {
      expect(s.name.trim().split(/\s+/).length).toBeGreaterThanOrEqual(2);
    }
  });
});
