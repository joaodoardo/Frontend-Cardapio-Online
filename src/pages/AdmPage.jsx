import React from 'react';
import AdminDashboard from '../components/AdminDashboard';
import AdminLogin from '../components/AdminLogin';
import { AuthProvider } from '../contexts/AuthContext';

function AdmPage() {
  return (
    <AuthProvider>
          <AdminLogin />
    </AuthProvider>
  );
}

export default AdmPage;
