# Frontend architecture

## State boundaries

`useProductivity` owns tasks, timer settings and completed session history. Task actions use functional state updates so queued actions read the latest state. `useTimer` owns the current countdown independently. `useTheme` stores appearance separately. No global state library or network service is needed.

## Data model

- Task: UUID, creation timestamp, title, description, priority, optional local calendar date and completion flag.
- Task state: task array and one nullable active pending-task ID.
- Settings: focus, short and long durations in whole minutes, each 1–120.
- Session: stable UUID, completion timestamp, focus duration in milliseconds, nullable task ID and a task-title snapshot.

Pure timer transitions account for pauses by moving the deadline when resuming. Only a completed focus transition produces a session result. Appending history is idempotent by ID. Choosing another mode or resetting creates a fresh stopped countdown. Settings changes do not mutate the current session duration.

## Persistence

`focusly:v1:data` stores `{ version: 1, data }`. Recovery validates types, dates, durations, duplicate IDs and active-task consistency. Unknown versions or corrupt data remain untouched; the app starts in memory with an error message. Future migrations must be explicit. `focusly:v1:theme` stores light, dark or system independently.

No user data belongs in the repository. Storage is not encrypted and should not be treated as a secure vault. Multi-tab edits use last-writer behavior; cross-device synchronization is not implemented.

## Rendering and cleanup

The timer interval refreshes every 200 ms and is removed alongside visibility/focus listeners on dependency changes or unmount. Statistics use a memoized component boundary to avoid repeated full-history aggregation and sorting during countdown ticks. Calendar-day calculations use local date fields rather than UTC slicing.

The build emits a Service Worker precaching the shell and hashed resources. Updated workers activate through the normal browser lifecycle. This is an offline app shell, not a deployment pipeline.

## CI references

The workflow follows the official [checkout](https://github.com/actions/checkout) and [setup-node](https://github.com/actions/setup-node) documentation, with read-only repository permissions and Node 24. No deployment or repository write token is configured.
