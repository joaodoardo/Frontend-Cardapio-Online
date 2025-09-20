// Arquivo: Frontend-Cardapio-Online/src/components/PedidoHistorico.jsx

import React, { useState, useEffect, useCallback, Fragment } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { API_BASE_URL } from '../config';
import styles from '../styles';
import { ChevronDownIcon, ChevronUpIcon } from './Icons'; // Supondo que você tenha ícones de seta

const PedidoHistorico = () => {
    const { token } = useAuth();
    const [pedidos, setPedidos] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    // ✅ 1. NOVO ESTADO PARA CONTROLAR A LINHA EXPANDIDA
    const [expandedRowId, setExpandedRowId] = useState(null);

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

    // ✅ 2. FUNÇÃO PARA ABRIR/FECHAR OS DETALHES DE UM PEDIDO
    const handleToggleRow = (pedidoId) => {
        setExpandedRowId(currentId => (currentId === pedidoId ? null : pedidoId));
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
                                {/* Adicionada uma coluna vazia para o botão de expandir */}
                                <th style={{...styles.tableHeadCell, width: '1%'}}></th> 
                                <th style={styles.tableHeadCell}>Data</th>
                                <th style={styles.tableHeadCell}>Cliente</th>
                                <th style={styles.tableHeadCell}>Endereço</th>
                                <th style={styles.tableHeadCell}>Valor Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pedidos.map(pedido => {
                                // ✅ 3. CÁLCULO DO VALOR TOTAL CORRIGIDO
                                const subtotal = pedido.itens.reduce((acc, itemPedido) => {
                                    const precoItem = itemPedido.precoFinal ?? itemPedido.item?.preco ?? 0;
                                    return acc + (precoItem * itemPedido.quantidade);
                                }, 0);
                                const total = subtotal + (pedido.taxaEntrega || 0);
                                
                                const isExpanded = expandedRowId === pedido.id;

                                return (
                                    // Fragment permite agrupar a linha principal e a de detalhes
                                    <Fragment key={pedido.id}>
                                        <tr style={{...styles.tableBodyRow, cursor: 'pointer'}} onClick={() => handleToggleRow(pedido.id)}>
                                            <td style={styles.tableBodyCell}>
                                                {/* Ícone muda dependendo se a linha está expandida ou não */}
                                                {isExpanded ? <ChevronUpIcon /> : <ChevronDownIcon />}
                                            </td>
                                            <td style={styles.tableBodyCell}>{formatarData(pedido.criadoEm)}</td>
                                            <td style={{...styles.tableBodyCell, fontWeight: 500}}>{pedido.nomeCliente}</td>
                                            <td style={styles.tableBodyCell}>{pedido.endereco}</td>
                                            <td style={styles.tableBodyCell}>R$ {total.toFixed(2).replace('.', ',')}</td>
                                        </tr>
                                        {/* ✅ 4. RENDERIZAÇÃO CONDICIONAL DA LINHA DE DETALHES */}
                                        {isExpanded && (
                                            <tr style={{backgroundColor: '#F9FAFB'}}>
                                                <td colSpan="5" style={{padding: '1rem 1.5rem'}}>
                                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
                                                        <div>
                                                            <strong style={{display: 'block', marginBottom: '0.5rem'}}>Itens do Pedido:</strong>
                                                            <ul style={{margin: 0, paddingLeft: '1rem'}}>
                                                                {pedido.itens.map(itemPedido => (
                                                                    <li key={itemPedido.id}>
                                                                        {itemPedido.quantidade}x {itemPedido.item?.nome || 'Item não encontrado'}
                                                                        {itemPedido.tamanho && ` (${itemPedido.tamanho})`}
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                        <div>
                                                            <strong style={{display: 'block', marginBottom: '0.5rem'}}>Detalhes Financeiros:</strong>
                                                            <p style={{margin: 0}}>Subtotal: R$ {subtotal.toFixed(2).replace('.', ',')}</p>
                                                            {pedido.taxaEntrega > 0 && <p style={{margin: 0}}>Taxa de Entrega: R$ {pedido.taxaEntrega.toFixed(2).replace('.', ',')}</p>}
                                                            <p style={{margin: 0, fontWeight: 'bold'}}>Total: R$ {total.toFixed(2).replace('.', ',')}</p>
                                                        </div>
                                                        {pedido.observacoes && (
                                                            <div>
                                                                <strong style={{display: 'block', marginBottom: '0.5rem'}}>Observações:</strong>
                                                                <p style={{margin: 0, fontStyle: 'italic'}}>{pedido.observacoes}</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </Fragment>
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