
import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { 
  Stethoscope, 
  Plus, 
  Search, 
  Filter, 
  ArrowDownUp, 
  Download, 
  AlertTriangle,
  X,
  Check,
  Trash,
  PencilLine,
  Save
} from 'lucide-react';

// Mock inventory data
const MOCK_INVENTORY = [
  { id: 1, name: 'Surgical Masks', category: 'Protective Equipment', stock: 2450, unit: 'pcs', lowStockThreshold: 1000, status: 'Adequate' },
  { id: 2, name: 'Disposable Gloves', category: 'Protective Equipment', stock: 850, unit: 'pcs', lowStockThreshold: 2000, status: 'Low Stock' },
  { id: 3, name: 'Paracetamol 500mg', category: 'Medication', stock: 540, unit: 'boxes', lowStockThreshold: 200, status: 'Adequate' },
  { id: 4, name: 'Bandages', category: 'Medical Supplies', stock: 320, unit: 'pcs', lowStockThreshold: 500, status: 'Low Stock' },
  { id: 5, name: 'Hand Sanitizer', category: 'Hygiene Products', stock: 180, unit: 'bottles', lowStockThreshold: 100, status: 'Adequate' },
  { id: 6, name: 'Ibuprofen 400mg', category: 'Medication', stock: 430, unit: 'boxes', lowStockThreshold: 150, status: 'Adequate' },
  { id: 7, name: 'Syringes', category: 'Medical Supplies', stock: 970, unit: 'pcs', lowStockThreshold: 300, status: 'Adequate' },
  { id: 8, name: 'Face Shields', category: 'Protective Equipment', stock: 120, unit: 'pcs', lowStockThreshold: 200, status: 'Low Stock' },
  { id: 9, name: 'Stethoscopes', category: 'Medical Equipment', stock: 25, unit: 'pcs', lowStockThreshold: 10, status: 'Adequate' },
  { id: 10, name: 'Blood Pressure Monitors', category: 'Medical Equipment', stock: 15, unit: 'pcs', lowStockThreshold: 5, status: 'Adequate' },
  { id: 11, name: 'Antibiotic Ointment', category: 'Medication', stock: 85, unit: 'tubes', lowStockThreshold: 50, status: 'Adequate' },
  { id: 12, name: 'Antiseptic Solution', category: 'Medical Supplies', stock: 40, unit: 'bottles', lowStockThreshold: 50, status: 'Low Stock' },
];

const CATEGORIES = [
  'All Categories',
  'Medication',
  'Medical Supplies',
  'Protective Equipment',
  'Medical Equipment',
  'Hygiene Products',
];

const STATUS_FILTERS = [
  'All Status',
  'Adequate',
  'Low Stock',
  'Out of Stock',
];

