
import { api } from './api';

export interface Appointment {
  id: string;
  doctor: string;
  doctorId: string;
  department: string;
  hospitalId?: string;
  hospitalName?: string;
  date: string;
  time: string;
  status: 'Confirmed' | 'Pending' | 'Cancelled';
  patientId: string;
  patientName?: string;
  notes?: string;
}

export interface AppointmentCreateData {
  doctorId: string;
  hospitalId?: string;
  date: string;
  time: string;
  notes?: string;
}

export const appointmentService = {
  getAppointments: () => 
    api.get('/appointments'),
  
  getAppointmentById: (id: string) => 
    api.get(`/appointments/${id}`),
  
  createAppointment: (appointmentData: AppointmentCreateData) => 
    api.post('/appointments', appointmentData),
  
  updateAppointment: (id: string, appointmentData: Partial<Appointment>) => 
    api.put(`/appointments/${id}`, appointmentData),
  
  cancelAppointment: (id: string) => 
    api.put(`/appointments/${id}`, { status: 'Cancelled' }),
  
  getDoctorAvailability: (doctorId: string, date: string) => 
    api.get(`/doctors/${doctorId}/availability?date=${date}`)
};
