
import { useState, useEffect } from 'react';
import { ArrowUp, ArrowDown, Check, X, User, Clock, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';

interface Patient {
  id: string;
  name: string;
  age: number;
  reason: string;
  waitTime: number;
  status: 'waiting' | 'in-progress' | 'completed' | 'cancelled';
  priority: number;
  arrivalTime: Date;
}

const QueueManagement = () => {
  const [patients, setPatients] = useState<Patient[]>([
    {
      id: 'P1001',
      name: 'Arjun Singh',
      age: 45,
      reason: 'Chest pain',
      waitTime: 25,
      status: 'waiting',
      priority: 3,
      arrivalTime: new Date(Date.now() - 25 * 60 * 1000),
    },
    {
      id: 'P1002',
      name: 'Priya Mehta',
      age: 32,
      reason: 'Fever and headache',
      waitTime: 15,
      status: 'waiting',
      priority: 2,
      arrivalTime: new Date(Date.now() - 15 * 60 * 1000),
    },
    {
      id: 'P1003',
      name: 'Raj Malhotra',
      age: 60,
      reason: 'Difficulty breathing',
      waitTime: 10,
      status: 'in-progress',
      priority: 4,
      arrivalTime: new Date(Date.now() - 10 * 60 * 1000),
    },
    {
      id: 'P1004',
      name: 'Anita Desai',
      age: 28,
      reason: 'Sprained ankle',
      waitTime: 40,
      status: 'waiting',
      priority: 1,
      arrivalTime: new Date(Date.now() - 40 * 60 * 1000),
    },
  ]);

  const [newPatient, setNewPatient] = useState({
    name: '',
    age: '',
    reason: '',
    priority: '2',
  });

  const [showAddForm, setShowAddForm] = useState(false);
  const [filter, setFilter] = useState('all');

  // Update wait times periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setPatients(prevPatients => 
        prevPatients.map(patient => {
          if (patient.status === 'waiting') {
            const nowMs = Date.now();
            const arrivalMs = patient.arrivalTime.getTime();
            const waitTimeMinutes = Math.floor((nowMs - arrivalMs) / (1000 * 60));
            
            return {
              ...patient,
              waitTime: waitTimeMinutes
            };
          }
          return patient;
        })
      );
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  // Handle priority change
  const changePriority = (patientId: string, direction: 'up' | 'down') => {
    setPatients(prevPatients => 
      prevPatients.map(patient => {
        if (patient.id === patientId) {
          return {
            ...patient,
            priority: direction === 'up' 
              ? Math.min(patient.priority + 1, 5) 
              : Math.max(patient.priority - 1, 1)
          };
        }
        return patient;
      })
    );
    
    toast.success(`Patient priority updated`);
  };

  // Handle status change
  const changeStatus = (patientId: string, newStatus: 'waiting' | 'in-progress' | 'completed' | 'cancelled') => {
    setPatients(prevPatients => 
      prevPatients.map(patient => {
        if (patient.id === patientId) {
          return {
            ...patient,
            status: newStatus
          };
        }
        return patient;
      })
    );
    
    toast.success(`Patient status updated to ${newStatus}`);
  };

  // Handle new patient form submission
  const handleAddPatient = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newPatient.name || !newPatient.age || !newPatient.reason) {
      toast.error('Please fill all required fields');
      return;
    }
    
    const newPatientId = `P${1000 + patients.length + 1}`;
    
    setPatients(prev => [
      ...prev,
      {
        id: newPatientId,
        name: newPatient.name,
        age: parseInt(newPatient.age),
        reason: newPatient.reason,
        waitTime: 0,
        status: 'waiting',
        priority: parseInt(newPatient.priority),
        arrivalTime: new Date(),
      }
    ]);
    
    setNewPatient({
      name: '',
      age: '',
      reason: '',
      priority: '2',
    });
    
    setShowAddForm(false);
    toast.success('New patient added to queue');
  };

  // Filter patients based on status
  const filteredPatients = filter === 'all' 
    ? patients
    : patients.filter(patient => patient.status === filter);

  // Sort patients by priority (higher first), then by wait time (longer first)
  const sortedPatients = [...filteredPatients].sort((a, b) => {
    if (a.priority !== b.priority) {
      return b.priority - a.priority;
    }
    return b.waitTime - a.waitTime;
  });

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <h2 className="section-title mb-3 sm:mb-0">Queue Management</h2>
        
        <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
          <select 
            className="hospital-input text-sm"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All Patients</option>
            <option value="waiting">Waiting</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          
          <button 
            className="hospital-btn-primary text-sm"
            onClick={() => setShowAddForm(true)}
          >
            Add Patient
          </button>
        </div>
      </div>

      {/* Queue Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="stat-card p-4">
          <p className="text-xs text-gray-500 mb-1">Total Patients</p>
          <p className="text-xl font-bold">{patients.length}</p>
        </div>
        <div className="stat-card p-4">
          <p className="text-xs text-gray-500 mb-1">Waiting</p>
          <p className="text-xl font-bold text-amber-600">
            {patients.filter(p => p.status === 'waiting').length}
          </p>
        </div>
        <div className="stat-card p-4">
          <p className="text-xs text-gray-500 mb-1">In Progress</p>
          <p className="text-xl font-bold text-blue-600">
            {patients.filter(p => p.status === 'in-progress').length}
          </p>
        </div>
        <div className="stat-card p-4">
          <p className="text-xs text-gray-500 mb-1">Completed</p>
          <p className="text-xl font-bold text-green-600">
            {patients.filter(p => p.status === 'completed').length}
          </p>
        </div>
      </div>

      {/* Patient Queue Table */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Patient
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Wait Time
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Priority
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedPatients.length > 0 ? (
              sortedPatients.map(patient => (
                <tr key={patient.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-hospital-100 rounded-full flex items-center justify-center">
                        <User className="h-6 w-6 text-hospital-600" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{patient.name}</div>
                        <div className="text-sm text-gray-500">
                          {patient.age} years • {patient.id}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">{patient.reason}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-gray-400 mr-1" />
                      <span className={`text-sm ${
                        patient.waitTime > 30 ? 'text-red-600' : 
                        patient.waitTime > 15 ? 'text-amber-600' : 
                        'text-gray-600'
                      }`}>
                        {patient.waitTime} min
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      patient.status === 'waiting' ? 'bg-amber-100 text-amber-800' :
                      patient.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                      patient.status === 'completed' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {patient.status.replace('-', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <div 
                          key={i} 
                          className={`w-2 h-2 rounded-full mx-0.5 ${
                            i < patient.priority ? 'bg-hospital-500' : 'bg-gray-200'
                          }`}
                        ></div>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-1">
                      <button 
                        onClick={() => changePriority(patient.id, 'up')}
                        disabled={patient.priority >= 5}
                        className="text-gray-600 hover:text-gray-900 disabled:opacity-50"
                      >
                        <ArrowUp className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => changePriority(patient.id, 'down')}
                        disabled={patient.priority <= 1}
                        className="text-gray-600 hover:text-gray-900 disabled:opacity-50"
                      >
                        <ArrowDown className="h-4 w-4" />
                      </button>
                      
                      {patient.status === 'waiting' && (
                        <button 
                          onClick={() => changeStatus(patient.id, 'in-progress')}
                          className="ml-2 text-blue-600 hover:text-blue-900"
                        >
                          <ChevronRight className="h-4 w-4" />
                        </button>
                      )}
                      
                      {patient.status === 'in-progress' && (
                        <button 
                          onClick={() => changeStatus(patient.id, 'completed')}
                          className="ml-2 text-green-600 hover:text-green-900"
                        >
                          <Check className="h-4 w-4" />
                        </button>
                      )}
                      
                      {(patient.status === 'waiting' || patient.status === 'in-progress') && (
                        <button 
                          onClick={() => changeStatus(patient.id, 'cancelled')}
                          className="ml-2 text-red-600 hover:text-red-900"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                  No patients in the queue
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add Patient Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md animate-fadeIn">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">Add New Patient</h2>
                <button onClick={() => setShowAddForm(false)}>
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>
              
              <form onSubmit={handleAddPatient} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Patient Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    className="hospital-input"
                    placeholder="Enter patient name"
                    value={newPatient.name}
                    onChange={(e) => setNewPatient({ ...newPatient, name: e.target.value })}
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">
                    Age
                  </label>
                  <input
                    id="age"
                    type="number"
                    min="0"
                    max="120"
                    className="hospital-input"
                    placeholder="Enter age"
                    value={newPatient.age}
                    onChange={(e) => setNewPatient({ ...newPatient, age: e.target.value })}
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-1">
                    Reason for Visit
                  </label>
                  <input
                    id="reason"
                    type="text"
                    className="hospital-input"
                    placeholder="Enter chief complaint"
                    value={newPatient.reason}
                    onChange={(e) => setNewPatient({ ...newPatient, reason: e.target.value })}
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
                    Priority Level (1-5)
                  </label>
                  <select
                    id="priority"
                    className="hospital-input"
                    value={newPatient.priority}
                    onChange={(e) => setNewPatient({ ...newPatient, priority: e.target.value })}
                  >
                    <option value="1">1 - Low</option>
                    <option value="2">2 - Normal</option>
                    <option value="3">3 - Elevated</option>
                    <option value="4">4 - Urgent</option>
                    <option value="5">5 - Emergency</option>
                  </select>
                </div>
                
                <div className="flex justify-end space-x-2 pt-4">
                  <button
                    type="button"
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    onClick={() => setShowAddForm(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="hospital-btn-primary"
                  >
                    Add Patient
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QueueManagement;
