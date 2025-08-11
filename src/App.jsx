import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { ScheduleProvider } from './contexts/ScheduleContext';
import styles from './styles';

//Componentes
import Header from './components/Header';
import StoreStatusBanner from './components/StoreStatusBanner';
import Menu from './components/Menu';
import CartSidebar from './components/CartSidebar';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';


function AppViewManager() {
    const [view, setView] = useState('menu');
    const { isAuthenticated } = useAuth();
    
    useEffect(() => {
        if (isAuthenticated && view === 'adminLogin') {
            setView('adminDashboard');
        }
        if (!isAuthenticated && view === 'adminDashboard') {
            setView('adminLogin');
        }
    }, [view, isAuthenticated]);

    switch (view) {
        case 'adminLogin':
            return <AdminLogin setView={setView} />;
        case 'adminDashboard':
            return <AdminDashboard setView={setView} />;
        case 'menu':
        default:
            return (
                <div style={{ backgroundColor: '#fbf9fbff', minHeight: '100vh' }}>
                    <Header setView={setView} />
                    <StoreStatusBanner />
                    <main style={styles.container}>
                        <Menu />
                    </main>
                    <CartSidebar />
                </div>
            );
    }
}

function App() {
    return (
      <AuthProvider>
        <ScheduleProvider>
          <CartProvider>
            <AppViewManager />
          </CartProvider>
        </ScheduleProvider>
      </AuthProvider>
    );
}

export default App;
