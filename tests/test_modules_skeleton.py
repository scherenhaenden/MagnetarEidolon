from magnetar.modules.administration import SkillDefinition, SkillsAdministrationModule
from magnetar.modules.api_connectors import ApiConnectorsModule
from magnetar.modules.cross_platform_ui import CrossPlatformUIModule
from magnetar.modules.system_interaction import SystemInteractionModule


def test_skills_administration_registration() -> None:
    module = SkillsAdministrationModule()
    skill = SkillDefinition(
        name="skill-installer",
        description="Installs curated skills.",
        source="/opt/codex/skills/.system/skill-installer/SKILL.md",
    )

    module.register_skill(skill)

    assert module.get_skill("skill-installer") is not None
    assert len(module.list_skills()) == 1


def test_other_module_skeletons_initialize() -> None:
    assert ApiConnectorsModule().module.name == "api-connectors"
    assert SystemInteractionModule().module.name == "system-interaction"
    assert CrossPlatformUIModule().module.name == "cross-platform-ui"
