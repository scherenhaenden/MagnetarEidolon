# Plan operativo de MagnetarEidolon

## Base estratégica
Este plan implementa la dirección definida en `NEW_PLAN.md`: simplicidad, control humano y observabilidad end-to-end.

## Roadmap por fases

| Fase | Objetivo | Estado |
| :--- | :--- | :--- |
| Fase 1 | Valor individual inmediato (setup simple, ejecuciones visibles, recetas básicas). | in_progress |
| Fase 2 | Potencia para usuarios avanzados (multiagente, memoria gestionable, políticas finas). | planned |
| Fase 3 | Colaboración de equipos (workspaces, roles, colas de aprobación). | planned |
| Fase 4 | Ecosistema y expansión segura (intercambio de recetas + integraciones externas con controles estrictos). | planned |

## Milestones activos

| Milestone ID | Nombre | Fecha objetivo | Estado | Descripción |
| :--- | :--- | :--- | :--- | :--- |
| `ms-01` | Canon Bootstrap | 2026-03-05 | done | Establecer artefactos de gobernanza y planificación. |
| `ms-02` | Magnetar Model Baseline | 2026-03-12 | done | Definir arquitectura y esquema de proyecto. |
| `ms-ts-01` | TypeScript Core & SDK Migration | 2026-03-20 | in_progress | Migración del motor de razonamiento a TypeScript. |
| `ms-ts-qa-01` | TypeScript Testing & QA | 2026-03-30 | planned | Pirámide de pruebas y 100% cobertura en core. |
| `ms-11` | Experience Foundation | 2026-04-10 | in_progress | UI/UX base y catálogo de herramientas. |
| `ms-12` | Trust & Policy Center | 2026-04-24 | ready | Centro de control de políticas y aprobaciones. |
| `ms-13` | Observability & Replay | 2026-05-08 | planned | Trazabilidad y reproducción de ejecuciones. |
| `ms-14` | CLI Operativa de Consola | 2026-04-17 | ready | Interfaz de línea de comandos unificada. |
| `ms-15` | SDK Contract Base | 2026-04-22 | ready | Contrato compartido entre UI y CLI. |

## Backlog priorizado

| Task ID | Milestone | Título | Propietario | Estado | Notas |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `task-101` | `ms-01` | Crear base de documentación canónica | Core Team | done | Archivos canónicos iniciales creados. |
| `task-103` | `ms-02` | Construir plantilla de esquema YAML | Core Team | done | `_template.project.yml` completado. |
| `task-ts-101` | `ms-ts-01` | Portar estado MagnetarModel a TS | Gemini | done | Definido en `core/models.ts`. |
| `task-ts-102` | `ms-ts-01` | Portar Reasoning Loop a TS | Gemini | done | Definido en `core/agent.ts`. |
| `task-ts-103` | `ms-ts-01` | Implementar interfaces SDK | Gemini | done | Definido en `core/interfaces.ts`. |
| `task-ts-104` | `ms-ts-01` | Crear adaptadores de Node.js (CLI) | Gemini | done | `core/tools/node-filesystem.ts` creado. |
| `task-ts-105` | `ms-ts-01` | Crear adaptadores de Browser (Web) | Gemini | done | `core/tools/web-filesystem.ts` creado. |
| `task-ts-106` | `ms-ts-01` | Integrar SDK en Angular Shell | Gemini | done | Integración en app.component.ts. |
| `task-ts-107` | `ms-ts-01` | Implementar servicio LLM Provider | Gemini | done | Interfaz y uso en agente implementados. |
| `task-1101` | `ms-11` | Definir IA UX flow de onboarding | Core Team | in_progress | 7 pasos de flujo ideal. |
| `task-1102` | `ms-11` | Implementar Tool Catalog | Core Team | ready | Con visibilidad de riesgo/alcance. |
| `task-1201` | `ms-12` | Diseñar Policy Center | Core Team | ready | Reglas en lenguaje humano. |
| `task-1301` | `ms-13` | Habilitar Trace/Replay | Core Team | planned | Vista reproducible paso a paso. |
| `task-1401` | `ms-14` | Formalizar comandos CLI | Core Team | ready | Contratos de run/approve/logs. |
| `task-1402` | `ms-14` | Verificar CLI multiplataforma | Core Team | planned | Linux/macOS/Windows. |
| `task-1501` | `ms-15` | Definir contrato SDK unificado | Core Team | ready | Paridad funcional UI/CLI. |
| `task-ts-qa-101` | `ms-ts-qa-01` | Configurar Vitest (100% cobertura) | Gemini | planned | Umbral obligatorio. |
| `task-ts-qa-102` | `ms-ts-qa-01` | Implementar generador Bogus/Faker | Gemini | planned | Para datos realistas en tests. |

## Criterios de éxito del plan
- Primera automatización útil en menos de 15 minutos.
- Riesgos comprensibles antes de aprobar acciones sensibles.
- Capacidad de explicar qué hizo el agente después de cada run.
- Reutilización de recetas sin fricción alta.
- **CLI de consola operativa y verificable como canal de fallback y automatización.**
- **SDK contract estable que garantice paridad funcional entre UI y CLI.**

## Esfuerzo acumulado
- **Puntos completados**: 87 pts
- **Puntos en progreso**: 15 pts
- **Puntos restantes**: 60 pts

## Control de cambios
Toda variación de tareas o estado se refleja en `STATUS.md` y se registra en `BITACORA.md`.
