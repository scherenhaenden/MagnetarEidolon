# MagnetarEidolon

[![CI (Linux)](https://github.com/scherenhaenden/MagnetarEidolon/actions/workflows/ci-linux.yml/badge.svg)](https://github.com/scherenhaenden/MagnetarEidolon/actions/workflows/ci-linux.yml)
[![CI (macOS)](https://github.com/scherenhaenden/MagnetarEidolon/actions/workflows/ci-macos.yml/badge.svg)](https://github.com/scherenhaenden/MagnetarEidolon/actions/workflows/ci-macos.yml)
[![CI (Windows)](https://github.com/scherenhaenden/MagnetarEidolon/actions/workflows/ci-windows.yml/badge.svg)](https://github.com/scherenhaenden/MagnetarEidolon/actions/workflows/ci-windows.yml)
[![Release](https://github.com/scherenhaenden/MagnetarEidolon/actions/workflows/release.yml/badge.svg)](https://github.com/scherenhaenden/MagnetarEidolon/actions/workflows/release.yml)
[![License](https://img.shields.io/github/license/scherenhaenden/MagnetarEidolon)](https://github.com/scherenhaenden/MagnetarEidolon/blob/master/LICENSE)

## Propósito
MagnetarEidolon evoluciona hacia una plataforma de agentes enfocada en **simplicidad, confianza y observabilidad total**.

Promesa del producto:

> **"Build, run, observe, and trust AI agents without technical chaos."**

Este repositorio mantiene el marco documental y técnico para aterrizar esa visión en entregables verificables.

## Principios rectores
1. Simplicidad radical para empezar en minutos.
2. Confianza por diseño (acciones de riesgo siempre visibles/aprobables).
3. Observabilidad completa de planes, pasos y resultados.
4. Control humano permanente.
5. Memoria explícita, editable y gobernable.
6. Experiencia premium tipo command-center.

## Modos de uso del producto
- **Execution Mode**: ejecutar objetivos rápido.
- **Build Mode**: crear recetas/flows reutilizables.
- **Debug Mode**: inspeccionar decisiones, costos y errores.

## ¿Esto implica un SDK?
Sí. Si existe una CLI operativa y una UI con semántica compartida, debe existir un **núcleo reutilizable tipo SDK** (librería interna/externa) que exponga contratos estables para:
- ejecutar runs,
- consultar estado,
- aprobar/denegar acciones,
- recuperar trazas y logs.

La CLI no debe duplicar lógica de negocio; debe consumir ese SDK/Runtime Contract.

## Documentación canónica
| Archivo | Rol |
| :--- | :--- |
| `NEW_PLAN.md` | Visión de producto y dirección estratégica base. |
| `PLAN.md` | Roadmap operativo por fases, milestones y acometidos. |
| `REQUIREMENTS.md` | Requisitos funcionales/no funcionales alineados a la nueva visión. |
| `ARCHITECTURE.md` | Arquitectura objetivo para UI, motor agente, políticas y memoria. |
| `STATUS.md` | Estado actual, riesgos y próximos compromisos. |
| `TESTING.md` | Estrategia de validación técnica y de producto. |

## Estado de Transición
El repositorio se encuentra en una fase de transición estratégica:
- La implementación en Python sigue activa mientras se evalúa el prototipo en TypeScript.
- La UI TypeScript ya vive en `apps/magnetar-ui` y deja de tratarse como un "skeleton" permanente.
- El camino objetivo para la arquitectura unificada CLI/Web es `apps/magnetar-ui` + un runtime compartido que más adelante vivirá en `packages/magnetar-sdk`.
- Los planes y pruebas de calidad ahora priorizan la migración a TypeScript.
- Una vez validado el prototipo TypeScript, se procederá a retirar el código Python legado.

## Acometidos inmediatos
1. Consolidar experiencia MVP con Dashboard + Live Execution + Policy Center.
2. Garantizar trazabilidad de acciones sensibles con aprobación humana.
3. Mantener **CLI de consola** como interfaz oficial de operación/diagnóstico.
4. Formalizar el **SDK contract** que consumen tanto UI como CLI.

## Información adicional
- `docs/MAGNETAR_TECHNOLOGY_STACK.md`: decisiones tecnológicas y justificación para Linux, macOS y Windows.

## Nota de gobernanza
Cualquier cambio de alcance debe sincronizarse en `NEW_PLAN.md`, `PLAN.md`, `REQUIREMENTS.md` y `STATUS.md` en el mismo PR para evitar deriva documental.
