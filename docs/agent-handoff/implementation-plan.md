# Nhịp: concrete first suggestion and useful guided activities

Contract version: `nhip-home-v1`. Product/DOM/data/ownership requirements in this file are authoritative; `execution.md` defines message transport and runtime status.

Planning draft for the real GitHub Copilot and real Antigravity implementers. Prepared from baseline `279d65a` by the Astra planning/review advisor. This document is a specification, not evidence that either external application is connected or has implemented anything. The cloud environment has no callable Copilot/Antigravity tool or CLI, no connected local project, and no VPN/runtime credential path to the local applications. Implementation is pending a real local connection. Transport and status procedures are defined in `docs/agent-handoff/execution.md`; this document is the single authoritative product/interface/ownership contract. Do not substitute a Codex agent for either named implementer.

## 1. Outcome and scope

On opening Nhịp, immediately show one dominant, centered, concrete suggestion and its start/resume button in the first viewport. Show two quieter alternatives beside or below it. A user should understand the activity, the first action, and the useful thing they can keep without opening a chat or completing a questionnaire.

Replace the current three equal practice cards as the default experience. Keep the existing sample evaluator/context/designer exercises available in a secondary “Bài thực hành mẫu” disclosure and keep saved sessions resumable. Add useful activities based on what the user chooses or supplies. Preserve logging, review, timer, connection UI, provider/model selection, local storage, and confirmed memory behavior.

Do not introduce a framework, backend, new model router, new calendar integration, automatic daily planner, embeddings, model training, or a redesigned settings area. No code-learning prerequisite. No private profile/history copied into source, prompts in this document, fixtures, screenshots, or repository artifacts. No live model QA requests.

## 2. Verified starting points and hazards

Only `dist/index.html`, `dist/workshop.js`, `dist/guide.js`, `dist/app.js`, and `docs/context-audit.md` were read for this plan. Connector internals and current CSS have not been audited here; implementers must inspect their assigned surfaces before editing and report discrepancies. Do not describe uninspected connector behavior as verified.

* `index.html` loads `app.js`, `ai-client.js`, `workshop.js`, then `guide.js` as deferred scripts. The app uses shared lexical globals (`state`, `$`, `save`, `renderSession`, etc.), not modules. Preserve ordering.
* The home hero currently says “Một chút tò mò. Một điều làm được.” and precedes three cards. Its height plus decorative card art can delay the first actionable button. `#mission-grid` is rendered from JS, so CSS/HTML changes alone cannot deliver the requested hierarchy or useful activities.
* `workshop.js` has only `evaluate`, `context`, and `design`. Its persisted workshop validator discards a workshop when `missionById(id)` fails. Replacing the registry or renaming old IDs loses the old journey association. Retain those IDs and step definitions.
* `missionScores` orders existing missions, but the primary button is hardcoded to `evaluate`, independent of ordering. New primary status must come from the selected recommendation, not its ID or color.
* `variants.small`, `.guided`, and `.visual` replace titles with generic labels and assume sample comparisons. Keep them for old tasks; do not apply these global variants to new activity titles.
* `startMission` currently redirects any new task click into the existing session. `route()` only allows `#work` when `state.session` exists. Starting another task must not overwrite a saved session, and selecting an alternative must not silently open an unrelated task.
* `app.js` permits exactly four logging categories and sanitizes persisted records against them. The new display category “Huấn luyện AI” must be a separate field mapped to an existing logging category.
* `guide.js` assumes `step.input`, `step.candidate`, a sample source, “nhận xét”, and a model-generated introduction. Its “Hiểu rồi” handler also immediately sends the next AI request. New activities need an authored introduction and a local first step; neither page load nor local start/continue may trigger inference.
* The guide records the most recent user answer on confirmation, not a useful generated deliverable. New activities need an explicit editable result preview; do not treat an entire chat or an unreviewed AI reply as the confirmed output.
* `finish()` defaults to a count of comments; finish submission hardcodes `category: 'Làm việc'`. New outputs and log categories require a task adapter. Preserve old history and finish semantics.
* `NhipGuide.context()` constructs task context from the legacy step structure. Update it through an adapter rather than making new tasks fake “candidate errors”. Preserve bounded context, sample exclusion, actual selected model, and the single-step role contract.
* `guide.js` stores session threads, guide notes, and future memory separately. A task answer or completed task must not automatically become future memory. Existing `aiMemory` is an approved text-memory path; it is not a structured recommendation score.
* `pauseOnLeave` pauses workshop timers on hidden/pagehide. Rendering a suggestion/resume must not restart a paused timer. Generic custom sessions currently use a different path; preserve their existing state too.
* `app.js` binds many elements directly with `querySelector(...).addEventListener`, including `#choose-task`. Do not remove/rename an existing ID without a coordinated JS change. Preserve dialogs, chat drawer, focus behavior, and hidden attributes.

