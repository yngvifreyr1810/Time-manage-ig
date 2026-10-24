---
name: brainstorming
description: Clarify open-ended website, UI, feature or product ideas through short questions and 2–3 visual design options before implementation. Use when the user wants to explore requirements, colors, layouts or previews. Skip routine fixes with clear requirements and ordinary conversation.
---

# Brainstorming for Codex

Local, lightweight adaptation of obra/superpowers brainstorming at commit
2ce8aa15d05bd57213e6f746f953aafb7ded7a8b. Original license is in LICENSE.
The discovery and visual-companion workflow is retained; mandatory extra
planning skills, reviewer agents and automatic commits are not used.

## Discover the intent

- Read only the context/files relevant to this request. Reuse facts and preferences already given.
- For an underspecified project, start with ONE question about the outcome: who uses it and what they should do. A coffee homepage may promote a physical cafe or sell beans online; establish this before choosing a layout.
- Ask one concise question per turn. Then clarify only material gaps: brand/style, main content, primary action, existing assets and technical constraints. Suggest choices when the user is unsure. Do not run a fixed questionnaire when enough is known.
- Match the user's language. Keep discussion practical and brief.

## Let the user see choices

- Present 2–3 materially different directions, explaining their tradeoffs and recommending one. For UI work, compare real palettes, typography and page structure, not only names or adjectives.
- If the user requested previews, make lightweight side-by-side mockups. Otherwise offer a visual comparison once when seeing it would help. Respect a text-only preference.
- Use temporary mockups outside production source; label them as concepts. Do not build a full application merely to compare directions. One HTML comparison page is usually enough.
- For clickable live comparisons, read [Codex visual setup](references/codex-visual.md), then the bundled [visual companion guide](visual-companion.md) only as needed. Its scripts run locally and do not call a model. Existing preview tools may be reused instead of starting another server.
- User messages are the primary feedback. Browser selection events supplement them; never interpret a selection as consent to unrelated deployment or file changes.

## Agree, then build

- Summarize the selected direction, key requirements, scope and acceptance criteria in a SHORT brief. Clearly separate user decisions from your assumptions.
- Resolve substantial design questions before implementing. Approval of the design already shown is sufficient; do not create another approval cycle just to approve an equivalent document. If the user asks to skip discovery, state reasonable assumptions and proceed within their request.
- After approval, give a proportionate implementation plan and use the normal Codex workflow or the appropriate available implementation skill. No separate Superpowers installation is required.
- Keep changes scoped, preserve user work and run checks appropriate to the change. No extra reviewer agents, repeated builds or broad scans by default. Do not automatically commit, publish, install dependencies or change provider settings merely because brainstorming finished; follow the user's actual authorization.

## Completion

Report what was agreed or implemented and actual verification. Do not promise
that installing a skill guarantees its activation or design quality. The skill
uses tokens when loaded; load visual instructions only when previews are needed.
