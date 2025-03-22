
// Mock API data for demo mode
const mockData = {
  auth: {
    staff: {
      id: '1',
      email: 'admin@hospital.com',
      name: 'Admin User',
      role: 'staff',
      specialization: 'Administration',
      hospital: 'City General Hospital',
      token: 'mock-staff-token'
    },
    patient: {
      id: '2',
      email: 'patient@example.com',
      name: 'John Doe',
      role: 'patient',
      dateOfBirth: '1990-01-01',
      bloodType: 'O+',
      emergencyContact: '+1234567890',
      token: 'mock-patient-token'
    }
  }
};

const API_BASE_URL = 'http://localhost:5000/api'; // This can be changed to your actual backend URL

// Helper function for API requests
async function fetchApi(endpoint: string, options?: RequestInit) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        ...(options?.headers || {})
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || `API Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API Error for ${endpoint}:`, error);
    throw error;
  }
}

// Check if we should use demo mode (for login only)
const isDemoMode = () => {
  return true; // Always use demo mode until backend is available
};

// Generic API methods
export const api = {
  get: (endpoint: string) => fetchApi(endpoint),
  
  post: (endpoint: string, data: any) => {
    // Special handling for demo login
    if (isDemoMode() && endpoint === '/auth/login') {
      const { email, password } = data;
      
      // Check for demo staff credentials
      if (email === 'admin@hospital.com' && password === 'admin123') {
        return Promise.resolve({
          user: mockData.auth.staff,
          token: mockData.auth.staff.token
        });
      }
      
      // Check for demo patient credentials
      if (email === 'patient@example.com' && password === 'patient123') {
        return Promise.resolve({
          user: mockData.auth.patient,
          token: mockData.auth.patient.token
        });
      }
      
      // Invalid credentials
      return Promise.reject(new Error('Invalid email or password'));
    }
    
    return fetchApi(endpoint, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },
  
  put: (endpoint: string, data: any) => fetchApi(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data)
  }),
  
  delete: (endpoint: string) => fetchApi(endpoint, {
    method: 'DELETE'
  })
};
