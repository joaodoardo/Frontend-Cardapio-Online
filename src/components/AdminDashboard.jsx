import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import styles from '../styles';
import StyledButton from './StyledButton';
import ItemManager from './ItemManager';
import CategoryManager from './CategoryManager';
import ScheduleManager from './ScheduleManager';
import PedidoManager from './pedidoManager';

const AdminDashboard = ({ setView }) => {
    const { logout } = useAuth();
    const [activeTab, setActiveTab] = useState('pedidos');
    return (
        <div style={{minHeight: '100vh', backgroundColor: '#F9FAFB'}}>
            <header style={{backgroundColor: 'white', boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)'}}>
                 <div style={{...styles.container, display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '5rem'}}>
                    <h1 style={{fontSize: '1.25rem', fontWeight: 600, color: 'black'}}>Painel Admin</h1>
                    <StyledButton onClick={() => { logout(); setView('menu'); }} variant="secondary">Sair</StyledButton>
                </div>
            </header>
            <main style={{...styles.container, padding: '2rem 1rem'}}>
                <div style={{borderBottom: '1px solid #E5E7EB', marginBottom: '1.5rem'}}>
                    <nav style={{display: 'flex', gap: '2rem', flexWrap: 'wrap'}}>
                        <button onClick={() => setActiveTab('pedidos')} style={{background:'none', border:'none', cursor:'pointer', paddingBottom: '1rem', borderBottom: activeTab === 'pedidos' ? '2px solid #EA580C' : '2px solid transparent', color: activeTab === 'pedidos' ? '#EA580C' : '#6B7280', fontWeight: 500}}>Gerenciar Pedidos</button>
                        <button onClick={() => setActiveTab('items')} style={{background:'none', border:'none', cursor:'pointer', paddingBottom: '1rem', borderBottom: activeTab === 'items' ? '2px solid #EA580C' : '2px solid transparent', color: activeTab === 'items' ? '#EA580C' : '#6B7280', fontWeight: 500}}>Gerenciar Itens</button>
                        <button onClick={() => setActiveTab('categories')} style={{background:'none', border:'none', cursor:'pointer', paddingBottom: '1rem', borderBottom: activeTab === 'categories' ? '2px solid #EA580C' : '2px solid transparent', color: activeTab === 'categories' ? '#EA580C' : '#6B7280', fontWeight: 500}}>Gerenciar Categorias</button>
                        <button onClick={() => setActiveTab('schedule')} style={{background:'none', border:'none', cursor:'pointer', paddingBottom: '1rem', borderBottom: activeTab === 'schedule' ? '2px solid #EA580C' : '2px solid transparent', color: activeTab === 'schedule' ? '#EA580C' : '#6B7280', fontWeight: 500}}>Horários de Funcionamento</button>
                    </nav>
                </div>
                <div>
                    {activeTab === 'pedidos' && <PedidoManager />}
                    {activeTab === 'items' && <ItemManager />}
                    {activeTab === 'categories' && <CategoryManager />}
                    {activeTab === 'schedule' && <ScheduleManager />}
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;