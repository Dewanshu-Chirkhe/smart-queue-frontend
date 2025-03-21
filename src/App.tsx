
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

// Pages
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import PatientDashboard from "./pages/PatientDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Inventory from "./pages/Inventory";
import BedManagement from "./pages/BedManagement";
import UserProfile from "./pages/UserProfile";
import HospitalProfile from "./pages/HospitalProfile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            
            {/* Patient Routes */}
            <Route 
              path="/patient-dashboard" 
              element={
                <ProtectedRoute>
                  <PatientDashboard />
                </ProtectedRoute>
              } 
            />
            
            {/* Staff Routes */}
            <Route 
              path="/admin-dashboard" 
              element={
                <ProtectedRoute requiresStaff>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/inventory" 
              element={
                <ProtectedRoute requiresStaff>
                  <Inventory />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/bed-management" 
              element={
                <ProtectedRoute requiresStaff>
                  <BedManagement />
                </ProtectedRoute>
              } 
            />
            
            {/* Profile Routes */}
            <Route 
              path="/user-profile" 
              element={
                <ProtectedRoute>
                  <UserProfile />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/hospital-profile" 
              element={
                <ProtectedRoute requiresStaff>
                  <HospitalProfile />
                </ProtectedRoute>
              } 
            />
            
            {/* Catch All Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
