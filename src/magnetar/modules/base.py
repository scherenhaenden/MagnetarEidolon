from dataclasses import dataclass, field
from enum import Enum
from typing import Dict, List


class ModuleLifecycle(str, Enum):
    """Simple lifecycle for module skeletons."""

    PLANNED = "planned"
    IN_PROGRESS = "in_progress"
    IN_REVIEW = "in_review"
    DONE = "done"


@dataclass(slots=True)
class ModuleSkeleton:
    """Shared skeleton descriptor for Magnetar modules."""

    name: str
    description: str
    owners: List[str] = field(default_factory=list)
    lifecycle: ModuleLifecycle = ModuleLifecycle.PLANNED
    metadata: Dict[str, str] = field(default_factory=dict)

    def mark_in_progress(self) -> None:
        self.lifecycle = ModuleLifecycle.IN_PROGRESS

    def mark_in_review(self) -> None:
        self.lifecycle = ModuleLifecycle.IN_REVIEW

    def mark_done(self) -> None:
        self.lifecycle = ModuleLifecycle.DONE
