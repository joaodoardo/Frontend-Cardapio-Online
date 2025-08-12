import React from 'react';
import AdminDashboard from '../components/AdminDashboard';
import AdminLogin from '../components/AdminLogin';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import { ScheduleProvider } from '../contexts/ScheduleContext'; 

const AdminPageContent = () => {
    const { isAuthenticated } = useAuth();
    
    return isAuthenticated ? <AdminDashboard /> : <AdminLogin />;
};

function AdmPage() {
  return (
    <AuthProvider>
      <ScheduleProvider>
        <AdminPageContent />
      </ScheduleProvider>
    </AuthProvider>
  );
}

export default AdmPage;
