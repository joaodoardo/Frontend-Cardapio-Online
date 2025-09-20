import React, { useState, useMemo, useEffect } from 'react';
import { useCart } from '../contexts/CartContext';
import styles from '../styles';
import StyledButton from './StyledButton';
import { XIcon } from './Icons';

const SIZES = {
    P: { name: 'P', flavors: 2 },
    M: { name: 'M', flavors: 2 },
    G: { name: 'G', flavors: 3 },
    GG: { name: 'GG', flavors: 3 },
};

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
                if (prev.length === 1) return prev;
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
        const priceKey = priceFieldMap[selectedSize];
        const pricesForSize = selectedFlavors.map(flavor => flavor[priceKey] || flavor.preco);
        return Math.max(...pricesForSize);
    }, [selectedFlavors, selectedSize]);

    const handleAddToCart = () => {
        const pizzaName = selectedFlavors.length > 1 
            ? `Pizza ${selectedFlavors.map(f => f.nome).join(' / ')}`
            : `Pizza ${selectedFlavors[0].nome}`;
        
        const priceKey = priceFieldMap[selectedSize];
        const mostExpensiveFlavor = selectedFlavors.reduce((max, flavor) => {
            const maxPrice = max[priceKey] || max.preco;
            const currentPrice = flavor[priceKey] || flavor.preco;
            return currentPrice > maxPrice ? flavor : max;
        }, selectedFlavors[0]);

        const customPizza = {
            baseItemId: mostExpensiveFlavor.id,
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
        // ✅ 1. O OVERLAY PERMITE ROLAGEM E NÃO CENTRALIZA O CONTEÚDO VERTICALMENTE
        <div style={{...styles.modalOverlay, alignItems: 'flex-start', justifyContent: 'center', overflowY: 'auto' }}>
            {/* ✅ 2. O CONTEÚDO DO MODAL OCUPA A TELA E USA LAYOUT FLEXÍVEL EM COLUNA */}
            <div style={{
                ...styles.modalContent, 
                maxWidth: '600px',
                width: '100%',
                minHeight: '100vh',
                borderRadius: 0,
                display: 'flex',
                flexDirection: 'column',
                // Em telas maiores (desktop), ele volta a se comportar como um modal normal
                 '@media (min-width: 640px)': {
                    minHeight: 'auto',
                    maxHeight: '90vh',
                    borderRadius: '0.5rem',
                }
            }}>
                <div style={styles.modalHeader}>
                    <h3 style={{fontSize: '1.125rem', fontWeight: 600}}>Monte sua Pizza</h3>
                    <StyledButton onClick={onClose} style={{padding: '0.25rem'}}><XIcon/></StyledButton>
                </div>

                {/* ✅ 3. O CORPO DO MODAL É A ÁREA PRINCIPAL E ROLÁVEL */}
                <div style={{...styles.modalBody, flexGrow: 1, overflowY: 'auto' }}>
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
                                    {selectedFlavors.length === 1 ? "Sabor escolhido:" : "Sabores escolhidos:"}
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

                    {/* SELEÇÃO DE SABORES (A LISTA LONGA QUE PRECISA ROLAR) */}
                    <div style={{marginTop: '1.5rem'}}>
                        <label style={styles.label}>
                            2. Escolha até {maxFlavors} Sabores ({selectedFlavors.length}/{maxFlavors})
                        </label>
                        <div style={{
                            maxHeight: '200px', // Altura máxima antes de rolar
                            overflowY: 'auto',
                            border: '1px solid #E5E7EB',
                            borderRadius: '0.375rem',
                            padding: '0.5rem'
                        }}>
                            {allFlavors.map(flavor => {
                                const isSelected = selectedFlavors.some(f => f.id === flavor.id);
                                const isDisabled = !isSelected && selectedFlavors.length >= maxFlavors;
                                const priceKey = priceFieldMap[selectedSize];
                                const displayPrice = flavor[priceKey] || flavor.preco;

                                return (
                                    <div key={flavor.id} style={{ padding: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', opacity: isDisabled ? 0.5 : 1 }}>
                                        <input 
                                            type="checkbox" 
                                            id={`flavor-${flavor.id}`} 
                                            checked={isSelected}
                                            disabled={isDisabled}
                                            onChange={() => handleFlavorToggle(flavor)}
                                            style={{cursor: isDisabled ? 'not-allowed' : 'pointer'}}
                                        />
                                        <label htmlFor={`flavor-${flavor.id}`} style={{flexGrow: 1, cursor: isDisabled ? 'not-allowed' : 'pointer'}}>
                                            {flavor.nome}
                                        </label>
                                        <span>R$ {displayPrice.toFixed(2)}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
                
                {/* ✅ 4. O RODAPÉ COM O PREÇO E O BOTÃO FICA FIXO NA PARTE DE BAIXO */}
                <div style={{
                    padding: '1.5rem',
                    paddingTop: '1.5rem',
                    marginTop: 'auto', // Empurra para o final do container flex
                    borderTop: '1px solid #E5E7EB',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    backgroundColor: 'white' // Garante que não seja transparente
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
    );
};

export default PizzaCustomizationModal;