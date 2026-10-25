# Local dispatch and agent-to-agent coordination

This is an execution specification, NOT a claim that a runner or connection is installed. No external task has been started from the cloud.

## Bootstrap in the local Codex workspace

1. Open the actual Nhịp source folder in local Codex, or restore the supplied baseline bundle to a NEW folder. Do not operate in TechPath's served `dist/nhip` directory as if it were source.
2. Inspect applicable local `AGENTS.md` files and `git status`. Preserve existing uncommitted work. Verify the baseline before applying this plan; if branches differ, inspect their diff rather than resetting.
3. Read `Get-Command copilot, agy -ErrorAction SilentlyContinue` in PowerShell. For binaries present, inspect `--version` and `--help` only. Presence of desktop applications does not establish CLI availability.
4. If a CLI is absent or signed out, identify that one prerequisite. Use the vendor's supported installation/login flow locally. Never ask for a token in chat, copy app tokens, or reuse GitHub connector credentials as Copilot credentials.
5. Record the actual provider, binary version and selected model locally. Respect existing explicitly configured models. If none is selected, obtain that choice rather than choose an expensive default. Do not relabel the current lead's model; the Astra planning advisor is the explicitly spawned `gpt-6-astra` agent.
6. Establish a private runtime directory outside the checkout: `<parent>/nhip-agent-run-<run-id>/`. This holds messages, actual session IDs and output logs; never put it in `dist`, commits or public issue comments.
7. Use separate worktrees for the two real workers and a separate integration worktree. Each starts at the identical verified source + handoff commit. Agents write only their allowlisted files; peers may read a frozen artifact/patch for review. A contract is a coordination rule, not an OS security sandbox.

## Transport choice

Prefer the installed supported programmatic CLI on the same machine as the source and signed-in applications. The local lead invokes each process, captures output and delivers peer messages as a follow-up prompt to the named agent. The user should not copy messages between applications.

Official references checked for this plan:

- [GitHub Copilot programmatic reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-programmatic-reference): supports `-p`, JSONL output, explicit model selection and scoped tool permissions.
- [Antigravity headless mode](https://antigravity.google/docs/cli/headless/): supports `agy -p`, structured output and specific conversation continuation; cached local authentication is required.

Do not assume installed versions match current docs. Validate options with local help. Pass prompt content as a literal process argument or supported stdin structure, not interpolated shell code. Do not paste full private chat history into either agent.

Keep session IDs returned by each process and resume the exact task session. Avoid a generic 'continue most recent' command that might resume another project. Local lead should use process APIs or the verified CLI arguments; no custom internet-exposed execution service is needed.

Grant access to the task workspace and required verification commands only. Do not default to blanket permission-bypass flags. A denied tool or model request is a blocker, not permission to switch credentials/providers or spawn replacements.

## Message envelope and delivery

For each actual outgoing/incoming message, write one new JSON file under the private run directory. Sender owns its file. Use a temporary file followed by rename to prevent partial reads. No shared append stream and no synthetic acknowledgements.

Required fields:

```json
{
  "messageId": "unique-runtime-id",
  "runId": "actual-run-id",
  "from": "copilot",
  "to": "antigravity",
  "type": "CONTRACT_ACK",
  "contractVersion": "nhip-home-v1",
  "baseCommit": "verified-commit",
  "inReplyTo": "previous-message-or-null",
  "summary": "short bounded explanation",
  "artifactPaths": [],
  "blocking": false
}
```

Message types: `CONTRACT_ACK`, `CONTRACT_CHANGE_REQUEST`, `QUESTION`, `ANSWER`, `IMPLEMENTATION_READY`, `REVIEW_FINDING`, `REVIEW_PASS`, `BLOCKED`.

For a cross-agent question, lead forwards the literal task-relevant message to the recipient with contract version and referenced artifact. Recipient returns an `ANSWER` addressed to the original agent. Lead delivers it before affected work continues. A file left on disk is not delivery: record the recipient process/session and successful turn result. At most 2 targeted rounds for a disputed contract point; the lead decides the requirement and publishes a versioned amendment, then both acknowledge.

## Stages (no polling loops or idle model chatter)

1. **Preflight:** each worker reads its task, reports actual identity/model, file scope and contract acknowledgement. No production edits yet. Lead forwards each acknowledgement to its peer. Unavailable runtime leaves this stage blocked.
2. **Implement in parallel:** Copilot handles behavior/data; Antigravity handles markup/styles. Only cross-boundary uncertainty triggers a peer message. No nested agent fleets or model benchmarks for this trial.
3. **Ready:** each provides actual commit/patch, changed paths, checks run, failures and screenshot/artifact paths. 'Tests passed' requires command/result evidence; no fake results.
4. **Integration:** Copilot assembles both approved patches in the integration worktree. No concurrent Git index writes. Conflicts go back to the file owner; lead does not silently write application code.
5. **Peer review:** Antigravity verifies the integrated visual/keyboard/mobile behavior; Copilot verifies selectors/events/copy-data consistency against the integrated DOM. Each sends findings to the other through the lead. Owners fix their own files. One review pass and one targeted repair pass initially; unresolved blockers stay explicit.
6. **Lead review:** compare against acceptance checks, actual file ownership, private-data rules and regression evidence. Report real provider/model/session metadata separately from app's model settings. No claim that both workers participated without both actual outputs.
7. **Release:** package connector assets only after final UI; preserve Site owner-private access. No deployment before integrated acceptance passes. If deployment tools only exist in the cloud, return verified commits/patches and evidence to the lead here.

## Budget

Use one main task session per implementer and targeted continuation for review/fix. No real app model call is needed to test the homepage, catalog, sample exclusion or metadata selector. Test AI responses with local isolated stubs. Agent implementation calls themselves consume their providers' quotas; record reported usage when available rather than claim the multi-agent run is free.

## Returning evidence

Return: baseline and final SHA, exact changed-file list, actual Copilot and Antigravity model/session identifiers (no credentials), peer message IDs proving delivery/reply, test command summaries, screenshots for declared viewports/themes, open limitations, and deployment state. Export only sanitized task artifacts, never local app storage or personal chat history.
