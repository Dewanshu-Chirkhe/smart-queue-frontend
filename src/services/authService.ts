
import { api } from './api';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'staff' | 'patient';
  phone?: string;
  address?: string;
  specialization?: string;
  hospital?: string;
  bloodType?: string;
  emergencyContact?: string;
  dateOfBirth?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  name: string;
  email: string;
  password: string;
  role: 'staff' | 'patient';
}

export const authService = {
  login: (credentials: LoginCredentials) => 
    api.post('/auth/login', credentials),
  
  signup: (userData: SignupData) => 
    api.post('/auth/signup', userData),
  
  getUserProfile: () => 
    api.get('/auth/profile'),
  
  updateUserProfile: (userData: Partial<User>) => 
    api.put('/auth/profile', userData),
  
  logout: () => 
    api.post('/auth/logout', {})
};
