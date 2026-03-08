# Requisitos de MagnetarEidolon

## Objetivo de producto
Construir una plataforma de agentes que combine potencia operativa con control humano explícito, basada en simplicidad de uso, confianza y observabilidad total.

## Requisitos funcionales (FR)

### Experiencia y flujo
- **FR-01 (Must)**: El onboarding ideal debe cubrir trust mode, habilitación de herramientas, carga de contexto, objetivo, plan y aprobaciones.
- **FR-02 (Must)**: La UI debe exponer Dashboard, Live Execution, Tool Catalog, Memory Inspector, Trace/Replay y Policy Center.
- **FR-03 (Should)**: Debe existir Recipe Builder para flujos reutilizables.

### Confianza y políticas
- **FR-04 (Must)**: Toda acción de impacto debe clasificarse por nivel de riesgo.
- **FR-05 (Must)**: Operaciones de escritura/modificación requieren aprobación por defecto.
- **FR-06 (Must)**: Acciones destructivas requieren doble confirmación o simulación previa.
- **FR-07 (Must)**: Toda acción sensible debe dejar evidencia auditable.
- **FR-08 (Must)**: Toda receta importada inicia deshabilitada y pasa revisión de permisos.

### Motor agente y memoria
- **FR-09 (Must)**: Separación estricta entre estado cognitivo serializable y loop de ejecución.
- **FR-10 (Must)**: Memoria de corto y largo plazo debe ser visible y administrable (ver, fijar, borrar).
- **FR-11 (Should)**: Reglas y políticas deben ser editables desde Markdown/versionado.

### Interfaces
- **FR-12 (Must)**: Debe existir una **CLI de consola** para ejecutar objetivos, observar progreso, aprobar/denegar acciones y consultar trazas.
- **FR-13 (Must)**: La CLI y la UI deben compartir semántica de estados y eventos.
- **FR-14 (Must)**: Debe existir un **SDK/Runtime Contract** consumible por CLI y UI para evitar duplicación de lógica.
- **FR-15 (Should)**: El SDK debe exponer comandos/operaciones de alto nivel: `run`, `status`, `approve`, `deny`, `logs`, `trace`.

## Requisitos no funcionales (NFR)
- **NFR-01 (Must)**: Portabilidad Linux/macOS/Windows.
- **NFR-02 (Must)**: Observabilidad estructurada (logs/eventos/replay) para auditoría y debugging.
- **NFR-03 (Must)**: Seguridad por defecto orientada a "trust by design".
- **NFR-04 (Must)**: Latencia y complejidad percibida deben permitir primer valor < 15 min.
- **NFR-05 (Should)**: Arquitectura modular para cambiar proveedor de modelos y tool adapters sin rehacer el sistema.
- **NFR-06 (Must)**: Compatibilidad hacia atrás razonable del SDK contract entre versiones menores.

## Criterios de aceptación
1. El usuario entiende qué hará el agente antes de ejecutar acciones de riesgo.
2. Puede reconstruir el "qué" y el "por qué" de una ejecución completa.
3. Puede operar el sistema desde UI o **CLI** sin perder gobernanza.
4. El mismo flujo es ejecutable vía SDK sin cambiar semántica de políticas/eventos.
