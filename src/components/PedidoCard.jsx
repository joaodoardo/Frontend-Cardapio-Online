// frontend/PedidoCard.js

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
    
    // Calcula o total do pedido
    const totalPedido = pedido.itens.reduce((acc, itemPedido) => {
        return acc + (itemPedido.item.preco * itemPedido.quantidade);
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
                    <li key={itemPedido.id}>
                        {itemPedido.quantidade}x {itemPedido.item.nome}
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