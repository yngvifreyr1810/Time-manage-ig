# Conversational AI Implementation Plan

**Goal:** Deliver an understandable guided workflow, a contextual chat drawer and a real local transport ready for the existing TechPath installation.

**Spec:** ../specs/2026-10-25-conversational-ai.md

**Architecture:** Static browser UI with explicit loopback streaming requests; an installer extends the existing local transport with an isolated Nhịp context. Local records and reviewed export remain outside source.

**Execution:** Native, lightweight offline checks; no extra agents or live-model test calls.

- [x] Build transport routes, bounded prompts and an idempotent installer with original-file backup.
- [x] Replace the initial worksheet with explanation, one-step conversation and optional source details.
- [x] Implement drawer feedback, explicit scoped memory, labeled evidence and reviewed export.
- [x] Verify real-source installer compatibility and failure-before-edit behavior; test route validation without providers.
- [x] Verify browser flows with a clearly isolated stub, including no page-load inference, abort, no retry, remembered-context approval, mobile drawer and existing logs.
- [ ] Package the source-only connector, publish the updated Site privately and explain the required local installation/live verification boundary.
