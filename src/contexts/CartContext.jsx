import React, { useState, createContext, useContext, useMemo } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [isCartOpen, setIsCartOpen] = useState(false);

    const addToCart = (item) => {
        setCartItems(prev => {
            const existing = prev.find(i => i.id === item.id);
            if (existing) { return prev.map(i => i.id === item.id ? { ...i, quantidade: i.quantidade + 1 } : i); }
            return [...prev, { ...item, quantidade: 1 }];
        });
        setIsCartOpen(true);
    };

    const updateQuantity = (itemId, newQuantity) => {
        setCartItems(prev => {
            if (newQuantity <= 0) { return prev.filter(i => i.id !== itemId); }
            return prev.map(i => i.id === itemId ? { ...i, quantidade: newQuantity } : i);
        });
    };

    const clearCart = () => {
        setCartItems([]);
        setIsCartOpen(false);
    };

    const cartTotal = useMemo(() => cartItems.reduce((total, item) => total + item.preco * item.quantidade, 0), [cartItems]);
    const cartItemCount = useMemo(() => cartItems.reduce((count, item) => count + item.quantidade, 0), [cartItems]);

    return (
        <CartContext.Provider value={{ cartItems, addToCart, updateQuantity, isCartOpen, setIsCartOpen, cartTotal, cartItemCount, clearCart }}>
            {children}
        </CartContext.Provider>
    );
};