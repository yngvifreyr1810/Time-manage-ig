# Nhịp: agent implementation handoff

Current implementation is complete and offline-verified; see [`RUN-STATUS.md`](RUN-STATUS.md). The user has ended external-agent orchestration: continue directly with Codex. Earlier status, role and dispatch instructions below are historical and superseded. Cloud deployment is the next step.

Status: planning only; external implementers have NOT been dispatched.

Baseline: `279d65acd1ca3c8e6e7233b12cc6cca3df571479`.
This package contains agreed product requirements, not a user profile. No private conversation background should be copied into implementation, fixtures or reports.

## Roles

- Codex + GPT-6 Astra: architecture, detailed contract, review and coordination. Do not write production implementation in this iteration.
- Actual GitHub Copilot: catalog, activity selection, state/guide behavior, behavioral checks and integration.
- Actual Antigravity: home presentation, responsive/light/dark design and visual verification.
- An internal Codex subagent is not a substitute for either external implementer. A request to a model through 9Router is not evidence that either coding agent has received the project or changed files.

## Reading order for agents

1. `implementation-plan.md`: authoritative product, DOM, data, ownership and acceptance contract.
2. `execution.md`: actual local transport, bounded message exchange and dispatch gates.
3. Your own `copilot-task.md` or `antigravity-task.md`.
4. `../../README.md` and `../context-audit.md`, then only the implementation files assigned by the contract.

The plan is addressed to agents. Do not ask the user to interpret it or manually relay every agent message.

## Current capability evidence

- Available: cloud source checkout; GPT-6 Astra planning agent; GitHub repository tools.
- Not available in this task: a connected local project, Copilot CLI, Antigravity CLI, or a verified Windows terminal connection.
- Cloud network policy has no configured VPN. `127.0.0.1` in the cloud is not the user's Windows device.
- The app's TechPath connector offers model responses, not a remote shell or coding-agent dispatcher. Do not add a shell endpoint to it.
- Official CLI documentation describes programmatic agent execution. Actual installed binaries, login, model availability and permissions must still be checked in the local workspace before dispatch.

## Deliverables

The implementers deliver working home UI + concrete guided activities, preserved previous sessions, focused offline tests, real peer-review messages, and an integration report. The lead reviews evidence and routes fixes back to the responsible implementer. Production deployment follows verified integration; this planning package does not represent a deployed UI change.
