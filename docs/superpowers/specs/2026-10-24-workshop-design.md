# Nhịp interface revision — approved product scope

## Purpose and selected approach
Lead with two or three concrete activities, each with supplied input, a clear first step, and a tangible outcome. The selected approach is an interactive workshop supported by quick logs and reflection. Generic activity suggestions and fixed day planning do not meet this revision's needs.

## Requirements
- Replace the green visual identity with iris, warm off-white and ink surfaces, with peach accents. Maintain responsive light/dark modes.
- Show concrete neutral example missions and supplied sample materials; no open-ended search or reading assignments.
- A mission opens one step at a time. Drafts, progress and elapsed time survive interruptions and reloads. Silence does not imply abandonment.
- Rejection and post-session feedback accept free text. Offer two or three specific adjustments with a preview. Apply only the user's explicit choice, with a one-session or future-session scope.
- Preference changes are gradual; increasing one type preserves other choices. Closing a task may slightly lower similar suggestions but never permanently removes the category.
- Session confirmation separates verified results from future intentions. Record the user's stated contribution without inferring coding mastery.
- Keep local logs, editable records, theme choice and existing prototype data.
- This remains a frontend prototype: simulated suggestions/adjustments, browser-local records, no model calls and no live learning-progress synchronization. Explain sample/source status where relevant.
- Commit only product requirements and neutral examples, never personal background or conversation history.

## UI structure
Home: centered top navigation without a sidebar, an open introduction and three mission cards, a resumable session, explicit sample/source status, recent records and approved personalization. Workshop: input material, one question, editable response and confirmation. Feedback dialog: reason, candidate adjustments, scope and explicit apply. Completion dialog: result, contribution, future intention and two preview summaries. Review: confirmed records and session summaries.

## Implementation choices and boundaries
Reuse the static shell and existing local-storage records. Add isolated workshop data/interaction code and a visual override stylesheet. No packages, model tests, integration changes, notification infrastructure or account changes. Keep the existing Site identity and owner-private audience.
