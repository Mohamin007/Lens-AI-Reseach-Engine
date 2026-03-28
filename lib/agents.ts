import { Agent, AgentStatus } from './types';

const AGENT_DELAYS = {
  search: { min: 2000, max: 4000 },
  scrape: { min: 3000, max: 5000 },
  synthesis: { min: 4000, max: 8000 },
};

const SAMPLE_OUTPUTS = {
  search: [
    'Found 847 relevant sources matching your query',
    'Filtered results to top 50 most relevant sources',
    'Analyzing source credibility and relevance',
  ],
  scrape: [
    'Extracting key information from sources',
    'Processing 50 web pages and documents',
    'Organizing extracted data for synthesis',
  ],
};

export class AgentSimulator {
  private agents: Map<string, Agent> = new Map();

  createAgents(): Agent[] {
    const agents: Agent[] = [
      {
        id: 'search',
        name: 'Search Agent',
        description: 'Searching the web for relevant information',
        status: 'queued',
        progress: 0,
        icon: '🔍',
      },
      {
        id: 'scrape',
        name: 'Scrape Agent',
        description: 'Extracting data from sources',
        status: 'queued',
        progress: 0,
        icon: '📄',
      },
      {
        id: 'synthesis',
        name: 'Synthesis Agent',
        description: 'Synthesizing findings with AI',
        status: 'queued',
        progress: 0,
        icon: '🧠',
      },
    ];

    agents.forEach(agent => {
      this.agents.set(agent.id, agent);
    });

    return agents;
  }

  simulateAgentExecution(
    agentId: string,
    onStatusChange: (agent: Agent) => void
  ): Promise<Agent> {
    return new Promise((resolve) => {
      const agent = this.agents.get(agentId);
      if (!agent) {
        resolve(agent!);
        return;
      }

      // Set to running
      agent.status = 'running';
      agent.progress = 10;
      onStatusChange({ ...agent });

      const duration = this.getRandomDelay(agentId);
      const startTime = Date.now();
      const outputMessages = SAMPLE_OUTPUTS[agentId as keyof typeof SAMPLE_OUTPUTS] || [];
      let messageIndex = 0;

      const progressInterval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const percentage = Math.min((elapsed / duration) * 100, 95);
        agent.progress = Math.round(percentage);

        // Update output message every 30% of progress
        if (percentage > messageIndex * 30 && messageIndex < outputMessages.length) {
          agent.output = outputMessages[messageIndex];
          messageIndex++;
        }

        onStatusChange({ ...agent });

        if (percentage >= 95) {
          clearInterval(progressInterval);
          setTimeout(() => {
            agent.status = 'completed';
            agent.progress = 100;
            agent.output = outputMessages[outputMessages.length - 1] || 'Complete';
            onStatusChange({ ...agent });
            resolve({ ...agent });
          }, 300);
        }
      }, 100);
    });
  }

  private getRandomDelay(agentId: string): number {
    const delays = AGENT_DELAYS[agentId as keyof typeof AGENT_DELAYS] || {
      min: 2000,
      max: 4000,
    };
    return Math.random() * (delays.max - delays.min) + delays.min;
  }

  getAgent(agentId: string): Agent | undefined {
    return this.agents.get(agentId);
  }

  getAllAgents(): Agent[] {
    return Array.from(this.agents.values());
  }
}

export async function executeWorkflow(
  agents: Agent[],
  onAgentUpdate: (agent: Agent) => void
): Promise<string> {
  const simulator = new AgentSimulator();

  // Execute agents sequentially
  for (const agent of agents) {
    await simulator.simulateAgentExecution(agent.id, onAgentUpdate);
  }

  // Generate mock synthesis result
  const result = `Based on our comprehensive research, we found valuable insights across multiple domains. 
Our search identified 847 relevant sources, from which we extracted and analyzed key information. 
The synthesis reveals that the most impactful findings center on emerging trends and established best practices. 
This multi-agent approach ensures thorough coverage and accurate synthesis of information.`;

  return result;
}
