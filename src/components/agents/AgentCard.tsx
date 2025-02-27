import { Agent } from '@/types/agent';
import { FC } from 'react';
import StatusBadge from '../common/StatusBadge';

interface AgentCardProps {
  agent: Agent;
}

const AgentCard: FC<AgentCardProps> = ({ agent }) => {
  const { name, status, waitTime } = agent;
  
  // Convert seconds to readable format
  const formatTime = (seconds: number): string => {
    if (seconds < 60) return `${seconds}s`;
    
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    return `${minutes}m ${remainingSeconds}s`;
  };
  
  return (
    <div className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-semibold">{name}</h3>
        <StatusBadge status={status} />
      </div>
      <div className="text-sm text-gray-600">
        <p>Wait time: {formatTime(waitTime)}</p>
      </div>
    </div>
  );
};

export default AgentCard;
