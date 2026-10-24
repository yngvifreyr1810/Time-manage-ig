# Visual previews in Codex Cloud

Use the preview/artifact surface supported by the current environment. Never assume a Windows path, Git Bash installation, or that a cloud loopback URL is reachable from the user browser.

For initial choices, one small HTML comparison page with 2-3 concepts is sufficient. Keep it outside application source. If browser preview is unavailable, offer a concise text comparison and state the limitation. Do not claim a preview is visible until it has been opened through a supported surface.

The bundled Node server is optional. On Linux it can be launched with `bash .agents/skills/brainstorming/scripts/start-server.sh --project-dir <absolute-demo-directory> --foreground` and `SUPERPOWERS_DISABLE_TELEMETRY=1`. Use its actual output and only supported preview forwarding. Do not widen network bindings to bypass access restrictions.
