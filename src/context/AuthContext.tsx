
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

type User = {
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
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUserProfile: (updatedData: Partial<User>) => void;
  isAuthenticated: boolean;
  isStaff: boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

// Mock user data with Indian names
const MOCK_USERS = [
  {
    id: '1',
    email: 'admin@hospital.com',
    password: 'admin123',
    name: 'Dr. Rajesh Kumar',
    role: 'staff' as const,
    phone: '+91 9876543210',
    address: 'Koramangala, Bangalore',
    specialization: 'Cardiology',
    hospital: 'Apollo Hospitals',
    dateOfBirth: '1980-05-15',
  },
  {
    id: '2',
    email: 'patient@example.com',
    password: 'patient123',
    name: 'Ananya Sharma',
    role: 'patient' as const,
    phone: '+91 8765432109',
    address: 'Indiranagar, Bangalore',
    bloodType: 'O+',
    emergencyContact: '+91 7654321098',
    dateOfBirth: '1992-08-22',
  },
  {
    id: '3',
    email: 'doctor@hospital.com',
    password: 'doctor123',
    name: 'Dr. Priya Patel',
    role: 'staff' as const,
    phone: '+91 9876543211',
    address: 'HSR Layout, Bangalore',
    specialization: 'Neurology',
    hospital: 'Fortis Hospital',
    dateOfBirth: '1985-03-10',
  },
  {
    id: '4',
    email: 'patient2@example.com',
    password: 'patient123',
    name: 'Vikram Malhotra',
    role: 'patient' as const,
    phone: '+91 8765432110',
    address: 'JP Nagar, Bangalore',
    bloodType: 'A+',
    emergencyContact: '+91 7654321099',
    dateOfBirth: '1988-11-15',
  },
];

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in (from localStorage)
    const storedUser = localStorage.getItem('hospitalUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Find user with matching credentials
      const matchedUser = MOCK_USERS.find(
        u => u.email === email && u.password === password
      );
      
      if (!matchedUser) {
        throw new Error('Invalid credentials');
      }
      
      // Create sanitized user object (without password)
      const { password: _, ...userWithoutPassword } = matchedUser;
      
      // Store user in state and localStorage
      setUser(userWithoutPassword);
      localStorage.setItem('hospitalUser', JSON.stringify(userWithoutPassword));
      
      // Redirect based on role
      if (userWithoutPassword.role === 'staff') {
        navigate('/admin-dashboard');
      } else {
        navigate('/patient-dashboard');
      }
      
      toast.success('Logged in successfully');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Login failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateUserProfile = (updatedData: Partial<User>) => {
    if (!user) return;
    
    const updatedUser = { ...user, ...updatedData };
    setUser(updatedUser);
    localStorage.setItem('hospitalUser', JSON.stringify(updatedUser));
    toast.success('Profile updated successfully');
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('hospitalUser');
    navigate('/login');
    toast.success('Logged out successfully');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        updateUserProfile,
        isAuthenticated: !!user,
        isStaff: user?.role === 'staff',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
