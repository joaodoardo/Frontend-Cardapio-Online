import React, { useState, useEffect, useCallback } from 'react';
import { API_BASE_URL } from '../config';

// O objeto statusInfo continua o mesmo
const statusInfo = {
    1: { texto: "Em Análise", cor: "#d4652f", emoji: "🧐" },
    2: { texto: "Em Produção", cor: "#e8a234", emoji: "🧑‍🍳" },
    3: { texto: "Pronto para Entrega", cor: "#5ab44f", emoji: "📦" },
    4: { texto: "Finalizado / Entregue", cor: "#4B5563", emoji: "✅" }
};

// Os estilos continuam os mesmos
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
    greeting: {
        textAlign: 'center',
        color: '#333',
        marginBottom: '1.5rem',
        borderBottom: '1px solid #eee',
        paddingBottom: '1.5rem'
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
    pedidoCard: {
        backgroundColor: 'white',
        borderLeft: '5px solid #ccc',
        borderRadius: '4px',
        padding: '1rem 1.5rem',
        marginBottom: '1rem',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
    },
    statusTag: {
        display: 'inline-block',
        padding: '0.25rem 0.75rem',
        borderRadius: '12px',
        color: 'white',
        fontWeight: 'bold',
        fontSize: '0.9rem',
    }
};

const PedidosStatus = () => {
    const [telefone, setTelefone] = useState('');
    const [pedidos, setPedidos] = useState([]);
    const [nomeCliente, setNomeCliente] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    // ======================================================================
    // ✅ INÍCIO DA ALTERAÇÃO 1: LÓGICA DE BUSCA REATORADA
    // ======================================================================
    const buscarPedidosPorTelefone = useCallback(async (numeroParaBuscar) => {
        if (!numeroParaBuscar) return;

        setIsLoading(true);
        setError('');
        setPedidos([]);
        setNomeCliente('');

        try {
            const response = await fetch(`${API_BASE_URL}/pedidos/cliente/${numeroParaBuscar}`);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Falha ao buscar pedidos.');
            }
            
            setPedidos(data);
            if (data.length > 0) {
                setNomeCliente(data[0].nomeCliente);
            }

        } catch (err) {
            setError(err.message);
            setPedidos([]); // Limpa os pedidos em caso de erro
        } finally {
            setIsLoading(false);
        }
    }, []); // useCallback para evitar recriação desnecessária da função

    // O handler do formulário agora apenas chama a função de busca
    const handleFormSubmit = (e) => {
        e.preventDefault();
        buscarPedidosPorTelefone(telefone);
    };
    // ======================================================================
    // ✅ FIM DA ALTERAÇÃO 1
    // ======================================================================


    // ======================================================================
    // ✅ INÍCIO DA ALTERAÇÃO 2: useEffect PARA BUSCA AUTOMÁTICA
    // ======================================================================
    useEffect(() => {
        // Tenta buscar os dados do cliente no localStorage
        const savedDataString = localStorage.getItem('customerData');
        if (savedDataString) {
            const savedData = JSON.parse(savedDataString);
            if (savedData.telefone) {
                console.log(`Telefone encontrado no localStorage: ${savedData.telefone}. Buscando pedidos...`);
                // Define o telefone no estado para preencher o input
                setTelefone(savedData.telefone);
                // Chama a função de busca com o número encontrado
                buscarPedidosPorTelefone(savedData.telefone);
            }
        }
    }, [buscarPedidosPorTelefone]); // A dependência agora é a função memoizada
    // ======================================================================
    // ✅ FIM DA ALTERAÇÃO 2
    // ======================================================================

    
    // useEffect para atualização automática (polling) continua o mesmo
    useEffect(() => {
        if (telefone && pedidos.length > 0) {
            const intervalId = setInterval(async () => {
                console.log(`Atualizando automaticamente pedidos para o telefone: ${telefone}`);
                try {
                    const response = await fetch(`${API_BASE_URL}/pedidos/cliente/${telefone}`);
                    const data = await response.json();
                    if (response.ok) {
                        setPedidos(data); // Apenas atualiza a lista
                    }
                } catch (err) {
                    console.error("Erro na atualização automática:", err);
                }
            }, 60000);

            return () => clearInterval(intervalId);
        }
    }, [telefone, pedidos.length]);


    const formatarData = (dataString) => {
        const opcoes = { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dataString).toLocaleDateString('pt-BR', opcoes);
    };

    return (
        <div style={styles.container}>
            {nomeCliente ? (
                <h2 style={styles.greeting}>Olá, {nomeCliente}!</h2>
            ) : (
                <h2>Acompanhe seu Pedido</h2>
            )}

            <p>Digite o número de telefone usado no pedido para ver o status.</p>
            
            {/* O formulário agora chama handleFormSubmit */}
            <form onSubmit={handleFormSubmit}>
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

            {/* O restante do JSX para renderizar os pedidos permanece o mesmo */}
            {pedidos.length > 0 && (
                <div style={{ marginTop: '2rem' }}>
                    <h3>Seus pedidos recentes:</h3>
                    {pedidos.map(p => {
                        const valorTotal = p.itens.reduce((total, itemPedido) => {
                            return total + (itemPedido.item.preco * itemPedido.quantidade);
                        }, 0);

                        const statusAtual = statusInfo[p.status] || { texto: 'Desconhecido', cor: '#ccc', emoji: '❓' };

                        return (
                            <div 
                                key={p.id}
                                style={{ ...styles.pedidoCard, borderLeftColor: statusAtual.cor }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                    <div>
                                        <strong>Pedido #{p.id}</strong>
                                        <p style={{ margin: '0.25rem 0', color: '#666', fontSize: '0.9rem' }}>{formatarData(p.criadoEm)}</p>
                                    </div>
                                    <div style={{...styles.statusTag, backgroundColor: statusAtual.cor}}>
                                        {statusAtual.emoji} {statusAtual.texto}
                                    </div>
                                </div>
                                
                                <div>
                                    <strong>Itens:</strong>
                                    <ul style={{ listStyle: 'none', padding: 0, margin: '0.5rem 0', color: '#555' }}>
                                        {p.itens.map(itemPedido => (
                                            <li key={itemPedido.id} style={{ marginBottom: '0.25rem' }}>
                                                {itemPedido.quantidade}x {itemPedido.item.nome}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div style={{ borderTop: '1px solid #eee', marginTop: '1rem', paddingTop: '1rem', textAlign: 'right' }}>
                                    <strong style={{fontSize: '1.1rem'}}>Valor Total: R$ {valorTotal.toFixed(2).replace('.', ',')}</strong>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default PedidosStatus;