## Goal

A simple, single-user mobile-friendly web app that lets one parent rate each of 23 fifth-grade students' presentations on a 1–10 scale. The app is designed for live use during a classroom presentation session, making it fast and easy to pull up the next student, assign a score, and move on without friction.

---

## User Stories

**As the rater, I want to see a list of all students so I can quickly find whose turn it is.**
- All 23 student names are visible on the home screen.
- Students can be tapped/clicked to open their rating card.

**As the rater, I want to assign a 1–10 score to each student so I can record my impression of their presentation.**
- A numeric rating control (1–10) is shown on each student's card.
- Submitting saves the score immediately without requiring extra confirmation steps.
- A rated student is visually distinguished from an unrated one in the list.

**As the rater, I want to add a short note to any student's rating so I can capture a quick impression beyond the number.**
- An optional text field (one or two sentences) is available below the score on each student's card.

**As the rater, I want to edit a previously submitted score so I can correct a rating if my impression changes.**
- Tapping a rated student reopens their card with the existing score and note pre-filled.
- Saving overwrites the previous entry.

**As the rater, I want to see a summary of all ratings after presentations are done so I can review scores at a glance.**
- A summary view lists every student with their score and note, sorted by score (highest first).
- The summary can be printed or exported as a simple text list.

---

## Features

### Student Roster
- Pre-loaded list of 23 students, each with a name and an optional presentation topic field.
- Students displayed as a scrollable card list on the home screen.
- Visual status indicator per student: unrated (neutral), rated (highlighted).

### Rating Entry
- 1–10 score selector (large tap targets — buttons or a slider).
- Optional short-text notes field (plain text, no formatting required).
- "Save" button commits the entry; "Cancel" discards changes and returns to the list.

### Rating Summary
- Dedicated summary screen accessible from the home screen.
- Shows all students sorted by score descending.
- Displays name, score, and note for each student.
- Browser print view formatted cleanly for a single printed page.

### Progress Indicator
- Home screen shows count of rated vs. total students (e.g., "14 / 23 rated").

---

## Design Direction

- **Mood:** Clean, friendly, and distraction-free — designed for quick one-handed use on a phone during a live event.
- **Palette:** White background, soft blue primary accent (#3B82F6), green for rated status, neutral gray for unrated. No dark mode required.
- **Typography:** System sans-serif (San Francisco / Roboto depending on device), 16 px base, large touch targets (minimum 44 px height).
- **Layout:** Single-column mobile-first layout. Home screen is a vertical card list. Rating card is a full-screen overlay or dedicated page. Summary screen is a simple ranked list.
- **No animations beyond simple transitions** — speed and reliability over polish.

---

## Tech & Constraints

- **Frontend:** Single-page web app (HTML + vanilla JS or lightweight framework such as React with no backend dependency).
- **Storage:** Browser `localStorage` — no server, no login, no database. Data persists on the device between sessions as long as the browser cache is not cleared.
- **Deployment:** Hosted as a static site (e.g., GitHub Pages, Netlify, or Vercel free tier) accessible via URL on any modern mobile browser.
- **No authentication required** — the app is single-user by design.
- **No native app** — web only; must work in Safari on iOS and Chrome on Android.
- **Roster seeded at build time** — student names (and optionally topics) are hardcoded in a config file; no admin UI for managing the list is needed.

---

## Out of Scope

- Multi-user access or shared rating sessions.
- User accounts, login, or authentication.
- Backend server or database of any kind.
- Multiple rating categories (content, delivery, creativity, etc.) — overall score only.
- Real-time syncing across devices.
- Video or audio recording of presentations.
- Automated grading or scoring suggestions.
- Parent or student-facing results sharing.

---

## Acceptance Criteria

1. Opening the app shows all 23 students with a "0 / 23 rated" progress count.
2. Tapping any student opens a rating card with a 1–10 selector and a notes field.
3. Saving a rating marks that student as rated in the list and increments the progress counter.
4. Tapping a rated student reopens their card with the saved score and note visible and editable.
5. The summary screen lists all students ordered by score, highest first, with name, score, and note.
6. Closing the browser tab and reopening the URL preserves all previously entered ratings.
7. The app is fully usable on a phone screen (375 px viewport) without horizontal scrolling.
8. The summary screen renders cleanly when printed from the browser (File → Print).

---
*Generated by [AI codeWorx](https://codeworx.ai) for Noa, Inc.*