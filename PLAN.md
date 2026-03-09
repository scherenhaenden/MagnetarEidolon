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

## Resumen de Milestones

| Milestone ID | Nombre | Fecha objetivo | Estado | Descripción |
| :--- | :--- | :--- | :--- | :--- |
| `ms-01` | Canon Bootstrap | 2026-03-05 | done | Establecer artefactos de gobernanza y planificación. |
| `ms-02` | Magnetar Model Baseline | 2026-03-12 | done | Definir arquitectura y esquema de proyecto. |
| `ms-ts-01` | TypeScript Core & SDK Migration | 2026-03-20 | in_progress | Migración del motor de razonamiento a TypeScript. |
| `ms-ts-qa-01` | TypeScript Testing & QA | 2026-03-30 | planned | Pirámide de pruebas y 100% cobertura en core. |
| `ms-11` | Experience Foundation | 2026-04-10 | in_progress | UI/UX base y catálogo de herramientas. |
| `ms-16` | UI Workspace Rehome & TS Delivery Pipeline | 2026-04-15 | in_progress | Reubicar la UI TypeScript a una estructura de producto y activar pipeline propio de validación. |
| `ms-12` | Trust & Policy Center | 2026-04-24 | ready | Centro de control de políticas y aprobaciones. |
| `ms-13` | Observability & Replay | 2026-05-08 | planned | Trazabilidad y reproducción de ejecuciones. |
| `ms-14` | CLI Operativa de Consola | 2026-04-17 | ready | Interfaz de línea de comandos unificada. |
| `ms-15` | SDK Contract Base | 2026-04-22 | ready | Contrato compartido entre UI y CLI. |
| `ms-04` | Project Initialization | 2026-05-15 | done | Estructura inicial y archivos de gobernanza. |
| `ms-05` | Core Implementation | 2026-06-01 | done | Implementación base histórica; código Python legado retirado. |
| `ms-06` | Tool System | 2026-06-15 | done | Abstracción de herramientas y herramientas OS. |
| `ms-07` | Memory & Knowledge | 2026-07-01 | done | Integración de LiteLLM y ChromaDB. |
| `ms-08` | Distribution | 2026-07-15 | done | Empaquetado y CLI inicial. |

## Backlog priorizado

