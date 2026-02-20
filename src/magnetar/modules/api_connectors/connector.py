from dataclasses import dataclass, field

from magnetar.modules.base import ModuleSkeleton


@dataclass(slots=True)
class ApiConnectorsModule:
    """Skeleton for cloud/local API connector orchestration."""

    module: ModuleSkeleton = field(
        default_factory=lambda: ModuleSkeleton(
            name="api-connectors",
            description="Module skeleton for provider-agnostic API connectors.",
            owners=["Integrations Team"],
        )
    )
