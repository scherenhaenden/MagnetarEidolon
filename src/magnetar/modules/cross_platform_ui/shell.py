from dataclasses import dataclass, field

from magnetar.modules.base import ModuleSkeleton


@dataclass(slots=True)
class CrossPlatformUIModule:
    """Skeleton for a unified UI shell across operating systems."""

    module: ModuleSkeleton = field(
        default_factory=lambda: ModuleSkeleton(
            name="cross-platform-ui",
            description="Module skeleton for shared UI shell and adapters.",
            owners=["UI Team"],
        )
    )
