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
    // ✅ 1. ADICIONADO CAMPOS DE PREÇO DE PIZZA AO ESTADO INICIAL
    const [formData, setFormData] = useState({ 
        nome: '', descricao: '', preco: '', categoriaId: '', imagemUrl: '', disponivel: true,
        precoP: '', precoM: '', precoG: '', precoGG: '' 
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    const handleChange = (e) => setFormData({...formData, [e.target.name]: e.target.value });

    useEffect(() => {
        if (isOpen) {
            const getInitialFormData = () => {
                if (item) {
                    return { 
                        nome: item.nome || '', 
                        descricao: item.descricao || '', 
                        preco: item.preco || '', 
                        // ✅ POPULA OS NOVOS CAMPOS AO EDITAR
                        precoP: item.precoP || '',
                        precoM: item.precoM || '',
                        precoG: item.precoG || '',
                        precoGG: item.precoGG || '',
                        categoriaId: item.categoriaId || '',
                        imagemUrl: item.imagemUrl || '',
                        disponivel: item.disponivel ?? true 
                    };
                }
                return { 
                    nome: '', descricao: '', preco: '', imagemUrl: '', disponivel: true,
                    // ✅ GARANTE QUE OS CAMPOS ESTEJAM VAZIOS AO CRIAR
                    precoP: '', precoM: '', precoG: '', precoGG: '',
                    categoriaId: categories.length > 0 ? categories[0].id : ''
                };
            };
            setFormData(getInitialFormData());
        }
    }, [item, categories, isOpen]);

    // ✅ 2. LÓGICA PARA VERIFICAR SE A CATEGORIA É "PIZZAS"
    const selectedCategory = categories.find(cat => cat.id === parseInt(formData.categoriaId));
    const isPizzaCategory = selectedCategory?.nome.toLowerCase() === 'pizzas';

    const handleSubmit = async (e) => {
        e.preventDefault(); 
        setIsLoading(true); 
        setError('');

        const url = item ? `${API_BASE_URL}/admin/item/${item.id}` : `${API_BASE_URL}/admin/item`;
        const method = item ? 'PUT' : 'POST';

        // ✅ 3. PREPARA O CORPO DA REQUISIÇÃO DINAMICAMENTE
        const body = {
            nome: formData.nome,
            descricao: formData.descricao,
            imagemUrl: formData.imagemUrl,
            disponivel: formData.disponivel,
            categoriaId: parseInt(formData.categoriaId)
        };

        if (isPizzaCategory) {
            // Para pizzas, o preço principal será o da pizza P (ou 0 se vazio)
            body.preco = parseFloat(formData.precoP) || 0;
            body.precoP = formData.precoP ? parseFloat(formData.precoP) : null;
            body.precoM = formData.precoM ? parseFloat(formData.precoM) : null;
            body.precoG = formData.precoG ? parseFloat(formData.precoG) : null;
            body.precoGG = formData.precoGG ? parseFloat(formData.precoGG) : null;
        } else {
            // Para outros itens, usa o preço normal
            body.preco = parseFloat(formData.preco) || 0;
            // Garante que os preços de pizza sejam nulos se não for uma pizza
            body.precoP = null;
            body.precoM = null;
            body.precoG = null;
            body.precoGG = null;
        }

        // Validação: nome, categoria e pelo menos o preço principal são obrigatórios
        if (!body.nome || !body.preco || !body.categoriaId) { 
            setError('Nome, Categoria e Preço são obrigatórios.'); 
            setIsLoading(false); 
            return; 
        }

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
                <div style={styles.modalHeader}><h3 style={{fontSize: '1.125rem', fontWeight: 600}}>{item ? "Editar Item" : "Adicionar Item"}</h3><StyledButton onClick={onClose} style={{padding: '0.25rem'}}><XIcon/></StyledButton></div>
                <div style={styles.modalBody}>
                    <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
                        <div><label style={styles.label}>Nome do Item</label><input style={styles.input} name="nome" value={formData.nome} onChange={handleChange} required/></div>
                        <div><label style={styles.label}>Descrição</label><textarea style={{...styles.input, height: '80px'}} name="descricao" value={formData.descricao} onChange={handleChange} /></div>
                        <div><label style={styles.label}>Categoria</label><select name="categoriaId" value={formData.categoriaId} onChange={handleChange} required style={styles.input}>{categories.map(cat => <option key={cat.id} value={cat.id}>{cat.nome}</option>)}</select></div>

                        {/* ✅ 4. RENDERIZAÇÃO CONDICIONAL DOS CAMPOS DE PREÇO */}
                        {isPizzaCategory ? (
                            <div>
                                <label style={styles.label}>Preços por Tamanho</label>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <input style={styles.input} name="precoP" type="number" step="0.01" value={formData.precoP} onChange={handleChange} placeholder="Preço P" required/>
                                    <input style={styles.input} name="precoM" type="number" step="0.01" value={formData.precoM} onChange={handleChange} placeholder="Preço M" />
                                    <input style={styles.input} name="precoG" type="number" step="0.01" value={formData.precoG} onChange={handleChange} placeholder="Preço G" />
                                    <input style={styles.input} name="precoGG" type="number" step="0.01" value={formData.precoGG} onChange={handleChange} placeholder="Preço GG" />
                                </div>
                            </div>
                        ) : (
                            <div>
                                <label style={styles.label}>Preço</label>
                                <input style={styles.input} name="preco" type="number" step="0.01" value={formData.preco} onChange={handleChange} required/>
                            </div>
                        )}
                        
                        <div>
                            <label style={styles.label}>URL da Imagem (Opcional)</label>
                            <input style={styles.input} name="imagemUrl" value={formData.imagemUrl} onChange={handleChange} placeholder="https://exemplo.com/imagem.jpg" />
                            <img 
                                src={formData.imagemUrl || PLACEHOLDER_IMAGE}
                                alt="Pré-visualização" 
                                style={{width: '100px', height: '100px', objectFit: 'cover', marginTop: '0.5rem', borderRadius: '0.5rem', background: '#eee'}}
                            />
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <input
                                type="checkbox"
                                id="disponivel"
                                name="disponivel"
                                checked={formData.disponivel}
                                onChange={(e) => setFormData({ ...formData, disponivel: e.target.checked })}
                                style={{ height: '1rem', width: '1rem', cursor: 'pointer' }}
                            />
                            <label htmlFor="disponivel" style={{ ...styles.label, marginBottom: 0, cursor: 'pointer' }}>
                                Item Disponível para Venda
                            </label>
                        </div>

                        {error && <p style={{color: 'red', fontSize: '0.875rem'}}>{error}</p>}
                        <div style={{display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', paddingTop: '1rem', borderTop: '1px solid #E5E7EB', marginTop: '1rem'}}><StyledButton type="button" variant="secondary" onClick={onClose}>Cancelar</StyledButton><StyledButton type="submit" disabled={isLoading}>{isLoading ? 'Salvando...' : 'Salvar'}</StyledButton></div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ItemFormModal;