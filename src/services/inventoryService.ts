
import { api } from './api';

export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  currentStock: number;
  minimumStock: number;
  unit: string;
  expiryDate?: string;
  supplierName: string;
  lastUpdated: string;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
}

export interface InventoryItemCreateData {
  name: string;
  category: string;
  currentStock: number;
  minimumStock: number;
  unit: string;
  expiryDate?: string;
  supplierName: string;
}

export const inventoryService = {
  getAllItems: () => 
    api.get('/inventory'),
  
  getItemById: (id: string) => 
    api.get(`/inventory/${id}`),
  
  searchItems: (query: string) => 
    api.get(`/inventory/search?q=${query}`),
  
  filterItems: (category: string, status: string) => 
    api.get(`/inventory/filter?category=${category}&status=${status}`),
  
  createItem: (itemData: InventoryItemCreateData) => 
    api.post('/inventory', itemData),
  
  updateItem: (id: string, itemData: Partial<InventoryItem>) => 
    api.put(`/inventory/${id}`, itemData),
  
  deleteItem: (id: string) => 
    api.delete(`/inventory/${id}`)
};
