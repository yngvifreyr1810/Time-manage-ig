# Nhịp Interface Implementation Plan

> **For agentic workers:** Use native execution in the current session. Keep verification lightweight and avoid additional agents for this prototype.

**Goal:** Deliver the approved responsive, interactive interface prototype.

**Architecture:** Static HTML shell, semantic CSS tokens, and browser-local JavaScript state. Deterministic sample suggestions are labeled simulated AI. No external application dependencies or private example data.

**Tech Stack:** HTML, CSS, browser JavaScript.

**Spec:** ../specs/2026-10-24-interface-design.md

## Global Constraints
- Vietnamese; mobile and desktop; light and dark themes.
- Prototype only, neutral sample content, simulated AI visibly identified.
- No private profile information or real model connection.
- Do not change the original repository remote or push to it.

## Review Focus
- Long activity names wrap rather than overflow mobile layouts.
- Empty or invalid durations keep the log form open with a clear error.
- Timers recover from backgrounding using timestamps rather than interval counts.
- Storage failures preserve in-session functionality.
- Keyboard navigation, modal dismissal and focus restoration remain usable.

### Task 1: Interface and interactions
**Files:** dist/index.html, dist/styles.css, dist/app.js.
- [x] Build the three views, responsive navigation and semantic theme tokens.
- [x] Implement alternative suggestions, editable tasks, elapsed sessions and confirmed quick logs.
- [x] Implement record review, independent/assisted outcome labels and empty states.
- [x] Check JavaScript syntax and basic browser interactions when browser infrastructure is available.

### Task 2: Handoff
**Files:** README.md, .openai/hosting.json.
- [x] Document local serving and prototype limitations without personal context.
- [ ] Package the static assets from the pushed source and deploy privately.
- [ ] Open the result in Codex and report verification limits.
