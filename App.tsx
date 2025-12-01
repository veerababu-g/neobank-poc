import React, { useState } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { CustomerDashboard } from './pages/CustomerDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { UserSession, Role } from './types';

const App: React.FC = () => {
  // Simple Session State (In a real app, use Context or Redux)
  const [user, setUser] = useState<UserSession | null>(null);

  const handleLogin = (session: UserSession) => {
    setUser(session);
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <HashRouter>
      <Routes>
        <Route 
          path="/login" 
          element={!user ? <Login onLogin={handleLogin} /> : <Navigate to={user.role === Role.ADMIN ? "/admin" : "/customer"} replace />} 
        />
        
        <Route 
          path="/register" 
          element={!user ? <Register /> : <Navigate to={user.role === Role.ADMIN ? "/admin" : "/customer"} replace />} 
        />
        
        <Route 
          path="/customer" 
          element={
            user && user.role === Role.CUSTOMER ? (
              <Layout user={user} onLogout={handleLogout}>
                <CustomerDashboard user={user} />
              </Layout>
            ) : (
              <Navigate to="/login" replace />
            )
          } 
        />

        <Route 
          path="/admin" 
          element={
            user && user.role === Role.ADMIN ? (
              <Layout user={user} onLogout={handleLogout}>
                <AdminDashboard />
              </Layout>
            ) : (
              <Navigate to="/login" replace />
            )
          } 
        />

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </HashRouter>
  );
};

export default App;