'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { Agent, ResearchWorkflow } from './types';
import { AgentSimulator } from './agents';

interface ResearchContextType {
  workflow: ResearchWorkflow | null;
  startResearch: (query: string) => void;
  updateAgent: (agent: Agent) => void;
  completeWorkflow: (result: string) => void;
}

const ResearchContext = createContext<ResearchContextType | undefined>(undefined);

export function ResearchProvider({ children }: { children: ReactNode }) {
  const [workflow, setWorkflow] = useState<ResearchWorkflow | null>(null);

  const startResearch = (query: string) => {
    const simulator = new AgentSimulator();
    const agents = simulator.createAgents();

    setWorkflow({
      id: Math.random().toString(36).substr(2, 9),
      query,
      agents,
      status: 'in-progress',
    });
  };

  const updateAgent = (agent: Agent) => {
    setWorkflow((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        agents: prev.agents.map((a) => (a.id === agent.id ? agent : a)),
      };
    });
  };

  const completeWorkflow = (result: string) => {
    setWorkflow((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        status: 'completed',
        result,
        sources: [
          {
            title: 'Research Overview',
            url: '#',
            excerpt: result,
          },
        ],
      };
    });
  };

  return (
    <ResearchContext.Provider value={{ workflow, startResearch, updateAgent, completeWorkflow }}>
      {children}
    </ResearchContext.Provider>
  );
}

export function useResearch() {
  const context = useContext(ResearchContext);
  if (undefined === context) {
    throw new Error('useResearch must be used within ResearchProvider');
  }
  return context;
}
