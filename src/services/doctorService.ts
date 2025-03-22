
import { api } from './api';

export interface Doctor {
  id: string;
  name: string;
  department: string;
  hospitalId: string;
  hospitalName?: string;
  specialization: string;
  rating?: number;
  availability: string[];
  contactInfo?: {
    email?: string;
    phone?: string;
  };
  image?: string;
}

export const doctorService = {
  getAllDoctors: () => 
    api.get('/doctors'),
  
  getDoctorById: (id: string) => 
    api.get(`/doctors/${id}`),
  
  searchDoctors: (query: string) => 
    api.get(`/doctors/search?q=${query}`),
  
  getDoctorsByDepartment: (department: string) => 
    api.get(`/doctors/department/${department}`),
  
  getDoctorsByHospital: (hospitalId: string) => 
    api.get(`/doctors/hospital/${hospitalId}`)
};
