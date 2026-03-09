# Branch Changes — feature/docker-integration

## Summary
- Introduced a multi-stage `Dockerfile` supporting both development (hot-reload) and production (Nginx) environments.
- Added `docker-compose.yml` to orchestrate the services and handle volume mounting for development.
- Configured `.dockerignore` to exclude host node_modules and build artifacts.

## Usage
- **Development**: `docker compose up dev` (runs on port 4200 with live reload)
- **Production**: `docker compose up app` (builds and serves on port 8080)

## Technical Details
- The Dockerfile correctly handles the internal dependency of `apps/magnetar-ui` on `packages/magnetar-sdk` by building the SDK in an earlier stage.
- Uses Node 22 Alpine as the base image for a lightweight footprint.
