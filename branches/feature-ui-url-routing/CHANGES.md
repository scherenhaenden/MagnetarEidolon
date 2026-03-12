# Branch Changes — feature/ui-url-routing

## 2026-03-12
- Added URL routing for every existing top-level shell tab so the app can navigate directly to `/dashboard`, `/liverun`, `/chat`, `/builder`, `/tools`, `/memory`, `/providers`, and `/policy`.
- Replaced in-memory tab switching in the root shell with Angular Router navigation and a `router-outlet`-driven screen render path.
- Moved chat and provider screens off root inputs and onto Angular dependency injection so routed screens can keep shared app state without a manual parent handoff.
