'use client';

import { Agent } from '@/lib/types';
import { CheckCircle, Loader } from 'lucide-react';

interface AgentCardProps {
  agent: Agent;
}

export function AgentCard({ agent }: AgentCardProps) {
  const statusColors = {
    queued: 'text-gray-400',
    running: 'text-blue-400 animate-pulse',
    completed: 'text-green-400',
    error: 'text-red-400',
  };

  const statusLabels = {
    queued: 'Queued',
    running: 'Running',
    completed: 'Completed',
    error: 'Error',
  };

  const statusIcons = {
    queued: null,
    running: <Loader className="w-4 h-4 animate-spin" />,
    completed: <CheckCircle className="w-4 h-4" />,
    error: null,
  };

  const runningGlowByAgentId: Record<string, string> = {
    search: 'border-blue-400/50 shadow-[0_0_0_1px_rgba(96,165,250,0.28),0_0_22px_rgba(59,130,246,0.26)]',
    scrape: 'border-violet-400/50 shadow-[0_0_0_1px_rgba(167,139,250,0.3),0_0_22px_rgba(139,92,246,0.26)]',
    synthesis: 'border-emerald-400/50 shadow-[0_0_0_1px_rgba(52,211,153,0.3),0_0_22px_rgba(16,185,129,0.24)]',
  };

  const runningGlowClass =
    agent.status === 'running' ? runningGlowByAgentId[agent.id] ?? 'border-blue-400/45' : 'border-white/10';

  return (
    <div
      className={`group glass-dark rounded-lg p-4 sm:p-6 border transition-all duration-300 hover:border-blue-400/30 hover:shadow-lg hover:shadow-blue-400/10 ${runningGlowClass}`}
    >
      <div className="flex items-start justify-between gap-3 sm:gap-4 mb-3 sm:mb-4">
        <div className="flex-1 min-w-0">
          <div className="text-2xl sm:text-3xl mb-1 sm:mb-2">{agent.icon}</div>
          <h3 className="text-base sm:text-lg font-semibold text-white truncate">{agent.name}</h3>
          <p className="text-xs sm:text-sm text-gray-400 mt-0.5 sm:mt-1 line-clamp-2">{agent.description}</p>
        </div>
        <div className={`flex items-center gap-1 sm:gap-2 flex-shrink-0 ${statusColors[agent.status]}`}>
          {statusIcons[agent.status]}
          <span className="text-xs font-medium uppercase tracking-wide whitespace-nowrap">
            {statusLabels[agent.status]}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-4 sm:mt-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-gray-400">Progress</span>
          <span className="text-xs font-semibold text-blue-400">{agent.progress}%</span>
        </div>
        <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/10">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-300"
            style={{ width: `${agent.progress}%` }}
          />
        </div>
      </div>

      {/* Output Message */}
      {agent.output && (
        <div className="mt-3 sm:mt-4 p-2 sm:p-3 bg-white/5 border border-white/10 rounded text-xs sm:text-sm text-gray-300 line-clamp-3">
          {agent.output}
        </div>
      )}
    </div>
  );
}
