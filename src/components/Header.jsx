import React from 'react';
import { Link } from 'react-router-dom'; // Importa o Link
import { useCart } from '../contexts/CartContext';
import styles from '../styles';
import { PizzaIcon, ShoppingCartIcon, UserCogIcon } from './Icons';

const Header = () => { // A prop setView foi removida daqui
    const { isCartOpen, setIsCartOpen, cartItemCount } = useCart();
    return (
        <header style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(10px)', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', position: 'sticky', top: 0, zIndex: 40, width: '100%' }}>
            <div style={styles.container}>
                <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <PizzaIcon style={{ height: '2.5rem', width: '2.5rem', color: '#EA580C' }} />
                        <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1F2937', letterSpacing: '-0.025em' }}>La Brasa Pizzaria</h1>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Link to="/adm" title="Acesso Administrativo" style={{ padding: '0.5rem', borderRadius: '9999px', background: 'transparent', border: 'none', cursor: 'pointer' }}>
                            <UserCogIcon style={{ height: '1.5rem', width: '1.5rem', color: '#4B5563' }} />
                        </Link>
                        <button onClick={() => setIsCartOpen(!isCartOpen)} style={{ position: 'relative', padding: '0.5rem', borderRadius: '9999px', background: 'transparent', border: 'none', cursor: 'pointer' }}>
                            <ShoppingCartIcon style={{ height: '1.5rem', width: '1.5rem', color: '#374151' }} />
                            {cartItemCount > 0 && (
                                <span style={{ position: 'absolute', top: '-0.25rem', right: '-0.25rem', display: 'flex', height: '1.25rem', width: '1.25rem', alignItems: 'center', justifyContent: 'center', borderRadius: '9999px', backgroundColor: '#EA580C', fontSize: '0.75rem', color: 'white' }}>
                                    {cartItemCount}
                                </span>
                            )}
                        </button>
                    </div>
                </nav>
            </div>
        </header>
    );
};

export default Header;
