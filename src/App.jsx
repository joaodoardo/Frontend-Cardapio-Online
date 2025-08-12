import React from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { ScheduleProvider } from './contexts/ScheduleContext';
import styles from './styles';

// Importa os componentes da página do cliente
import Header from './components/Header';
import StoreStatusBanner from './components/StoreStatusBanner';
import Menu from './components/Menu';
import CartSidebar from './components/CartSidebar';

function CustomerPage() {
    return (
        <div style={{ backgroundColor: '#F9FAFB', minHeight: '100vh' }}>
            <Header />
            <StoreStatusBanner />
            <main style={styles.container}>
                <Menu />
            </main>
            <CartSidebar />
        </div>
    );
}

// O App final que envolve a página do cliente com os "Contexts"
function App() {
    return (
      <AuthProvider>
        <ScheduleProvider>
          <CartProvider>
            <CustomerPage />
          </CartProvider>
        </ScheduleProvider>
      </AuthProvider>
    );
}

export default App;
