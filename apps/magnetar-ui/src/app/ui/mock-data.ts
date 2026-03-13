export type AgentStatus = 'active' | 'idle' | 'error';
export type AgentType = 'Orchestrator' | 'Reviewer' | 'Operations' | 'assistant' | 'tool' | 'system';

export interface Agent {
  id: string;
  name: string;
  status: AgentStatus;
  type: AgentType;
  runs: number;
  latency: string;
}

export type RunStatus = 'success' | 'pending_approval' | 'failed' | 'running' | 'completed';

export interface Run {
  id: string;
  agent: string;
  status: RunStatus;
  time: string;
  tokens: string;
  cost: string;
}

export type ToolCategory = 'Databases' | 'Infrastructure' | 'VCS' | 'APIs' | 'Automation';
export type ToolTrust = 'Low' | 'Medium' | 'High' | 'Critical';
export type ToolStatus = 'connected' | 'requires_auth' | 'disconnected';

export interface Tool {
  name: string;
  category: ToolCategory;
  trust: ToolTrust;
  status: ToolStatus;
  icon: string;
}

export const MOCK_AGENTS: Agent[] = [
  {
    id: 'ag-01',
    name: 'Data Pipeline Sentinel',
    status: 'active',
    type: 'Orchestrator',
    runs: 1240,
    latency: '45ms',
  },
  {
    id: 'ag-02',
    name: 'Code Review Enforcer',
    status: 'idle',
    type: 'Reviewer',
    runs: 85,
    latency: '120ms',
  },
  {
    id: 'ag-03',
    name: 'Infrastructure Auto-Scaler',
    status: 'active',
    type: 'Operations',
    runs: 8900,
    latency: '12ms',
  },
];

export const MOCK_RUNS: Run[] = [
  {
    id: 'run-992a',
    agent: 'Data Pipeline Sentinel',
    status: 'success',
    time: '2m ago',
    tokens: '4.2k',
    cost: '$0.04',
  },
  {
    id: 'run-992b',
    agent: 'Infrastructure Auto-Scaler',
    status: 'pending_approval',
    time: '5m ago',
    tokens: '1.1k',
    cost: '$0.01',
  },
  {
    id: 'run-992c',
    agent: 'Code Review Enforcer',
    status: 'failed',
    time: '1h ago',
    tokens: '8.9k',
    cost: '$0.09',
  },
];

export const MOCK_TOOLS: Tool[] = [
  {
    name: 'Postgres Prod (RO)',
    category: 'Databases',
    trust: 'High',
    status: 'connected',
    icon: 'database',
  },
  {
    name: 'AWS EC2 Control',
    category: 'Infrastructure',
    trust: 'Critical',
    status: 'requires_auth',
    icon: 'server',
  },
  {
    name: 'GitHub Pr Manager',
    category: 'VCS',
    trust: 'Medium',
    status: 'connected',
    icon: 'git-merge',
  },
  {
    name: 'Stripe Billing API',
    category: 'APIs',
    trust: 'High',
    status: 'connected',
    icon: 'credit-card',
  },
  {
    name: 'Internal Slack Notifier',
    category: 'Automation',
    trust: 'Low',
    status: 'connected',
    icon: 'message-square',
  },
  {
    name: 'MongoDB Driver',
    category: 'Databases',
    trust: 'High',
    status: 'connected',
    icon: 'database',
  },
  {
    name: 'Redis Cache Client',
    category: 'Databases',
    trust: 'Medium',
    status: 'disconnected',
    icon: 'zap',
  },
  {
    name: 'MySQL Connector',
    category: 'Databases',
    trust: 'High',
    status: 'requires_auth',
    icon: 'database',
  },
  {
    name: 'Kubernetes Manager',
    category: 'Infrastructure',
    trust: 'Critical',
    status: 'connected',
    icon: 'server',
  },
  {
    name: 'Docker Engine API',
    category: 'Infrastructure',
    trust: 'Medium',
    status: 'disconnected',
    icon: 'box',
  },
  {
    name: 'Terraform Apply',
    category: 'Infrastructure',
    trust: 'Critical',
    status: 'requires_auth',
    icon: 'terminal',
  },
  {
    name: 'AWS S3 Interface',
    category: 'Infrastructure',
    trust: 'High',
    status: 'connected',
    icon: 'cloud',
  },
  {
    name: 'GitLab CI/CD Tracker',
    category: 'VCS',
    trust: 'Medium',
    status: 'connected',
    icon: 'git-branch',
  },
  {
    name: 'Jenkins Pipeline Runner',
    category: 'VCS',
    trust: 'High',
    status: 'requires_auth',
    icon: 'play',
  },
  {
    name: 'Bitbucket Manager',
    category: 'VCS',
    trust: 'Medium',
    status: 'disconnected',
    icon: 'git-merge',
  },
  {
    name: 'GraphQL Query Fetcher',
    category: 'APIs',
    trust: 'Medium',
    status: 'connected',
    icon: 'globe',
  },
  {
    name: 'Datadog Metrics Viewer',
    category: 'APIs',
    trust: 'High',
    status: 'connected',
    icon: 'monitor',
  },
  {
    name: 'Sentry Error Reporter',
    category: 'APIs',
    trust: 'Low',
    status: 'connected',
    icon: 'alert',
  },
  {
    name: 'Jira Issue Tracker',
    category: 'Automation',
    trust: 'Medium',
    status: 'requires_auth',
    icon: 'file-text',
  },
  {
    name: 'Ansible Playbook Runner',
    category: 'Automation',
    trust: 'Critical',
    status: 'connected',
    icon: 'cpu',
  },
  {
    name: 'Twilio SMS Sender',
    category: 'Automation',
    trust: 'Low',
    status: 'connected',
    icon: 'bell',
  },
  {
    name: 'SendGrid Email Dispatcher',
    category: 'Automation',
    trust: 'Medium',
    status: 'connected',
    icon: 'mail',
  },
  {
    name: 'Auth0 Manager',
    category: 'APIs',
    trust: 'Critical',
    status: 'requires_auth',
    icon: 'lock',
  },
];
