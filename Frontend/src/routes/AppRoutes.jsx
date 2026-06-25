import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Dashboard from '../pages/Dashboard';
import { ROUTES } from '../constants/routes';

export default function AppRoutes() {
  const auth = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        <Route path={ROUTES.LOGIN} element={<Login auth={auth} />} />
        <Route path={ROUTES.REGISTER} element={<Register auth={auth} />} />
        <Route 
          path={ROUTES.DASHBOARD} 
          element={auth.user ? <Dashboard auth={auth} /> : <Navigate to={ROUTES.LOGIN} replace />} 
        />
        <Route path="*" element={<Navigate to={ROUTES.LOGIN} replace />} />
      </Routes>
    </BrowserRouter>
  );
}
