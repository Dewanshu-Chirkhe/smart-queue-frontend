
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
import { User, Save, LogOut, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

// User profile page for both patients and staff
const UserProfile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '+91 9876543210', // Default Indian phone format
    address: 'Koramangala, Bangalore',
    bloodType: 'O+',
    emergencyContact: '+91 8765432109',
    dateOfBirth: '1985-06-15',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, update the user profile in the backend
    toast.success('Profile updated successfully');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-20 page-container">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <button 
              onClick={() => navigate(-1)} 
              className="mr-4 p-2 rounded-full hover:bg-gray-100"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </button>
            <h1 className="page-title">User Profile</h1>
          </div>
          <button 
            onClick={logout} 
            className="flex items-center text-red-500 hover:text-red-600"
          >
            <LogOut className="h-4 w-4 mr-1" />
            <span>Logout</span>
          </button>
        </div>

        <div className="glass-panel p-6">
          <div className="flex flex-col md:flex-row items-start gap-6">
            <div className="w-full md:w-1/4 flex flex-col items-center">
              <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden mb-4">
                <User className="h-16 w-16 text-gray-400" />
              </div>
              <h2 className="text-xl font-semibold">{user?.name}</h2>
              <p className="text-gray-500 mb-2">{user?.role === 'staff' ? 'Hospital Staff' : 'Patient'}</p>
              <button className="text-sm text-hospital-600 hover:text-hospital-700">
                Change profile picture
              </button>
            </div>
            
            <div className="w-full md:w-3/4">
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="hospital-input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="hospital-input"
                      disabled
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="hospital-input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleChange}
                      className="hospital-input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className="hospital-input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Blood Type
                    </label>
                    <select
                      name="bloodType"
                      value={formData.bloodType}
                      onChange={handleChange}
                      className="hospital-input"
                    >
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Emergency Contact
                    </label>
                    <input
                      type="tel"
                      name="emergencyContact"
                      value={formData.emergencyContact}
                      onChange={handleChange}
                      className="hospital-input"
                    />
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <button type="submit" className="hospital-btn-primary flex items-center">
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
