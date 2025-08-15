// Arquivo: Frontend-Cardapio-Online/src/components/PedidoHistorico.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { API_BASE_URL } from '../config';
import styles from '../styles';

const PedidoHistorico = () => {
    const { token } = useAuth();
    const [pedidos, setPedidos] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchHistorico = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/admin/pedidos/historico`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error('Falha ao buscar o histórico.');
            const data = await response.json();
            setPedidos(data);
            setError('');
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }, [token]);

    useEffect(() => {
        fetchHistorico();
    }, [fetchHistorico]);
    
    const formatarData = (dataString) => {
        return new Date(dataString).toLocaleDateString('pt-BR', {
            day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
        });
    };

    return (
        <div style={styles.card}>
            <div style={{ ...styles.input, padding: '1.5rem', border: 'none', height: 'auto' }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 500 }}>Histórico de Pedidos Finalizados</h3>
            </div>
            <div style={{ borderTop: '1px solid #E5E7EB', overflowX: 'auto' }}>
                {isLoading && <p style={{ padding: '1.5rem' }}>Carregando histórico...</p>}
                {error && <p style={{ padding: '1.5rem', color: 'red' }}>{error}</p>}
                {!isLoading && !error && (
                    <table style={styles.table}>
                        <thead style={styles.tableHead}>
                            <tr>
                                <th style={styles.tableHeadCell}>Data</th>
                                <th style={styles.tableHeadCell}>Cliente</th>
                                <th style={styles.tableHeadCell}>Endereço</th>
                                <th style={styles.tableHeadCell}>Valor Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pedidos.map(pedido => {
                                const total = pedido.itens.reduce((acc, itemPedido) => acc + (itemPedido.item.preco * itemPedido.quantidade), 0);
                                return (
                                    <tr key={pedido.id} style={styles.tableBodyRow}>
                                        <td style={styles.tableBodyCell}>{formatarData(pedido.criadoEm)}</td>
                                        <td style={{...styles.tableBodyCell, fontWeight: 500}}>{pedido.nomeCliente}</td>
                                        <td style={styles.tableBodyCell}>{pedido.endereco}</td>
                                        <td style={styles.tableBodyCell}>R$ {total.toFixed(2)}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
                 {!isLoading && pedidos.length === 0 && <p style={{ padding: '1.5rem' }}>Nenhum pedido finalizado encontrado.</p>}
            </div>
        </div>
    );
};

export default PedidoHistorico;