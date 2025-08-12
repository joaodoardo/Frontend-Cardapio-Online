import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import styles from '../styles';
import { API_BASE_URL } from '../config';
import StyledButton from './StyledButton';
import { XIcon } from './Icons';

// imagem sem nada
const PLACEHOLDER_IMAGE = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MDAiIGhlaWdodD0iNDAwIiB2aWV3Qm94PSIwIDAgMTUwIDEwMCI+CiAgICA8cmVjdCB3aWR0aD0iMTUwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2VlZSIvPgogICAgPHBhdGggZD0iTTMwIDgwIEw1MCA0MCBMNzAgNjAgTDEwMCAzMCBMMTMwIDcwIEwxNTAgNTAgTDE1MCAxMDAgTDAgMTAwIFoiIGZpbGw9IiNjY2MiLz4KICAgIDxjaXJjbGUgY3g9IjY1IiBjeT0iMzUiIHI9IjEwIiBmaWxsPSIjY2NjIi8+CiAgICA8dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1zaXplPSIxMiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgYWxpZ25tZW50LWJhc2VsaW5lPSJjZW50cmFsIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZmlsbD0iI2FhYSI+Tk8gSU1BR0U8L3RleHQ+Cjwvc3ZnPg==";

const ItemFormModal = ({ isOpen, onClose, item, categories }) => {
    const { token } = useAuth();
    const [formData, setFormData] = useState({ nome: '', descricao: '', preco: '', categoriaId: '', imagemUrl: '' });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const handleChange = (e) => setFormData({...formData, [e.target.name]: e.target.value });

    useEffect(() => {
        if (isOpen) {
            if (item) {
                setFormData({ 
                    nome: item.nome || '', 
                    descricao: item.descricao || '', 
                    preco: item.preco || '', 
                    categoriaId: item.categoriaId || '',
                    imagemUrl: item.imagemUrl || ''
                });
            } else {
                setFormData({ nome: '', descricao: '', preco: '', categoriaId: categories.length > 0 ? categories[0].id : '', imagemUrl: '' });
            }
        }
    }, [item, categories, isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault(); setIsLoading(true); setError('');
        const url = item ? `${API_BASE_URL}/admin/item/${item.id}` : `${API_BASE_URL}/admin/item`;
        const method = item ? 'PUT' : 'POST';
        const body = { ...formData, preco: parseFloat(formData.preco), categoriaId: parseInt(formData.categoriaId) };
        if (!body.nome || !body.preco || !body.categoriaId) { setError('Nome, preço e categoria são obrigatórios.'); setIsLoading(false); return; }

        try {
            const response = await fetch(url, { method, headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify(body) });
            if (!response.ok) { const errData = await response.json(); throw new Error(errData.error || 'Falha ao salvar o item.'); }
            onClose();
        } catch (err) { setError(err.message); } finally { setIsLoading(false); }
    };
    
    if (!isOpen) return null;

    return (
        <div style={styles.modalOverlay}>
            <div style={styles.modalContent}>
                <div style={styles.modalHeader}><h3 style={{fontSize: '1.125rem', fontWeight: 600}}>{item ? "Editar Item" : "Adicionar Item"}</h3><StyledButton variant="ghost" onClick={onClose} style={{padding: '0.25rem'}}><XIcon/></StyledButton></div>
                <div style={styles.modalBody}>
                    <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
                        <div><label style={styles.label}>Nome do Item</label><input style={styles.input} name="nome" value={formData.nome} onChange={handleChange} required/></div>
                        <div><label style={styles.label}>Descrição</label><textarea style={{...styles.input, height: '80px'}} name="descricao" value={formData.descricao} onChange={handleChange} /></div>
                        <div><label style={styles.label}>Preço</label><input style={styles.input} name="preco" type="number" step="0.01" value={formData.preco} onChange={handleChange} required/></div>
                        <div><label style={styles.label}>Categoria</label><select name="categoriaId" value={formData.categoriaId} onChange={handleChange} required style={styles.input}>{categories.map(cat => <option key={cat.id} value={cat.id}>{cat.nome}</option>)}</select></div>
                        
                        <div>
                            <label style={styles.label}>URL da Imagem (Opcional)</label>
                            <input style={styles.input} name="imagemUrl" value={formData.imagemUrl} onChange={handleChange} placeholder="https://exemplo.com/imagem.jpg" />
                            <img 
                                src={formData.imagemUrl || PLACEHOLDER_IMAGE}
                                alt="Pré-visualização" 
                                style={{width: '100px', height: '100px', objectFit: 'cover', marginTop: '0.5rem', borderRadius: '0.5rem', background: '#eee'}}
                            />
                        </div>

                        {error && <p style={{color: 'red', fontSize: '0.875rem'}}>{error}</p>}
                        <div style={{display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', paddingTop: '1rem'}}><StyledButton type="button" variant="secondary" onClick={onClose}>Cancelar</StyledButton><StyledButton type="submit" disabled={isLoading}>{isLoading ? 'Salvando...' : 'Salvar'}</StyledButton></div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ItemFormModal;