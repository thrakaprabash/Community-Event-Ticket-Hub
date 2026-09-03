import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/layout/Navbar';
import { DiscoveryPage } from './pages/DiscoveryPage';
import { DashboardPage } from './pages/DashboardPage';
import { LoginPage } from './pages/LoginPage';

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <div className="flex-1">
            <Routes>
              <Route path="/" element={<DiscoveryPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
          <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500">
            <p>© 2026 EventHub Inc. All rights reserved. • Community Event Platform</p>
          </footer>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
