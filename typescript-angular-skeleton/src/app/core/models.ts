export interface Goal {
  id: string;
  description: string;
  createdAt: Date;
  status: 'pending' | 'active' | 'completed' | 'failed';
}

export interface Task {
  id: string;
  description: string;
  status: 'planned' | 'in_progress' | 'completed' | 'failed';
  result?: string;
}

export interface MemoryItem {
  id: string;
  content: string;
  embeddingId?: string;
  timestamp: Date;
  metadata: Record<string, any>;
}

export interface ToolCall {
  toolName: string;
  arguments: Record<string, any>;
  result?: string;
  error?: string;
  timestamp: Date;
}

export interface EnvironmentSnapshot {
  os: string;
  currentDirectory: string;
  timestamp: Date;
}

/**
 * The structured cognition state of the Magnetar agent.
 * This interface encapsulates the entire 'mind' of the agent and is serializable.
 */
export interface MagnetarEidolon {
  agentId: string;
  goal?: Goal;
  plan: Task[];
  shortTermMemory: MemoryItem[];
  toolHistory: ToolCall[];
  environment?: EnvironmentSnapshot;
  metadata: Record<string, any>;
}
