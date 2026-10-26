# Start a local lead session

Current execution checkpoint: see [`RUN-STATUS.md`](RUN-STATUS.md) and [`provider-amendment-v2.md`](provider-amendment-v2.md). The original status/role text below is historical where superseded. Final acceptance is paused; resume only on user instruction.

The user need only open the downloaded/cloned project in local Codex and provide this file path. Everything below is for the lead, not a survey for the user.

Continue the Nhịp homepage redesign using `docs/agent-handoff/START-HERE.md`. Read the authoritative implementation and execution contracts. The cloud task has prepared the plan; the current deployed app is still the baseline design.

Your role is lead, planner and reviewer only. Actual GitHub Copilot implements behavior; actual Antigravity implements presentation. Confirm the local source and available authenticated CLIs first. Do not replace these services with internal Codex agents or 9Router model calls. Do not ask the user to repeat product requirements.

The user wants the final verified source returned to GitHub. Work on dedicated branches, preserve existing changes, use provider-specific real sessions and relay their messages automatically according to `execution.md`. Keep the user informed concisely in Vietnamese. Ask only for a missing installation/login/model decision that cannot be resolved from existing configuration. Never request credentials in chat.

Keep personal data out of source and handoff artifacts. Use synthetic fixtures and local stubs for app checks. After real peer review and integrated verification, publish the result on an implementation branch/PR, attach the PR to the task and report the link. Deployment must preserve owner-only Site access; if unavailable locally, return the reviewed commit and evidence to the cloud lead for deployment.

Until both real agent processes have received and acknowledged their task, report them as pending. The existence of this plan and role files is not proof of an agent connection.
