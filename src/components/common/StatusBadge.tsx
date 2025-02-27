import { AgentStatus } from '@/types/agent';
import { FC } from 'react';

interface StatusBadgeProps {
  status: AgentStatus;
}

const statusColorMap: Record<AgentStatus, string> = {
  available: 'bg-green-500',
  on_call: 'bg-blue-500',
  on_break: 'bg-yellow-500',
  offline: 'bg-gray-500',
};

const statusTextMap: Record<AgentStatus, string> = {
  available: 'Available',
  on_call: 'On call',
  on_break: 'On break',
  offline: 'Offline',
};

const StatusBadge: FC<StatusBadgeProps> = ({ status }) => {
  return (
    <span 
      className={`px-2 py-1 text-xs font-semibold rounded-full text-white ${statusColorMap[status]}`}
    >
      {statusTextMap[status]}
    </span>
  );
};

export default StatusBadge;