## 3. Exact initial content

### Home

Keep the existing brand and navigation. Use a compact introduction:

* Eyebrow: “MỘT VIỆC CHO LÚC NÀY”
* Main heading: “Bắt đầu từ một việc cụ thể.”
* Supporting line: “Làm một bước rồi quyết định tiếp. Bạn có thể đổi việc hoặc quay lại sau.”

The first-time primary suggestion is `ai-preferences`, with category “Huấn luyện AI” and title “Cùng AI tìm cách hỗ trợ bạn tốt hơn”. Card text: “Bắt đầu từ một việc bạn đang muốn làm. Cùng chọn cách AI hỗ trợ; chỉ ghi nhớ điều bạn xác nhận.” Output: “Một yêu cầu rõ ràng và cách hỗ trợ bạn chọn.” First action: “Nói một việc bạn muốn AI giúp.” CTA: “Bắt đầu từ việc của mình”. Time hint: “Một bước trước · tiếp tục khi muốn”. Add a short inline clarification in the activity intro: “Ở đây, huấn luyện AI là cùng điều chỉnh cách hỗ trợ qua phản hồi bạn xác nhận.” Do not imply weight training or fine-tuning.

Default alternatives: `work-next-step` and `rest-offscreen`. Label the area “Hoặc đổi nhịp”. Each has display category, concrete title, one-sentence output and a small start button. “Xem thêm hoạt động” opens a local list with all six tasks grouped by display category. “Tự chọn việc khác” stays visible but quieter. “Bài thực hành mẫu” is a separate collapsed area below the initial suggestion section, containing the three unchanged legacy exercises. User-supplied activities must not carry a “tình huống mẫu” label; label the legacy exercises individually instead.

### Task catalog: six activities, three display categories

Each category has exactly two activities. Categories are “Huấn luyện AI”, “Việc và học”, and “Nghỉ và giải trí”; the existing four logging categories remain unchanged. Each activity has an authored intro and at most one active prompt at a time. The following is the required initial catalog; do not invent additional categories to fill space.

| Stable ID | Display category / logging category | Concrete title | Authored intro | First prompt | Confirmable output |
|---|---|---|---|---|---|
| `ai-preferences` | Huấn luyện AI / Làm việc | Cùng AI tìm cách hỗ trợ bạn tốt hơn | “Chọn một việc thật bạn muốn làm. Mình cùng làm rõ yêu cầu, rồi chọn cách hỗ trợ phù hợp. Điều muốn nhớ sẽ được xem lại riêng.” | “Lúc này bạn muốn AI giúp việc gì?” | A clear request plus the assistance style selected for this session; optionally a separately approved future memory |
| `ai-real-draft` | Huấn luyện AI / Làm việc | Soạn một tin nhắn bạn đang cần gửi | “Dùng một tin nhắn bạn thực sự cần viết để thử cách AI hỗ trợ. Bạn kiểm tra bản nháp trước khi dùng.” | “Tin nhắn này cần nói điều gì?” | One edited and confirmed message draft; never automatically sent |
| `work-next-step` | Việc và học / Làm việc | Chốt bước tiếp theo cho một việc đang dở | “Nêu việc đang dở, rồi chọn một hành động đủ nhỏ để bắt đầu. Thời lượng là tùy bạn.” | “Việc nào bạn muốn tiến thêm một chút?” | One next action and a user-selected sign of enough progress |
| `learn-question` | Việc và học / Học hỏi | Làm rõ một điều bạn đang muốn hiểu | “Mang vào một câu hỏi hoặc đoạn ngắn. Mình cùng làm rõ một ý và ghi lại điều bạn thấy hữu ích.” | “Bạn đang muốn hiểu điều gì?” | A short explanation/understanding note confirmed by the user and optionally an unresolved question |
| `play-music` | Nghỉ và giải trí / Giải trí | Dành một lúc cho bản nhạc bạn chọn | “Chọn một bài có sẵn trong ứng dụng bạn dùng. Nghe bao lâu tùy bạn; Nhịp không tự mở nhạc.” | “Bạn muốn nghe bài nào, hoặc mở danh sách quen thuộc?” | Optional chosen title and one user-written impression; completion does not require an impression |
| `rest-offscreen` | Nghỉ và giải trí / Nghỉ ngơi | Rời màn hình và nghỉ một chút | “Chọn một cách nghỉ dễ làm ngay. Quay lại khi bạn muốn, không cần theo lịch cố định.” | “Bạn muốn đứng dậy đi vài bước hay nghỉ mắt tại chỗ?” | A user-confirmed rest record; optional feeling afterward |

