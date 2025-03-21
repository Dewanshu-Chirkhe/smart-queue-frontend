
import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { 
  Bed, 
  User, 
  Clock, 
  Brain, 
  RefreshCw, 
  Search, 
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  FileText,
  Pencil,
  X,
  Save,
  Check,
  UserPlus,
  UserMinus
} from 'lucide-react';

// Mock bed data
const DEPARTMENTS = [
  { id: 1, name: 'ICU', totalBeds: 20, color: 'red' },
  { id: 2, name: 'Emergency', totalBeds: 30, color: 'amber' },
  { id: 3, name: 'General Ward', totalBeds: 70, color: 'blue' },
  { id: 4, name: 'Pediatrics', totalBeds: 25, color: 'green' },
  { id: 5, name: 'Cardiology', totalBeds: 15, color: 'purple' },
];

// Initial bed data creator function
const createInitialBeds = () => {
  let beds: any[] = [];
  let id = 1;
  
  DEPARTMENTS.forEach(dept => {
    for (let i = 1; i <= dept.totalBeds; i++) {
      const isOccupied = Math.random() > 0.3; // 70% chance of being occupied
      beds.push({
        id: id++,
        number: i,
        departmentId: dept.id,
        departmentName: dept.name,
        status: isOccupied ? 'Occupied' : 'Available',
        patientName: isOccupied ? getRandomPatientName() : null,
        patientId: isOccupied ? `P${Math.floor(1000 + Math.random() * 9000)}` : null,
        admissionDate: isOccupied ? getRandomDate(new Date(2023, 10, 1), new Date()) : null,
        estimatedDischarge: isOccupied ? getRandomFutureDate() : null,
        notes: '',
      });
    }
  });
  
  return beds;
};

