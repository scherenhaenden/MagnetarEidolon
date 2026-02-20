from dataclasses import dataclass, field

from magnetar.modules.base import ModuleSkeleton


@dataclass(slots=True)
class SystemInteractionModule:
    """Skeleton for desktop/shell integration boundaries."""

    module: ModuleSkeleton = field(
        default_factory=lambda: ModuleSkeleton(
            name="system-interaction",
            description="Module skeleton for local automation adapters.",
            owners=["Automation Team"],
        )
    )
