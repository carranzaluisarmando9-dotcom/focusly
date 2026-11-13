# Enhancement release

## Implemented scope

1. Timer recovery after reload, using saved absolute deadlines or paused remaining time.
2. Cross-tab read/modify/write coordination via Web Locks and storage events; shared countdown and idempotent history.
3. JSON export and validated merge import, with optional restoration of preferences and duration settings.
4. Undo of the latest task mutation, guarded against overwriting later changes from another tab.
5. Focus-only mode and fullscreen controls with a fallback message.
6. Opt-in sound and browser notifications; cross-tab deduplication; visual completion always available.
7. Configurable cycle length and automatic breaks; focus never starts automatically.
8. Search, tags, priority/date sorting and individually completable subtasks.
9. Persisted daily goal with actual recorded progress.
10. Adjacent-seven-day comparisons and historical focus grouped by task.
11. Installable PWA manifest and official PNG icons; offline production shell.
12. Disable-able keyboard shortcuts, explicit dialog focus, 200% zoom/reflow checks and automated axe audits in both themes. Manual screen-reader testing remains a stated limitation.
13. Brave E2E tests in CI, running in isolated contexts.
14. Gated Vercel deployment job after the quality job, using a repository secret scoped to the Focusly project.

## Data integrity decisions

Storage writes happen in explicit operations, not mount effects. Cooperating tabs read the latest valid state inside a shared lock. Corrupt data remains preserved; failed writes retain current in-memory data. Existing settings, history and user content do not change during migration. New task fields are optional.

Backups merge missing task/session IDs and keep current records on collision. Restoring configuration is an explicit checkbox in the import confirmation dialog. A running timer is never replaced by an import.

Timer completion comes from the actual state transition; intervals refresh the display and check deadlines. History uses a stable session ID. A break transition is guarded by the completed session ID, preventing duplicate advancement across tabs.

## Verification

Local automated results before release: 52 unit tests and 8 Brave E2E tests passed, lint and strict production build passed; npm audit reported zero vulnerabilities. E2E covers concurrent task creation, shared timer pause/resume/reload and one completion record, recovery after refresh, search/tags/subtasks/undo, backup round-trip and invalid files, focus mode, themes, disabled shortcuts, native dialog focus, 200% zoom, widths 320–1440px, automatic long breaks, notification deduplication and corrupt storage. Notifications are stubbed for deterministic tests; real sound remains subject to browser autoplay policy.

The production/repository URLs and the final remote workflow result are verified separately during publication. No test uses production user data.
