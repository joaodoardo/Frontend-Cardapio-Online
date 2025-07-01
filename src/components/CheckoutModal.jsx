import React, { useState, useEffect } from 'react';
import styles from '../styles';
import { API_BASE_URL } from '../config';
import StyledButton from './StyledButton';
import { XIcon } from './Icons';

const CheckoutModal = ({ isOpen, onClose, cartItems, total, clearCart }) => {
    const [formData, setFormData] = useState({ nomeCliente: '', telefone: '', endereco: '', observacoes: '' });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const handleChange = (e) => setFormData({...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { nomeCliente, telefone, endereco } = formData;
        if (!nomeCliente || !telefone || !endereco) { setError('Por favor, preencha nome, telefone e endereço.'); return; }
        setError(''); setIsLoading(true);
        const pedido = { ...formData, itens: cartItems.map(item => ({ itemId: item.id, quantidade: item.quantidade })) };
        try {
            const r = await fetch(`${API_BASE_URL}/pedido`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(pedido) });
            if (!r.ok) throw new Error('Falha ao enviar o pedido.');
            const res = await r.json();
            setSuccess(`Pedido #${res.pedidoId} realizado com sucesso!`); clearCart();
        } catch (err) { setError(err.message || 'Ocorreu um erro.'); } finally { setIsLoading(false); }
    };

    useEffect(() => { if (!isOpen) { setFormData({ nomeCliente: '', telefone: '', endereco: '', observacoes: '' }); setError(''); setSuccess(null); setIsLoading(false); }}, [isOpen]);
    if (!isOpen) return null;

    return (
        <div style={styles.modalOverlay}>
            <div style={styles.modalContent}>
                <div style={styles.modalHeader}><h3 style={{fontSize: '1.125rem', fontWeight: 600}}>Finalizar Pedido</h3><StyledButton variant="ghost" onClick={onClose} style={{padding: '0.25rem'}}><XIcon /></StyledButton></div>
                <div style={styles.modalBody}>
                    {success ? (
                        <div style={{ textAlign: 'center', padding: '1rem' }}>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#16A34A' }}>Obrigado!</h3>
                            <p style={{ marginTop: '0.5rem' }}>{success}</p>
                            <StyledButton onClick={onClose} style={{ marginTop: '1.5rem', width: '100%' }}>Fechar</StyledButton>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div><label style={styles.label} htmlFor="nomeCliente">Nome Completo</label><input style={styles.input} type="text" id="nomeCliente" name="nomeCliente" value={formData.nomeCliente} onChange={handleChange} required /></div>
                            <div><label style={styles.label} htmlFor="telefone">Telefone / WhatsApp</label><input style={styles.input} type="tel" id="telefone" name="telefone" value={formData.telefone} onChange={handleChange} required /></div>
                            <div><label style={styles.label} htmlFor="endereco">Endereço de Entrega</label><input style={styles.input} type="text" id="endereco" name="endereco" value={formData.endereco} onChange={handleChange} required /></div>
                            <div><label style={styles.label} htmlFor="observacoes">Observações</label><textarea style={{...styles.input, height: '80px'}} id="observacoes" name="observacoes" value={formData.observacoes} onChange={handleChange} placeholder="Ex: Sem cebola, etc." /></div>
                            <div style={{ paddingTop: '1rem', borderTop: '1px solid #E5E7EB' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1.125rem', marginBottom: '1rem' }}><span>Total:</span><span>R$ {total.toFixed(2)}</span></div>
                                {error && <p style={{ color: 'red', fontSize: '0.875rem', marginBottom: '1rem' }}>{error}</p>}
                                <StyledButton type="submit" disabled={isLoading} style={{ width: '100%', padding: '0.75rem', fontSize: '1rem' }}>{isLoading ? 'Enviando...' : 'Confirmar Pedido'}</StyledButton>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CheckoutModal;
