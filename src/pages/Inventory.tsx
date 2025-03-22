import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { Package, Search, Filter, PlusCircle, RefreshCw, ArrowDown, ArrowUp, Download, Upload, Edit, Trash2, Save, X } from 'lucide-react';
import { toast } from 'sonner';
import { inventoryService, InventoryItem, InventoryItemCreateData } from '../services/inventoryService';

const Inventory = () => {
  const { isStaff } = useAuth();
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [editItemId, setEditItemId] = useState<string | null>(null);
  const [editedItem, setEditedItem] = useState<InventoryItem | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItem, setNewItem] = useState<Partial<InventoryItemCreateData>>({
    name: '',
    category: 'Medicine',
    currentStock: 0,
    minimumStock: 0,
    unit: '',
    expiryDate: '',
    supplierName: '',
  });

  // Fetch inventory data
  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    setIsLoading(true);
    try {
      const data = await inventoryService.getAllItems();
      setInventory(data);
    } catch (error) {
      toast.error('Failed to load inventory data');
      console.error('Error fetching inventory:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter inventory based on search, category, and status
  const filteredInventory = inventory.filter(item => {
    // Search filter
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.supplierName.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Category filter
    const matchesCategory = categoryFilter === 'All' || item.category === categoryFilter;
    
    // Status filter
    const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Sort inventory based on field and direction
  const sortedInventory = [...filteredInventory].sort((a, b) => {
    let aValue: any = a[sortField as keyof InventoryItem];
    let bValue: any = b[sortField as keyof InventoryItem];
    
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

  // Start editing an item
  const startEditing = (item: InventoryItem) => {
    setEditItemId(item.id);
    setEditedItem({ ...item });
  };

  // Save edited item
  const saveEditedItem = async () => {
    if (editItemId && editedItem) {
      try {
        // Determine status based on current and minimum stock
        let status: 'In Stock' | 'Low Stock' | 'Out of Stock';
        if (editedItem.currentStock <= 0) {
          status = 'Out of Stock';
        } else if (editedItem.currentStock < editedItem.minimumStock) {
          status = 'Low Stock';
        } else {
          status = 'In Stock';
        }

        const updatedItem = {
          ...editedItem,
          status,
          lastUpdated: new Date().toISOString().split('T')[0]
        };

        await inventoryService.updateItem(editItemId, updatedItem);
        
        // Update local state
        setInventory(prev => prev.map(item => 
          item.id === editItemId ? updatedItem : item
        ));
        
        setEditItemId(null);
        setEditedItem(null);
        toast.success('Item updated successfully');
      } catch (error) {
        toast.error('Failed to update item');
        console.error('Error updating item:', error);
      }
    }
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditItemId(null);
    setEditedItem(null);
  };

  // Handle add item form submission
  const handleAddItem = async () => {
    if (!newItem.name || !newItem.unit || !newItem.supplierName) {
      toast.error('Please fill all required fields');
      return;
    }

    try {
      const itemToAdd: InventoryItemCreateData = {
        name: newItem.name || '',
        category: newItem.category || 'Medicine',
        currentStock: newItem.currentStock || 0,
        minimumStock: newItem.minimumStock || 0,
        unit: newItem.unit || '',
        expiryDate: newItem.expiryDate,
        supplierName: newItem.supplierName || '',
      };

      const addedItem = await inventoryService.createItem(itemToAdd);
      
      // Update local state
      setInventory(prev => [...prev, addedItem]);
      setShowAddForm(false);
      setNewItem({
        name: '',
        category: 'Medicine',
        currentStock: 0,
        minimumStock: 0,
        unit: '',
        expiryDate: '',
        supplierName: '',
      });
      
      toast.success('Item added successfully');
    } catch (error) {
      toast.error('Failed to add item');
      console.error('Error adding item:', error);
    }
  };

  // Delete an item
  const deleteItem = async (id: string) => {
    if (confirm('Are you sure you want to remove this item?')) {
      try {
        await inventoryService.deleteItem(id);
        setInventory(prev => prev.filter(item => item.id !== id));
        toast.success('Item removed from inventory');
      } catch (error) {
        toast.error('Failed to delete item');
        console.error('Error deleting item:', error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-20 page-container">
        <div className="flex justify-between items-center mb-6">
          <h1 className="page-title">Inventory Management</h1>
          <div className="flex items-center space-x-2">
            <button className="p-2 rounded-full hover:bg-gray-100" onClick={fetchInventory}>
              <RefreshCw className="h-5 w-5 text-gray-600" />
            </button>
            <button className="p-2 rounded-full hover:bg-gray-100">
              <Upload className="h-5 w-5 text-gray-600" />
            </button>
            <button className="p-2 rounded-full hover:bg-gray-100">
              <Download className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="stat-card">
            <div className="flex justify-between items-start">
              <div>
                <p className="card-subtitle">Total Items</p>
                <h3 className="text-3xl font-bold">{inventory.length}</h3>
              </div>
              <div className="p-3 rounded-full bg-blue-50">
                <Package className="h-6 w-6 text-blue-500" />
              </div>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="flex justify-between items-start">
              <div>
                <p className="card-subtitle">Low Stock Items</p>
                <h3 className="text-3xl font-bold text-amber-600">
                  {inventory.filter(item => item.status === 'Low Stock').length}
                </h3>
              </div>
              <div className="p-3 rounded-full bg-amber-50">
                <ArrowDown className="h-6 w-6 text-amber-500" />
              </div>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="flex justify-between items-start">
              <div>
                <p className="card-subtitle">Out of Stock</p>
                <h3 className="text-3xl font-bold text-red-600">
                  {inventory.filter(item => item.status === 'Out of Stock').length}
                </h3>
              </div>
              <div className="p-3 rounded-full bg-red-50">
                <X className="h-6 w-6 text-red-500" />
              </div>
            </div>
          </div>
        </div>
        
        <div className="glass-panel p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0 mb-6">
            <h2 className="section-title mb-0">Inventory Items</h2>
            
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search inventory..."
                  className="hospital-input pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="flex space-x-2">
                <select 
                  className="hospital-input"
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                >
                  <option value="All">All Categories</option>
                  <option value="Medicine">Medicine</option>
                  <option value="Supplies">Supplies</option>
                  <option value="Equipment">Equipment</option>
                </select>
                
                <select 
                  className="hospital-input"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="All">All Status</option>
                  <option value="In Stock">In Stock</option>
                  <option value="Low Stock">Low Stock</option>
                  <option value="Out of Stock">Out of Stock</option>
                </select>
                
                <button 
                  className="hospital-btn-primary text-sm whitespace-nowrap flex items-center"
                  onClick={() => setShowAddForm(true)}
                >
                  <PlusCircle className="h-4 w-4 mr-1" />
                  Add Item
                </button>
              </div>
            </div>
          </div>
          
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin h-10 w-10 border-4 border-hospital-500 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-500">Loading inventory data...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th 
                      onClick={() => handleSort('id')}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    >
                      <div className="flex items-center">
                        Item ID
                        {sortField === 'id' && (
                          <span className="ml-1">
                            {sortDirection === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                          </span>
                        )}
                      </div>
                    </th>
                    <th 
                      onClick={() => handleSort('name')}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    >
                      <div className="flex items-center">
                        Name
                        {sortField === 'name' && (
                          <span className="ml-1">
                            {sortDirection === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                          </span>
                        )}
                      </div>
                    </th>
                    <th 
                      onClick={() => handleSort('category')}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    >
                      <div className="flex items-center">
                        Category
                        {sortField === 'category' && (
                          <span className="ml-1">
                            {sortDirection === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                          </span>
                        )}
                      </div>
                    </th>
                    <th 
                      onClick={() => handleSort('currentStock')}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    >
                      <div className="flex items-center">
                        Current Stock
                        {sortField === 'currentStock' && (
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
                      onClick={() => handleSort('supplierName')}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    >
                      <div className="flex items-center">
                        Supplier
                        {sortField === 'supplierName' && (
                          <span className="ml-1">
                            {sortDirection === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                          </span>
                        )}
                      </div>
                    </th>
                    <th 
                      onClick={() => handleSort('lastUpdated')}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    >
                      <div className="flex items-center">
                        Last Updated
                        {sortField === 'lastUpdated' && (
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
                  {sortedInventory.map(item => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {editItemId === item.id ? (
                          <span>{item.id}</span>
                        ) : (
                          item.id
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {editItemId === item.id ? (
                          <input
                            type="text"
                            className="hospital-input"
                            value={editedItem?.name}
                            onChange={(e) => setEditedItem(prev => prev ? { ...prev, name: e.target.value } : null)}
                          />
                        ) : (
                          item.name
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {editItemId === item.id ? (
                          <select
                            className="hospital-input"
                            value={editedItem?.category}
                            onChange={(e) => setEditedItem(prev => prev ? { ...prev, category: e.target.value } : null)}
                          >
                            <option value="Medicine">Medicine</option>
                            <option value="Supplies">Supplies</option>
                            <option value="Equipment">Equipment</option>
                          </select>
                        ) : (
                          item.category
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {editItemId === item.id ? (
                          <div className="flex items-center space-x-1">
                            <input
                              type="number"
                              min="0"
                              className="hospital-input w-20"
                              value={editedItem?.currentStock}
                              onChange={(e) => setEditedItem(prev => prev ? { ...prev, currentStock: parseInt(e.target.value) || 0 } : null)}
                            />
                            <span>{item.unit}</span>
                          </div>
                        ) : (
                          `${item.currentStock} ${item.unit}`
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full
                          ${item.status === 'In Stock' ? 'bg-green-100 text-green-800' : 
                            item.status === 'Low Stock' ? 'bg-amber-100 text-amber-800' : 
                            'bg-red-100 text-red-800'}`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {editItemId === item.id ? (
                          <input
                            type="text"
                            className="hospital-input"
                            value={editedItem?.supplierName}
                            onChange={(e) => setEditedItem(prev => prev ? { ...prev, supplierName: e.target.value } : null)}
                          />
                        ) : (
                          item.supplierName
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.lastUpdated}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        {editItemId === item.id ? (
                          <div className="flex justify-end space-x-2">
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
                          <div className="flex justify-end space-x-2">
                            <button 
                              onClick={() => startEditing(item)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button 
                              onClick={() => deleteItem(item.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                  
                  {sortedInventory.length === 0 && (
                    <tr>
                      <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                        No inventory items found matching your filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Add Item Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md animate-fadeIn">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Add New Item</h2>
                <button onClick={() => setShowAddForm(false)}>
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Item Name
                  </label>
                  <input
                    type="text"
                    className="hospital-input"
                    placeholder="Enter item name"
                    value={newItem.name}
                    onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    className="hospital-input"
                    value={newItem.category}
                    onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                  >
                    <option value="Medicine">Medicine</option>
                    <option value="Supplies">Supplies</option>
                    <option value="Equipment">Equipment</option>
                  </select>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Current Stock
                    </label>
                    <input
                      type="number"
                      min="0"
                      className="hospital-input"
                      placeholder="0"
                      value={newItem.currentStock || ''}
                      onChange={(e) => setNewItem({ ...newItem, currentStock: parseInt(e.target.value) || 0 })}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Minimum Stock
                    </label>
                    <input
                      type="number"
                      min="0"
                      className="hospital-input"
                      placeholder="0"
                      value={newItem.minimumStock || ''}
                      onChange={(e) => setNewItem({ ...newItem, minimumStock: parseInt(e.target.value) || 0 })}
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Unit
                  </label>
                  <input
                    type="text"
                    className="hospital-input"
                    placeholder="e.g., Tablets, Boxes, Pieces"
                    value={newItem.unit}
                    onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Expiry Date (if applicable)
                  </label>
                  <input
                    type="date"
                    className="hospital-input"
                    value={newItem.expiryDate}
                    onChange={(e) => setNewItem({ ...newItem, expiryDate: e.target.value })}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Supplier Name
                  </label>
                  <input
                    type="text"
                    className="hospital-input"
                    placeholder="Enter supplier name"
                    value={newItem.supplierName}
                    onChange={(e) => setNewItem({ ...newItem, supplierName: e.target.value })}
                    required
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-2 mt-6">
                <button
                  type="button"
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  onClick={() => setShowAddForm(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="hospital-btn-primary"
                  onClick={handleAddItem}
                >
                  Add Item
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
