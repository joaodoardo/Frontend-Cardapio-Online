import React, { useState } from 'react';
import { useCart } from '../contexts/CartContext';
import { useSchedule } from '../contexts/ScheduleContext';
import styles from '../styles';
import { XIcon, ShoppingCartIcon, PlusIcon, MinusIcon } from './Icons';
import CheckoutModal from './CheckoutModal';
import StyledButton from './StyledButton';

const CartSidebar = () => {
    const { isCartOpen, setIsCartOpen, cartItems, updateQuantity, cartTotal, clearCart } = useCart();
    const { isOpen } = useSchedule();
    const [isCheckout, setIsCheckout] = useState(false);
    if (!isCartOpen) return null;

    return (
        <>
            <div style={{...styles.modalOverlay, zIndex: 50}} onClick={() => setIsCartOpen(false)}></div>
            <div style={{ position: 'fixed', top: 0, right: 0, height: '100%', width: '100%', maxWidth: '384px', backgroundColor: 'white', zIndex: 51, display: 'flex', flexDirection: 'column', boxShadow: '-2px 0 8px rgba(0,0,0,0.1)' }}>
                <div style={styles.modalHeader}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Seu Carrinho</h2>
                    <StyledButton variant="ghost" onClick={() => setIsCartOpen(false)} style={{padding: '0.25rem'}}><XIcon /></StyledButton>
                </div>
                {cartItems.length === 0 ? (
                    <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#6B7280' }}>
                        <ShoppingCartIcon style={{ width: '4rem', height: '4rem', marginBottom: '1rem' }} />
                        <p>Seu carrinho está vazio.</p>
                    </div>
                ) : (
                    <>
                        <div style={{ flexGrow: 1, overflowY: 'auto', padding: '1rem' }}>
                            {cartItems.map(item => (
                                <div key={item.cartId} style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                                    <div style={{ flexGrow: 1 }}>
                                        <p style={{ fontWeight: 600 }}>{item.nome}</p>
                                        {item.isCustomPizza && (
                                            <p style={{ fontSize: '0.75rem', color: '#6B7280' }}>
                                                ({item.tamanho}, {item.sabores.map(s => s.nome).join(' / ')})
                                            </p>
                                        )}
                                        <p style={{ fontSize: '0.875rem', color: '#4B5563' }}>R$ {item.preco.toFixed(2)}</p>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #D1D5DB', borderRadius: '0.375rem' }}>
                                        <StyledButton variant="ghost" onClick={() => updateQuantity(item.cartId, item.quantidade - 1)} style={{ padding: '0.5rem' }}><MinusIcon style={{width: '1rem', height: '1rem'}}/></StyledButton>
                                        <span style={{ width: '2rem', textAlign: 'center', fontSize: '0.875rem' }}>{item.quantidade}</span>
                                        <StyledButton variant="ghost" onClick={() => updateQuantity(item.cartId, item.quantidade + 1)} style={{ padding: '0.5rem' }}><PlusIcon style={{width: '1rem', height: '1rem'}}/></StyledButton>
                                    </div>
                                    <span style={{ fontWeight: 600, width: '5rem', textAlign: 'right' }}>R$ {(item.preco * item.quantidade).toFixed(2)}</span>
                                </div>
                            ))}
                        </div>
                        <div style={{ padding: '1rem', borderTop: '1px solid #E5E7EB' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1.125rem', marginBottom: '1rem' }}>
                                <span>Total:</span>
                                <span>R$ {cartTotal.toFixed(2)}</span>
                            </div>
                            <StyledButton onClick={() => setIsCheckout(true)} disabled={!isOpen} title={!isOpen ? 'Loja fechada' : ''} style={{ width: '100%', padding: '0.75rem', fontSize: '1rem' }}>Finalizar Pedido</StyledButton>
                        </div>
                    </>
                )}
            </div>
            {isCheckout && <CheckoutModal isOpen={isCheckout} onClose={() => setIsCheckout(false)} cartItems={cartItems} total={cartTotal} clearCart={clearCart} />}
        </>
    );
};

export default CartSidebar;
