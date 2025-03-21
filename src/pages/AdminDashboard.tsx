
import { useState } from 'react';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { Users, User, Bed, Package, Settings, Bell, Clock, AlertTriangle, Activity, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import QueueManagement from '../components/QueueManagement';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const AdminDashboard = () => {
  const { user } = useAuth();
  const [notifications] = useState([
    { id: 1, text: 'Inventory alert: Paracetamol stock low', time: '10 min ago' },
    { id: 2, text: 'New patient registered: Vikram Malhotra', time: '25 min ago' },
    { id: 3, text: 'ICU Bed #3 is now available', time: '1 hour ago' },
  ]);

  // Enhanced mock data for quick statistics
  const stats = [
    { id: 1, name: 'Total Patients', value: 127, icon: <Users className="h-6 w-6 text-blue-500" /> },
    { id: 2, name: 'Available Beds', value: 45, total: 80, icon: <Bed className="h-6 w-6 text-green-500" /> },
    { id: 3, name: 'Staff On Duty', value: 23, icon: <User className="h-6 w-6 text-purple-500" /> },
    { id: 4, name: 'Low Stock Items', value: 7, icon: <Package className="h-6 w-6 text-amber-500" /> },
  ];

  // Additional dashboard metrics
  const metrics = [
    { 
      id: 1, 
      title: 'Average Wait Time', 
      value: '28 min', 
      change: '+5%', 
      trend: 'up',
      icon: <Clock className="h-5 w-5 text-amber-500" />
    },
    { 
      id: 2, 
      title: 'Critical Inventory Items', 
      value: '3', 
      change: '-1', 
      trend: 'down',
      icon: <AlertTriangle className="h-5 w-5 text-red-500" />
    },
    { 
      id: 3, 
      title: 'Patient Satisfaction', 
      value: '92%', 
      change: '+2%', 
      trend: 'up',
      icon: <Activity className="h-5 w-5 text-green-500" />
    },
  ];

  // Bed status by department with visual grid representation
  const bedStatus = [
    { department: 'General Ward', available: 15, total: 25 },
    { department: 'ICU', available: 5, total: 10 },
    { department: 'Emergency', available: 8, total: 15 },
    { department: 'Pediatrics', available: 12, total: 20 },
  ];

  // Today's appointment data
  const todayAppointments = [
    { id: 1, time: '9:00 AM', patient: 'Rahul Patel', doctor: 'Dr. Priya Patel', status: 'Checked In' },
    { id: 2, time: '10:30 AM', patient: 'Anjali Sharma', doctor: 'Dr. Rajesh Kumar', status: 'Waiting' },
    { id: 3, time: '11:15 AM', patient: 'Vikram Singh', doctor: 'Dr. Priya Patel', status: 'Scheduled' },
    { id: 4, time: '2:00 PM', patient: 'Deepika Reddy', doctor: 'Dr. Rajesh Kumar', status: 'Scheduled' },
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
                  <div className="w-full">
                    <p className="card-subtitle">{stat.name}</p>
                    <h3 className="text-3xl font-bold">{stat.value}</h3>
                    {stat.total && (
                      <div className="mt-2">
                        <Progress value={(stat.value / stat.total) * 100} className="h-2" />
                        <p className="text-xs text-gray-500 mt-1">{stat.value} of {stat.total}</p>
                      </div>
                    )}
                  </div>
                  <div className="p-3 rounded-full bg-gray-50">
                    {stat.icon}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Additional Metrics Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Key Metrics</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {metrics.map(metric => (
              <Card key={metric.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
                    {metric.icon}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{metric.value}</div>
                  <p className={`text-xs ${metric.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                    {metric.change} from last week
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Bed Status by Department - Grid View */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Bed Availability by Department</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {bedStatus.map((dept, index) => (
              <Card key={index}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">{dept.department}</CardTitle>
                  <CardDescription>
                    {dept.available} of {dept.total} beds available
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-5 gap-1">
                    {Array.from({ length: dept.total }).map((_, i) => (
                      <div 
                        key={i}
                        className={`h-6 rounded-sm ${i < dept.available ? 'bg-green-100 border border-green-500' : 'bg-red-100 border border-red-500'}`}
                      ></div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        
        {/* Today's Appointments */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Today's Appointments</h2>
            <Link to="/appointments" className="text-sm text-hospital-600 flex items-center gap-1 hover:underline">
              <Calendar className="h-4 w-4" />
              View Calendar
            </Link>
          </div>
          
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-gray-700">
                    <tr>
                      <th className="py-3 px-4 text-left font-medium">Time</th>
                      <th className="py-3 px-4 text-left font-medium">Patient</th>
                      <th className="py-3 px-4 text-left font-medium">Doctor</th>
                      <th className="py-3 px-4 text-left font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {todayAppointments.map((appointment) => (
                      <tr key={appointment.id} className="hover:bg-gray-50">
                        <td className="py-3 px-4">{appointment.time}</td>
                        <td className="py-3 px-4">{appointment.patient}</td>
                        <td className="py-3 px-4">{appointment.doctor}</td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                            appointment.status === 'Checked In' ? 'bg-green-100 text-green-800' : 
                            appointment.status === 'Waiting' ? 'bg-yellow-100 text-yellow-800' : 
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {appointment.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
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
