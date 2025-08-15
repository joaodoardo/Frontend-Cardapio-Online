import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import styles from '../styles';
import { API_BASE_URL } from '../config';
import StyledButton from './StyledButton';
import { PlusIcon, EditIcon, TrashIcon } from './Icons';
import ItemFormModal from './ItemFormModal';

const ItemManager = () => {
    const { token } = useAuth();
    const [items, setItems] = useState([]);
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);

    // 1. ATUALIZADO PARA USAR A NOVA ROTA DE ADMIN E SER MAIS EFICIENTE
    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            // Busca as categorias para passar ao modal
            const catResponse = await fetch(`${API_BASE_URL}/categorias`);
            if (!catResponse.ok) throw new Error('Falha ao buscar categorias.');
            setCategories(await catResponse.json());
            
            // Busca TODOS os itens (incluindo os indisponíveis) pela nova rota de admin
            const itemsResponse = await fetch(`${API_BASE_URL}/admin/items`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!itemsResponse.ok) throw new Error('Falha ao buscar os itens.');
            setItems(await itemsResponse.json());

            setError('');
        } catch (err) { 
            setError(err.message); 
        } finally { 
            setIsLoading(false); 
        }
    }, [token]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleOpenModal = (item = null) => { setEditingItem(item); setIsModalOpen(true); };
    const handleCloseModal = () => { setIsModalOpen(false); setEditingItem(null); fetchData(); };

    const handleDelete = async (itemId) => {
        if (!window.confirm('Tem certeza que deseja excluir este item?')) return;
        try {
            const response = await fetch(`${API_BASE_URL}/admin/item/${itemId}`, { 
                method: 'DELETE', 
                headers: { 'Authorization': `Bearer ${token}` } 
            });
            if (!response.ok) throw new Error('Falha ao excluir o item.');
            fetchData();
        } catch (err) { alert(err.message); }
    };

    // 2. NOVA FUNÇÃO PARA ALTERNAR A DISPONIBILIDADE DO ITEM
    const handleToggleAvailability = async (item) => {
        try {
            const response = await fetch(`${API_BASE_URL}/admin/item/${item.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ ...item, disponivel: !item.disponivel })
            });
            if (!response.ok) throw new Error('Falha ao atualizar o status.');
            fetchData(); // Recarrega a lista para mostrar a mudança
        } catch (err) {
            alert(err.message);
        }
    };

    return (
        <div style={styles.card}>
            <div style={{...styles.input, padding: '1.5rem', border: 'none', height: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <h3 style={{fontSize: '1.125rem', fontWeight: 500, color: 'black'}}>Itens do Cardápio</h3>
                <StyledButton onClick={() => handleOpenModal()}><PlusIcon style={{width:'1rem', height:'1rem', marginRight: '0.5rem'}}/>Adicionar Item</StyledButton>
            </div>
            <div style={{borderTop: '1px solid #E5E7EB', overflowX: 'auto'}}>
                {isLoading ? <p style={{padding: '1.5rem'}}>Carregando...</p> : error ? <p style={{padding: '1.5rem', color: 'red'}}>{error}</p> : (
                    <table style={styles.table}>
                        <thead style={styles.tableHead}>
                            <tr>
                                <th style={styles.tableHeadCell}>Nome</th>
                                <th style={styles.tableHeadCell}>Preço</th>
                                {/* 3. ADICIONADA A COLUNA DE STATUS */}
                                <th style={styles.tableHeadCell}>Status</th>
                                <th style={styles.tableHeadCell}>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map(item => (
                                <tr key={item.id} style={styles.tableBodyRow}>
                                    <td style={{...styles.tableBodyCell, fontWeight: 500, color: '#111827'}}>{item.nome}</td>
                                    <td style={styles.tableBodyCell}>R$ {item.preco.toFixed(2)}</td>
                                    {/* EXIBE O STATUS ATUAL DO ITEM */}
                                    <td style={styles.tableBodyCell}>
                                        <span style={{
                                            backgroundColor: item.disponivel ? '#D1FAE5' : '#FEE2E2',
                                            color: item.disponivel ? '#065F46' : '#991B1B',
                                            padding: '0.25rem 0.75rem',
                                            borderRadius: '9999px',
                                            fontSize: '0.75rem',
                                            fontWeight: 500,
                                        }}>
                                            {item.disponivel ? 'Disponível' : 'Indisponível'}
                                        </span>
                                    </td>
                                    <td style={styles.tableBodyCell}>
                                        <div style={{display: 'flex', gap: '0.25rem'}}>
                                            {/* 4. ADICIONADO BOTÃO DE AÇÃO RÁPIDA */}
                                            <StyledButton 
                                                variant="secondary" 
                                                onClick={() => handleToggleAvailability(item)} 
                                                title={item.disponivel ? 'Pausar item' : 'Ativar item'}
                                                style={{ padding: '0.5rem 0.75rem', fontSize: '0.875rem' }}
                                            >
                                                {item.disponivel ? 'Pausar' : 'Ativar'}
                                            </StyledButton>
                                            <StyledButton variant="ghost" onClick={() => handleOpenModal(item)} title="Editar item"><EditIcon style={{width: '1.25rem', height: '1.25rem'}}/></StyledButton>
                                            <StyledButton variant="ghost" onClick={() => handleDelete(item.id)} title="Excluir item" style={{color: '#DC2626'}}><TrashIcon style={{width: '1.25rem', height: '1.25rem'}}/></StyledButton>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
            {isModalOpen && <ItemFormModal isOpen={isModalOpen} onClose={handleCloseModal} item={editingItem} categories={categories} />}
        </div>
    );
};

export default ItemManager;