
import { useState, useEffect } from 'react';
import { Clock, ArrowRight, Search } from 'lucide-react';
import { queueService, DepartmentWaitTime } from '../services/queueService';
import { toast } from 'sonner';

// Queue item type
interface QueueItem {
  id: string;
  patientName: string;
  patientId: string;
  department: string;
  doctor: string;
  arrivalTime: string;
  estimatedWaitTime: string;
  status: 'Waiting' | 'In Progress' | 'Completed' | 'Cancelled';
}

const QueueManagement = () => {
  const [activeTab, setActiveTab] = useState<'current' | 'departments'>('current');
  const [queueItems, setQueueItems] = useState<QueueItem[]>([]);
  const [departmentWaitTimes, setDepartmentWaitTimes] = useState<DepartmentWaitTime[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchQueueData();
    fetchDepartmentWaitTimes();
  }, []);

  const fetchQueueData = async () => {
    setIsLoading(true);
    try {
      // Replace with API call when backend is ready
      // For now, simulate API response
      const mockedQueueItems: QueueItem[] = [
        {
          id: '1',
          patientName: 'Ananya Sharma',
          patientId: 'P1001',
          department: 'Cardiology',
          doctor: 'Dr. Priya Patel',
          arrivalTime: '09:15 AM',
          estimatedWaitTime: '25 min',
          status: 'Waiting'
        },
        {
          id: '2',
          patientName: 'Vikram Malhotra',
          patientId: 'P1002',
          department: 'General',
          doctor: 'Dr. Rajesh Kumar',
          arrivalTime: '09:30 AM',
          estimatedWaitTime: '10 min',
          status: 'In Progress'
        },
      ];
      setQueueItems(mockedQueueItems);
    } catch (error) {
      console.error('Error fetching queue data:', error);
      toast.error('Failed to load queue data');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDepartmentWaitTimes = async () => {
    try {
      const data = await queueService.getDepartmentWaitTimes();
      setDepartmentWaitTimes(data);
    } catch (error) {
      console.error('Error fetching department wait times:', error);
    }
  };

  const updateQueueItemStatus = async (id: string, status: QueueItem['status']) => {
    try {
      // Replace with API call when backend is ready
      // await api.put(`/queue/${id}`, { status });
      
      // Update local state
      setQueueItems(prev => 
        prev.map(item => item.id === id ? { ...item, status } : item)
      );
      
      toast.success(`Patient ${status.toLowerCase()}`);
    } catch (error) {
      console.error('Error updating queue status:', error);
      toast.error('Failed to update status');
    }
  };

  // Filter queue items based on search
  const filteredQueueItems = queueItems.filter(item =>
    item.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.patientId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="section-title">Queue Management</h2>
        
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab('current')}
            className={`px-3 py-1 text-sm rounded-md ${
              activeTab === 'current'
                ? 'bg-hospital-100 text-hospital-700'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Current Queue
          </button>
          <button
            onClick={() => setActiveTab('departments')}
            className={`px-3 py-1 text-sm rounded-md ${
              activeTab === 'departments'
                ? 'bg-hospital-100 text-hospital-700'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Departments
          </button>
        </div>
      </div>
      
      {activeTab === 'current' && (
        <>
          <div className="mb-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by patient name or ID..."
                className="hospital-input pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin h-10 w-10 border-4 border-hospital-500 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-500">Loading queue data...</p>
            </div>
          ) : filteredQueueItems.length > 0 ? (
            <div className="space-y-3">
              {filteredQueueItems.map(item => (
                <div
                  key={item.id}
                  className="p-4 bg-white rounded-lg border border-gray-200 hover:shadow-sm transition-shadow"
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="p-2 rounded-full bg-hospital-50 mr-3">
                        <Clock className="h-5 w-5 text-hospital-500" />
                      </div>
                      <div>
                        <div className="flex items-center">
                          <h3 className="font-medium text-gray-900">{item.patientName}</h3>
                          <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-800">
                            {item.patientId}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500">{item.department} • {item.doctor}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-sm">
                        Arrival: {item.arrivalTime}
                      </div>
                      <div className="text-sm text-hospital-600">
                        <span className="font-medium">Wait: {item.estimatedWaitTime}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex justify-between items-center">
                    <div>
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full
                        ${item.status === 'Waiting' ? 'bg-yellow-100 text-yellow-800' : 
                          item.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                          item.status === 'Completed' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'}`}
                      >
                        {item.status}
                      </span>
                    </div>
                    
                    <div className="flex space-x-2">
                      {item.status === 'Waiting' && (
                        <button
                          onClick={() => updateQueueItemStatus(item.id, 'In Progress')}
                          className="px-3 py-1 bg-hospital-50 text-hospital-600 text-sm rounded-md hover:bg-hospital-100"
                        >
                          Start
                        </button>
                      )}
                      {item.status === 'In Progress' && (
                        <button
                          onClick={() => updateQueueItemStatus(item.id, 'Completed')}
                          className="px-3 py-1 bg-green-50 text-green-600 text-sm rounded-md hover:bg-green-100"
                        >
                          Complete
                        </button>
                      )}
                      {(item.status === 'Waiting' || item.status === 'In Progress') && (
                        <button
                          onClick={() => updateQueueItemStatus(item.id, 'Cancelled')}
                          className="px-3 py-1 bg-red-50 text-red-600 text-sm rounded-md hover:bg-red-100"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-white rounded-lg border border-gray-200">
              <Clock className="h-12 w-12 mx-auto text-gray-300 mb-2" />
              <h3 className="text-lg font-medium text-gray-700 mb-1">Queue is empty</h3>
              <p className="text-gray-500">There are no patients waiting at the moment</p>
            </div>
          )}
        </>
      )}
      
      {activeTab === 'departments' && (
        <div className="space-y-4">
          {departmentWaitTimes.map((dept, index) => (
            <div key={index} className="p-4 bg-white rounded-lg border border-gray-200">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium text-gray-900">{dept.department}</h3>
                  <p className="text-sm text-gray-500">
                    Capacity: {Math.round(dept.capacity * 100)}%
                  </p>
                </div>
                <div className="text-right">
                  <div className="font-bold text-lg text-hospital-600">{dept.averageWaitTime}</div>
                  <div className="text-xs text-gray-500">Average wait time</div>
                </div>
              </div>
              
              <div className="mt-3">
                <div className="w-full h-2 bg-gray-200 rounded-full">
                  <div 
                    className={`h-2 rounded-full ${
                      dept.waitTimeMinutes > 30 ? 'bg-red-500' : 
                      dept.waitTimeMinutes > 15 ? 'bg-amber-500' : 
                      'bg-green-500'
                    }`}
                    style={{ width: `${Math.min(dept.capacity * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}

          {departmentWaitTimes.length === 0 && (
            <div className="text-center py-8 bg-white rounded-lg border border-gray-200">
              <p className="text-gray-500">No department data available</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default QueueManagement;