For free-text first prompts, one textbox is sufficient, with optional example chips that are clearly examples, not presumed interests. `ai-preferences` chips: “Làm rõ một ý tưởng”, “Viết một bản nháp”, “Chọn bước tiếp theo”. Selecting a chip supplies an initial choice, not a durable preference. Always allow the user's own words. Music and rest can start with a choice button and no required writing. No mandatory sensitive context, goal inventory, time budget, or proficiency survey.

### Deterministic step progression and output

`ai-preferences`:
1. User supplies/selects one current need. Save as session input only.
2. Ask just “Bạn muốn mình giúp bằng cách nào trước?” Choices: “Cùng nghĩ vài hướng”, “Đưa bản nháp để mình sửa”, “Hỏi từng câu để làm rõ”. A free-text answer is permitted. These choices apply to this session.
3. Show editable request: “Mình muốn: [need]. Cách hỗ trợ trước: [choice].” Offer explicit “Nhờ AI cùng làm” and local “Giữ yêu cầu này”. If AI is used, it produces a useful next contribution for the real need with at most one follow-up question. User may continue discussing or keep an edited useful result.
4. On result confirmation, optionally offer “Xem điều muốn nhớ”. Preview a short proposed memory drawn only from the user's chosen support style, allow editing, and provide separate session/future/skip controls. The default is no future memory. Save through the existing confirmed-memory path only after explicit confirmation. Do not convert casual answers, model guesses, or task subjects into a permanent interest profile.

`ai-real-draft`: first prompt captures the intended message; second prompt asks “Bạn muốn giọng điệu thế nào?” with a small optional choice set (ngắn gọn/thân mật/trang trọng/tự viết). Show editable local draft seeded from supplied text, or explicitly request an AI draft using only that session material. Confirm the final text. Recipient details can be supplied voluntarily; no contact access or sending integration.

`work-next-step`: capture real task; then ask “Bước nhỏ nhất bạn có thể làm ngay là gì?” with optional “Nhờ AI gợi ý một bước”. User edits/confirms the action; optionally set a simple completion sign on the following step (“Làm đến đâu thì đủ cho lần này?”). A local template displays the action verbatim and completion sign if provided; no fabricated understanding or schedule.

`learn-question`: capture actual question or user-pasted short material; offer explicit “Nhờ AI giải thích một ý” or “Tự ghi điều mình hiểu”. AI uncertainty stays visible; no invented reference source. User edits/confirms a short note. No mandatory quiz, coding exercise, or claim of mastery.

`play-music`: select familiar playlist or enter a title, show “Mở ứng dụng nghe nhạc của bạn rồi quay lại khi muốn.” User can start/pause/end the existing timer. Do not claim playback happened; finish confirms the actual activity. Impression optional, no model needed.

`rest-offscreen`: select “Đi vài bước” or “Nghỉ mắt tại chỗ”, show that single action with “Mình bắt đầu nghỉ”. No countdown requirement or health claims. Pause/resume/end through existing controls; finish asks for confirmation, optional note, no model needed.

Every activity can finish early. An early exit must say what was actually captured, e.g. “Đã ghi việc muốn làm; chưa chốt bước tiếp theo”, never falsely claim the expected output. A confirmed final artifact is a concrete result, not “3 lượt nhận xét”. Keep task drafts and AI responses distinct from that artifact.

