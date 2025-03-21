
import { useState } from 'react';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { Users, User, Bed, Package, Settings, Bell } from 'lucide-react';
import { Link } from 'react-router-dom';
import QueueManagement from '../components/QueueManagement';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [notifications] = useState([
    { id: 1, text: 'Inventory alert: Paracetamol stock low', time: '10 min ago' },
    { id: 2, text: 'New patient registered: Vikram Malhotra', time: '25 min ago' },
    { id: 3, text: 'ICU Bed #3 is now available', time: '1 hour ago' },
  ]);

  // Mock data for quick statistics
  const stats = [
    { id: 1, name: 'Total Patients', value: 127, icon: <Users className="h-6 w-6 text-blue-500" /> },
    { id: 2, name: 'Available Beds', value: 45, icon: <Bed className="h-6 w-6 text-green-500" /> },
    { id: 3, name: 'Staff On Duty', value: 23, icon: <User className="h-6 w-6 text-purple-500" /> },
    { id: 4, name: 'Low Stock Items', value: 7, icon: <Package className="h-6 w-6 text-amber-500" /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-20 page-container">
        <div className="flex justify-between items-center mb-6">
          <h1 className="page-title">Admin Dashboard</h1>
          
          <div className="dropdown relative">
            <button className="p-2 rounded-full hover:bg-gray-100 relative">
              <Bell className="h-5 w-5 text-gray-600" />
              <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
            </button>
            <div className="dropdown-content hidden absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg z-10 py-1">
              <div className="px-4 py-2 border-b border-gray-100">
                <h3 className="text-sm font-semibold">Notifications</h3>
              </div>
              {notifications.map(notification => (
                <div key={notification.id} className="px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-none">
                  <p className="text-sm">{notification.text}</p>
                  <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map(stat => (
              <div key={stat.id} className="stat-card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="card-subtitle">{stat.name}</p>
                    <h3 className="text-3xl font-bold">{stat.value}</h3>
                  </div>
                  <div className="p-3 rounded-full bg-gray-50">
                    {stat.icon}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 glass-panel">
            <div className="p-6">
              <QueueManagement />
            </div>
          </div>
          
          <div className="glass-panel p-6">
            <h2 className="section-title mb-6">Quick Actions</h2>
            <div className="space-y-4">
              <Link 
                to="/inventory" 
                className="flex items-center p-4 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="p-3 rounded-full bg-amber-50 mr-4">
                  <Package className="h-5 w-5 text-amber-500" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Inventory Management</h3>
                  <p className="text-sm text-gray-500">Manage medical supplies and equipment</p>
                </div>
              </Link>
              
              <Link 
                to="/bed-management" 
                className="flex items-center p-4 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="p-3 rounded-full bg-green-50 mr-4">
                  <Bed className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Bed Management</h3>
                  <p className="text-sm text-gray-500">Track and assign hospital beds</p>
                </div>
              </Link>
              
              <Link 
                to="/user-profile" 
                className="flex items-center p-4 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="p-3 rounded-full bg-blue-50 mr-4">
                  <User className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Your Profile</h3>
                  <p className="text-sm text-gray-500">View and edit your account information</p>
                </div>
              </Link>
              
              <Link 
                to="/hospital-profile" 
                className="flex items-center p-4 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="p-3 rounded-full bg-purple-50 mr-4">
                  <Settings className="h-5 w-5 text-purple-500" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Hospital Settings</h3>
                  <p className="text-sm text-gray-500">Manage hospital profile and settings</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
