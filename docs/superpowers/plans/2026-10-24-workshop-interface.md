# Workshop Interface Implementation Plan

**Goal:** Implement the approved concrete-mission and feedback-preview prototype.

**Spec:** ../specs/2026-10-24-workshop-design.md

**Execution:** Native in the current session, without extra agents or model calls.

**Files:** dist/index.html for semantic view/dialog structure; dist/app.js for existing time/log integration; dist/workshop.js for neutral mission content and workflow; dist/workshop.css for the iris identity and responsive workshop layout.

- [x] Build concrete mission selection, one-step workshop and resumable drafts.
- [x] Implement explicit feedback previews and scoped gradual preferences.
- [x] Implement user-confirmed result and future-intent summaries.
- [x] Verify core flows, cancellation, reloads, legacy logs, mobile overflow, theme contrast and keyboard focus using the installed browser.
- [ ] Push the exact verified source to the existing Site repository, package and deploy privately.

No private profile data or conversation transcript belongs in source or examples. No automatic model calls or live progress integration is claimed.
