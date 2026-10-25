# Nhịp — approved interface scope

## Intent
An on-demand personal time companion that suggests a manageable next action, records activities with little effort, and helps review progress. Its day is flexible rather than a fixed timetable.

## Agreed requirements
- Vietnamese interface; responsive phone and desktop layouts; light and dark themes.
- Primary entry: next-action suggestion, with start, alternate suggestion, and self-selected task actions.
- Quick logging supports recording after the fact and correcting the draft before confirmation.
- Review recorded time and confirmed outcomes; unknown time remains unknown.
- Interaction happens only while the user opens/uses the app; no unsolicited check-in notifications.
- Learning outcomes distinguish independent practice from AI-assisted work.
- This milestone is an interactive UI prototype with neutral example content and clearly labeled simulated AI, without a live model.
- No personal profile, private history, or sensitive background in source, documentation, commits, or demo content.

## Approaches considered
Retrospective journaling provides reflection but less help getting started. Fixed day planning gives structure but requires scheduling. The selected approach leads with one suggested next action, supported by quick logging and optional reflection.

## Implementation choices
Use buildless HTML, CSS and JavaScript. Three views: next action, quick log, review. Use local browser state for prototype interactions only; no account or cross-device synchronization. The visual treatment is an implementation choice: warm neutral surfaces, green accents, clear typography and restrained motion. Publish with owner-private access.

## Boundaries
No real AI inference, passive app monitoring, automatic occupation selection, diagnosis, or blanket productivity score. User-created sample entries remain browser-local.
