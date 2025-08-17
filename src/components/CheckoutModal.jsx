import React, { useState, useEffect } from 'react';
import styles from '../styles';
import { API_BASE_URL } from '../config';
import StyledButton from './StyledButton';
import { XIcon } from './Icons';

// --- CONFIGURAÇÕES DA PIZZARIA ---
const PIX_KEY = '(38)999478040';
const PIX_NAME = 'AMBROZIO SILVA DA ROCHA';
const WHATSAPP_NUMBER = '5538999478040'; // Número com código do país (55 para o Brasil)
// --- FIM DAS CONFIGURAÇÕES ---

const CheckoutModal = ({ isOpen, onClose, cartItems, total, clearCart }) => {
    const [formData, setFormData] = useState({ nomeCliente: '', telefone: '', endereco: '', observacoes: '' });
    const [paymentMethod, setPaymentMethod] = useState('Dinheiro');
    const [trocoPara, setTrocoPara] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [copySuccess, setCopySuccess] = useState('');

    const handleChange = (e) => setFormData({...formData, [e.target.name]: e.target.value });

    const handleCopyToClipboard = () => {
        navigator.clipboard.writeText(PIX_KEY).then(() => {
            setCopySuccess('Copiado!');
            setTimeout(() => setCopySuccess(''), 2000);
        }, () => {
            setCopySuccess('Falha ao copiar');
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { nomeCliente, telefone, endereco } = formData;
        if (!nomeCliente || !telefone || !endereco) { setError('Por favor, preencha nome, telefone e endereço.'); return; }
        
        // ALTERAÇÃO 1: Lógica de observações simplificada.
        const itemsParaBackend = cartItems.map(item => {
            if (item.isCustomPizza) {
                // As linhas que adicionavam detalhes à observação foram removidas.
                return { itemId: item.baseItemId, quantidade: item.quantidade };
            }
            return { itemId: item.id, quantidade: item.quantidade };
        });

        setError(''); setIsLoading(true);
        const pedido = { 
            ...formData, 
            observacoes: formData.observacoes.trim(), // Usando diretamente o valor do formulário
            itens: itemsParaBackend,
            metodoPagamento: paymentMethod,
            trocoPara: paymentMethod === 'Dinheiro' && trocoPara ? parseFloat(trocoPara) : null,
        };

        try {
            const r = await fetch(`${API_BASE_URL}/pedido`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(pedido) });
            if (!r.ok) throw new Error('Falha ao enviar o pedido.');
            const res = await r.json();
            setSuccess({ message: `Pedido #${res.pedidoId} realizado com sucesso!`, pedidoId: res.pedidoId, paymentMethod });
            
            // ALTERAÇÃO 2: Salva os dados do cliente no localStorage após o sucesso.
            const customerDataToSave = {
                nomeCliente: formData.nomeCliente,
                telefone: formData.telefone,
                endereco: formData.endereco,
            };
            localStorage.setItem('customerData', JSON.stringify(customerDataToSave));

            if (paymentMethod !== 'Pix') {
                clearCart();
            }
        } catch (err) { setError(err.message || 'Ocorreu um erro.'); } finally { setIsLoading(false); }
    };

    // ALTERAÇÃO 3: useEffect modificado para carregar dados do localStorage.
    useEffect(() => { 
        if (isOpen) {
            const savedData = localStorage.getItem('customerData');
            if (savedData) {
                const { nomeCliente, telefone, endereco } = JSON.parse(savedData);
                setFormData({
                    nomeCliente: nomeCliente || '',
                    telefone: telefone || '',
                    endereco: endereco || '',
                    observacoes: '' 
                });
            }
        } else {
            setFormData({ nomeCliente: '', telefone: '', endereco: '', observacoes: '' }); 
            setError(''); setSuccess(null); setIsLoading(false); setPaymentMethod('Dinheiro'); setTrocoPara('');
        }
    }, [isOpen]);
    
    if (!isOpen) return null;

    const whatsappMessage = success ? encodeURIComponent(`Olá! Gostaria de saber sobre o meu pedido #${success.pedidoId}.`) : '';
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMessage}`;

    return (
        <div style={{...styles.modalOverlay, zIndex: 60}}>
            <div style={{...styles.modalContent, zIndex: 61}}>
                <div style={styles.modalHeader}>
                    <h3 style={{fontSize: '1.125rem', fontWeight: 600}}>
                        {success ? 'Pedido Enviado!' : 'Finalizar Pedido'}
                    </h3>
                    <StyledButton onClick={onClose} style={{padding: '0.25rem'}}><XIcon /></StyledButton>
                </div>
                <div style={styles.modalBody}>
                    {success ? (
                        success.paymentMethod === 'Pix' ? (
                            <div style={{ textAlign: 'center', padding: '1rem' }}>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#16A34A' }}>Pedido feito!</h3>
                                <p style={{ marginTop: '0.5rem', marginBottom: '1.5rem' }}>Para confirmar, faça o pagamento via Pix e envie o comprovante em nosso WhatsApp.</p>
                                <div style={{backgroundColor: '#F3F4F6', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1.5rem', border: '1px solid #E5E7EB'}}>
                                    <p style={{fontSize: '0.875rem', color: '#6B7280'}}>Chave Pix (Telefone)</p>
                                    <p style={{fontWeight: 600, fontSize: '1.125rem', margin: '0.25rem 0'}}>{PIX_KEY}</p>
                                    <p style={{fontSize: '0.875rem', color: '#6B7280'}}>{PIX_NAME}</p>
                                    <StyledButton onClick={handleCopyToClipboard} style={{marginTop: '1rem', width: '100%'}} variant="secondary">
                                        {copySuccess || 'Copiar Chave Pix'}
                                    </StyledButton>
                                </div>
                                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" style={{textDecoration: 'none'}}>
                                    <StyledButton style={{width: '100%'}}>Falar sobre meu pedido no WhatsApp</StyledButton>
                                </a>
                            </div>
                        ) : (
                            <div style={{ textAlign: 'center', padding: '1rem' }}>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#16A34A' }}>Obrigado!</h3>
                                <p style={{ marginTop: '0.5rem' }}>{success.message}</p>
                                <StyledButton onClick={onClose} style={{ marginTop: '1.5rem', width: '100%' }}>Fechar</StyledButton>
                            </div>
                        )
                    ) : (
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div><label style={styles.label} htmlFor="nomeCliente">Nome Completo</label><input style={styles.input} type="text" id="nomeCliente" name="nomeCliente" value={formData.nomeCliente} onChange={handleChange} required /></div>
                            <div><label style={styles.label} htmlFor="telefone">Telefone / WhatsApp</label><input style={styles.input} type="tel" id="telefone" name="telefone" value={formData.telefone} onChange={handleChange} required /></div>
                            <div><label style={styles.label} htmlFor="endereco">Endereço de Entrega</label><input style={styles.input} type="text" id="endereco" name="endereco" value={formData.endereco} onChange={handleChange} required /></div>
                            <div><label style={styles.label} htmlFor="observacoes">Observações</label><textarea style={{...styles.input, height: '80px'}} id="observacoes" name="observacoes" value={formData.observacoes} onChange={handleChange} placeholder="Ex: Sem cebola, etc." /></div>
                            
                            <div style={{paddingTop: '1rem', borderTop: '1px solid #E5E7EB'}}>
                                <label style={styles.label}>Forma de Pagamento</label>
                                <div style={{display: 'flex', gap: '1rem', flexWrap: 'wrap'}}>
                                    {['Dinheiro', 'Pix', 'Cartão de Crédito', 'Cartão de Débito'].map(method => (
                                        <label key={method} style={{display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer'}}>
                                            <input type="radio" name="paymentMethod" value={method} checked={paymentMethod === method} onChange={() => setPaymentMethod(method)} />
                                            {method}
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {paymentMethod === 'Dinheiro' && (
                                <div>
                                    <label style={styles.label} htmlFor="trocoPara">Precisa de troco para quanto? (Opcional)</label>
                                    <input style={styles.input} type="number" id="trocoPara" name="trocoPara" value={trocoPara} onChange={(e) => setTrocoPara(e.target.value)} placeholder="Ex: 50" />
                                </div>
                            )}

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