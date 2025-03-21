
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { 
  Users, 
  Bed, 
  Stethoscope, 
  Calendar, 
  ArrowUp, 
  ArrowDown, 
  Clock, 
  UserPlus, 
  UserMinus 
} from 'lucide-react';

// Mock data
const MOCK_QUEUE = [
  { id: 1, name: 'John Doe', priority: 'High', department: 'Emergency', waitTime: '10 mins', status: 'Waiting' },
  { id: 2, name: 'Jane Smith', priority: 'Medium', department: 'General', waitTime: '25 mins', status: 'Waiting' },
  { id: 3, name: 'Robert Johnson', priority: 'Medium', department: 'Cardiology', waitTime: '35 mins', status: 'Waiting' },
  { id: 4, name: 'Sarah Williams', priority: 'Low', department: 'Pediatrics', waitTime: '45 mins', status: 'Waiting' },
  { id: 5, name: 'Michael Brown', priority: 'High', department: 'Emergency', waitTime: '15 mins', status: 'Waiting' },
];

const MOCK_BED_STATUS = {
  total: 120,
  occupied: 87,
  available: 33,
  icu: { total: 20, occupied: 18 },
  emergency: { total: 30, occupied: 25 },
  general: { total: 70, occupied: 44 },
};

const MOCK_INVENTORY = [
  { id: 1, name: 'Surgical Masks', stock: 2450, unit: 'pcs', lowStockThreshold: 1000, status: 'Adequate' },
  { id: 2, name: 'Disposable Gloves', stock: 1850, unit: 'pcs', lowStockThreshold: 2000, status: 'Low Stock' },
  { id: 3, name: 'Paracetamol', stock: 540, unit: 'boxes', lowStockThreshold: 200, status: 'Adequate' },
  { id: 4, name: 'Bandages', stock: 320, unit: 'pcs', lowStockThreshold: 500, status: 'Low Stock' },
  { id: 5, name: 'Hand Sanitizer', stock: 180, unit: 'bottles', lowStockThreshold: 100, status: 'Adequate' },
];

const MOCK_STATS = {
  dailyPatients: 142,
  dailyPatientsDelta: 12,
  averageWaitTime: 28,
  averageWaitTimeDelta: -5,
  bedOccupancyRate: 72.5,
  bedOccupancyDelta: 3.2,
  lowStockItems: 2,
  lowStockItemsDelta: -1,
};

const AdminDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [queue, setQueue] = useState(MOCK_QUEUE);
  const [bedStatus, setBedStatus] = useState(MOCK_BED_STATUS);
  const [inventory, setInventory] = useState(MOCK_INVENTORY);
  const [stats, setStats] = useState(MOCK_STATS);

  // Parse tab from URL query params
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const tab = searchParams.get('tab');
    if (tab) {
      setActiveTab(tab);
    }
  }, [location.search]);

  // Change tab and update URL
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    navigate(`/admin-dashboard?tab=${tab}`);
  };

  // Handle priority change
  const handlePriorityChange = (id: number, priority: string) => {
    setQueue(prevQueue =>
      prevQueue.map(patient =>
        patient.id === id ? { ...patient, priority } : patient
      )
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-20 page-container">
        <div className="flex justify-between items-center mb-6">
          <h1 className="page-title">Hospital Administration</h1>
          <div className="flex space-x-2">
            <button className="hospital-btn-primary flex items-center">
              <UserPlus className="mr-2 h-4 w-4" />
              Add Patient
            </button>
          </div>
        </div>

        {/* Tab navigation */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => handleTabChange('overview')}
              className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'overview'
                  ? 'border-hospital-500 text-hospital-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => handleTabChange('queue')}
              className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'queue'
                  ? 'border-hospital-500 text-hospital-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Queue Management
            </button>
            <button
              onClick={() => handleTabChange('beds')}
              className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'beds'
                  ? 'border-hospital-500 text-hospital-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Bed Status
            </button>
            <button
              onClick={() => handleTabChange('inventory')}
              className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'inventory'
                  ? 'border-hospital-500 text-hospital-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Quick Inventory
            </button>
          </nav>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="section-container">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="stat-card">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="card-subtitle">Today's Patients</p>
                    <h3 className="text-2xl font-semibold mt-1">{stats.dailyPatients}</h3>
                  </div>
                  <div className="p-3 rounded-full bg-blue-50">
                    <Users className="h-6 w-6 text-hospital-500" />
                  </div>
                </div>
                <div className={`flex items-center text-sm ${stats.dailyPatientsDelta > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {stats.dailyPatientsDelta > 0 ? (
                    <ArrowUp className="h-3 w-3 mr-1" />
                  ) : (
                    <ArrowDown className="h-3 w-3 mr-1" />
                  )}
                  <span>{Math.abs(stats.dailyPatientsDelta)}% from yesterday</span>
                </div>
              </div>

              <div className="stat-card">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="card-subtitle">Average Wait Time</p>
                    <h3 className="text-2xl font-semibold mt-1">{stats.averageWaitTime} min</h3>
                  </div>
                  <div className="p-3 rounded-full bg-purple-50">
                    <Clock className="h-6 w-6 text-purple-500" />
                  </div>
                </div>
                <div className={`flex items-center text-sm ${stats.averageWaitTimeDelta < 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {stats.averageWaitTimeDelta < 0 ? (
                    <ArrowDown className="h-3 w-3 mr-1" />
                  ) : (
                    <ArrowUp className="h-3 w-3 mr-1" />
                  )}
                  <span>{Math.abs(stats.averageWaitTimeDelta)} min from yesterday</span>
                </div>
              </div>

              <div className="stat-card">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="card-subtitle">Bed Occupancy Rate</p>
                    <h3 className="text-2xl font-semibold mt-1">{stats.bedOccupancyRate}%</h3>
                  </div>
                  <div className="p-3 rounded-full bg-amber-50">
                    <Bed className="h-6 w-6 text-amber-500" />
                  </div>
                </div>
                <div className={`flex items-center text-sm ${stats.bedOccupancyDelta > 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {stats.bedOccupancyDelta > 0 ? (
                    <ArrowUp className="h-3 w-3 mr-1" />
                  ) : (
                    <ArrowDown className="h-3 w-3 mr-1" />
                  )}
                  <span>{Math.abs(stats.bedOccupancyDelta)}% from yesterday</span>
                </div>
              </div>

              <div className="stat-card">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="card-subtitle">Low Stock Items</p>
                    <h3 className="text-2xl font-semibold mt-1">{stats.lowStockItems}</h3>
                  </div>
                  <div className="p-3 rounded-full bg-rose-50">
                    <Stethoscope className="h-6 w-6 text-rose-500" />
                  </div>
                </div>
                <div className={`flex items-center text-sm ${stats.lowStockItemsDelta < 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {stats.lowStockItemsDelta < 0 ? (
                    <ArrowDown className="h-3 w-3 mr-1" />
                  ) : (
                    <ArrowUp className="h-3 w-3 mr-1" />
                  )}
                  <span>{Math.abs(stats.lowStockItemsDelta)} from yesterday</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <div className="glass-panel p-5 lg:col-span-2">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="section-title">Patient Queue</h2>
                  <a href="#" className="text-sm text-hospital-600 hover:text-hospital-700">View all</a>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Wait Time</th>
                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {queue.slice(0, 5).map((patient) => (
                        <tr key={patient.id} className="hover:bg-gray-50">
                          <td className="px-3 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{patient.name}</div>
                          </td>
                          <td className="px-3 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">{patient.department}</div>
                          </td>
                          <td className="px-3 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                              ${patient.priority === 'High' ? 'bg-red-100 text-red-800' : 
                                patient.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 
                                'bg-green-100 text-green-800'}`}>
                              {patient.priority}
                            </span>
                          </td>
                          <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                            {patient.waitTime}
                          </td>
                          <td className="px-3 py-4 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                              {patient.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="glass-panel p-5">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="section-title">Bed Status</h2>
                  <a href="#" className="text-sm text-hospital-600 hover:text-hospital-700">Details</a>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Total Beds</span>
                    <span className="text-sm font-semibold">{bedStatus.total}</span>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium">Occupied</span>
                      <span className="text-sm font-semibold text-amber-600">{bedStatus.occupied}</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full">
                      <div 
                        className="h-2 bg-amber-500 rounded-full"
                        style={{ width: `${(bedStatus.occupied / bedStatus.total) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium">Available</span>
                      <span className="text-sm font-semibold text-green-600">{bedStatus.available}</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full">
                      <div 
                        className="h-2 bg-green-500 rounded-full"
                        style={{ width: `${(bedStatus.available / bedStatus.total) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="border-t border-gray-200 pt-3 mt-3">
                    <h3 className="font-medium text-sm mb-2">Department Breakdown</h3>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between items-center text-xs mb-1">
                          <span>ICU ({bedStatus.icu.occupied}/{bedStatus.icu.total})</span>
                          <span>{Math.round((bedStatus.icu.occupied / bedStatus.icu.total) * 100)}% occupied</span>
                        </div>
                        <div className="w-full h-1.5 bg-gray-200 rounded-full">
                          <div 
                            className="h-1.5 bg-red-500 rounded-full"
                            style={{ width: `${(bedStatus.icu.occupied / bedStatus.icu.total) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between items-center text-xs mb-1">
                          <span>Emergency ({bedStatus.emergency.occupied}/{bedStatus.emergency.total})</span>
                          <span>{Math.round((bedStatus.emergency.occupied / bedStatus.emergency.total) * 100)}% occupied</span>
                        </div>
                        <div className="w-full h-1.5 bg-gray-200 rounded-full">
                          <div 
                            className="h-1.5 bg-amber-500 rounded-full"
                            style={{ width: `${(bedStatus.emergency.occupied / bedStatus.emergency.total) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between items-center text-xs mb-1">
                          <span>General ({bedStatus.general.occupied}/{bedStatus.general.total})</span>
                          <span>{Math.round((bedStatus.general.occupied / bedStatus.general.total) * 100)}% occupied</span>
                        </div>
                        <div className="w-full h-1.5 bg-gray-200 rounded-full">
                          <div 
                            className="h-1.5 bg-hospital-500 rounded-full"
                            style={{ width: `${(bedStatus.general.occupied / bedStatus.general.total) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="glass-panel p-5">
              <div className="flex justify-between items-center mb-4">
                <h2 className="section-title">Inventory Status</h2>
                <a href="#" className="text-sm text-hospital-600 hover:text-hospital-700">View all</a>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Stock</th>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit</th>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {inventory.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="px-3 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{item.name}</div>
                        </td>
                        <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.stock}
                        </td>
                        <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.unit}
                        </td>
                        <td className="px-3 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                            ${item.status === 'Adequate' ? 'bg-green-100 text-green-800' : 
                              'bg-red-100 text-red-800'}`}>
                            {item.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Queue Management Tab */}
        {activeTab === 'queue' && (
          <div className="section-container">
            <div className="glass-panel p-5 mb-6">
              <h2 className="section-title mb-4">Current Queue</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Wait Time</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {queue.map((patient) => (
                      <tr key={patient.id} className="hover:bg-gray-50">
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{patient.name}</div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{patient.department}</div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <select
                            className="text-xs rounded-full px-3 py-1 font-medium border-0 focus:ring-0"
                            value={patient.priority}
                            onChange={(e) => handlePriorityChange(patient.id, e.target.value)}
                            style={{
                              backgroundColor: 
                                patient.priority === 'High' ? 'rgba(239, 68, 68, 0.1)' : 
                                patient.priority === 'Medium' ? 'rgba(245, 158, 11, 0.1)' : 
                                'rgba(16, 185, 129, 0.1)',
                              color: 
                                patient.priority === 'High' ? 'rgb(185, 28, 28)' : 
                                patient.priority === 'Medium' ? 'rgb(180, 83, 9)' : 
                                'rgb(6, 95, 70)'
                            }}
                          >
                            <option value="High">High</option>
                            <option value="Medium">Medium</option>
                            <option value="Low">Low</option>
                          </select>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                          {patient.waitTime}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                            {patient.status}
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <button className="text-green-600 hover:text-green-900">Complete</button>
                            <button className="text-red-600 hover:text-red-900">Cancel</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="glass-panel p-5">
                <h2 className="section-title mb-4">Add Patient to Queue</h2>
                <form className="space-y-4">
                  <div>
                    <label htmlFor="patient-name" className="block text-sm font-medium text-gray-700 mb-1">
                      Patient Name
                    </label>
                    <input
                      type="text"
                      id="patient-name"
                      className="hospital-input"
                      placeholder="Enter patient name"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">
                        Department
                      </label>
                      <select id="department" className="hospital-input">
                        <option value="">Select department</option>
                        <option value="Emergency">Emergency</option>
                        <option value="General">General</option>
                        <option value="Pediatrics">Pediatrics</option>
                        <option value="Cardiology">Cardiology</option>
                        <option value="Neurology">Neurology</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
                        Priority
                      </label>
                      <select id="priority" className="hospital-input">
                        <option value="">Select priority</option>
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                      Notes
                    </label>
                    <textarea
                      id="notes"
                      rows={3}
                      className="hospital-input"
                      placeholder="Enter any relevant information"
                    ></textarea>
                  </div>
                  
                  <div className="flex justify-end">
                    <button type="submit" className="hospital-btn-primary">
                      Add to Queue
                    </button>
                  </div>
                </form>
              </div>
              
              <div className="glass-panel p-5">
                <h2 className="section-title mb-4">Queue Statistics</h2>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium">Current Queue Length</span>
                      <span className="text-sm font-bold">{queue.length} patients</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full">
                      <div 
                        className="h-2 bg-hospital-500 rounded-full"
                        style={{ width: `${(queue.length / 15) * 100}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Maximum capacity: 15 patients</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <p className="text-xs text-blue-700 mb-1">Average Wait Time</p>
                      <p className="text-xl font-bold text-blue-900">28 min</p>
                    </div>
                    <div className="p-4 bg-amber-50 rounded-lg">
                      <p className="text-xs text-amber-700 mb-1">Longest Wait</p>
                      <p className="text-xl font-bold text-amber-900">45 min</p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium mb-2">Priority Breakdown</h3>
                    <div className="space-y-2">
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span>High Priority</span>
                          <span>2 patients (40%)</span>
                        </div>
                        <div className="w-full h-1.5 bg-gray-200 rounded-full">
                          <div className="h-1.5 bg-red-500 rounded-full" style={{ width: '40%' }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span>Medium Priority</span>
                          <span>2 patients (40%)</span>
                        </div>
                        <div className="w-full h-1.5 bg-gray-200 rounded-full">
                          <div className="h-1.5 bg-amber-500 rounded-full" style={{ width: '40%' }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span>Low Priority</span>
                          <span>1 patient (20%)</span>
                        </div>
                        <div className="w-full h-1.5 bg-gray-200 rounded-full">
                          <div className="h-1.5 bg-green-500 rounded-full" style={{ width: '20%' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bed Status Tab */}
        {activeTab === 'beds' && (
          <div className="section-container">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="stat-card">
                <div className="flex justify-between">
                  <div>
                    <p className="card-subtitle">Total Beds</p>
                    <h3 className="text-3xl font-bold">{bedStatus.total}</h3>
                  </div>
                  <div className="p-3 rounded-full bg-blue-50">
                    <Bed className="h-6 w-6 text-hospital-500" />
                  </div>
                </div>
              </div>

              <div className="stat-card">
                <div className="flex justify-between">
                  <div>
                    <p className="card-subtitle">Occupied Beds</p>
                    <h3 className="text-3xl font-bold text-amber-600">{bedStatus.occupied}</h3>
                  </div>
                  <div className="p-3 rounded-full bg-amber-50">
                    <UserPlus className="h-6 w-6 text-amber-500" />
                  </div>
                </div>
                <div className="text-gray-500 text-sm">{Math.round((bedStatus.occupied / bedStatus.total) * 100)}% occupancy rate</div>
              </div>

              <div className="stat-card">
                <div className="flex justify-between">
                  <div>
                    <p className="card-subtitle">Available Beds</p>
                    <h3 className="text-3xl font-bold text-green-600">{bedStatus.available}</h3>
                  </div>
                  <div className="p-3 rounded-full bg-green-50">
                    <UserMinus className="h-6 w-6 text-green-500" />
                  </div>
                </div>
                <div className="text-gray-500 text-sm">{Math.round((bedStatus.available / bedStatus.total) * 100)}% availability rate</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <div className="glass-panel p-5 col-span-1 md:col-span-3">
                <h2 className="section-title mb-4">Department Bed Status</h2>
                <div className="space-y-8">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium">ICU Department</h3>
                      <span className="text-sm font-semibold">
                        {bedStatus.icu.occupied}/{bedStatus.icu.total} occupied
                      </span>
                    </div>
                    <div className="grid grid-cols-10 gap-2">
                      {Array.from({ length: bedStatus.icu.total }).map((_, i) => (
                        <div
                          key={`icu-${i}`}
                          className={`aspect-square rounded-md flex items-center justify-center text-xs font-medium
                            ${i < bedStatus.icu.occupied ? 'bg-red-100 text-red-700 border border-red-200' : 'bg-green-100 text-green-700 border border-green-200'}`}
                        >
                          {i + 1}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium">Emergency Department</h3>
                      <span className="text-sm font-semibold">
                        {bedStatus.emergency.occupied}/{bedStatus.emergency.total} occupied
                      </span>
                    </div>
                    <div className="grid grid-cols-10 gap-2">
                      {Array.from({ length: bedStatus.emergency.total }).map((_, i) => (
                        <div
                          key={`emergency-${i}`}
                          className={`aspect-square rounded-md flex items-center justify-center text-xs font-medium
                            ${i < bedStatus.emergency.occupied ? 'bg-amber-100 text-amber-700 border border-amber-200' : 'bg-green-100 text-green-700 border border-green-200'}`}
                        >
                          {i + 1}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium">General Ward</h3>
                      <span className="text-sm font-semibold">
                        {bedStatus.general.occupied}/{bedStatus.general.total} occupied
                      </span>
                    </div>
                    <div className="grid grid-cols-10 gap-2">
                      {Array.from({ length: bedStatus.general.total }).map((_, i) => (
                        <div
                          key={`general-${i}`}
                          className={`aspect-square rounded-md flex items-center justify-center text-xs font-medium
                            ${i < bedStatus.general.occupied ? 'bg-blue-100 text-blue-700 border border-blue-200' : 'bg-green-100 text-green-700 border border-green-200'}`}
                        >
                          {i + 1}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="glass-panel p-5">
                <h2 className="section-title mb-4">Update Bed Status</h2>
                <form className="space-y-4">
                  <div>
                    <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">
                      Department
                    </label>
                    <select id="department" className="hospital-input">
                      <option value="">Select department</option>
                      <option value="ICU">ICU</option>
                      <option value="Emergency">Emergency</option>
                      <option value="General">General Ward</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="bed-number" className="block text-sm font-medium text-gray-700 mb-1">
                      Bed Number
                    </label>
                    <input
                      type="number"
                      id="bed-number"
                      className="hospital-input"
                      placeholder="Enter bed number"
                      min="1"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select id="status" className="hospital-input">
                      <option value="">Select status</option>
                      <option value="Available">Available</option>
                      <option value="Occupied">Occupied</option>
                      <option value="Maintenance">Maintenance</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="patient-id" className="block text-sm font-medium text-gray-700 mb-1">
                      Patient ID (if occupied)
                    </label>
                    <input
                      type="text"
                      id="patient-id"
                      className="hospital-input"
                      placeholder="Enter patient ID"
                    />
                  </div>
                  
                  <div className="flex justify-end">
                    <button type="submit" className="hospital-btn-primary">
                      Update Status
                    </button>
                  </div>
                </form>
              </div>
            </div>

            <div className="glass-panel p-5">
              <h2 className="section-title mb-4">Bed Availability Prediction</h2>
              <p className="text-sm text-gray-600 mb-4">
                AI-driven predictions on when beds will become available based on historical data and current patient conditions.
              </p>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bed Number</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Status</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estimated Available At</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Confidence</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">ICU</div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">3</td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                          Occupied
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        Thomas Wilson
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                        Today, 15:30
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          High (85%)
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">Emergency</div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">7</td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                          Occupied
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        Maria Garcia
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                        Today, 18:45
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                          Medium (65%)
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">General</div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">12</td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                          Occupied
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        Robert Chen
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                        Tomorrow, 09:15
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          High (90%)
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">General</div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">19</td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                          Occupied
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        Emily Johnson
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                        Tomorrow, 14:30
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                          Medium (70%)
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Inventory Tab */}
        {activeTab === 'inventory' && (
          <div className="section-container">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="stat-card">
                <div className="flex justify-between">
                  <div>
                    <p className="card-subtitle">Total Items</p>
                    <h3 className="text-3xl font-bold">247</h3>
                  </div>
                  <div className="p-3 rounded-full bg-blue-50">
                    <Stethoscope className="h-6 w-6 text-hospital-500" />
                  </div>
                </div>
              </div>

              <div className="stat-card">
                <div className="flex justify-between">
                  <div>
                    <p className="card-subtitle">Low Stock Items</p>
                    <h3 className="text-3xl font-bold text-amber-600">8</h3>
                  </div>
                  <div className="p-3 rounded-full bg-amber-50">
                    <ArrowDown className="h-6 w-6 text-amber-500" />
                  </div>
                </div>
              </div>

              <div className="stat-card">
                <div className="flex justify-between">
                  <div>
                    <p className="card-subtitle">Out of Stock</p>
                    <h3 className="text-3xl font-bold text-red-600">2</h3>
                  </div>
                  <div className="p-3 rounded-full bg-red-50">
                    <UserMinus className="h-6 w-6 text-red-500" />
                  </div>
                </div>
              </div>
            </div>

            <div className="glass-panel p-5 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="section-title">Inventory Management</h2>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="Search inventory..."
                    className="hospital-input max-w-xs"
                  />
                  <button className="hospital-btn-primary">
                    Add Item
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item Name</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Stock</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {inventory.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{item.name}</div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.id % 2 === 0 ? 'Medical Supplies' : 'Medications'}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.stock}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.unit}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                            ${item.status === 'Adequate' ? 'bg-green-100 text-green-800' : 
                              'bg-red-100 text-red-800'}`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button className="text-hospital-600 hover:text-hospital-700">Update</button>
                            <button className="text-red-600 hover:text-red-700">Delete</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
