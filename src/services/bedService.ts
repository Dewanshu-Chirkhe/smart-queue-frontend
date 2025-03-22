
import { api } from './api';

export interface Bed {
  id: string;
  bedNumber: string;
  department: string;
  ward: string;
  status: 'Available' | 'Occupied' | 'Under Maintenance';
  patientId?: string;
  patientName?: string;
  admissionDate?: string;
  estimatedDischarge?: string;
}

export interface BedSummary {
  department: string;
  total: number;
  available: number;
}

export const bedService = {
  getAllBeds: () => 
    api.get('/beds'),
  
  getBedById: (id: string) => 
    api.get(`/beds/${id}`),
  
  getBedsByDepartment: (department: string) => 
    api.get(`/beds/department/${department}`),
  
  getBedSummary: () => 
    api.get('/beds/summary'),
  
  updateBedStatus: (id: string, status: Bed['status'], patientId?: string) => 
    api.put(`/beds/${id}`, { status, patientId }),
  
  assignBed: (id: string, patientId: string, admissionDate: string, estimatedDischarge?: string) => 
    api.put(`/beds/${id}/assign`, { patientId, admissionDate, estimatedDischarge }),
  
  releaseBed: (id: string) => 
    api.put(`/beds/${id}/release`, {})
};
