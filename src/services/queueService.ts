
import { api } from './api';

export interface QueueStatus {
  id: string;
  position: number;
  department: string;
  estimatedWaitTime: string;
  peopleAhead: number;
  doctor: string;
}

export interface DepartmentWaitTime {
  department: string;
  averageWaitTime: string;
  waitTimeMinutes: number;
  capacity: number;
}

export const queueService = {
  getUserQueueStatus: () => 
    api.get('/queue/status'),
  
  getDepartmentWaitTimes: () => 
    api.get('/queue/department-wait-times'),
  
  joinQueue: (departmentId: string, doctorId?: string) => 
    api.post('/queue/join', { departmentId, doctorId }),
  
  leaveQueue: () => 
    api.post('/queue/leave', {})
};