## 4. Recommendation rules: local, stable, explainable

Implement a small deterministic selector, not a model call. Do not parse free-text memory or browsing/private history to invent a profile.

1. A valid `state.session` takes priority: primary becomes “Tiếp tục: [saved session title]”, with category derived from its task/adapter and CTA “Tiếp tục việc đang dở”. Preserve elapsed time, drafts, selected variant, index, and paused/running state. Legacy sample/custom sessions are eligible. If the paused session is opened, it stays paused until its existing resume control is used.
2. With an active session, alternatives remain visible as preview choices. Clicking an alternative opens its local details with “Để sau” and “Kết thúc việc đang dở trước”; it cannot start or replace a second session. That latter action opens the existing finish flow, not an automatic finish/save. When the user completes the old session, return to the requested alternative's preview with a fresh explicit start. Do not silently switch activities.
3. Without a session, rank new catalog tasks by their explicitly approved `missionScores` in the current bounded range [-2, 2]; first-time tie order is `ai-preferences`, `work-next-step`, `rest-offscreen`, `ai-real-draft`, `learn-question`, `play-music`. An old sample task's score does not stand in for a new task or category preference. Avoid scoring inferred from counts, idle time, or words in activity records.
4. Choose two alternatives from distinct display categories, excluding the primary. Use ranking then catalog order. This preserves genuine variety even with a preferred AI task. Legacy examples stay in the sample section rather than crowding out ordinary work/rest/play.
5. Add “Đổi gợi ý” as a local, explicit rotation through remaining catalog tasks. Rotate within the current page session, without recording disinterest or altering saved preference. With a saved session, the resume item stays prominent and this action rotates alternatives only.
6. A confirmed “more/less” finish intent adjusts only that task by one, capped at [-2,2], retaining the current approval preview/reset behavior. Label it “hoạt động này”, not an entire category unless category-scoped behavior is actually implemented. No permanent hiding and no gradual changes without user approval.
7. Reason text is factual: “Một cách bắt đầu khi bạn chưa chọn việc”, “Bạn đã chọn muốn thử hoạt động này nhiều hơn”, or “Bạn còn một phiên đang dở”. Do not say “Dựa trên sở thích của bạn” without a matching explicit setting. Completed records can be shown as context, but are not evidence of ability or a mandate to keep doing the same thing.

## 5. Data schema and backwards compatibility

Keep local storage key `nhip-prototype-v1` and root `version: 1`. The existing loader rejects other root versions. Make additive, idempotent defaults only. Keep unknown root fields; no storage reset, migration that renames legacy IDs, or wholesale history transformation.

Suggested catalog shape (static, not private):

```js
{
  id: 'ai-preferences',
  kind: 'activity',                  // legacy tasks: 'sample'
  categoryId: 'ai-collaboration',
  categoryLabel: 'Huấn luyện AI',
  logCategory: 'Làm việc',           // one of existing app categories
  title: 'Cùng AI tìm cách hỗ trợ bạn tốt hơn',
  description: '...', intro: '...', firstAction: '...',
  output: '...', shortOutput: '...', action: 'Bắt đầu từ việc của mình',
  timeHint: 'Một bước trước · tiếp tục khi muốn',
  steps: [{ id: 'need', title: 'Chọn một việc thật',
    question: 'Lúc này bạn muốn AI giúp việc gì?',
    inputMode: 'text', optional: false,
    choices: [], aiAction: null }]
}
```

Extend `state.workshop` additively for new activities:

```js
{
  id, variant: null, index: 0, answers: [], drafts: {}, limit,
  schemaVersion: 2,                 // optional; absence means legacy adapter
  kind: 'activity',
  inputs: {},                      // user text/choices keyed by stable step ID
  artifact: null,                  // {text, source:'user'|'local-template'|'ai', confirmed:false}
  // Existing guide, aiKey and guideNotes remain compatible.
}
```

Retain `answers: [{title, text, aiEventId?}]` for confirmed steps consumed by current history/context; add `stepId` if useful. Draft typing is not confirmation. A local template is explicitly a draft assembled from user inputs. AI text is never marked confirmed until the user sees and accepts/edits it. Saving a result and remembering a preference are separate actions.