const Inventory = () => {
  const { isStaff } = useAuth();
  const [inventory, setInventory] = useState(MOCK_INVENTORY);
  const [filteredInventory, setFilteredInventory] = useState(MOCK_INVENTORY);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All Categories');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
  const [editItemId, setEditItemId] = useState<number | null>(null);
  
  // Form state for adding new items
  const [newItem, setNewItem] = useState({
    name: '',
    category: '',
    stock: 0,
    unit: '',
    lowStockThreshold: 0,
  });
  
  // Form state for editing items
  const [editedItem, setEditedItem] = useState({
    name: '',
    category: '',
    stock: 0,
    unit: '',
    lowStockThreshold: 0,
  });

  // Apply filters and sorting
  useEffect(() => {
    let result = [...inventory];
    
    // Search filter
    if (searchQuery) {
      result = result.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Category filter
    if (categoryFilter !== 'All Categories') {
      result = result.filter(item => item.category === categoryFilter);
    }
    
    // Status filter
    if (statusFilter !== 'All Status') {
      result = result.filter(item => item.status === statusFilter);
    }
    
    // Sorting
    result.sort((a, b) => {
      const aValue = a[sortField as keyof typeof a];
      const bValue = b[sortField as keyof typeof b];
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc' 
          ? aValue.localeCompare(bValue) 
          : bValue.localeCompare(aValue);
      } else {
        return sortDirection === 'asc' 
          ? (aValue as number) - (bValue as number) 
          : (bValue as number) - (aValue as number);
      }
    });
    
    setFilteredInventory(result);
  }, [inventory, searchQuery, categoryFilter, statusFilter, sortField, sortDirection]);

  // Sort by field
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };
  
  // Reset filters
  const resetFilters = () => {
    setSearchQuery('');
    setCategoryFilter('All Categories');
    setStatusFilter('All Status');
    setSortField('name');
    setSortDirection('asc');
  };
  
  // Add new item
  const handleAddItem = () => {
    const status = newItem.stock <= newItem.lowStockThreshold ? 'Low Stock' : 'Adequate';
    const id = Math.max(...inventory.map(item => item.id)) + 1;
    
    const itemToAdd = {
      id,
      ...newItem,
      status,
    };
    
    setInventory([...inventory, itemToAdd]);
    setIsAddModalOpen(false);
    setNewItem({
      name: '',
      category: '',
      stock: 0,
      unit: '',
      lowStockThreshold: 0,
    });
  };
  
  // Delete item
  const handleDeleteItem = () => {
    if (selectedItemId) {
      setInventory(inventory.filter(item => item.id !== selectedItemId));
      setIsDeleteModalOpen(false);
      setSelectedItemId(null);
    }
  };
  
  // Edit item
  const startEditingItem = (id: number) => {
    const itemToEdit = inventory.find(item => item.id === id);
    if (itemToEdit) {
      setEditedItem({
        name: itemToEdit.name,
        category: itemToEdit.category,
        stock: itemToEdit.stock,
        unit: itemToEdit.unit,
        lowStockThreshold: itemToEdit.lowStockThreshold,
      });
      setEditItemId(id);
    }
  };
  
  // Save edited item
  const saveEditedItem = () => {
    if (editItemId) {
      const status = editedItem.stock <= editedItem.lowStockThreshold ? 'Low Stock' : 'Adequate';
      
      setInventory(inventory.map(item => 
        item.id === editItemId ? { ...item, ...editedItem, status } : item
      ));
      
      setEditItemId(null);
    }
  };
  
  // Cancel editing
  const cancelEditing = () => {
    setEditItemId(null);
  };
  
  // Count low stock items
  const lowStockCount = inventory.filter(item => item.status === 'Low Stock').length;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-20 page-container">
        <div className="flex justify-between items-center mb-6">
          <h1 className="page-title">Inventory Management</h1>
          <button
            className="hospital-btn-primary flex items-center"
            onClick={() => setIsAddModalOpen(true)}
          >
            <Plus className="mr-1 h-4 w-4" />
            Add Item
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="stat-card col-span-1">
            <div className="flex justify-between items-start">
              <div>
                <p className="card-subtitle">Total Items</p>
                <h3 className="text-3xl font-bold">{inventory.length}</h3>
              </div>
              <div className="p-3 rounded-full bg-blue-50">
                <Stethoscope className="h-6 w-6 text-hospital-500" />
              </div>
            </div>
          </div>
          
          <div className="stat-card col-span-1">
            <div className="flex justify-between items-start">
              <div>
                <p className="card-subtitle">Categories</p>
                <h3 className="text-3xl font-bold">
                  {new Set(inventory.map(item => item.category)).size}
                </h3>
              </div>
              <div className="p-3 rounded-full bg-purple-50">
                <Filter className="h-6 w-6 text-purple-500" />
              </div>
            </div>
          </div>
          
          <div className="stat-card col-span-1">
            <div className="flex justify-between items-start">
              <div>
                <p className="card-subtitle">Low Stock Items</p>
                <h3 className="text-3xl font-bold text-amber-600">{lowStockCount}</h3>
              </div>
              <div className="p-3 rounded-full bg-amber-50">
                <AlertTriangle className="h-6 w-6 text-amber-500" />
              </div>
            </div>
          </div>
          
          <div className="stat-card col-span-1">
            <div className="flex justify-between items-start">
              <div>
                <p className="card-subtitle">Out of Stock</p>
                <h3 className="text-3xl font-bold text-red-600">0</h3>
              </div>
              <div className="p-3 rounded-full bg-red-50">
                <X className="h-6 w-6 text-red-500" />
              </div>
            </div>
          </div>
        </div>
        
        <div className="glass-panel p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0 mb-6">
            <div className="flex space-x-2">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search inventory..."
                  className="hospital-input pl-9 max-w-xs"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <select 
                className="hospital-input max-w-xs"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                {CATEGORIES.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              
              <select 
                className="hospital-input max-w-xs"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                {STATUS_FILTERS.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
            
            <div className="flex space-x-2">
              <button 
                className="px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 text-sm hover:bg-gray-50"
                onClick={resetFilters}
              >
                Reset Filters
              </button>
              <button className="px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 text-sm hover:bg-gray-50">
                <Download className="h-4 w-4" />
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th 
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center">
                      <span>Item Name</span>
                      {sortField === 'name' && (
                        <ArrowDownUp className={`ml-1 h-4 w-4 text-gray-400 ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('category')}
                  >
                    <div className="flex items-center">
                      <span>Category</span>
                      {sortField === 'category' && (
                        <ArrowDownUp className={`ml-1 h-4 w-4 text-gray-400 ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('stock')}
                  >
                    <div className="flex items-center">
                      <span>Current Stock</span>
                      {sortField === 'stock' && (
                        <ArrowDownUp className={`ml-1 h-4 w-4 text-gray-400 ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                      )}
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Unit
                  </th>
                  <th 
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('lowStockThreshold')}
                  >
                    <div className="flex items-center">
                      <span>Low Stock Threshold</span>
                      {sortField === 'lowStockThreshold' && (
                        <ArrowDownUp className={`ml-1 h-4 w-4 text-gray-400 ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('status')}
                  >
                    <div className="flex items-center">
                      <span>Status</span>
                      {sortField === 'status' && (
                        <ArrowDownUp className={`ml-1 h-4 w-4 text-gray-400 ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                      )}
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredInventory.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap">
                      {editItemId === item.id ? (
                        <input
                          type="text"
                          className="hospital-input"
                          value={editedItem.name}
                          onChange={(e) => setEditedItem({ ...editedItem, name: e.target.value })}
                        />
                      ) : (
                        <div className="text-sm font-medium text-gray-900">{item.name}</div>
                      )}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      {editItemId === item.id ? (
                        <select
                          className="hospital-input"
                          value={editedItem.category}
                          onChange={(e) => setEditedItem({ ...editedItem, category: e.target.value })}
                        >
                          {CATEGORIES.filter(cat => cat !== 'All Categories').map(category => (
                            <option key={category} value={category}>{category}</option>
                          ))}
                        </select>
                      ) : (
                        <div className="text-sm text-gray-500">{item.category}</div>
                      )}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      {editItemId === item.id ? (
                        <input
                          type="number"
                          className="hospital-input"
                          value={editedItem.stock}
                          onChange={(e) => setEditedItem({ ...editedItem, stock: parseInt(e.target.value) })}
                          min="0"
                        />
                      ) : (
                        <div className="text-sm text-gray-900">{item.stock}</div>
                      )}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      {editItemId === item.id ? (
                        <input
                          type="text"
                          className="hospital-input"
                          value={editedItem.unit}
                          onChange={(e) => setEditedItem({ ...editedItem, unit: e.target.value })}
                        />
                      ) : (
                        <div className="text-sm text-gray-500">{item.unit}</div>
                      )}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      {editItemId === item.id ? (
                        <input
                          type="number"
                          className="hospital-input"
                          value={editedItem.lowStockThreshold}
                          onChange={(e) => setEditedItem({ ...editedItem, lowStockThreshold: parseInt(e.target.value) })}
                          min="0"
                        />
                      ) : (
                        <div className="text-sm text-gray-500">{item.lowStockThreshold}</div>
                      )}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full
                        ${item.status === 'Adequate' ? 'bg-green-100 text-green-800' : 
                          item.status === 'Low Stock' ? 'bg-amber-100 text-amber-800' : 
                          'bg-red-100 text-red-800'}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                      {editItemId === item.id ? (
                        <div className="flex space-x-2">
                          <button 
                            onClick={saveEditedItem}
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
                            onClick={() => startEditingItem(item.id)}
                            className="text-hospital-600 hover:text-hospital-900"
                          >
                            <PencilLine className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => {
                              setSelectedItemId(item.id);
                              setIsDeleteModalOpen(true);
                            }}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
                
                {filteredInventory.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                      No items found matching your filters. <button className="text-hospital-600" onClick={resetFilters}>Reset filters</button>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="glass-panel p-6">
          <h2 className="section-title mb-4">Low Stock Alerts</h2>
          <div className="space-y-4">
            {inventory
              .filter(item => item.status === 'Low Stock')
              .map(item => (
                <div key={item.id} className="flex items-center justify-between p-4 bg-amber-50 border border-amber-100 rounded-lg">
                  <div className="flex items-center">
                    <div className="p-2 rounded-full bg-amber-100 mr-3">
                      <AlertTriangle className="h-5 w-5 text-amber-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-amber-900">{item.name}</h3>
                      <p className="text-sm text-amber-700">
                        Current stock: <span className="font-medium">{item.stock} {item.unit}</span> (threshold: {item.lowStockThreshold} {item.unit})
                      </p>
                    </div>
                  </div>
                  <button className="hospital-btn-primary text-sm">
                    Order More
                  </button>
                </div>
              ))}
              
            {inventory.filter(item => item.status === 'Low Stock').length === 0 && (
              <div className="text-center py-8">
                <Check className="h-12 w-12 mx-auto text-green-300 mb-2" />
                <h3 className="text-lg font-medium text-gray-700 mb-1">All items well stocked</h3>
                <p className="text-gray-500">There are no low stock items at the moment</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Add Item Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md animate-fadeIn">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">Add New Item</h2>
                <button onClick={() => setIsAddModalOpen(false)}>
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>
              
              <form onSubmit={(e) => { e.preventDefault(); handleAddItem(); }} className="space-y-4">
                <div>
                  <label htmlFor="item-name" className="block text-sm font-medium text-gray-700 mb-1">
                    Item Name
                  </label>
                  <input
                    id="item-name"
                    type="text"
                    className="hospital-input"
                    placeholder="Enter item name"
                    value={newItem.name}
                    onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    id="category"
                    className="hospital-input"
                    value={newItem.category}
                    onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                    required
                  >
                    <option value="">Select category</option>
                    {CATEGORIES.filter(cat => cat !== 'All Categories').map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">
                      Current Stock
                    </label>
                    <input
                      id="stock"
                      type="number"
                      className="hospital-input"
                      placeholder="Quantity"
                      value={newItem.stock || ''}
                      onChange={(e) => setNewItem({ ...newItem, stock: parseInt(e.target.value) || 0 })}
                      min="0"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="unit" className="block text-sm font-medium text-gray-700 mb-1">
                      Unit
                    </label>
                    <input
                      id="unit"
                      type="text"
                      className="hospital-input"
                      placeholder="pcs, boxes, etc."
                      value={newItem.unit}
                      onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="threshold" className="block text-sm font-medium text-gray-700 mb-1">
                    Low Stock Threshold
                  </label>
                  <input
                    id="threshold"
                    type="number"
                    className="hospital-input"
                    placeholder="Minimum quantity"
                    value={newItem.lowStockThreshold || ''}
                    onChange={(e) => setNewItem({ ...newItem, lowStockThreshold: parseInt(e.target.value) || 0 })}
                    min="0"
                    required
                  />
                </div>
                
                <div className="flex justify-end space-x-2 pt-4">
                  <button
                    type="button"
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    onClick={() => setIsAddModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="hospital-btn-primary"
                  >
                    Add Item
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      
      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md animate-fadeIn">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">Confirm Deletion</h2>
                <button onClick={() => setIsDeleteModalOpen(false)}>
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>
              
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this item? This action cannot be undone.
              </p>
              
              <div className="flex justify-end space-x-2">
                <button
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  onClick={() => setIsDeleteModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                  onClick={handleDeleteItem}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;
