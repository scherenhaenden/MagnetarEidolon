# MagnetarEidolon Backend

This app is a NestJS backend-for-frontend for browser-safe integrations.

Current responsibility:
- receive chat streaming requests from `apps/magnetar-ui`
- forward them to LM Studio using the configured API style
- stream the response back to the browser

Local development:

```bash
cd apps/magnetar-api
npm install
npm run start:dev
```

The default port is `3100`.

In normal repository development you usually do not need to start it separately, because root `npm run dev` boots both:
- `apps/magnetar-api`
- `apps/magnetar-ui`
