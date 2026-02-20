from __future__ import annotations

from abc import ABC, abstractmethod
from dataclasses import dataclass, field
from datetime import datetime, timezone
from pathlib import Path
from typing import Callable, Dict, List, Optional, Sequence
import shlex
import subprocess


@dataclass(slots=True)
class PermissionDecision:
    allowed: bool
    reason: str


@dataclass(slots=True)
class AuditEvent:
    timestamp: str
    action: str
    target: str
    allowed: bool
    reason: str
    details: Dict[str, str] = field(default_factory=dict)


class PermissionPolicy:
    """Simple allowlist-based policy for local automation actions."""

    def __init__(
        self,
        allowed_commands: Optional[Sequence[str]] = None,
        denied_commands: Optional[Sequence[str]] = None,
        allowed_desktop_apps: Optional[Sequence[str]] = None,
    ) -> None:
        self.allowed_commands = {c.lower() for c in (allowed_commands or [])}
        self.denied_commands = {c.lower() for c in (denied_commands or [])}
        self.allowed_desktop_apps = {a.lower() for a in (allowed_desktop_apps or [])}

    def evaluate_command(self, command: str) -> PermissionDecision:
        command = command.strip()
        if not command:
            return PermissionDecision(False, "Empty command is not allowed")

        if any(token in command for token in ("|", "&&", "||", ";", "$(", "`", ">", "<", "&")):
            return PermissionDecision(
                False,
                "Shell operators are not supported; provide a single executable with plain arguments",
            )

        tokens = shlex.split(command)
        if not tokens:
            return PermissionDecision(False, "Invalid command")
        first_token = tokens[0].lower()
        for token in tokens:
            if token.lower() in self.denied_commands:
                return PermissionDecision(False, f"Command '{token}' explicitly denied")
        if first_token in self.denied_commands:
            return PermissionDecision(False, f"Command '{first_token}' explicitly denied")

        if self.allowed_commands and first_token not in self.allowed_commands:
            return PermissionDecision(False, f"Command '{first_token}' not in allowlist")

        return PermissionDecision(True, "Command approved")

    def evaluate_desktop_action(self, app_name: str) -> PermissionDecision:
        app_name = app_name.strip().lower()
        if not app_name:
            return PermissionDecision(False, "Application name is required")
        if self.allowed_desktop_apps and app_name not in self.allowed_desktop_apps:
            return PermissionDecision(False, f"Desktop app '{app_name}' not in allowlist")
        return PermissionDecision(True, "Desktop action approved")


class AuditLogger:
    """In-memory audit logger with optional hook for external sinks."""

    def __init__(self, sink: Optional[Callable[[AuditEvent], None]] = None) -> None:
        self._sink = sink
        self._events: List[AuditEvent] = []

    def record(self, event: AuditEvent) -> None:
        self._events.append(event)
        if self._sink:
            self._sink(event)

    def events(self) -> List[AuditEvent]:
        return list(self._events)


class CommandExecutor(ABC):
    @abstractmethod
    def run(self, command: str, timeout_s: int = 60) -> subprocess.CompletedProcess[str]:
        raise NotImplementedError


class SubprocessCommandExecutor(CommandExecutor):
    def run(self, command: str, timeout_s: int = 60) -> subprocess.CompletedProcess[str]:
        args = shlex.split(command)
        return subprocess.run(args, capture_output=True, text=True, timeout=timeout_s, check=False)


class DesktopAppConnector(ABC):
    """Abstract contract for connectors to desktop apps (Slack/Teams/Telegram/etc)."""

    app_name: str

    @abstractmethod
    def send_message(self, channel: str, message: str) -> str:
        raise NotImplementedError


class StubDesktopConnector(DesktopAppConnector):
    """Test connector used until concrete provider adapters are added."""

    def __init__(self, app_name: str) -> None:
        self.app_name = app_name
        self.sent_messages: List[Dict[str, str]] = []

    def send_message(self, channel: str, message: str) -> str:
        self.sent_messages.append({"channel": channel, "message": message})
        return f"queued:{self.app_name}:{channel}"


class SystemInteractionModule:
    """Orchestrates command and desktop interactions with policy + auditing."""

    def __init__(
        self,
        policy: PermissionPolicy,
        audit_logger: AuditLogger,
        command_executor: Optional[CommandExecutor] = None,
        desktop_connectors: Optional[Sequence[DesktopAppConnector]] = None,
    ) -> None:
        self.policy = policy
        self.audit = audit_logger
        self.command_executor = command_executor or SubprocessCommandExecutor()
        connectors = desktop_connectors or []
        self.desktop_connectors = {c.app_name.lower(): c for c in connectors}

    def run_command(self, command: str, timeout_s: int = 60) -> subprocess.CompletedProcess[str] | None:
        decision = self.policy.evaluate_command(command)
        self._audit(action="command", target=command, allowed=decision.allowed, reason=decision.reason)
        if not decision.allowed:
            return None
        return self.command_executor.run(command=command, timeout_s=timeout_s)

    def send_desktop_message(self, app_name: str, channel: str, message: str) -> Optional[str]:
        decision = self.policy.evaluate_desktop_action(app_name)
        self._audit(action="desktop_message", target=app_name, allowed=decision.allowed, reason=decision.reason)
        if not decision.allowed:
            return None
        connector = self.desktop_connectors.get(app_name.lower())
        if connector is None:
            self._audit(
                action="desktop_message",
                target=app_name,
                allowed=False,
                reason="No connector registered for app",
            )
            return None
        return connector.send_message(channel=channel, message=message)

    def _audit(self, action: str, target: str, allowed: bool, reason: str) -> None:
        self.audit.record(
            AuditEvent(
                timestamp=datetime.now(timezone.utc).isoformat(),
                action=action,
                target=target,
                allowed=allowed,
                reason=reason,
            )
        )
