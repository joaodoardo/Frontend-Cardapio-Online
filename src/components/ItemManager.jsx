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

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            const catResponse = await fetch(`${API_BASE_URL}/categorias`);
            if (!catResponse.ok) throw new Error('Falha ao buscar categorias.');
            const catData = await catResponse.json();
            setCategories(catData);
            
            if (catData.length > 0) {
                const itemsPromises = catData.map(cat => fetch(`${API_BASE_URL}/categorias/${cat.id}/itens`).then(res => res.json()));
                const allItemsArrays = await Promise.all(itemsPromises);
                setItems(allItemsArrays.flat());
            }
            setError('');
        } catch (err) { setError(err.message); } finally { setIsLoading(false); }
    }, []);

    useEffect(() => { fetchData(); }, [fetchData]);

    const handleOpenModal = (item = null) => { setEditingItem(item); setIsModalOpen(true); };
    const handleCloseModal = () => { setIsModalOpen(false); setEditingItem(null); fetchData(); };

    const handleDelete = async (itemId) => {
        if (!window.confirm('Tem certeza que deseja excluir este item?')) return;
        try {
            const response = await fetch(`${API_BASE_URL}/admin/item/${itemId}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
            if (!response.ok) throw new Error('Falha ao excluir o item.');
            fetchData();
        } catch (err) { alert(err.message); }
    };

    return (
        <div style={styles.card}>
            <div style={{...styles.input, padding: '1.5rem', border: 'none', height: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <h3 style={{fontSize: '1.125rem', fontWeight: 500}}>Itens do Cardápio</h3>
                <StyledButton onClick={() => handleOpenModal()}><PlusIcon style={{width:'1rem', height:'1rem', marginRight: '0.5rem'}}/>Adicionar Item</StyledButton>
            </div>
            <div style={{borderTop: '1px solid #E5E7EB', overflowX: 'auto'}}>
                {isLoading ? <p style={{padding: '1.5rem'}}>Carregando...</p> : error ? <p style={{padding: '1.5rem', color: 'red'}}>{error}</p> : (
                    <table style={styles.table}>
                        <thead style={styles.tableHead}><tr><th style={styles.tableHeadCell}>Nome</th><th style={styles.tableHeadCell}>Preço</th><th style={styles.tableHeadCell}>Ações</th></tr></thead>
                        <tbody>
                            {items.map(item => (
                                <tr key={item.id} style={styles.tableBodyRow}>
                                    <td style={{...styles.tableBodyCell, fontWeight: 500, color: '#111827'}}>{item.nome}</td>
                                    <td style={styles.tableBodyCell}>R$ {item.preco.toFixed(2)}</td>
                                    <td style={styles.tableBodyCell}><div style={{display: 'flex', gap: '0.25rem'}}>
                                        <StyledButton variant="ghost" style={{padding: '0.25rem'}} onClick={() => handleOpenModal(item)}><EditIcon style={{width: '1.25rem', height: '1.25rem'}}/></StyledButton>
                                        <StyledButton variant="ghost" style={{padding: '0.25rem', color: '#DC2626'}} onClick={() => handleDelete(item.id)}><TrashIcon style={{width: '1.25rem', height: '1.25rem'}}/></StyledButton>
                                    </div></td>
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
