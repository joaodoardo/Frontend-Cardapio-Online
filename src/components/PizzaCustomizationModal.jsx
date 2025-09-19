import React, { useState, useMemo, useEffect } from 'react';
import { useCart } from '../contexts/CartContext';
import styles from '../styles';
import StyledButton from './StyledButton';
import { XIcon } from './Icons';

// ✅ ALTERAÇÃO 1: Removido 'priceMultiplier', pois não é mais necessário.
const SIZES = {
    P: { name: 'P', flavors: 2 },
    M: { name: 'M', flavors: 2 },
    G: { name: 'G', flavors: 3 },
    GG: { name: 'GG', flavors: 3 },
};

// Objeto para mapear o tamanho ao campo de preço correspondente no item
const priceFieldMap = {
    P: 'precoP',
    M: 'precoM',
    G: 'precoG',
    GG: 'precoGG',
};

const PizzaCustomizationModal = ({ isOpen, onClose, basePizza, allFlavors }) => {
    const { addToCart } = useCart();
    const [selectedSize, setSelectedSize] = useState('M');
    const [selectedFlavors, setSelectedFlavors] = useState([]);

    // Reseta o estado quando o modal é aberto com uma nova pizza base
    useEffect(() => {
        if (isOpen) {
            setSelectedSize('M');
            setSelectedFlavors([basePizza]);
        }
    }, [isOpen, basePizza]);


    const maxFlavors = SIZES[selectedSize].flavors;

    const handleFlavorToggle = (flavor) => {
        setSelectedFlavors(prev => {
            const isSelected = prev.find(f => f.id === flavor.id);
            if (isSelected) {
                if (prev.length === 1) return prev; // Não permite remover o último sabor
                return prev.filter(f => f.id !== flavor.id);
            } else {
                if (prev.length < maxFlavors) {
                    return [...prev, flavor];
                }
                return prev;
            }
        });
    };
    
    // ✅ ALTERAÇÃO 2: Lógica de cálculo de preço totalmente refeita.
    const finalPrice = useMemo(() => {
        if (selectedFlavors.length === 0) return 0;

        // Pega a chave do campo de preço, ex: 'precoM'
        const priceKey = priceFieldMap[selectedSize];

        // Mapeia os sabores selecionados para seus preços no tamanho escolhido.
        // Se um sabor não tiver um preço específico para o tamanho, usa o preço base.
        const pricesForSize = selectedFlavors.map(flavor => flavor[priceKey] || flavor.preco);
        
        // Retorna o maior preço entre os sabores selecionados.
        return Math.max(...pricesForSize);

    }, [selectedFlavors, selectedSize]);

    const handleAddToCart = () => {
        const pizzaName = selectedFlavors.length > 1 
            ? `Pizza ${selectedFlavors.map(f => f.nome).join(' / ')}`
            : `Pizza ${selectedFlavors[0].nome}`;
        
        // Pega a chave do campo de preço para o tamanho selecionado
        const priceKey = priceFieldMap[selectedSize];

        // Encontra o sabor mais caro com base no preço do tamanho selecionado
        const mostExpensiveFlavor = selectedFlavors.reduce((max, flavor) => {
            const maxPrice = max[priceKey] || max.preco;
            const currentPrice = flavor[priceKey] || flavor.preco;
            return currentPrice > maxPrice ? flavor : max;
        }, selectedFlavors[0]);

        const customPizza = {
            baseItemId: mostExpensiveFlavor.id, // ID do sabor mais caro
            nome: pizzaName,
            preco: finalPrice,
            quantidade: 1,
            isCustomPizza: true,
            tamanho: SIZES[selectedSize].name,
            sabores: selectedFlavors,
        };
        addToCart(customPizza);
        onClose();
    };

    const remainingFlavors = maxFlavors - selectedFlavors.length;

    if (!isOpen) return null;

    return (
        <div style={styles.modalOverlay}>
            <div style={{...styles.modalContent, maxWidth: '600px'}}>
                <div style={styles.modalHeader}>
                    <h3 style={{fontSize: '1.125rem', fontWeight: 600}}>Monte sua Pizza</h3>
                    <StyledButton onClick={onClose} style={{padding: '0.25rem'}}><XIcon/></StyledButton>
                </div>
                <div style={styles.modalBody}>
                    {/* SELEÇÃO DE TAMANHO */}
                    <div>
                        <label style={styles.label}>1. Escolha o Tamanho</label>
                        <div style={{display: 'flex', gap: '0.5rem', flexWrap: 'wrap'}}>
                            {Object.values(SIZES).map(size => (
                                <StyledButton 
                                    key={size.name} 
                                    variant={selectedSize === size.name ? 'primary' : 'secondary'}
                                    onClick={() => setSelectedSize(size.name)}
                                >
                                    {size.name} ({size.flavors} sabores)
                                </StyledButton>
                            ))}
                        </div>
                    </div>

                    {/* SABORES ESCOLHIDOS + MENSAGEM */}
                    <div style={{ marginTop: '1rem' }}>
                        {selectedFlavors.length > 0 && (
                            <>
                                <label style={styles.label}>
                                    {selectedFlavors.length === 1
                                        ? "Sabor escolhido:"
                                        : "Sabores escolhidos:"}
                                </label>
                                <p style={{ margin: '0.5rem 0', fontWeight: '500' }}>
                                    {selectedFlavors.map(f => f.nome).join(' / ')}
                                </p>
                            </>
                        )}
                        {remainingFlavors > 0 && (
                            <p style={{ fontSize: '0.875rem', color: '#6B7280' }}>
                                Você pode adicionar mais {remainingFlavors} sabor{remainingFlavors > 1 ? 'es' : ''} (opcional)
                            </p>
                        )}
                    </div>

                    {/* SELEÇÃO DE SABORES */}
                    <div style={{marginTop: '1.5rem'}}>
                        <label style={styles.label}>
                            2. Escolha até {maxFlavors} Sabores ({selectedFlavors.length}/{maxFlavors})
                        </label>
                        <div style={{
                            maxHeight: '200px',
                            overflowY: 'auto',
                            border: '1px solid #E5E7EB',
                            borderRadius: '0.375rem',
                            padding: '0.5rem'
                        }}>
                            {allFlavors.map(flavor => {
                                const isSelected = selectedFlavors.some(f => f.id === flavor.id);
                                const isDisabled = !isSelected && selectedFlavors.length >= maxFlavors;
                                
                                // ✅ ALTERAÇÃO 3: Exibe o preço correto para o tamanho selecionado.
                                const priceKey = priceFieldMap[selectedSize];
                                const displayPrice = flavor[priceKey] || flavor.preco;

                                return (
                                    <div
                                        key={flavor.id}
                                        style={{
                                            padding: '0.5rem',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.75rem',
                                            opacity: isDisabled ? 0.5 : 1
                                        }}
                                    >
                                        <input 
                                            type="checkbox" 
                                            id={`flavor-${flavor.id}`} 
                                            checked={isSelected}
                                            disabled={isDisabled}
                                            onChange={() => handleFlavorToggle(flavor)}
                                            style={{cursor: isDisabled ? 'not-allowed' : 'pointer'}}
                                        />
                                        <label
                                            htmlFor={`flavor-${flavor.id}`}
                                            style={{flexGrow: 1, cursor: isDisabled ? 'not-allowed' : 'pointer'}}
                                        >
                                            {flavor.nome}
                                        </label>
                                        {/* Mostra o preço dinâmico */}
                                        <span>R$ {displayPrice.toFixed(2)}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    
                    {/* FOOTER COM PREÇO E BOTÃO */}
                    <div style={{
                        paddingTop: '1.5rem',
                        marginTop: '1.5rem',
                        borderTop: '1px solid #E5E7EB',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <div>
                            <span style={{fontSize: '0.875rem', color: '#6B7280'}}>Total</span>
                            <p style={{fontSize: '1.5rem', fontWeight: 'bold'}}>R$ {finalPrice.toFixed(2)}</p>
                        </div>
                        <StyledButton 
                            onClick={handleAddToCart} 
                            style={{padding: '0.75rem 1.5rem'}} 
                            disabled={selectedFlavors.length === 0}
                        >
                            Adicionar ao Carrinho
                        </StyledButton>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PizzaCustomizationModal;