
import { useState } from 'react';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
import { Hospital, Save, Phone, MapPin, Clock, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../context/AuthContext';

// Hospital profile page - only accessible to staff
const HospitalProfile = () => {
  const { isStaff } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: 'AIIMS Delhi',
    address: 'Ansari Nagar East, New Delhi, Delhi 110029',
    phone: '+91 11 2658 8500',
    email: 'info@aiims.edu',
    website: 'www.aiims.edu',
    establishedYear: '1956',
    bedsTotal: '2000',
    departments: [
      'Cardiology',
      'Neurology',
      'Orthopedics',
      'Pediatrics',
      'General Medicine',
    ],
    operatingHours: '24 hours',
    emergencyServices: 'Available 24/7',
    ambulanceNumber: '102',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, update the hospital profile in the backend
    toast.success('Hospital profile updated successfully');
  };

  // Redirect to admin dashboard if not staff
  if (!isStaff) {
    navigate('/patient-dashboard');
    return null;
  }

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
            <h1 className="page-title">Hospital Profile</h1>
          </div>
        </div>

        <div className="glass-panel p-6">
          <div className="flex flex-col md:flex-row items-start gap-6">
            <div className="w-full md:w-1/4 flex flex-col items-center">
              <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden mb-4">
                <Hospital className="h-16 w-16 text-gray-400" />
              </div>
              <h2 className="text-xl font-semibold text-center">{formData.name}</h2>
              <div className="flex items-center text-gray-500 mb-1 mt-2">
                <MapPin className="h-4 w-4 mr-1" />
                <span className="text-sm">New Delhi, India</span>
              </div>
              <div className="flex items-center text-gray-500 mb-2">
                <Phone className="h-4 w-4 mr-1" />
                <span className="text-sm">{formData.phone}</span>
              </div>
              <div className="flex items-center text-gray-500">
                <Clock className="h-4 w-4 mr-1" />
                <span className="text-sm">{formData.operatingHours}</span>
              </div>
            </div>
            
            <div className="w-full md:w-3/4">
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Hospital Name
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
                      Website
                    </label>
                    <input
                      type="text"
                      name="website"
                      value={formData.website}
                      onChange={handleChange}
                      className="hospital-input"
                    />
                  </div>
                  <div className="md:col-span-2">
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
                      Established Year
                    </label>
                    <input
                      type="text"
                      name="establishedYear"
                      value={formData.establishedYear}
                      onChange={handleChange}
                      className="hospital-input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Total Beds
                    </label>
                    <input
                      type="number"
                      name="bedsTotal"
                      value={formData.bedsTotal}
                      onChange={handleChange}
                      className="hospital-input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Operating Hours
                    </label>
                    <input
                      type="text"
                      name="operatingHours"
                      value={formData.operatingHours}
                      onChange={handleChange}
                      className="hospital-input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Emergency Services
                    </label>
                    <input
                      type="text"
                      name="emergencyServices"
                      value={formData.emergencyServices}
                      onChange={handleChange}
                      className="hospital-input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ambulance Number
                    </label>
                    <input
                      type="text"
                      name="ambulanceNumber"
                      value={formData.ambulanceNumber}
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

export default HospitalProfile;
