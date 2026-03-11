# Provider Configuration Module Architecture

## Goal
Maintain a dedicated provider-configuration state layer that defines which providers exist, which one is primary, which ones are backups, and how the runtime should interpret the failover chain.

## Target Shape
```text
[Provider Configuration UI]
            |
            v
[Provider Config State/Store]
            |
            v
[Runtime Handoff Contract]
            |
            v
[SDK Provider Adapters]
```

## Design Rules
1. Provider configuration must remain separate from provider transport implementations.
2. The configuration layer must allow multiple providers at once.
3. There must always be either one primary provider or a clearly invalid state surfaced to the UI.
4. Backup providers must preserve ordering for failover.