Add `taskId`, `kind`, and `categoryLabel` to new `state.session.task` records while retaining required `title`, `category` (existing logging enum), and finite `minutes` for loader compatibility. Do not render the compatibility minutes as a fixed schedule. Existing `state.session` objects without new fields must continue to load.

Keep `workshopHistory`, `missionScores`, `approvedRules`, `missionOverrides`, `onceOverrides`, `aiMemory`, and the user-context configuration intact. For new history records, optional `kind/categoryLabel/artifact` may be added, but existing `id`, `missionId`, `title`, `date`, `result`, `followup`, `answers` must remain. Link history/log entries using the existing shared ID so edit/delete behavior remains consistent.

If an unknown workshop ID is encountered, do not erase its payload. Preserve it untouched and offer the generic saved session resume/finish path with a short unavailable-activity message. The validator may report recovery state in memory rather than persist a destructive rewrite. Validate new additive fields defensively; malformed optional activity fields must not destroy otherwise valid sessions.

## 6. Adapter and behavior changes: real Copilot owns JS

Keep `window.NhipWorkshop` and `window.NhipGuide` APIs compatible. Add small helpers in existing files rather than introducing a second state store.

* Registry: retain legacy `missions` unchanged, add the six activities, and expose combined lookup via `missionById`. If a consumer needs only examples, filter by `kind`. Avoid assigning the sample fallback illustration to every new task.
* Adapter: `taskPresentation(task, journey)` yields display title/category/intro/output, kind, current step, and source label. `taskContext(task, journey)` yields only the current task and current question/material. `resultDraft(task, journey)` creates a truthful editable result from confirmed input/artifact. Legacy adapters retain sample fields and variant limits.
* Home: a pure `selectHomeCandidates(state, rotation)` returns `{primary, alternatives}`; a `renderHome` renderer projects this into frozen templates. No calls to `NhipAI.send` or metadata requests from the selector/renderer. Existing connector may continue its permitted metadata behavior independently.
* Start: expose `startTask(id)` internally/through `NhipWorkshop` as needed; preserve `startMission` compatibility if referenced. Register session before routing to `#work`. Starting a new task creates local authored intro and one visible first prompt, without AI connection or an AI introduction gate. Keep first input available alongside the concise intro, not behind two additional buttons.
* Guide dispatch: `render()` dispatches to legacy/sample rendering or generic activity rendering by kind. New activities use current-step input types (`text`, `choice`, `action`, `artifact`) and reuse existing thread, busy, stop, failure, and draft controls. Keep active session snapshots in asynchronous callbacks to prevent stale AI output from overwriting another task.
* AI action: only labeled explicit controls such as “Nhờ AI gợi ý một bước” send. Continue using `NhipAI.send`, `stop`, `annotate`, and `openConnection`. If disconnected, offer connection setup while retaining input and an offline path; do not queue an automatic send after setup. One user action permits one request. Page load, rerender, resume, home rotation, selector change, and local step confirmation produce zero inference calls.
* Context: adapter uses real supplied material for new tasks; do not serialize `candidate: undefined` as sample evidence or describe user tasks as tests. Include task kind, display category, current question, confirmed steps, current session notes and actual selected connection. Preserve exclusions/bounds described in `context-audit.md`. Guide history must not also be duplicated into context.
* Artifact: explicit “Giữ kết quả này” saves the reviewed artifact for finish. An ordinary user chat reply is not necessarily the artifact. Avoid silently choosing the most recent assistant output as the final result.
* Finish: preserve existing dialog but use activity-specific result draft, existing actual elapsed time, and `state.session.task.category`. Optional “cách thực hiện” reflects actual AI use (`guide.usedAI`), not just choosing an AI-themed category. Keep separate future-intent approval. No claims of mastery or completed work when only a draft exists.
* Custom task: existing dialog's only required starting input should be its title. Keep logging category and estimated duration in an optional disclosure with defaults for compatibility. Allow its current generic session path; do not invent an AI workflow for every unknown title.
* Memory: reuse existing approved memory infrastructure after inspecting it. Do not add a second memory DB. Preview exact proposed memory, allow editing, confirm scope, and keep optional private context behind its existing preview/confirm flow. No inferred recommendation weights from prose memory.

## 7. Frozen presentation contract: agree before either implementation

