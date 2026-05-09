import { STUDENTS } from './roster.js';
import { loadRatings, saveRating, loadNames, saveName } from './storage.js';
import { escHtml, sortStudentsForSummary } from './utils.js';

const app = document.getElementById('app');
let pendingScore = null;

function effectiveName(student, names) {
  return names[student.id] || student.name;
}

function renderHome() {
  const ratings = loadRatings();
  const names = loadNames();
  const ratedCount = Object.keys(ratings).length;

  app.innerHTML = `
    <div class="screen">
      <header class="header">
        <div class="header-top">
          <h1 class="title">Presentations</h1>
          <button class="btn btn-outline" data-action="summary">Summary</button>
        </div>
        <div class="progress">${ratedCount} / ${STUDENTS.length} rated</div>
      </header>
      <ul class="student-list" role="list">
        ${STUDENTS.map(s => {
          const r = ratings[s.id];
          const name = effectiveName(s, names);
          return `
            <li class="student-card${r ? ' rated' : ''}"
                data-action="open-rating"
                data-student-id="${escHtml(s.id)}"
                role="button"
                tabindex="0"
                aria-label="Rate ${escHtml(name)}${r ? ', currently ' + r.score + ' out of 10' : ', not yet rated'}">
              <div class="student-info">
                <span class="student-name">${escHtml(name)}</span>
                ${r ? `<span class="score-chip">${r.score} / 10</span>` : ''}
              </div>
              <button class="edit-name-btn" data-action="edit-name" data-student-id="${escHtml(s.id)}" aria-label="Edit name for ${escHtml(name)}" title="Edit name">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
              </button>
              <span class="status-badge ${r ? 'badge-rated' : 'badge-unrated'}">${r ? 'Rated' : 'Unrated'}</span>
            </li>
          `;
        }).join('')}
      </ul>
    </div>
  `;
}

function openRatingOverlay(studentId) {
  const student = STUDENTS.find(s => s.id === studentId);
  if (!student) return;

  const names = loadNames();
  const name = effectiveName(student, names);
  const existing = loadRatings()[studentId] ?? null;
  pendingScore = existing ? existing.score : null;

  const overlay = document.createElement('div');
  overlay.className = 'overlay';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-label', `Rate ${name}`);

  overlay.innerHTML = `
    <div class="rating-card" role="document">
      <div class="rating-header">
        <h2 class="rating-name">${escHtml(name)}</h2>
        <button class="close-btn" data-action="close-rating" aria-label="Close">&#x2715;</button>
      </div>
      <div class="score-section">
        <div class="score-label">Score (1&ndash;10)</div>
        <div class="score-grid" role="group" aria-label="Select score from 1 to 10">
          ${[1,2,3,4,5,6,7,8,9,10].map(n => `
            <button class="score-btn${pendingScore === n ? ' selected' : ''}"
                    data-action="select-score"
                    data-score="${n}"
                    aria-pressed="${pendingScore === n}"
                    aria-label="Score ${n}">${n}</button>
          `).join('')}
        </div>
      </div>
      <div class="notes-section">
        <label class="notes-label" for="notes-field">Notes <span class="optional">(optional)</span></label>
        <textarea id="notes-field"
                  class="notes-field"
                  placeholder="Quick impression&#8230;"
                  maxlength="200"
                  rows="3">${escHtml(existing ? existing.notes : '')}</textarea>
      </div>
      <div class="rating-footer">
        <button class="btn btn-secondary" data-action="close-rating">Cancel</button>
        <button class="btn btn-primary" data-action="save-rating" data-student-id="${escHtml(studentId)}">Save</button>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  const target = overlay.querySelector(
    pendingScore ? `.score-btn[data-score="${pendingScore}"]` : '.score-btn'
  );
  target?.focus();
}

function openEditNameOverlay(studentId) {
  const student = STUDENTS.find(s => s.id === studentId);
  if (!student) return;

  const names = loadNames();
  const currentName = effectiveName(student, names);
  const isCustom = !!names[studentId];

  const overlay = document.createElement('div');
  overlay.className = 'overlay';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-label', 'Edit participant name');

  overlay.innerHTML = `
    <div class="rating-card" role="document">
      <div class="rating-header">
        <h2 class="rating-name">Edit Name</h2>
        <button class="close-btn" data-action="close-rating" aria-label="Close">&#x2715;</button>
      </div>
      <div class="notes-section">
        <label class="notes-label" for="name-field">Participant name</label>
        <input id="name-field"
               class="text-input"
               type="text"
               value="${escHtml(currentName)}"
               maxlength="60"
               placeholder="${escHtml(student.name)}"
               autocomplete="off" />
        ${isCustom ? `<button class="reset-name-btn" data-action="reset-name" data-student-id="${escHtml(studentId)}">Reset to default (${escHtml(student.name)})</button>` : ''}
      </div>
      <div class="rating-footer">
        <button class="btn btn-secondary" data-action="close-rating">Cancel</button>
        <button class="btn btn-primary" data-action="save-name" data-student-id="${escHtml(studentId)}">Save</button>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  const input = overlay.querySelector('#name-field');
  input?.focus();
  input?.select();
}

