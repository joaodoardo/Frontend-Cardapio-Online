import React, { useState, useMemo } from 'react';
import { useCart } from '../contexts/CartContext';
import styles from '../styles';
import StyledButton from './StyledButton';
import { XIcon } from './Icons';

const SIZES = {
    P: { name: 'P', flavors: 2, priceMultiplier: 0.8 },
    M: { name: 'M', flavors: 2, priceMultiplier: 1.0 },
    G: { name: 'G', flavors: 3, priceMultiplier: 1.2 },
    GG: { name: 'GG', flavors: 3, priceMultiplier: 1.5 },
};

const PizzaCustomizationModal = ({ isOpen, onClose, basePizza, allFlavors }) => {
    const { addToCart } = useCart();
    const [selectedSize, setSelectedSize] = useState('M');
    const [selectedFlavors, setSelectedFlavors] = useState([basePizza]);

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
    
    const finalPrice = useMemo(() => {
        if (selectedFlavors.length === 0) return 0;
        const maxPrice = Math.max(...selectedFlavors.map(f => f.preco));
        return maxPrice * SIZES[selectedSize].priceMultiplier;
    }, [selectedFlavors, selectedSize]);

    const handleAddToCart = () => {
        const pizzaName = selectedFlavors.length > 1 
            ? `Pizza ${selectedFlavors.map(f => f.nome).join(' / ')}`
            : `Pizza ${selectedFlavors[0].nome}`;
        
        const mostExpensiveFlavor = selectedFlavors.reduce((max, f) => f.preco > max.preco ? f : max, selectedFlavors[0]);

        const customPizza = {
            baseItemId: mostExpensiveFlavor.id, // ID do sabor mais caro para o backend
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
                                        <span>R$ {flavor.preco.toFixed(2)}</span>
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
