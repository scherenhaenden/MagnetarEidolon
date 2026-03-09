# Arquitectura de MagnetarEidolon

## Principio rector
La arquitectura prioriza tres propiedades: **control humano**, **trazabilidad total** y **operación multimodal (UI + CLI)**.

## Vista de alto nivel
```text
+-----------------------------+
| UX Layer                    |
| Dashboard / Live / Builder  |
+-------------+---------------+
              |
              v
+-----------------------------+
| Orchestrator / Agent Core   |
| plan -> decide -> act       |
+------+------+---------------+
       |      |
       |      +-------------------+
       |                          |
       v                          v
+-------------+          +-------------------+
| Policy Gate |          | Observability Hub |
| risk/approve|          | logs/traces/replay|
+------+------+          +---------+---------+
       |                           |
       v                           v
+-----------------------------+
| SDK / Runtime Contract      |
| run/status/approve/deny/... |
+--------------+--------------+
               |
      +--------+--------+
      |                 |
      v                 v
+---------------+  +----------------+
| CLI Interface |  | UI Integrations|
+---------------+  +----------------+
```


## Componentes clave
- **UX Layer**: interfaz principal para onboarding, ejecución y depuración.
- **Agent Core**: ejecuta objetivos por pasos y actualiza estado cognitivo serializable.
- **Policy Gate**: decide cuándo pedir aprobación y aplica reglas de riesgo.
- **Observability Hub**: captura eventos, decisiones, costos y evidencia auditable.
- **Tool Runtime**: adaptadores multiplataforma para filesystem, shell, web y conectores.
- **SDK / Runtime Contract**: capa reutilizable con operaciones de ejecución (`run`, `status`, `approve`, `deny`, `logs`, `trace`).
- **Memory System**: contexto inmediato + memoria persistente para aprendizaje reutilizable.
- **CLI Interface**: canal operativo oficial para consola/automatización y fallback sin UI.

## Decisiones de diseño
1. UI y CLI comparten el mismo contrato de ejecución y estados vía SDK.
2. La CLI es un cliente del SDK (no una implementación paralela del core).
3. Las acciones destructivas nunca hacen bypass del `Policy Gate`.
4. Cada decisión del agente es reproducible desde `Trace/Replay`.
5. La memoria del agente siempre es inspeccionable por el usuario.

## Estructura de repositorio objetivo
- `apps/magnetar-ui`: shell de producto para Dashboard, Live Execution, Builder, Memory y Policy Center.
- `packages/magnetar-sdk`: contrato/runtime compartido para estado, agente, herramientas y operaciones consumidas por UI y CLI.
- `src/magnetar`: baseline Python legado mientras se valida la transición TypeScript.
- `.github/workflows`: pipelines separados para Python legacy, UI TypeScript y empaquetado/release.

## Decisión de transición activa
- El directorio temporal `typescript-angular-skeleton` deja de representar el destino arquitectónico deseado.
- La UI debe vivir bajo una estructura de producto explícita (`apps/magnetar-ui`) para evitar que un nombre de prototipo condicione la arquitectura.
- La extracción del runtime compartido hacia `packages/magnetar-sdk` está en ejecución para separar claramente producto UI y contrato reusable.