function closeRatingOverlay() {
  document.querySelector('.overlay')?.remove();
  pendingScore = null;
}

function selectScore(score) {
  pendingScore = score;
  document.querySelectorAll('.score-btn').forEach(btn => {
    const s = parseInt(btn.dataset.score, 10);
    const selected = s === score;
    btn.classList.toggle('selected', selected);
    btn.setAttribute('aria-pressed', String(selected));
  });
}

function commitSaveRating(studentId) {
  if (!pendingScore) {
    const grid = document.querySelector('.score-grid');
    grid?.classList.remove('shake');
    void grid?.offsetWidth;
    grid?.classList.add('shake');
    return;
  }
  const notes = document.getElementById('notes-field')?.value?.trim() ?? '';
  saveRating(studentId, pendingScore, notes);
  closeRatingOverlay();
  renderHome();
}

function commitSaveName(studentId) {
  const input = document.getElementById('name-field');
  const name = input?.value?.trim() ?? '';
  if (!name) {
    input?.focus();
    input?.classList.add('input-error');
    return;
  }
  saveName(studentId, name);
  closeRatingOverlay();
  renderHome();
}

function commitResetName(studentId) {
  saveName(studentId, '');
  closeRatingOverlay();
  renderHome();
}

function renderSummary() {
  const ratings = loadRatings();
  const names = loadNames();
  const students = STUDENTS.map(s => ({ ...s, name: effectiveName(s, names), rating: ratings[s.id] ?? null }));
  const sorted = sortStudentsForSummary(students);
  const ratedCount = sorted.filter(s => s.rating).length;

  app.innerHTML = `
    <div class="screen summary-screen">
      <header class="header">
        <div class="header-top">
          <button class="btn btn-ghost" data-action="home">&#8592; Back</button>
          <h1 class="title">Summary</h1>
          <button class="btn btn-outline" data-action="print">Print</button>
        </div>
        <div class="progress">${ratedCount} / ${STUDENTS.length} rated</div>
      </header>
      <ul class="summary-list" role="list">
        ${sorted.map((s, i) => {
          const isRated = !!s.rating;
          const rank = isRated ? i + 1 : '&mdash;';
          return `
            <li class="summary-card${isRated ? '' : ' unrated'}">
              <div class="summary-rank" aria-hidden="true">${rank}</div>
              <div class="summary-content">
                <div class="summary-name">${escHtml(s.name)}</div>
                ${isRated
                  ? `<div class="summary-score">${s.rating.score} / 10</div>
                     ${s.rating.notes ? `<div class="summary-notes">${escHtml(s.rating.notes)}</div>` : ''}`
                  : `<div class="summary-unrated-label">Not rated</div>`
                }
              </div>
            </li>
          `;
        }).join('')}
      </ul>
    </div>
  `;
}

document.addEventListener('click', e => {
  const el = e.target.closest('[data-action]');
  if (!el) return;

  switch (el.dataset.action) {
    case 'summary':
      renderSummary();
      break;
    case 'home':
      renderHome();
      break;
    case 'open-rating':
      openRatingOverlay(el.dataset.studentId);
      break;
    case 'edit-name':
      openEditNameOverlay(el.dataset.studentId);
      break;
    case 'close-rating':
      closeRatingOverlay();
      break;
    case 'select-score':
      selectScore(parseInt(el.dataset.score, 10));
      break;
    case 'save-rating':
      commitSaveRating(el.dataset.studentId);
      break;
    case 'save-name':
      commitSaveName(el.dataset.studentId);
      break;
    case 'reset-name':
      commitResetName(el.dataset.studentId);
      break;
    case 'print':
      window.print();
      break;
  }
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && document.querySelector('.overlay')) {
    closeRatingOverlay();
  }
});

document.addEventListener('keydown', e => {
  if (e.key !== 'Enter' && e.key !== ' ') return;
  const card = e.target.closest('[data-action="open-rating"]');
  if (card) {
    e.preventDefault();
    openRatingOverlay(card.dataset.studentId);
  }
});

document.addEventListener('keydown', e => {
  if (e.key === 'Enter' && e.target.id === 'name-field') {
    const saveBtn = document.querySelector('.overlay [data-action="save-name"]');
    if (saveBtn) {
      e.preventDefault();
      saveBtn.click();
    }
  }
});

renderHome();