Real Antigravity owns HTML/CSS and visual review. Real Copilot owns behavior/content data/DOM population in JS. Dynamic markup is shared through templates, not independently rewritten strings. Before edits, both must acknowledge this contract and report any incompatible existing selector.

Keep `#mission-grid` as the stable recommendation mount for compatibility. Antigravity supplies these children and templates in `index.html`; Copilot never replaces the entire mount after initialization:

```html
<div id="mission-grid" data-suggestion-layout>
  <div data-primary-slot></div>
  <div data-alternatives-slot aria-label="Hoặc đổi nhịp"></div>
</div>
<template id="suggestion-card-template">
  <article class="suggestion-card" data-suggestion-card>
    <p data-field="category"></p>
    <h2 data-field="title"></h2>
    <p data-field="description"></p>
    <p data-field="first-action"></p>
    <p data-field="output"></p>
    <small data-field="time-hint"></small>
    <small data-field="reason"></small>
    <button type="button" data-action="start"></button>
    <button type="button" data-action="feedback">Chưa hợp</button>
  </article>
</template>
```

Renderer sets `data-task-id`, `data-priority="primary|secondary"`, `data-kind="activity|sample|custom|resume"`, and `data-category` from the catalog/view model. Renderer fills text with `textContent`, binds buttons once per clone, and places one clone in the primary slot, two in alternatives. It sets CTA text and `data-action="resume"` for resume. Antigravity styles these stable attributes; class names are presentation-only. Hidden fields on alternatives may reduce detail, but category/title/output/start remain accessible.

Antigravity supplies `#activity-picker` (native dialog) with `[data-activity-list]` mount and `[data-action="close-picker"]`, plus a secondary `#sample-missions` mount inside a disclosure. Copilot owns their population/events. A proposed change to these IDs, mount structure, or action names requires a new handshake before either side edits it.

The static buttons opening the picker and rotating choices are `#activity-picker-open` and `#rotate-suggestions`. Antigravity also provides native dialog `#activity-preview` with `[data-preview-content]` and `[data-action="close-preview"]`. Copilot populates the preview with the same card template (no duplicate IDs), and binds local actions `[data-action="defer"]`, `[data-action="finish-current"]` and `[data-action="start-preview"]` according to active-session state. Close/defer restores focus to the originating alternative; finishing the current session never starts the queued alternative automatically. Keep the queued preview ID in transient UI state, never overwrite `state.workshop` to preview another task.

Preserve `#resume-strip` for existing JS calls; Copilot hides the duplicate strip when the primary card is the resume suggestion, and owns that decision. Antigravity must not force-show `[hidden]` content. Preserve all existing mandatory IDs used by app/guide/connector, including `#choose-task`, `#work-content`, `#work-progress`, `#work-output`, `#session-card`, chat and finish fields. Introduce a consistent authored-step presentation inside the current `#work-content`, using these data hooks:

* `[data-activity-step]`, `[data-field="step-title"]`, `[data-field="step-question"]`
* `[data-step-input]`, `[data-action="confirm-step"]`, `[data-action="ask-ai"]`
* `[data-artifact-preview]`, `[data-action="confirm-artifact"]`

Copilot supplies semantic accessible markup for dynamic step controls using existing element helpers. Antigravity provides CSS for these hooks and reviews an actual rendered state; it does not rename or rewrite behavior hooks. Use label/input associations, button types, `aria-live` only for concise statuses, and existing error/focus patterns.

## 8. Presentation acceptance: real Antigravity

* The concrete primary activity title and CTA dominate the first screen, not the marketing headline. Remove/reduce the oversized artwork above the action; category is small but readable, title is largest within the card, output and first action are immediately legible.
* At 1280×800 and 1440×900, the primary card is centered in the available content region and takes roughly 60–70% of recommendation emphasis; alternatives sit below or in a smaller adjacent column. At 390×844 and 360×640, primary stacks before alternatives and the full start/resume CTA is initially visible at default text size without scrolling. Measure actual bounding boxes; do not merely claim “responsive”. Header + compact intro + primary card must fit that target.
* At enlarged text/200% zoom, allow natural scrolling rather than truncating titles or clipping controls. Do not enforce fixed viewport heights that hide content. No horizontal page overflow at 320 CSS pixels.
* One clear filled primary action; secondary outlined/text actions quieter. No reliance on color alone for hierarchy. Preserve light/dark readability, focus rings, hover/touch targets, reduced-motion preferences, and native `[hidden]` behavior.
* Keep the first screen focused. Recent activity/time summary, learning explanation, examples, and connection/prototype details move below the suggestion area. Scope sample disclosures to sample activities; remove the global assertion that all work is mock data. Retain truthful source status in its existing dialog.
* Do not move provider selector into onboarding or block start on connection. Keep it discoverable in the existing topbar/dialog flow.

