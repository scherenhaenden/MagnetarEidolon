from dataclasses import dataclass, field
from typing import Dict, Tuple

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
        if skill.name in self._skills:
            raise ValueError(f"Skill '{skill.name}' is already registered. Use update_skill to modify existing skills.")
        self._skills[skill.name] = skill

    def update_skill(self, skill: SkillDefinition) -> None:
        if skill.name not in self._skills:
            raise ValueError(f"Skill '{skill.name}' is not registered. Use register_skill to add new skills.")
        self._skills[skill.name] = skill

    def list_skills(self) -> Tuple[SkillDefinition, ...]:
        return tuple(self._skills.values())

    def get_skill(self, name: str) -> SkillDefinition | None:
        return self._skills.get(name)
