from dataclasses import dataclass, field
from typing import Dict, List

from magnetar.modules.base import ModuleSkeleton


@dataclass(slots=True)
class SkillDefinition:
    """Minimal skill contract for administration operations."""

    name: str
    description: str
    source: str


@dataclass(slots=True)
class SkillsAdministrationModule:
    """Administration skeleton for managing skill registration and discovery."""

    module: ModuleSkeleton = field(
        default_factory=lambda: ModuleSkeleton(
            name="administration-skills",
            description="Administration module for skill inventory and lifecycle scaffolding.",
            owners=["Core Team"],
        )
    )
    _skills: Dict[str, SkillDefinition] = field(default_factory=dict)

    def register_skill(self, skill: SkillDefinition) -> None:
        self._skills[skill.name] = skill

    def list_skills(self) -> List[SkillDefinition]:
        return list(self._skills.values())

    def get_skill(self, name: str) -> SkillDefinition | None:
        return self._skills.get(name)