## 9. Required implementer handshakes and reviews

These are real agent-to-agent exchanges through the actual Copilot/Antigravity surfaces once available. The coordinator may relay verbatim messages if direct messaging is impossible; report them as relayed. Do not fabricate acknowledgments or label a local agent as one of those applications.

1. **Before coding — interface handshake.** Coordinator gives both this plan, baseline, clean file ownership, and synthetic fixture states. Copilot confirms state/API/DOM requirements; Antigravity confirms IDs/templates/visual hierarchy and fit target. Each names any blocker. Both explicitly acknowledge the same contract revision before changing shared surfaces.
2. **Behavior delivery — Copilot to Antigravity.** Copilot provides its actual branch/commit/diff, exact selectors used, renderer state examples (fresh, resume legacy, resume new, disconnected, error, finished), local test command/results, and zero-inference verification. Antigravity opens the working rendered states and replies with layout/accessibility issues tied to those states.
3. **Presentation delivery — Antigravity to Copilot.** Antigravity provides actual branch/commit/diff, screenshots/viewport measurements in light/dark/mobile, changed HTML IDs and data attributes (expected: none outside agreed contract), and any requested behavior corrections. Copilot reviews binding/route/hidden/focus compatibility and responds with findings, not a generic “looks good”.
4. **Integration — reciprocal review.** Each reviews the other's changes; one designated integrator merges only after named findings are fixed or explicitly recorded. Re-run the focused acceptance set on the integrated result. Astra/Codex reviews scope and evidence, does not implement missing code in either agent's name.

Frozen exclusive edit ownership: real Copilot owns `dist/workshop.js`, `dist/guide.js`, targeted `dist/app.js`, and behavioral checks. Real Antigravity owns `dist/index.html`, `dist/styles.css`, `dist/workshop.css`, `dist/guide.css` and visual review evidence. No shared writes to `index.html`: Copilot submits hook requests through the mailbox and Antigravity implements the agreed HTML. Keep the small catalog and selector in `workshop.js` initially; any later extraction into a new catalog/selector JS module belongs to Copilot and requires a loader-change proposal to Antigravity. `dist/ai-client.js` is preservation scope; if an actual adapter change there is indispensable, Copilot first reports why, obtains the other implementer's acknowledgment of affected hooks, and limits the diff. No provider rewrite. Any shared file reassignment must be explicit to avoid simultaneous conflicting edits.

If either real tool cannot be reached, stop implementation dispatch and report the precise access limitation plus the reviewable plan. Connection unavailability is not authorization to impersonate or silently change implementers.

### Required mailbox protocol

Use the transport/mailboxes in `docs/agent-handoff/execution.md`. Each message must identify the actual originating tool, author, branch/commit or working-tree revision, contract revision, recipient, and status. Initial status is **PENDING — no actual implementer acknowledgment received**. Never prefill an ACK/review as completed.

* `CONTRACT_ACK`: each real implementer confirms its exclusive file ownership, exact selectors/template/actions, legacy compatibility and no-inference contract. Until both actual ACKs exist, do not perform coordinated implementation edits.
* `CONTRACT_CHANGE_REQUEST`: list the exact old/new hook or schema/API, rationale, affected consumer, compatibility approach and acceptance test. The peer replies `ANSWER` accepting or requesting revisions. Update this one contract before applying an accepted interface change; never silently rename a hook.
* `IMPLEMENTATION_READY`: send actual revision, changed owned files, tests performed and outstanding findings to the peer. No other agent edits those files while the owner is working; requested corrections go back to the owner.
* `REVIEW_FINDING` / `REVIEW_PASS`: cite concrete inspected states/diff/test results and findings. The owner answers each finding with its fix revision or unresolved status; peer rechecks affected behavior. Both final reviews must refer to the integrated revision.
* `BLOCKED`: identify the inaccessible tool/project or unresolved interface issue and work still possible. A relayed message is marked “relayed”; the coordinator cannot invent the peer response.

