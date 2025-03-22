
import { api } from './api';

export interface Hospital {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  contactPhone: string;
  email?: string;
  departments: string[];
  totalBeds?: number;
  availableBeds?: number;
}

export const hospitalService = {
  getAllHospitals: () => 
    api.get('/hospitals'),
  
  getHospitalById: (id: string) => 
    api.get(`/hospitals/${id}`),
  
  getHospitalsByCity: (city: string) => 
    api.get(`/hospitals/city/${city}`),
  
  getHospitalProfile: () => 
    api.get('/hospitals/profile'),
  
  updateHospitalProfile: (data: Partial<Hospital>) => 
    api.put('/hospitals/profile', data)
};
