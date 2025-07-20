import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import styles from '../styles';
import { API_BASE_URL } from '../config';
import StyledButton from './StyledButton';

const CategoryManager = () => {
    const { token } = useAuth();
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [newCategoryName, setNewCategoryName] = useState('');

    const fetchCategories = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/categorias`);
            if (!response.ok) throw new Error('Falha ao buscar categorias.');
            setCategories(await response.json()); setError('');
        } catch (err) { setError(err.message); } finally { setIsLoading(false); }
    }, []);

    useEffect(() => { fetchCategories(); }, [fetchCategories]);
    
    const handleAddCategory = async (e) => {
        e.preventDefault();
        if (!newCategoryName.trim()) return;
        try {
            const response = await fetch(`${API_BASE_URL}/admin/categoria`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify({ nome: newCategoryName }) });
            if (!response.ok) throw new Error('Falha ao criar categoria.');
            setNewCategoryName(''); fetchCategories();
        } catch (err) { alert(err.message); }
    };

    return (
        <div style={styles.card}>
            <div style={{...styles.input, padding: '1.5rem', border: 'none', height: 'auto', flexDirection: 'column'}}>
                 <h3 style={{fontSize: '1.125rem', fontWeight: 500}}>Categorias</h3>
                 <form onSubmit={handleAddCategory} style={{display: 'flex', gap: '0.5rem', marginTop: '1rem'}}>
                     <input value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} placeholder="Nome da nova categoria" style={{...styles.input, flexGrow: 1}}/>
                     <StyledButton type="submit">Adicionar</StyledButton>
                 </form>
            </div>
             <div style={{borderTop: '1px solid #E5E7EB'}}>
                {isLoading ? <p style={{padding: '1.5rem'}}>Carregando...</p> : error ? <p style={{padding: '1.em', color: 'red'}}>{error}</p> : (
                    <ul style={{listStyle: 'none', padding: 0, margin: 0}}>
                        {categories.map((cat, index) => (
                           <li key={cat.id} style={{padding: '1rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: index < categories.length - 1 ? '1px solid #E5E7EB' : 'none'}}>
                               <span style={{color: 'black'}}>{cat.nome}</span>
                           </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default CategoryManager;