// Helper function to get random patient name
function getRandomPatientName() {
  const firstNames = ['John', 'Jane', 'Robert', 'Mary', 'James', 'Patricia', 'Michael', 'Linda', 'William', 'Elizabeth'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Miller', 'Davis', 'Garcia', 'Rodriguez', 'Wilson'];
  
  return `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;
}

// Helper function to get random past date
function getRandomDate(start: Date, end: Date) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

// Helper function to get random future date
function getRandomFutureDate() {
  const today = new Date();
  const futureDate = new Date();
  futureDate.setDate(today.getDate() + Math.floor(Math.random() * 10) + 1);
  return futureDate;
}

// Mock AI predictions
const MOCK_PREDICTIONS = [
  { id: 1, bedId: 5, departmentName: 'ICU', bedNumber: 5, patientName: 'James Wilson', estimatedDischarge: new Date(Date.now() + 1000 * 60 * 60 * 24 * 1), confidence: 85 },
  { id: 2, bedId: 12, departmentName: 'Emergency', bedNumber: 12, patientName: 'Linda Brown', estimatedDischarge: new Date(Date.now() + 1000 * 60 * 60 * 8), confidence: 92 },
  { id: 3, bedId: 35, departmentName: 'General Ward', bedNumber: 35, patientName: 'Robert Davis', estimatedDischarge: new Date(Date.now() + 1000 * 60 * 60 * 36), confidence: 78 },
  { id: 4, bedId: 42, departmentName: 'General Ward', bedNumber: 42, patientName: 'Elizabeth Johnson', estimatedDischarge: new Date(Date.now() + 1000 * 60 * 60 * 10), confidence: 65 },
  { id: 5, bedId: 85, departmentName: 'Cardiology', bedNumber: 5, patientName: 'Michael Garcia', estimatedDischarge: new Date(Date.now() + 1000 * 60 * 60 * 48), confidence: 80 },
];

const BedManagement = () => {
  const { isStaff } = useAuth();
  const [beds, setBeds] = useState(createInitialBeds());
  const [filteredBeds, setFilteredBeds] = useState(beds);
  const [selectedDepartment, setSelectedDepartment] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [editBedId, setEditBedId] = useState<number | null>(null);
  const [editedBed, setEditedBed] = useState<any>(null);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isDischargeModalOpen, setIsDischargeModalOpen] = useState(false);
  const [selectedBedId, setSelectedBedId] = useState<number | null>(null);
  const [newPatient, setNewPatient] = useState({
    name: '',
    id: '',
    notes: '',
  });
  const [isLastUpdated, setIsLastUpdated] = useState(new Date());
  const [predictions, setPredictions] = useState(MOCK_PREDICTIONS);
  
  // Calculate bed statistics
  const bedStats = DEPARTMENTS.map(dept => {
    const departmentBeds = beds.filter(bed => bed.departmentId === dept.id);
    const occupiedBeds = departmentBeds.filter(bed => bed.status === 'Occupied').length;
    const availableBeds = departmentBeds.filter(bed => bed.status === 'Available').length;
    const maintenanceBeds = departmentBeds.filter(bed => bed.status === 'Maintenance').length;
    const occupancyRate = departmentBeds.length > 0 ? (occupiedBeds / departmentBeds.length) * 100 : 0;
    
    return {
      ...dept,
      occupiedBeds,
      availableBeds,
      maintenanceBeds,
      occupancyRate,
    };
  });
  
  // Total bed statistics
  const totalBeds = beds.length;
  const totalOccupied = beds.filter(bed => bed.status === 'Occupied').length;
  const totalAvailable = beds.filter(bed => bed.status === 'Available').length;
  const totalMaintenance = beds.filter(bed => bed.status === 'Maintenance').length;
  const totalOccupancyRate = (totalOccupied / totalBeds) * 100;
  
  // Filter beds based on department, search query, and status
  useEffect(() => {
    let filtered = [...beds];
    
    if (selectedDepartment !== null) {
      filtered = filtered.filter(bed => bed.departmentId === selectedDepartment);
    }
    
    if (searchQuery) {
      filtered = filtered.filter(bed => 
        bed.patientName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bed.patientId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bed.number.toString().includes(searchQuery)
      );
    }
    
    if (statusFilter !== 'All') {
      filtered = filtered.filter(bed => bed.status === statusFilter);
    }
    
    if (departmentFilter !== 'All') {
      filtered = filtered.filter(bed => bed.departmentName === departmentFilter);
    }
    
    setFilteredBeds(filtered);
  }, [beds, selectedDepartment, searchQuery, statusFilter, departmentFilter]);
  
  // Handle department click
  const handleDepartmentClick = (deptId: number) => {
    setSelectedDepartment(selectedDepartment === deptId ? null : deptId);
  };
  
  // Start editing a bed
  const startEditingBed = (bedId: number) => {
    const bedToEdit = beds.find(bed => bed.id === bedId);
    if (bedToEdit) {
      setEditedBed({ ...bedToEdit });
      setEditBedId(bedId);
    }
  };
  
  // Save edited bed
  const saveEditedBed = () => {
    if (editBedId && editedBed) {
      setBeds(beds.map(bed => 
        bed.id === editBedId ? { ...editedBed } : bed
      ));
      setEditBedId(null);
      setEditedBed(null);
    }
  };
  
  // Cancel editing
  const cancelEditing = () => {
    setEditBedId(null);
    setEditedBed(null);
  };
  
  // Open assign patient modal
  const openAssignModal = (bedId: number) => {
    setSelectedBedId(bedId);
    setIsAssignModalOpen(true);
    setNewPatient({
      name: '',
      id: `P${Math.floor(1000 + Math.random() * 9000)}`,
      notes: '',
    });
  };
  
  // Open discharge patient modal
  const openDischargeModal = (bedId: number) => {
    setSelectedBedId(bedId);
    setIsDischargeModalOpen(true);
  };
  
  // Assign a patient to a bed
  const assignPatient = () => {
    if (selectedBedId && newPatient.name) {
      setBeds(beds.map(bed => 
        bed.id === selectedBedId 
          ? { 
              ...bed, 
              status: 'Occupied', 
              patientName: newPatient.name, 
              patientId: newPatient.id,
              admissionDate: new Date(),
              estimatedDischarge: getRandomFutureDate(),
              notes: newPatient.notes,
            } 
          : bed
      ));
      setIsAssignModalOpen(false);
      setSelectedBedId(null);
    }
  };
  
  // Discharge a patient
  const dischargePatient = () => {
    if (selectedBedId) {
      setBeds(beds.map(bed => 
        bed.id === selectedBedId 
          ? { 
              ...bed, 
              status: 'Available', 
              patientName: null, 
              patientId: null,
              admissionDate: null,
              estimatedDischarge: null,
              notes: '',
            } 
          : bed
      ));
      setIsDischargeModalOpen(false);
      setSelectedBedId(null);
    }
  };
  
  // Reset all filters
  const resetFilters = () => {
    setSelectedDepartment(null);
    setSearchQuery('');
    setStatusFilter('All');
    setDepartmentFilter('All');
  };
  
  // Refresh bed data
  const refreshData = () => {
    setIsLastUpdated(new Date());
  };
  
  // Format date for display
  const formatDate = (date: Date | null) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
    });
  };

  // Generate department bed grid display
  const renderDepartmentGrid = (deptId: number) => {
    const departmentBeds = beds.filter(bed => bed.departmentId === deptId);
    const department = DEPARTMENTS.find(d => d.id === deptId);
    
    // Calculate rows and columns for a nice grid
    const totalBeds = departmentBeds.length;
    const columns = Math.min(10, Math.ceil(Math.sqrt(totalBeds)));
    
    return (
      <div className="mt-3 animate-fadeIn">
        <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2">
          {departmentBeds.map(bed => (
            <div
              key={bed.id}
              className={`aspect-square rounded-md flex flex-col items-center justify-center p-1 
                ${bed.status === 'Available' 
                  ? 'bg-green-100 border border-green-200 text-green-700' 
                  : bed.status === 'Occupied'
                  ? `bg-${department?.color || 'blue'}-100 border border-${department?.color || 'blue'}-200 text-${department?.color || 'blue'}-700`
                  : 'bg-gray-100 border border-gray-200 text-gray-700'
                } cursor-pointer hover:shadow-md transition-shadow`}
              onClick={() => bed.status === 'Available' ? openAssignModal(bed.id) : openDischargeModal(bed.id)}
            >
              <div className="text-xs font-semibold">{bed.number}</div>
              <div 
                className={`text-[10px] ${bed.status === 'Available' ? 'text-green-600' : bed.status === 'Occupied' ? `text-${department?.color || 'blue'}-600` : 'text-gray-600'}`}
              >
                {bed.status}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-20 page-container">
        <div className="flex justify-between items-center mb-6">
          <h1 className="page-title">Bed Management</h1>
          <div className="flex items-center text-sm text-gray-500">
            <Clock className="h-4 w-4 mr-1" />
            <span>Last updated: {isLastUpdated.toLocaleTimeString()}</span>
            <button 
              onClick={refreshData}
              className="ml-2 p-1 rounded-full hover:bg-gray-100"
            >
              <RefreshCw className="h-4 w-4 text-gray-500" />
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="stat-card">
            <div className="flex justify-between items-start">
              <div>
                <p className="card-subtitle">Total Beds</p>
                <h3 className="text-3xl font-bold">{totalBeds}</h3>
              </div>
              <div className="p-3 rounded-full bg-blue-50">
                <Bed className="h-6 w-6 text-hospital-500" />
              </div>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="flex justify-between items-start">
              <div>
                <p className="card-subtitle">Occupied Beds</p>
                <h3 className="text-3xl font-bold text-amber-600">{totalOccupied}</h3>
                <p className="text-sm text-gray-500">
                  {totalOccupancyRate.toFixed(1)}% occupancy rate
                </p>
              </div>
              <div className="p-3 rounded-full bg-amber-50">
                <UserPlus className="h-6 w-6 text-amber-500" />
              </div>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="flex justify-between items-start">
              <div>
                <p className="card-subtitle">Available Beds</p>
                <h3 className="text-3xl font-bold text-green-600">{totalAvailable}</h3>
                <p className="text-sm text-gray-500">
                  {((totalAvailable / totalBeds) * 100).toFixed(1)}% availability
                </p>
              </div>
              <div className="p-3 rounded-full bg-green-50">
                <UserMinus className="h-6 w-6 text-green-500" />
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
          <div className="lg:col-span-3 glass-panel p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0 mb-6">
              <h2 className="section-title mb-0">Department Bed Status</h2>
              <div className="flex space-x-2">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search beds..."
                    className="hospital-input pl-9 max-w-xs"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                <select 
                  className="hospital-input max-w-xs"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="All">All Status</option>
                  <option value="Available">Available</option>
                  <option value="Occupied">Occupied</option>
                  <option value="Maintenance">Maintenance</option>
                </select>
                
                <button 
                  className="px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 text-sm hover:bg-gray-50"
                  onClick={resetFilters}
                >
                  Reset
                </button>
              </div>
            </div>
            
            <div className="space-y-6">
              {bedStats.map((dept) => (
                <div key={dept.id} className="space-y-3">
                  <div className="flex justify-between items-center">
                    <button 
                      onClick={() => handleDepartmentClick(dept.id)}
                      className="flex items-center space-x-2 font-medium text-lg"
                    >
                      <span
                        className={`inline-block w-3 h-3 rounded-full bg-${dept.color}-500`}
                      ></span>
                      <span>{dept.name}</span>
                      <span className="text-sm font-normal text-gray-500">
                        ({dept.occupiedBeds}/{dept.totalBeds} occupied)
                      </span>
                    </button>
                    <div className="text-sm">
                      <span className={dept.occupancyRate > 80 ? 'text-red-600' : dept.occupancyRate > 60 ? 'text-amber-600' : 'text-green-600'}>
                        {dept.occupancyRate.toFixed(1)}% occupied
                      </span>
                    </div>
                  </div>
                  
                  {/* Grid display of beds instead of a progress bar */}
                  {selectedDepartment === dept.id && renderDepartmentGrid(dept.id)}
                </div>
              ))}
            </div>
          </div>
          
          <div className="glass-panel p-6">
            <h2 className="section-title mb-4">AI Bed Predictions</h2>
            <div className="space-y-3">
              <div className="flex items-center space-x-2 mb-3">
                <div className="p-2 rounded-full bg-purple-50">
                  <Brain className="h-5 w-5 text-purple-500" />
                </div>
                <div className="text-sm text-gray-600">
                  AI-predicted bed availability
                </div>
              </div>
              
              {predictions.map(prediction => (
                <div 
                  key={prediction.id} 
                  className="p-3 bg-white rounded-lg border border-gray-200 hover:shadow-sm transition-shadow"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="text-xs font-medium bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
                        {prediction.departmentName} #{prediction.bedNumber}
                      </span>
                    </div>
                    <span className={`text-xs font-medium ${
                      prediction.confidence > 80 ? 'text-green-600' : 
                      prediction.confidence > 60 ? 'text-amber-600' : 
                      'text-red-600'
                    }`}>
                      {prediction.confidence}% confidence
                    </span>
                  </div>
                  <p className="text-sm font-medium truncate">{prediction.patientName}</p>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-xs text-gray-500">
                      Available:
                    </span>
                    <span className="text-xs font-medium">
                      {new Date(prediction.estimatedDischarge).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric', 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="glass-panel p-6">
          <h2 className="section-title mb-4">Bed Details</h2>
          <div className="flex flex-wrap gap-3 mb-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search beds or patients..."
                className="hospital-input pl-9 max-w-xs"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <select 
              className="hospital-input max-w-xs"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Status</option>
              <option value="Available">Available</option>
              <option value="Occupied">Occupied</option>
              <option value="Maintenance">Maintenance</option>
            </select>
            
            <select 
              className="hospital-input max-w-xs"
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
            >
              <option value="All">All Departments</option>
              {DEPARTMENTS.map(dept => (
                <option key={dept.id} value={dept.name}>{dept.name}</option>
              ))}
            </select>
            
            <button 
              className="px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 text-sm hover:bg-gray-50"
              onClick={resetFilters}
            >
              Reset Filters
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Bed #
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Patient
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Patient ID
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Admission Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Est. Discharge
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredBeds.map((bed) => (
                  <tr key={bed.id} className={`hover:bg-gray-50 ${bed.status === 'Available' ? 'bg-green-50/30' : bed.status === 'Maintenance' ? 'bg-gray-50/50' : ''}`}>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {bed.number}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {bed.departmentName}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      {editBedId === bed.id ? (
                        <select
                          className="hospital-input"
                          value={editedBed.status}
                          onChange={(e) => setEditedBed({ ...editedBed, status: e.target.value })}
                        >
                          <option value="Available">Available</option>
                          <option value="Occupied">Occupied</option>
                          <option value="Maintenance">Maintenance</option>
                        </select>
                      ) : (
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full
                          ${bed.status === 'Available' ? 'bg-green-100 text-green-800' : 
                            bed.status === 'Occupied' ? 'bg-amber-100 text-amber-800' : 
                            'bg-gray-100 text-gray-800'}`}>
                          {bed.status}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      {editBedId === bed.id ? (
                        <input
                          type="text"
                          className="hospital-input"
                          value={editedBed.patientName || ''}
                          onChange={(e) => setEditedBed({ ...editedBed, patientName: e.target.value })}
                          disabled={editedBed.status !== 'Occupied'}
                        />
                      ) : (
                        <div className="text-sm text-gray-900">
                          {bed.patientName || '-'}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      {editBedId === bed.id ? (
                        <input
                          type="text"
                          className="hospital-input"
                          value={editedBed.patientId || ''}
                          onChange={(e) => setEditedBed({ ...editedBed, patientId: e.target.value })}
                          disabled={editedBed.status !== 'Occupied'}
                        />
                      ) : (
                        <div className="text-sm text-gray-500">
                          {bed.patientId || '-'}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {formatDate(bed.admissionDate) || '-'}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {formatDate(bed.estimatedDischarge) || '-'}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                      {editBedId === bed.id ? (
                        <div className="flex space-x-2">
                          <button 
                            onClick={saveEditedBed}
                            className="text-green-600 hover:text-green-900"
                          >
                            <Save className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={cancelEditing}
                            className="text-gray-600 hover:text-gray-900"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => startEditingBed(bed.id)}
                            className="text-hospital-600 hover:text-hospital-900"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          {bed.status === 'Available' ? (
                            <button 
                              onClick={() => openAssignModal(bed.id)}
                              className="text-green-600 hover:text-green-900"
                            >
                              <UserPlus className="h-4 w-4" />
                            </button>
                          ) : bed.status === 'Occupied' ? (
                            <button 
                              onClick={() => openDischargeModal(bed.id)}
                              className="text-amber-600 hover:text-amber-900"
                            >
                              <UserMinus className="h-4 w-4" />
                            </button>
                          ) : null}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
                
                {filteredBeds.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                      No beds found matching your filters. <button className="text-hospital-600" onClick={resetFilters}>Reset filters</button>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      {/* Assign Patient Modal */}
      {isAssignModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md animate-fadeIn">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">Assign Patient to Bed</h2>
                <button onClick={() => setIsAssignModalOpen(false)}>
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>
              
              <form onSubmit={(e) => { e.preventDefault(); assignPatient(); }} className="space-y-4">
                <div>
                  <label htmlFor="patient-name" className="block text-sm font-medium text-gray-700 mb-1">
                    Patient Name
                  </label>
                  <input
                    id="patient-name"
                    type="text"
                    className="hospital-input"
                    placeholder="Enter patient name"
                    value={newPatient.name}
                    onChange={(e) => setNewPatient({ ...newPatient, name: e.target.value })}
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="patient-id" className="block text-sm font-medium text-gray-700 mb-1">
                    Patient ID
                  </label>
                  <input
                    id="patient-id"
                    type="text"
                    className="hospital-input"
                    placeholder="Enter patient ID"
                    value={newPatient.id}
                    onChange={(e) => setNewPatient({ ...newPatient, id: e.target.value })}
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                    Notes
                  </label>
                  <textarea
                    id="notes"
                    rows={3}
                    className="hospital-input"
                    placeholder="Enter any notes"
                    value={newPatient.notes}
                    onChange={(e) => setNewPatient({ ...newPatient, notes: e.target.value })}
                  ></textarea>
                </div>
                
                <div className="flex justify-end space-x-2 pt-4">
                  <button
                    type="button"
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    onClick={() => setIsAssignModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="hospital-btn-primary"
                  >
                    Assign Patient
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      
      {/* Discharge Patient Modal */}
      {isDischargeModalOpen && selectedBedId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md animate-fadeIn">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">Discharge Patient</h2>
                <button onClick={() => setIsDischargeModalOpen(false)}>
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>
              
              <div className="mb-6">
                <div className="bg-amber-50 p-4 rounded-lg mb-4">
                  <div className="flex items-start">
                    <div className="p-2 rounded-full bg-amber-100 mr-3">
                      <User className="h-5 w-5 text-amber-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-amber-900">
                        {beds.find(bed => bed.id === selectedBedId)?.patientName}
                      </h3>
                      <p className="text-sm text-amber-700">
                        ID: {beds.find(bed => bed.id === selectedBedId)?.patientId}
                      </p>
                      <p className="text-sm text-amber-700">
                        Admitted: {formatDate(beds.find(bed => bed.id === selectedBedId)?.admissionDate)}
                      </p>
                    </div>
                  </div>
                </div>
                
                <p className="text-gray-600">
                  Are you sure you want to discharge this patient and mark the bed as available?
                </p>
              </div>
              
              <div className="flex justify-end space-x-2">
                <button
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  onClick={() => setIsDischargeModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="hospital-btn-primary"
                  onClick={dischargePatient}
                >
                  Discharge Patient
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BedManagement;
