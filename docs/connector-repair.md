# Reloading the installed local connector

TechPath's launcher runs Node hidden and returns early when `/api/health` already reports a healthy TechPath process. Opening the launcher again therefore does not reload edited JavaScript. Static Nhịp assets can be available while the old process still returns 404 for the new API routes.

The installation wrapper now performs a verified restart and checks the provider-free `/api/nhip/health` endpoint before reporting success. `Repair-Nhip.cmd` runs the same idempotent installation/reload path. It does not call a model.

Before stopping a running process, the helper requires matching installation IDs from the selected folder and its served assets, a TechPath health PID, a Node `server.mjs` command line, and the same PID owning port 4173. It refuses mismatches and never stops all Node processes or the model gateway. The existing TechPath launcher supplies the usual executable paths when restarting.

Validation covers a real-source upgrade fixture, repeat installation without duplicated route hooks, syntax checks, provider-free health, and refusal of mismatched process/folder identities. Actual Windows process restart still requires verification on the user's device.
