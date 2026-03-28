export type AgentStatus = 'queued' | 'running' | 'completed' | 'error';

export interface Agent {
  id: string;
  name: string;
  description: string;
  status: AgentStatus;
  progress: number;
  output?: string;
  logs?: string[];
  icon: string;
}

export interface ResearchWorkflow {
  id: string;
  query: string;
  agents: Agent[];
  status: 'pending' | 'in-progress' | 'completed' | 'error';
  result?: string;
  sources?: Array<{
    title: string;
    url: string;
    excerpt: string;
  }>;
}
