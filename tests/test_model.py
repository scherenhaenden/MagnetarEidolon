import json
from datetime import datetime
from magnetar.core.model import MagnetarEidolon, Goal, Task, MemoryItem, ToolCall, EnvironmentSnapshot

def test_model_serialization():
    # Create a sample state
    goal = Goal(id="goal-001", description="Build a spaceship")
    task = Task(id="task-001", description="Gather resources")
    memory = MemoryItem(id="mem-001", content="Found iron ore at (10, 20)")
    tool_call = ToolCall(tool_name="list_files", arguments={"path": "."}, result="file1.txt, file2.txt")
    env = EnvironmentSnapshot(os="Linux", current_directory="/home/user")

    eidolon = MagnetarEidolon(
        agent_id="agent-alpha",
        goal=goal,
        plan=[task],
        short_term_memory=[memory],
        tool_history=[tool_call],
        environment=env,
        metadata={"version": "1.0"}
    )

    # Serialize
    json_str = eidolon.to_json()
    print("Serialized JSON:", json_str)

    # Deserialize
    reconstructed = MagnetarEidolon.from_json(json_str)

    # Assertions
    assert reconstructed.agent_id == "agent-alpha"
    assert reconstructed.goal.description == "Build a spaceship"
    assert len(reconstructed.plan) == 1
    assert reconstructed.plan[0].description == "Gather resources"
    assert reconstructed.environment.os == "Linux"

    print("Serialization test passed!")

if __name__ == "__main__":
    test_model_serialization()
