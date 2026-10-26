# Nhịp

Vietnamese interface prototype for an on-demand time companion: concrete activity choices, a step-by-step workshop, explicit personalization previews, quick logs and reflection.

## Current source and next iteration

This repository includes the completed homepage/activity implementation, connector and bundled design skills. The final combined offline suite passed **22/22** and the connector archive was rebuilt and verified. See [`RUN-STATUS.md`](docs/agent-handoff/RUN-STATUS.md) for delivered behavior, provenance and deployment limits.

Continue directly with Codex using the agreed [`implementation plan`](docs/agent-handoff/implementation-plan.md); external-agent orchestration has ended. Cloud deployment follows this source publication and must preserve the existing owner-only Site access.

## Run locally

No dependency installation or build step is needed. Serve the static directory:

```sh
python3 -m http.server 3000 --directory dist
```

Open http://localhost:3000 in a browser. The app also works by opening `dist/index.html` directly, subject to the browser's local-storage policy.

## Guided workflow and local AI

New activities start with an authored introduction and one local question without requiring a connection. Explicit AI actions can request help; legacy sample exercises retain their guide path. **Hỏi Nhịp** opens contextual chat; rejection feedback uses the same conversation instead of a multi-field dialog.

The compact model selector groups the returned catalog and remembers the explicit model choice for each provider. Opening it reads connection metadata without starting inference. Endpoint/setup controls are under **Thiết lập nâng cao**.

Download `nhip-connector.zip` from the Site's **Kết nối AI** dialog. Extract it and run `Install-Nhip.cmd`. If already installed but routes are missing, run `Repair-Nhip.cmd`. The wrapper verifies and reloads the selected TechPath server; opening its normal launcher alone does not restart a hidden existing process. Select a provider/model explicitly in Nhịp. The installer adds a dedicated Nhịp context to the existing Codex, 9Router and Local AI transports. No new API key or model call is created by installation or connection checks.

If browser local-network policy blocks the hosted page, the installer also provides the same UI at `http://127.0.0.1:4173/nhip/index.html`. Browser-local records on this origin are separate from records on the hosted Site.

The connector must be installed on the user's machine before live use. Local-provider readiness cannot be established from the cloud development environment. Setup does not change the existing provider's plan limits.

## Scope and data

- A concrete featured suggestion, two quieter alternatives, six activities and retained sample exercises, with resumable sessions and iris light/dark themes.
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
node --test checks/nhip-connector.test.mjs checks/nhip-restart.test.mjs checks/hip-activities.test.mjs
python3 scripts/package-connector.py
```

Browser checks require Playwright and Chromium (or `PLAYWRIGHT_MODULE` and `BROWSER_EXECUTABLE` pointing to existing installations). Transport tests use isolated local stubs and do not import a real model provider. Browser checks also use a separate local stub; a successful check or deployment is not proof of a live provider response on the user's Windows device.

Only agreed product requirements belong in project documentation. Do not add private user profiles or conversation history to the repository.
