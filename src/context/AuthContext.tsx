
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { authService, User, LoginCredentials } from '../services/authService';

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

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in (from localStorage token)
    const checkAuthStatus = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (token) {
          // Fetch the user profile using the token
          const userData = await authService.getUserProfile();
          setUser(userData);
        }
      } catch (error) {
        // If token is invalid, clear it
        localStorage.removeItem('authToken');
        console.error('Error checking auth status:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const credentials: LoginCredentials = { email, password };
      const response = await authService.login(credentials);
      
      // Store the auth token
      if (response.token) {
        localStorage.setItem('authToken', response.token);
      }
      
      // Set user data
      setUser(response.user);
      
      // Redirect based on role
      if (response.user.role === 'staff') {
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

  const updateUserProfile = async (updatedData: Partial<User>) => {
    if (!user) return;
    
    try {
      const updatedUser = await authService.updateUserProfile(updatedData);
      setUser(updatedUser);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update profile');
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      // Even if the API call fails, clear the local state
      setUser(null);
      localStorage.removeItem('authToken');
      navigate('/login');
      toast.success('Logged out successfully');
    }
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
