import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import styles from '../styles';
import { API_BASE_URL } from '../config';
import StyledButton from './StyledButton';

const FreteManager = () => {
    const { token } = useAuth();
    const [taxa, setTaxa] = useState('');
    const [originalTaxaId, setOriginalTaxaId] = useState(null); // Para saber qual registro atualizar
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const fetchTaxaEntrega = useCallback(async () => {
        setIsLoading(true);
        setError('');
        try {
            // Esta rota será pública, pois o cliente também precisa saber a taxa
            const response = await fetch(`${API_BASE_URL}/entrega`);
            if (!response.ok) {
                throw new Error('Não foi possível buscar a taxa de entrega.');
            }
            const data = await response.json();
            // A rota retornará o primeiro registro de entrega encontrado
            if (data) {
                setTaxa(data.taxaEntrega.toFixed(2));
                setOriginalTaxaId(data.id);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchTaxaEntrega();
    }, [fetchTaxaEntrega]);

    const handleSave = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        setError('');
        setSuccessMessage('');

        if (!originalTaxaId) {
            setError("ID da taxa de entrega não encontrado. Não é possível salvar.");
            setIsSaving(false);
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/admin/entrega/${originalTaxaId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ taxaEntrega: parseFloat(taxa) }),
            });

            if (!response.ok) {
                throw new Error('Falha ao salvar a taxa de entrega.');
            }
            
            setSuccessMessage('Taxa de entrega salva com sucesso!');
            setTimeout(() => setSuccessMessage(''), 3000); // Limpa a mensagem após 3 segundos

        } catch (err) {
            setError(err.message);
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return <p style={{ padding: '1.5rem' }}>Carregando...</p>;
    }

    return (
        <div style={styles.card}>
            <div style={{...styles.input, padding: '1.5rem', border: 'none', height: 'auto', flexDirection: 'column'}}>
                <h3 style={{fontSize: '1.125rem', fontWeight: 500}}>Gerenciar Taxa de Entrega (Frete)</h3>
                <form onSubmit={handleSave} style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                        <label htmlFor="taxaEntrega" style={styles.label}>Valor da Taxa (R$)</label>
                        <input
                            id="taxaEntrega"
                            type="number"
                            step="0.01"
                            value={taxa}
                            onChange={(e) => setTaxa(e.target.value)}
                            placeholder="Ex: 5.00"
                            style={styles.input}
                            required
                        />
                    </div>
                    
                    {error && <p style={{ color: 'red', fontSize: '0.875rem' }}>{error}</p>}
                    {successMessage && <p style={{ color: 'green', fontSize: '0.875rem' }}>{successMessage}</p>}

                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <StyledButton type="submit" disabled={isSaving}>
                            {isSaving ? 'Salvando...' : 'Salvar Taxa de Entrega'}
                        </StyledButton>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default FreteManager;