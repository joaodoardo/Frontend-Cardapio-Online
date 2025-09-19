import React from 'react';

// Estilos para os botões e o card para não poluir o componente
const cardStyles = {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '1rem',
    color: 'black',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    flexShrink: 0,
    margin: "1rem"
};

const buttonStyles = {
    width: '100%',
    padding: '0.75rem',
    marginTop: '1rem',
    border: 'none',
    borderRadius: '6px',
    backgroundColor: '#333',
    color: 'white',
    fontWeight: 'bold',
    cursor: 'pointer',
    fontSize: '0.9rem'
};

const PedidoCard = ({ pedido, onStatusChange }) => {
    // Função para formatar a data para um formato mais legível
    const formatarData = (dataString) => {
        const data = new Date(dataString);
        return data.toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };
    
    // ✅ ALTERAÇÃO 1: Corrigido o cálculo do total do pedido
    // Agora, ele prioriza o 'precoFinal' salvo no item do pedido.
    // O '??' (operador de coalescência nula) usa o preço base do item como um fallback
    // caso 'precoFinal' não exista (para pedidos antigos ou itens normais).
    const totalPedido = pedido.itens.reduce((acc, itemPedido) => {
        const precoItem = itemPedido.precoFinal ?? itemPedido.item.preco;
        return acc + (precoItem * itemPedido.quantidade);
    }, 0).toFixed(2);

    return (
        <div style={cardStyles}>
            <p><strong>Pedido #{pedido.id}</strong> - {formatarData(pedido.criadoEm)}</p>
            <p><strong>Cliente:</strong> {pedido.nomeCliente}</p>
            <p><strong>Endereço:</strong> {pedido.endereco}</p>
            
            <hr style={{margin: '0.5rem 0'}}/>

            <strong>Itens:</strong>
            <ul style={{ listStyle: 'none', paddingLeft: '0', fontSize: '0.9em' }}>
                {pedido.itens.map(itemPedido => (
                    // ✅ ALTERAÇÃO 2: Exibição do item corrigida
                    <li key={itemPedido.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                        <span>
                            {itemPedido.quantidade}x {itemPedido.item.nome}
                            {/* Mostra o tamanho da pizza, se ele existir no pedido */}
                            {itemPedido.tamanho && <strong style={{ color: '#EA580C' }}> ({itemPedido.tamanho})</strong>}
                        </span>
                        {/* Mostra o preço individual do item no momento da compra */}
                        <span>
                            R$ {(itemPedido.precoFinal ?? itemPedido.item.preco).toFixed(2)}
                        </span>
                    </li>
                ))}
            </ul>

            <hr style={{margin: '0.5rem 0'}}/>

            <p><strong>Total:</strong> R$ {totalPedido}</p>
            {pedido.metodoPagamento && <p><strong>Pagamento:</strong> {pedido.metodoPagamento}</p>}
            {pedido.metodoPagamento === 'Dinheiro' && pedido.trocoPara > 0 && <p><strong>Troco para:</strong> R$ {pedido.trocoPara.toFixed(2)}</p>}
            {pedido.observacoes && <p><strong>Obs:</strong> {pedido.observacoes}</p>}

            {/* Renderização condicional do botão de ação */}
            {pedido.status === 1 && (
                <button style={{...buttonStyles, backgroundColor: '#e8a234'}} onClick={() => onStatusChange(pedido.id, 2)}>
                    Iniciar Produção
                </button>
            )}

            {pedido.status === 2 && (
                <button style={{...buttonStyles, backgroundColor: '#5ab44f'}} onClick={() => onStatusChange(pedido.id, 3)}>
                    Pronto para Entrega
                </button>
            )}

            {pedido.status === 3 && (
                <button style={{...buttonStyles, backgroundColor: '#4B5563'}} onClick={() => onStatusChange(pedido.id, 4)}>
                    Finalizar Pedido
                </button>
            )}
        </div>
    );
};

export default PedidoCard;