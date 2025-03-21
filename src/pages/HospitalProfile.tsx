
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
import { Building, Save, ArrowLeft, Clock, MapPin, Phone, Mail, Globe, User, Shield } from 'lucide-react';
import { toast } from 'sonner';

const HospitalProfile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [hospitalData, setHospitalData] = useState({
    name: 'Apollo Hospitals',
    address: 'No. 154/11, Bannerghatta Road, Bangalore - 560076',
    email: 'info@apollo-hospitals.com',
    phone: '+91 80 2630 4050',
    website: 'www.apollohospitals.com',
    hours: '24 hours (Emergency), 9 AM - 6 PM (OPD)',
    specialities: 'Cardiology, Neurology, Orthopedics, Oncology, Pediatrics',
    beds: '350',
    established: '1983',
    accreditation: 'NABH, JCI Accredited',
    description: 'Apollo Hospitals is one of the leading hospital chains in India, providing comprehensive healthcare services with state-of-the-art facilities and experienced medical professionals.'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setHospitalData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, update the hospital profile in the backend
    toast.success('Hospital profile updated successfully');
  };

  if (!user || user.role !== 'staff') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-4">Only staff members can access the hospital profile</p>
          <button 
            onClick={() => navigate(-1)}
            className="hospital-btn-primary"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-20 page-container">
        <div className="flex items-center mb-6">
          <button 
            onClick={() => navigate(-1)} 
            className="mr-4 p-2 rounded-full hover:bg-gray-100"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </button>
          <h1 className="page-title">Hospital Profile</h1>
        </div>

        <div className="glass-panel p-6">
          <div className="flex flex-col md:flex-row items-start gap-6">
            <div className="w-full md:w-1/3 flex flex-col items-center">
              <div className="w-32 h-32 rounded-full bg-hospital-100 flex items-center justify-center overflow-hidden mb-4">
                <Building className="h-16 w-16 text-hospital-600" />
              </div>
              <h2 className="text-xl font-semibold">{hospitalData.name}</h2>
              <p className="text-gray-500 mb-4 text-center">{hospitalData.accreditation}</p>
              
              <div className="w-full space-y-4 mt-4">
                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-gray-500 mt-0.5" />
                  <p className="text-gray-700 text-sm">{hospitalData.address}</p>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-gray-500" />
                  <p className="text-gray-700 text-sm">{hospitalData.phone}</p>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-gray-500" />
                  <p className="text-gray-700 text-sm">{hospitalData.email}</p>
                </div>
                <div className="flex items-center space-x-3">
                  <Globe className="h-5 w-5 text-gray-500" />
                  <p className="text-gray-700 text-sm">{hospitalData.website}</p>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="h-5 w-5 text-gray-500" />
                  <p className="text-gray-700 text-sm">{hospitalData.hours}</p>
                </div>
                <div className="flex items-center space-x-3">
                  <User className="h-5 w-5 text-gray-500" />
                  <p className="text-gray-700 text-sm">Established: {hospitalData.established}</p>
                </div>
                <div className="flex items-center space-x-3">
                  <Shield className="h-5 w-5 text-gray-500" />
                  <p className="text-gray-700 text-sm">Beds: {hospitalData.beds}</p>
                </div>
              </div>
            </div>
            
            <div className="w-full md:w-2/3">
              <form onSubmit={handleSubmit}>
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Hospital Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={hospitalData.name}
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
                      value={hospitalData.address}
                      onChange={handleChange}
                      className="hospital-input"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={hospitalData.email}
                        onChange={handleChange}
                        className="hospital-input"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={hospitalData.phone}
                        onChange={handleChange}
                        className="hospital-input"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Website
                      </label>
                      <input
                        type="text"
                        name="website"
                        value={hospitalData.website}
                        onChange={handleChange}
                        className="hospital-input"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Working Hours
                      </label>
                      <input
                        type="text"
                        name="hours"
                        value={hospitalData.hours}
                        onChange={handleChange}
                        className="hospital-input"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Specialities
                      </label>
                      <input
                        type="text"
                        name="specialities"
                        value={hospitalData.specialities}
                        onChange={handleChange}
                        className="hospital-input"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Number of Beds
                      </label>
                      <input
                        type="text"
                        name="beds"
                        value={hospitalData.beds}
                        onChange={handleChange}
                        className="hospital-input"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Established Year
                      </label>
                      <input
                        type="text"
                        name="established"
                        value={hospitalData.established}
                        onChange={handleChange}
                        className="hospital-input"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Accreditation
                      </label>
                      <input
                        type="text"
                        name="accreditation"
                        value={hospitalData.accreditation}
                        onChange={handleChange}
                        className="hospital-input"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      name="description"
                      rows={4}
                      value={hospitalData.description}
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
