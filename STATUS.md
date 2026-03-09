# Estado actual — MagnetarEidolon

## Resumen
**Progreso global estimado:** 72%
`[██████████████░░░░░░] 72%`

## Dirección actual
El repositorio opera en un estado de transición controlada. La implementación en Python sigue activa mientras se valida el prototipo en TypeScript como sucesor para la arquitectura unificada CLI/Web. Una vez validado el prototipo TypeScript, se retirará el código Python legado. Hasta entonces, Python es el baseline activo y TypeScript es el track estratégico de migración.

## Enfoque inmediato
- Consolidar la UI TypeScript ya reubicada en `apps/magnetar-ui`.
- Convertir `apps/magnetar-ui` en una superficie realmente arrancable para web y CLI, no solo validable por build/tests.
- Activar y estabilizar pipeline propio para validación TypeScript sin depender solo del CI Python legado.
- Ejecutar la extracción del runtime compartido a `packages/magnetar-sdk` y fijar su contrato inicial.

## Hitos (Milestones)

| Milestone ID | Nombre | Estado | Fecha objetivo |
| :--- | :--- | :--- | :--- |
| `ms-01` | Canon Bootstrap | Finalizado | 2026-03-05 |
| `ms-02` | Magnetar Model Baseline | Finalizado | 2026-03-12 |
| `ms-ts-01` | TypeScript Core & SDK Migration | En curso | 2026-03-20 |
| `ms-11` | Experience Foundation | En curso | 2026-04-10 |
| `ms-16` | UI Workspace Rehome & TS Delivery Pipeline | En curso | 2026-04-15 |
| `ms-14` | CLI Operativa de Consola | Listo | 2026-04-17 |
| `ms-15` | SDK Contract Base | Listo | 2026-04-22 |
| `ms-04` | Project Initialization & Governance | Finalizado | 2026-05-15 |
| `ms-05` | Core Architecture Implementation | Finalizado | 2026-06-01 |
| `ms-06` | Tool System & OS Integration | Finalizado | 2026-06-15 |
| `ms-07` | Memory & Knowledge Systems | Finalizado | 2026-07-01 |
| `ms-08` | Interface & Distribution | Finalizado | 2026-07-15 |

## Estado por frente

| Frente | Estado | Nota |
| :--- | :--- | :--- |
| Visión de producto | aligned | Principios y roadmap definidos. |
| UX MVP | in_progress | Onboarding y pantallas núcleo en definición detallada. |
| Migración TS | in_progress | Core portado, adaptadores de entorno en validación. |
| UI workspace rehome | in_review | Workspace movido a `apps/magnetar-ui`; pendiente consolidación post-move. |
| Runtime startup UX | in_progress | La inicialización real del workspace web está activa en `feature/init-runnable-web-ui`; el build web ya forma parte de la validación local. |
| TS test pipeline | in_review | Workflow dedicado creado y validado localmente con tests + typecheck. |
| Trust/Policy model | ready | Reglas de aprobación listas para implementación. |
| **CLI de consola** | **ready** | Incluida como acometido formal con validación cross-platform. |
| **SDK contract** | **in_progress** | Extracción física del runtime compartido en curso hacia `packages/magnetar-sdk`. |

## Riesgos y Mitigaciones

1.  **Riesgo**: Desincronización entre docs Markdown y estado YAML del proyecto.
    -   **Mitigación**: Sincronización obligatoria en cada PR y registros en BITACORA.
2.  **Riesgo**: Brechas de paridad entre UI y CLI.
    -   **Mitigación**: Uso de un SDK contract compartido y validación multiplataforma.
3.  **Riesgo**: Diferencias de OS (rutas, shell) en el Tool System.
    -   **Mitigación**: Uso de librerías estándar de abstracción de rutas y validación cruzada.
4.  **Riesgo**: Rendimiento de LLM local (Ollama).
    -   **Mitigación**: Proveedor agnóstico que permite saltar a modelos más potentes si es necesario.
5.  **Riesgo**: Consistencia de API entre Node.js y Browser para el SDK compartido.
    -   **Mitigación**: Interfaces estrictas en `core/interfaces.ts` y adaptadores específicos por entorno.

## Cadencia de reporte
Actualización al menos una vez al día e inmediatamente después de cada PR mergeado.
