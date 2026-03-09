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