| Task ID | Milestone | Título | Propietario | Estado | Notas |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `task-101` | `ms-01` | Crear base de documentación canónica | Core Team | done | Archivos canónicos iniciales creados. |
| `task-102` | `ms-02` | Borrador de arquitectura Magnetar | Core Team | in_review | Validar contra docs de arquitectura. |
| `task-103` | `ms-02` | Plantilla de esquema YAML | Core Team | done | `_template.project.yml` completado. |
| `task-ts-101` | `ms-ts-01` | Portar estado MagnetarModel a TS | Gemini | done | Definido en `core/models.ts`. |
| `task-ts-102` | `ms-ts-01` | Portar Reasoning Loop a TS | Gemini | done | Definido en `core/agent.ts`. |
| `task-ts-103` | `ms-ts-01` | Implementar interfaces SDK | Gemini | done | Definido en `core/interfaces.ts`. |
| `task-ts-104` | `ms-ts-01` | Crear adaptadores de Node.js (CLI) | Gemini | done | `core/tools/node-filesystem.ts` creado. |
| `task-ts-105` | `ms-ts-01` | Crear adaptadores de Browser (Web) | Gemini | done | `core/tools/web-filesystem.ts` creado. |
| `task-ts-106` | `ms-ts-01` | Integrar SDK en Angular Shell | Gemini | done | Integración en app.component.ts. |
| `task-ts-107` | `ms-ts-01` | Implementar servicio LLM Provider | Gemini | done | Interfaz y uso en agente implementados. |
| `task-ts-qa-101` | `ms-ts-qa-01` | Configurar Vitest (100% cobertura) | Gemini | done | Umbral obligatorio habilitado en vitest.config.ts. |
| `task-ts-qa-102` | `ms-ts-qa-01` | Implementar generador Bogus/Faker | Gemini | planned | Para datos realistas en tests. |
| `task-ts-qa-103` | `ms-ts-qa-01` | Tests unitarios de modelos de estado | Gemini | planned | |
| `task-ts-qa-104` | `ms-ts-qa-01` | Tests unitarios de MagnetarAgent loop | Gemini | planned | |
| `task-ts-qa-105` | `ms-ts-qa-01` | Tests de integración tool-agent-memory | Gemini | planned | |
| `task-ts-qa-106` | `ms-ts-qa-01` | Tests E2E de aceptación (CLI/Web) | Gemini | planned | |
| `task-ts-qa-107` | `ms-16` | Activar pipeline CI para TypeScript UI | Core Team | in_review | Workflow dedicado creado para install, test y typecheck del workspace UI. |
| `task-ts-qa-108` | `ms-16` | Validar el propio sistema de tests | Core Team | in_progress | Smoke suite inicial y cobertura activadas; falta ampliar meta-validación. |
| `task-1101` | `ms-11` | Definir IA UX flow de onboarding | Core Team | in_progress | 7 pasos de flujo ideal. |
| `task-1102` | `ms-11` | Implementar Tool Catalog | Core Team | ready | Con visibilidad de riesgo/alcance. |
| `task-1103` | `ms-16` | Reubicar la UI TS a `apps/magnetar-ui` | Core Team | in_review | Workspace movido y referencias activas actualizadas desde el nombre temporal anterior. |
| `task-1104` | `ms-16` | Definir separación futura UI/SDK | Core Team | in_progress | Extracción activa del runtime compartido hacia `packages/magnetar-sdk`. |
| `task-ui-109` | `ms-16` | Habilitar entrypoints reales de UI web y CLI | Core Team | in_progress | Rama `feature/init-runnable-web-ui` activa; Angular real, scripts web/CLI y pipeline de arranque en implementación. |
| `task-1201` | `ms-12` | Diseñar Policy Center | Core Team | ready | Reglas en lenguaje humano. |
| `task-1301` | `ms-13` | Habilitar Trace/Replay | Core Team | planned | Vista reproducible paso a paso. |
| `task-1401` | `ms-14` | Formalizar comandos CLI | Core Team | ready | Contratos de run/approve/logs. |
| `task-1402` | `ms-14` | Verificar CLI multiplataforma | Core Team | planned | Linux/macOS/Windows. |
| `task-1501` | `ms-15` | Definir contrato SDK unificado | Core Team | in_progress | El paquete `packages/magnetar-sdk` pasa a representar el contrato compartido. |
| `task-1502` | `ms-15` | Publicar guía de integración | Core Team | in_progress | Documentar consumo desde UI y próximos clientes CLI. |
| `task-104` | `ms-03` | Definir gobernanza de branching/WIP | Core Team | ready | Pendiente revisión. |
| `task-105` | `ms-03` | Establecer controles de test/blocker | Core Team | in_progress | Borrador de mecanismos de escalado. |
| `task-201` | `ms-04` | Crear archivos de doc canónica | Jules | done | RULES, PLAN, etc. |
| `task-202` | `ms-04` | Setup de estructura de repositorio Git | Jules | done | |
| `task-203` | `ms-04` | Definir plantilla YAML de proyecto | Jules | done | |
| `task-301` | `ms-05` | Esquema Pydantic de MagnetarModel | Jules | done | |
| `task-302` | `ms-05` | Controlador de Agent Loop | Jules | done | |
| `task-401` | `ms-06` | Interfaz abstracta de herramientas | Jules | done | |
| `task-402` | `ms-06` | Herramientas de sistema de archivos | Jules | done | |
| `task-501` | `ms-07` | Proveedor LiteLLM | Jules | done | |
| `task-502` | `ms-07` | Setup de ChromaDB para memoria | Jules | done | |
| `task-601` | `ms-08` | Construir CLI con Typer | Jules | done | |
| `task-voice-101` | `ms-voice-01` | Setup estructura (Voice UI) | Jules | in_progress | |
| `task-voice-102` | `ms-voice-01` | Lógica e interfaz Voice UI | Jules | planned | |

## Criterios de éxito del plan
- Primera automatización útil en menos de 15 minutos.
- Riesgos comprensibles antes de aprobar acciones sensibles.
- Capacidad de explicar qué hizo el agente después de cada run.
- Reutilización de recetas sin fricción alta.
- **CLI de consola operativa y verificable como canal de fallback y automatización.**
- **SDK contract estable que garantice paridad funcional entre UI y CLI.**

## Esfuerzo acumulado
- **Total esfuerzo estimado**: 165 pts
- **Puntos completados**: 108 pts
- **Puntos en progreso**: 15 pts
- **Puntos restantes**: 42 pts

## Control de cambios
Toda variación de tareas o estado se refleja en `STATUS.md` y se registra en `BITACORA.md`.
