// frontend/pages/pedidosStatus.jsx

import React, { useState } from 'react';

// Um objeto para mapear o status numérico para um texto amigável e uma cor
const statusInfo = {
    1: { texto: "Em Análise", cor: "#d4652f", emoji: "🧐" },
    2: { texto: "Em Produção", cor: "#e8a234", emoji: "🧑‍🍳" },
    3: { texto: "Pronto para Entrega", cor: "#5ab44f", emoji: "📦" },
    4: { texto: "Finalizado / Entregue", cor: "#4B5563", emoji: "✅" }
};

// Estilos básicos para a página
const styles = {
    container: {
        maxWidth: '700px',
        margin: '2rem auto',
        padding: '2rem',
        fontFamily: 'sans-serif',
        backgroundColor: '#f9f9f9',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        color: 'black'
    },
    input: {
        width: '100%',
        padding: '12px',
        fontSize: '1rem',
        marginBottom: '1rem',
        border: '1px solid #ddd',
        borderRadius: '4px'
    },
    button: {
        width: '100%',
        padding: '12px',
        fontSize: '1rem',
        backgroundColor: '#d4652f',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer'
    },
    pedidoItem: {
        padding: '1rem',
        border: '1px solid #eee',
        borderRadius: '4px',
        marginBottom: '0.5rem',
        cursor: 'pointer',
        backgroundColor: 'white'
    },
    statusDisplay: {
        marginTop: '2rem',
        padding: '1.5rem',
        borderRadius: '8px',
        textAlign: 'center'
    }
};

const PedidosStatus = () => {
    const [telefone, setTelefone] = useState('');
    const [pedidos, setPedidos] = useState([]);
    const [pedidoSelecionado, setPedidoSelecionado] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleBuscarPedidos = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setPedidos([]);
        setPedidoSelecionado(null);

        try {
            const response = await fetch(`http://localhost:3000/pedidos/cliente/${telefone}`);
            const data = await response.json();

            if (!response.ok) {
                // Usa a mensagem de erro vinda do backend (ex: "Nenhum pedido encontrado")
                throw new Error(data.message || 'Falha ao buscar pedidos.');
            }
            
            setPedidos(data);

        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const formatarData = (dataString) => {
        const opcoes = { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dataString).toLocaleDateString('pt-BR', opcoes);
    };

    return (
        <div style={styles.container}>
            <h2>Acompanhe seu Pedido</h2>
            <p>Digite o número de telefone usado no pedido para ver o status.</p>
            
            <form onSubmit={handleBuscarPedidos}>
                <input 
                    type="tel"
                    value={telefone}
                    onChange={(e) => setTelefone(e.target.value)}
                    placeholder="Ex: 38999998888"
                    style={styles.input}
                    required
                />
                <button type="submit" style={styles.button} disabled={isLoading}>
                    {isLoading ? 'Buscando...' : 'Buscar Pedidos'}
                </button>
            </form>

            {error && <p style={{ color: 'red', textAlign: 'center', marginTop: '1rem' }}>{error}</p>}

            {pedidos.length > 0 && (
                <div style={{ marginTop: '2rem' }}>
                    <h3>Seus pedidos recentes:</h3>
                    {pedidos.map(p => (
                        <div 
                            key={p.id}
                            style={styles.pedidoItem}
                            onClick={() => setPedidoSelecionado(p)}
                        >
                            <strong>Pedido #{p.id}</strong> - Realizado em: {formatarData(p.criadoEm)}
                        </div>
                    ))}
                </div>
            )}

            {pedidoSelecionado && (
                <div style={{ 
                    ...styles.statusDisplay, 
                    backgroundColor: statusInfo[pedidoSelecionado.status]?.cor || '#ccc' 
                }}>
                    <h3 style={{ color: 'white', margin: 0 }}>
                        {statusInfo[pedidoSelecionado.status]?.emoji || ''} Status do Pedido #{pedidoSelecionado.id}
                    </h3>
                    <p style={{ fontSize: '1.5rem', color: 'white', fontWeight: 'bold', margin: '0.5rem 0' }}>
                        {statusInfo[pedidoSelecionado.status]?.texto || 'Status Desconhecido'}
                    </p>
                    <div style={{marginTop: '1rem', padding: '1rem', backgroundColor: 'rgba(255,255,255,0.8)', borderRadius: '4px', color: '#333'}}>
                        <strong>Itens do Pedido:</strong>
                        <ul style={{listStyle: 'none', padding: 0, margin: '0.5rem 0 0 0'}}>
                           {pedidoSelecionado.itens.map(itemPedido => (
                               <li key={itemPedido.id}>
                                   {itemPedido.quantidade}x {itemPedido.item.nome}
                               </li>
                           ))}
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PedidosStatus;