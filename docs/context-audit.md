# Context contract and selector revision

## Model selection
The compact connection view exposes provider and model plus a status/refresh row. Endpoint/install controls are collapsed. Model groups come from returned catalog metadata; model IDs are not hardcoded. A user-selected model is remembered per provider and restored only if still present. Opening/changing the selector may read status/catalog metadata, never starts inference, and does not silently select another router model. Stale status responses cannot overwrite the current provider selection.

## Audited context
The existing dedicated Nhịp system instructions already require short Vietnamese conversation, explanation before work, one step/question per turn, explicit approval before personalization, gradual preference changes, and separation of an AI-assisted result from independent technical mastery. The Nhịp conversation scope remains separate from the existing SQL and personal-chat scopes.

Request context now states the time-management role and does not treat the AI workshop examples as a complete account of user interests or career. It includes current local date/time, the activity phase, supplied material, confirmed steps, relevant session notes, real saved activity records, recent confirmed result/intent summaries and actual connection selection. Sample entries are excluded from personal activity history. Side chat additionally receives a bounded recent guide exchange; guide requests avoid duplicating this exchange in both history and context.

Approved memory is bounded and task-relevant. A separate optional user-context field remains empty unless the user enters, previews and confirms content in their own browser. Private chat background is never seeded into source or a public demo. The data dialog can preview the current chat context without calling a model. Older low-priority records are reduced when needed to preserve the active task and approved context within the request budget.

## Evidence
Browser checks with isolated metadata/model stubs verify grouping, per-provider restoration, no selector-triggered inference, sample exclusion, confirmation-only private context, guide-to-drawer context, confirmed summaries and mobile layout. No live provider calls were used. Prompt/context correctness does not by itself establish that every model will follow the instructions; explicit user feedback remains necessary.
