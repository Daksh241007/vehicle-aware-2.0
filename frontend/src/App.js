import React from 'react';
import '@/App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import Landing from '@/pages/Landing';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Dashboard from '@/pages/Dashboard';
import Diagnose from '@/pages/Diagnose';
import Systems from '@/pages/Systems';
import FaultDetail from '@/pages/FaultDetail';
import About from '@/pages/About';
import Future from '@/pages/Future';
import { AuthProvider } from '@/context/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <div className="App bg-gradient-glow">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/diagnose" element={<Diagnose />} />
            <Route path="/systems" element={<Systems />} />
            <Route path="/fault/:id" element={<FaultDetail />} />
            <Route path="/about" element={<About />} />
            <Route path="/future" element={<Future />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <Toaster position="top-right" />
        </BrowserRouter>
      </div>
    </AuthProvider>
  );
}

export default App;