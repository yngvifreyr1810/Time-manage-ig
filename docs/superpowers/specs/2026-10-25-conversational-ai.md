# Conversational guidance and shared local AI connection

## Approved requirements
- Explain an activity before asking the user to perform it. Guide one action/question at a time, with clarification before more work.
- Replace the form-heavy rejection flow with conversation. Keep a contextual chat drawer available throughout the app.
- Use the existing local TechPath model connections; keep Nhịp instructions/context separate from SQL tutoring and personal chat.
- Collect browser-local interaction evidence and explicitly reviewed annotations for personalization and evaluation. Keep all personal content out of source, commits and example datasets.
- Review a proposed interpretation before applying it to a session or remembering it. Do not automatically fine-tune, upload training datasets, call models on page load, retry failed inference or switch providers/models.
- Preserve existing activity logs, drafts and confirmed results.

## Implementation
The static Site gains a local streaming client, a guided conversation view and an optional contextual drawer. A downloadable, dependency-free installer adds `/api/nhip/status` and `/api/nhip/chat` to the existing TechPath local server and adds a Nhịp-only context branch to its three existing model transports. Existing tutoring/personal branches remain in place. Host/origin gates and process-memory token checks remain mandatory; the Nhịp hosted origin can call only its own routes and health.

The installer validates all source markers before changing files, backs up original files under TechPath's ignored local runtime directory, and copies a local Nhịp UI as a fallback for browsers blocking hosted-to-loopback requests. Installing/restarting the connector on the user's machine is required before live use; this cloud workspace cannot establish that device's model readiness.

## Evidence and data boundaries
Store prompt/context, model response, completion/error/cancellation status and model identity as local events. Export only user-reviewed annotations through the reviewed JSONL action; raw logs use a separate explicit export. Annotated helpfulness, corrections and confirmed steps retain their distinct labels. This is an evaluation/personalization dataset, not proof of model training or a claim that each answer is correct. Only confirmed memory enters future bounded context.

## Validation
Use local stub transports and installed browser automation to verify protocols, installer compatibility, cancellation, no automatic inference, confirmation-only memory and export. Do not spend live model quota on tests. Report live-provider verification as pending until the user installs and connects their selected transport.
