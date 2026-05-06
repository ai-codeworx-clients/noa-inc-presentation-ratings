import { describe, test, expect } from 'vitest';
import { escHtml, sortStudentsForSummary } from '../src/utils.js';

describe('escHtml', () => {
  test('escapes ampersand', () => {
    expect(escHtml('Tom & Jerry')).toBe('Tom &amp; Jerry');
  });

  test('escapes less-than', () => {
    expect(escHtml('1 < 2')).toBe('1 &lt; 2');
  });

  test('escapes greater-than', () => {
    expect(escHtml('2 > 1')).toBe('2 &gt; 1');
  });

  test('escapes double quotes', () => {
    expect(escHtml('"hello"')).toBe('&quot;hello&quot;');
  });

  test('escapes single quotes', () => {
    expect(escHtml("it's fine")).toBe('it&#39;s fine');
  });

  test('escapes a full XSS payload', () => {
    const payload = '<script>alert("xss")</script>';
    const result = escHtml(payload);
    expect(result).not.toContain('<script>');
    expect(result).toContain('&lt;script&gt;');
  });

  test('leaves safe strings unchanged', () => {
    expect(escHtml('Hello World 123')).toBe('Hello World 123');
  });

  test('returns empty string for empty input', () => {
    expect(escHtml('')).toBe('');
  });

  test('coerces number to string', () => {
    expect(escHtml(42)).toBe('42');
  });

  test('coerces null to string', () => {
    expect(escHtml(null)).toBe('null');
  });

  test('escapes multiple special characters in one string', () => {
    expect(escHtml('<b class="x">A & B</b>')).toBe(
      '&lt;b class=&quot;x&quot;&gt;A &amp; B&lt;/b&gt;'
    );
  });
});

describe('sortStudentsForSummary', () => {
  test('places rated students before unrated students', () => {
    const students = [
      { id: '1', name: 'A', rating: null },
      { id: '2', name: 'B', rating: { score: 7, notes: '' } },
    ];
    const sorted = sortStudentsForSummary(students);
    expect(sorted[0].id).toBe('2');
    expect(sorted[1].id).toBe('1');
  });

  test('sorts rated students by score descending', () => {
    const students = [
      { id: '1', rating: { score: 5, notes: '' } },
      { id: '2', rating: { score: 9, notes: '' } },
      { id: '3', rating: { score: 7, notes: '' } },
    ];
    const sorted = sortStudentsForSummary(students);
    expect(sorted.map(s => s.id)).toEqual(['2', '3', '1']);
  });

  test('places tied scores in stable order', () => {
    const students = [
      { id: 'a', rating: { score: 8, notes: '' } },
      { id: 'b', rating: { score: 8, notes: '' } },
    ];
    const sorted = sortStudentsForSummary(students);
    expect(sorted).toHaveLength(2);
    expect(sorted.every(s => s.rating.score === 8)).toBe(true);
  });

  test('returns all unrated when none are rated', () => {
    const students = [
      { id: '1', rating: null },
      { id: '2', rating: null },
    ];
    const sorted = sortStudentsForSummary(students);
    expect(sorted).toHaveLength(2);
    expect(sorted.every(s => s.rating === null)).toBe(true);
  });

  test('returns empty array for empty input', () => {
    expect(sortStudentsForSummary([])).toEqual([]);
  });

  test('handles a mix of rated and unrated in any input order', () => {
    const students = [
      { id: 'u1', rating: null },
      { id: 'r3', rating: { score: 3, notes: '' } },
      { id: 'u2', rating: null },
      { id: 'r10', rating: { score: 10, notes: '' } },
      { id: 'r7', rating: { score: 7, notes: '' } },
    ];
    const sorted = sortStudentsForSummary(students);
    const ratedIds = sorted.filter(s => s.rating).map(s => s.id);
    const unratedIds = sorted.filter(s => !s.rating).map(s => s.id);
    expect(ratedIds).toEqual(['r10', 'r7', 'r3']);
    expect(unratedIds).toHaveLength(2);
    // all rated come before all unrated
    const firstUnratedIndex = sorted.findIndex(s => !s.rating);
    const lastRatedIndex = sorted.map(s => !!s.rating).lastIndexOf(true);
    expect(lastRatedIndex).toBeLessThan(firstUnratedIndex);
  });

  test('does not mutate the input array', () => {
    const students = [
      { id: '1', rating: { score: 5, notes: '' } },
      { id: '2', rating: { score: 9, notes: '' } },
    ];
    const copy = [...students];
    sortStudentsForSummary(students);
    expect(students[0].id).toBe(copy[0].id);
    expect(students[1].id).toBe(copy[1].id);
  });
});
