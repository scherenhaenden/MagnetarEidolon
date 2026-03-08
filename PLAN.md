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

| Milestone ID | Nombre | Fecha objetivo | Estado |
| :--- | :--- | :--- | :--- |
| `ms-11` | Experience Foundation | 2026-04-10 | in_progress |
| `ms-12` | Trust & Policy Center | 2026-04-24 | ready |
| `ms-13` | Observability & Replay | 2026-05-08 | planned |
| `ms-14` | CLI Operativa de Consola | 2026-04-17 | ready |
| `ms-15` | SDK Contract Base | 2026-04-22 | ready |

## Backlog priorizado (acometidos)

| Task ID | Milestone | Título | Estado | Entregable |
| :--- | :--- | :--- | :--- | :--- |
| `task-1101` | `ms-11` | Definir IA UX flow de onboarding ideal (7 pasos) | in_progress | Flujo validado en `REQUIREMENTS.md` y prototipo navegable. |
| `task-1102` | `ms-11` | Implementar Tool Catalog con riesgo/alcance visible | ready | Catálogo con etiquetas de riesgo legibles para usuario. |
| `task-1201` | `ms-12` | Diseñar Policy Center en lenguaje humano | ready | Reglas comprensibles para aprobaciones y acciones destructivas. |
| `task-1301` | `ms-13` | Habilitar Trace/Replay paso a paso | planned | Vista reproducible de decisiones, llamadas a tools y resultados. |
| `task-1401` | `ms-14` | Formalizar comandos CLI para run/approve/deny/status/logs | ready | Especificación de comandos y contratos de salida. |
| `task-1402` | `ms-14` | Verificar CLI de consola en Linux/macOS/Windows | planned | Evidencia de pruebas cruzadas y checklist de paridad. |
| `task-1501` | `ms-15` | Definir SDK contract (run/status/approve/deny/logs/trace) | ready | Especificación versionada del contrato compartido UI/CLI. |
| `task-1502` | `ms-15` | Publicar guía de integración para CLI y UI | planned | Ejemplos de consumo y reglas de compatibilidad. |

## Criterios de éxito del plan
- Primera automatización útil en menos de 15 minutos.
- Riesgos comprensibles antes de aprobar acciones sensibles.
- Capacidad de explicar qué hizo el agente después de cada run.
- Reutilización de recetas sin fricción alta.
- **CLI de consola operativa y verificable como canal de fallback y automatización.**
- **SDK contract estable que garantice paridad funcional entre UI y CLI.**

## Control de cambios
Toda variación de tareas o estado se refleja en `STATUS.md` y se registra en `BITACORA.md`.
