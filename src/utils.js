export function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function sortStudentsForSummary(students) {
  const rated = students
    .filter(s => s.rating !== null && s.rating !== undefined)
    .sort((a, b) => b.rating.score - a.rating.score);
  const unrated = students.filter(s => s.rating === null || s.rating === undefined);
  return [...rated, ...unrated];
}
