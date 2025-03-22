
import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { Bed as BedIcon, Search, Filter, User, Clock, RefreshCw, ArrowUp, ArrowDown } from 'lucide-react';
import { toast } from 'sonner';
import { bedService, Bed, BedSummary } from '../services/bedService';

const BedManagement = () => {
  const { isStaff } = useAuth();
  const [beds, setBeds] = useState<Bed[]>([]);
  const [bedSummary, setBedSummary] = useState<BedSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortField, setSortField] = useState('bedNumber');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Fetch bed data
  useEffect(() => {
    fetchBeds();
    fetchBedSummary();
  }, []);

  const fetchBeds = async () => {
    setIsLoading(true);
    try {
      const data = await bedService.getAllBeds();
      setBeds(data);
    } catch (error) {
      console.error('Error fetching beds:', error);
      toast.error('Failed to load bed data');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchBedSummary = async () => {
    try {
      const data = await bedService.getBedSummary();
      setBedSummary(data);
    } catch (error) {
      console.error('Error fetching bed summary:', error);
    }
  };

  // Filter beds based on search, department, and status
  const filteredBeds = beds.filter(bed => {
    // Search filter
    const matchesSearch = 
      bed.bedNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (bed.patientName && bed.patientName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (bed.patientId && bed.patientId.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // Department filter
    const matchesDepartment = departmentFilter === 'All' || bed.department === departmentFilter;
    
    // Status filter
    const matchesStatus = statusFilter === 'All' || bed.status === statusFilter;
    
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  // Sort beds
  const sortedBeds = [...filteredBeds].sort((a, b) => {
    let aValue: any = a[sortField as keyof Bed];
    let bValue: any = b[sortField as keyof Bed];
    
    // Handle undefined values
    if (aValue === undefined) aValue = '';
    if (bValue === undefined) bValue = '';
    
    if (typeof aValue === 'string') {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }
    
    if (aValue < bValue) {
      return sortDirection === 'asc' ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortDirection === 'asc' ? 1 : -1;
    }
    return 0;
  });

  // Handle sort change
  const handleSort = (field: string) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Update bed status
  const updateBedStatus = async (id: string, status: Bed['status']) => {
    try {
      await bedService.updateBedStatus(id, status);
      setBeds(prev => prev.map(bed => 
        bed.id === id ? { ...bed, status, patientId: status === 'Available' ? undefined : bed.patientId } : bed
      ));
      fetchBedSummary(); // Refresh summary
      toast.success(`Bed status updated to ${status}`);
    } catch (error) {
      console.error('Error updating bed status:', error);
      toast.error('Failed to update bed status');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-20 page-container">
        <div className="flex justify-between items-center mb-6">
          <h1 className="page-title">Bed Management</h1>
          <button className="p-2 rounded-full hover:bg-gray-100" onClick={() => {
            fetchBeds();
            fetchBedSummary();
          }}>
            <RefreshCw className="h-5 w-5 text-gray-600" />
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="stat-card">
            <div className="flex justify-between items-start">
              <div>
                <p className="card-subtitle">Total Beds</p>
                <h3 className="text-3xl font-bold">{beds.length}</h3>
              </div>
              <div className="p-3 rounded-full bg-blue-50">
                <BedIcon className="h-6 w-6 text-blue-500" />
              </div>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="flex justify-between items-start">
              <div>
                <p className="card-subtitle">Available</p>
                <h3 className="text-3xl font-bold text-green-600">
                  {beds.filter(bed => bed.status === 'Available').length}
                </h3>
              </div>
              <div className="p-3 rounded-full bg-green-50">
                <ArrowUp className="h-6 w-6 text-green-500" />
              </div>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="flex justify-between items-start">
              <div>
                <p className="card-subtitle">Occupied</p>
                <h3 className="text-3xl font-bold text-amber-600">
                  {beds.filter(bed => bed.status === 'Occupied').length}
                </h3>
              </div>
              <div className="p-3 rounded-full bg-amber-50">
                <User className="h-6 w-6 text-amber-500" />
              </div>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="flex justify-between items-start">
              <div>
                <p className="card-subtitle">Under Maintenance</p>
                <h3 className="text-3xl font-bold text-red-600">
                  {beds.filter(bed => bed.status === 'Under Maintenance').length}
                </h3>
              </div>
              <div className="p-3 rounded-full bg-red-50">
                <Clock className="h-6 w-6 text-red-500" />
              </div>
            </div>
          </div>
        </div>
        
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Bed Availability by Department</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {bedSummary.map((dept, index) => (
              <div key={index} className="glass-panel p-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium">{dept.department}</h3>
                  <span className="text-sm font-medium">{dept.available}/{dept.total}</span>
                </div>
                <div className="grid grid-cols-5 gap-1">
                  {Array.from({ length: dept.total }).map((_, i) => (
                    <div 
                      key={i}
                      className={`h-6 rounded-sm ${i < dept.available ? 'bg-green-100 border border-green-500' : 'bg-red-100 border border-red-500'}`}
                    >
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="glass-panel p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0 mb-6">
            <h2 className="section-title mb-0">Bed Details</h2>
            
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search beds..."
                  className="hospital-input pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="flex space-x-2">
                <select 
                  className="hospital-input"
                  value={departmentFilter}
                  onChange={(e) => setDepartmentFilter(e.target.value)}
                >
                  <option value="All">All Departments</option>
                  {Array.from(new Set(beds.map(bed => bed.department))).map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
                
                <select 
                  className="hospital-input"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="All">All Status</option>
                  <option value="Available">Available</option>
                  <option value="Occupied">Occupied</option>
                  <option value="Under Maintenance">Under Maintenance</option>
                </select>
              </div>
            </div>
          </div>
          
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin h-10 w-10 border-4 border-hospital-500 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-500">Loading bed data...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th 
                      onClick={() => handleSort('bedNumber')}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    >
                      <div className="flex items-center">
                        Bed Number
                        {sortField === 'bedNumber' && (
                          <span className="ml-1">
                            {sortDirection === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                          </span>
                        )}
                      </div>
                    </th>
                    <th 
                      onClick={() => handleSort('department')}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    >
                      <div className="flex items-center">
                        Department
                        {sortField === 'department' && (
                          <span className="ml-1">
                            {sortDirection === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                          </span>
                        )}
                      </div>
                    </th>
                    <th 
                      onClick={() => handleSort('ward')}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    >
                      <div className="flex items-center">
                        Ward
                        {sortField === 'ward' && (
                          <span className="ml-1">
                            {sortDirection === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                          </span>
                        )}
                      </div>
                    </th>
                    <th 
                      onClick={() => handleSort('status')}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    >
                      <div className="flex items-center">
                        Status
                        {sortField === 'status' && (
                          <span className="ml-1">
                            {sortDirection === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                          </span>
                        )}
                      </div>
                    </th>
                    <th 
                      onClick={() => handleSort('patientName')}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    >
                      <div className="flex items-center">
                        Patient
                        {sortField === 'patientName' && (
                          <span className="ml-1">
                            {sortDirection === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                          </span>
                        )}
                      </div>
                    </th>
                    <th 
                      onClick={() => handleSort('admissionDate')}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    >
                      <div className="flex items-center">
                        Admission Date
                        {sortField === 'admissionDate' && (
                          <span className="ml-1">
                            {sortDirection === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                          </span>
                        )}
                      </div>
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sortedBeds.map(bed => (
                    <tr key={bed.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {bed.bedNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {bed.department}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {bed.ward}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full
                          ${bed.status === 'Available' ? 'bg-green-100 text-green-800' : 
                            bed.status === 'Occupied' ? 'bg-amber-100 text-amber-800' : 
                            'bg-red-100 text-red-800'}`}>
                          {bed.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {bed.patientName || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {bed.admissionDate ? new Date(bed.admissionDate).toLocaleDateString() : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          {bed.status === 'Occupied' && (
                            <button 
                              onClick={() => updateBedStatus(bed.id, 'Available')}
                              className="text-green-600 hover:text-green-900"
                            >
                              Release
                            </button>
                          )}
                          {bed.status !== 'Under Maintenance' && (
                            <button 
                              onClick={() => updateBedStatus(bed.id, 'Under Maintenance')}
                              className="text-amber-600 hover:text-amber-900"
                            >
                              Maintenance
                            </button>
                          )}
                          {bed.status === 'Under Maintenance' && (
                            <button 
                              onClick={() => updateBedStatus(bed.id, 'Available')}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              Available
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                  
                  {sortedBeds.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                        No beds found matching your filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BedManagement;
