# Changes for feature/nest-backend-bff

## Summary
- Added `apps/magnetar-api` as a NestJS backend-for-frontend for browser-safe chat/provider integration.
- Rewired the Angular chat service to call `/api/chat/stream` instead of talking to LM Studio directly.
- Updated root scripts so `npm run dev` boots the backend and UI together from the repository root.

## Validation
- `npm --prefix apps/magnetar-api run typecheck`
- `npm --prefix apps/magnetar-api run build`
- `npm --prefix apps/magnetar-ui run test:ci`
- `npm run typecheck`
- `npm run build`
