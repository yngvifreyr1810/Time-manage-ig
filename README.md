# Nhịp

Vietnamese interface prototype for an on-demand time companion: concrete activity choices, a step-by-step workshop, explicit personalization previews, quick logs and reflection.

## Current source and next iteration

This repository now includes the deployed app source, connector and bundled design skills. The next homepage redesign is **planned, not implemented**. Its developer handoff starts at [`docs/agent-handoff/START-HERE.md`](docs/agent-handoff/START-HERE.md).

To continue in local Codex, clone/download this repository, open its root folder, and ask the lead to follow [`docs/agent-handoff/local-lead-start.md`](docs/agent-handoff/local-lead-start.md). That file contains the requirements and coordination instructions for the real GitHub Copilot and Antigravity agents. Their local CLI connections still need verification; having the desktop apps installed does not establish an agent connection.

## Run locally

No dependency installation or build step is needed. Serve the static directory:

```sh
python3 -m http.server 3000 --directory dist
```

Open http://localhost:3000 in a browser. The app also works by opening `dist/index.html` directly, subject to the browser's local-storage policy.

## Guided workflow and local AI

Selecting a task opens an explanation before any worksheet. A connected model introduces the task and guides one step at a time. **Hỏi Nhịp** opens contextual chat; rejection feedback uses the same conversation instead of a multi-field dialog.

The compact model selector groups the returned catalog and remembers the explicit model choice for each provider. Opening it reads connection metadata without starting inference. Endpoint/setup controls are under **Thiết lập nâng cao**.

Download `nhip-connector.zip` from the Site's **Kết nối AI** dialog. Extract it and run `Install-Nhip.cmd`. If already installed but routes are missing, run `Repair-Nhip.cmd`. The wrapper verifies and reloads the selected TechPath server; opening its normal launcher alone does not restart a hidden existing process. Select a provider/model explicitly in Nhịp. The installer adds a dedicated Nhịp context to the existing Codex, 9Router and Local AI transports. No new API key or model call is created by installation or connection checks.

If browser local-network policy blocks the hosted page, the installer also provides the same UI at `http://127.0.0.1:4173/nhip/index.html`. Browser-local records on this origin are separate from records on the hosted Site.

The connector must be installed on the user's machine before live use. Local-provider readiness cannot be established from the cloud development environment. Setup does not change the existing provider's plan limits.

## Scope and data

- A centered top navigation, three concrete example missions and a resumable workshop, with responsive iris/peach light and dark themes.
- Neutral sample entries and authored workshop cases; guidance and chat use the explicitly connected model.
- Start/pause/resume a session; drafts survive reloads and sessions pause when their tab is hidden.
- Conversational rejection feedback and explicit one-session/future-session approval for a proposed interpretation.
- Gradual priority changes retain all choices. Confirmed results and future intentions are summarized separately.
- Existing prototype logs remain editable; editing or deleting a session record updates its result summary.
- Browser-local persistence; no notifications, passive tracking or cross-device progress synchronization. A model request explicitly sends only bounded current context, relevant recent messages and approved memory through the local connector.
- Review summaries are derived only from recorded entries. They do not infer unrecorded time or assign a productivity score.
- Interaction events retain completion/error/cancellation state. Reviewed annotations can be exported as JSONL for evaluation; raw logs have a separate export. No automatic fine-tuning or training upload occurs. Confirmed memory can be removed in the data dialog.
- Sample activity records are excluded from personal AI context. Context includes current activity/phase, related confirmed records and the current guide exchange when asking in side chat. A data-dialog preview shows the context without model calls. Optional private context is browser-local and becomes active only after preview/confirmation; no personal background is seeded from the conversation used to build this app.

## Offline verification

```sh
node --test checks/nhip-connector.test.mjs checks/nhip-restart.test.mjs
python3 scripts/package-connector.py
```

Transport tests use isolated local stubs and do not import a real model provider. Browser checks also use a separate local stub; a successful check or deployment is not proof of a live provider response on the user's Windows device.

Only agreed product requirements belong in project documentation. Do not add private user profiles or conversation history to the repository.