This protocol is mandatory. A GitHub handoff branch/source bundle can be delivered while these statuses remain pending; that is not evidence of completed external implementation.

## 10. Focused validation: synthetic data and stubbed inference only

Use existing project test tooling after inspecting it; avoid a framework migration or large new snapshot suite. A small deterministic selector test plus browser smoke tests is sufficient if it covers the behavioral risks. Do not call a real model to judge model output. Stub connector metadata and inference separately, and record inference call counts. Use synthetic content only, never the user's saved browser data.

1. **Fresh state:** one primary activity and two different-category alternatives; expected first-time default/copy; CTA within viewport bounds at 360×640/390×844/1280×800; no page horizontal overflow. Page load, reload, rotate, picker, theme and provider/model metadata interaction produce zero inference calls.
2. **Start without connection:** primary CTA opens authored intro + exactly one current question with usable local input. It does not open a compulsory connection modal or send a request. Optional AI action opens setup or sends exactly once when connected. Repeated rendering does not send again.
3. **Useful work:** complete one real-task path with synthetic user text and a stubbed AI reply, edit its artifact, explicitly confirm, finish, and verify exact output plus correct logging category. Complete rest without AI or required narrative. Verify an early finish describes partial work honestly.
4. **Saved sessions:** load fixtures for each old ID (`evaluate`, `context`, `design`), legacy variant, custom session and new activity; preserve drafts, timer, index, answers, guide threads and finish draft through reload. Resume primary points to the right task. No new session overwrites an existing one; alternative preview → existing finish → new preview needs explicit start.
5. **Migration/recovery:** missing new fields default safely; root version remains 1; legacy approved rules/history remain. Unknown task ID preserves raw saved payload and generic session. Bad optional new fields do not delete valid old session data.
6. **Selection:** confirmed task priority changes ranking within bounds; alternatives still vary by category; resetting works; rotating does not write a preference; sample entries and free-text memory do not alter rank; no automatic preference from completion alone.
7. **Memory/context:** task answer/result are not future memory; memory preview edit + confirmation persists the exact chosen note; skip leaves memory unchanged. Optional user context remains empty until supplied and confirmed. Stub request asserts actual current activity/step, selected provider/model, bounded relevant confirmed notes, and absence of sample personal history and duplicate guide history.
8. **Connection regression:** grouped returned catalog metadata, per-provider remembered model restored only when present, stale response does not overwrite current provider, no silent router fallback, metadata interaction triggers no inference. Preserve existing tests if present; do not reimplement connector behavior just to satisfy the test.
9. **Accessibility/interruption:** keyboard start/close/resume, one active question, focus restored after dialog, mobile chat trap intact, screen-reader headings/labels, no forced hidden content. Stub failed/stopped AI preserves input and allows retry; a late response cannot overwrite another session or duplicate result confirmation.
10. **Finish/log/review:** new category maps to allowed logging enum; actual support status is truthful; editing/deleting entry updates matching history; review displays the confirmed artifact. Old sample sessions still finish correctly.

Acceptance evidence must include commands actually run, results, synthetic fixture names, screenshots for required viewports, and residual limitations. Stub tests establish request/flow correctness, not quality of real model advice. No successful connection/implementation/testing claims without corresponding tool evidence.

## 11. Minimal implementation order

1. Complete access check and interface handshake; preserve baseline and synthetic legacy fixture coverage.
2. Copilot adds catalog/adapters and safe legacy handling; Antigravity prepares the agreed template/compact home scaffolding in its own owned files after contract freeze.
3. Copilot adds deterministic ranking/resume/rotation, then new local activity flow and explicit AI handoff/result confirmation.
4. Antigravity verifies real rendered states, finishes first-viewport hierarchy and responsive styles; Copilot handles concrete integration feedback.
5. Reciprocal review, focused integrated tests, Astra/Codex evidence review, final user-facing summary. Do not publish/deploy beyond the user's authorized scope or claim unavailable external agents were used.

The smallest successful release has a useful visible recommendation, authentic user-directed activities, preserved sessions, no extra model calls, and a shared interface both real implementers reviewed. Anything unrelated to these requirements waits for a later change.
