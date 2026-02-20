import typer
import uuid
import os
from typing import Optional
from pathlib import Path
from rich.console import Console
from rich.panel import Panel

from magnetar.core.model import MagnetarEidolon, Goal
from magnetar.core.agent import MagnetarAgent
from magnetar.tools.filesystem import FileReadTool, FileWriteTool, ListDirectoryTool
from magnetar.tools.shell import ShellCommandTool
from magnetar.memory.chroma import ChromaMemoryStore
from magnetar.llm.provider import LLMProvider

app = typer.Typer()
console = Console()

def load_or_create_agent(goal_desc: str) -> MagnetarAgent:
    """Initialize the agent with dependencies."""

    # State
    goal = Goal(id=str(uuid.uuid4()), description=goal_desc)
    state = MagnetarEidolon(
        agent_id="local-agent",
        goal=goal,
        environment=None # Would be populated by observe()
    )

    # Tools
    tools = [
        FileReadTool(),
        FileWriteTool(),
        ListDirectoryTool(),
        ShellCommandTool()
    ]

    # Memory
    memory = ChromaMemoryStore(persist_directory="./agent_memory")

    # LLM
    # In a real scenario, API keys would come from env
    api_key = os.getenv("OPENAI_API_KEY") or "mock-key"
    llm = LLMProvider(model="gpt-3.5-turbo", api_key=api_key)

    agent = MagnetarAgent(state, tools, memory, llm)
    return agent

@app.command()
def init():
    """Initialize a new Magnetar project/agent configuration."""
    console.print(Panel("Magnetar Agent Initialization", style="bold green"))
    # Logic to create config files, etc.
    typer.echo("Initialized project structure.")

@app.command()
def run(goal: str = typer.Option(..., prompt="What is the goal?"), max_steps: int = 10):
    """Run the agent with a specific goal."""
    console.print(f"[bold blue]Starting agent with goal:[/bold blue] {goal}")

    agent = load_or_create_agent(goal)

    try:
        agent.run(max_steps=max_steps)
        console.print("[bold green]Agent finished.[/bold green]")
        if agent.state.goal.status == "completed":
             console.print(f"[green]Result:[/green] {agent.state.short_term_memory[-1].content}")
        else:
             console.print("[yellow]Goal not explicitly marked as completed.[/yellow]")

    except Exception as e:
        console.print(f"[bold red]Error:[/bold red] {e}")

if __name__ == "__main__":
    app()
