import React, { useState } from 'react';
import styles from '../styles';
import StyledButton from './StyledButton';

const PedidoManager = () => {
    
    return (
        <div style={styles.card}>
            <div style={{...styles.input, padding: '1.5rem', border: 'none', height: 'auto', flexDirection: 'column'}}>
                <h3 style={{fontSize: '1.125rem', fontWeight: 500, color: 'black'}}>Gerenciar status dos pedidos</h3>
            </div>
            <div style={{justifyContent: 'center', height: '100vh', borderTop: '1px solid #E5E7EB', padding: '1.5rem', display: 'flex', flexDirection: 'row', gap: '1.5rem'}}>


                <div style={{backgroundColor: '#d4652f', height: '100%', width: '30%', display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
                    <div style={{backgroundColor: '#0000003f', width: '100%', height: "10%", display: 'flex', justifyContent: "center", alignItems: "center"}}><h3>Em análise</h3></div>
                </div>
                <div style={{backgroundColor: '#e8a234', height: '100%', width: '30%',  display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
                    <div style={{backgroundColor: '#0000003f', width: '100%', height: "10%", display: 'flex', justifyContent: "center", alignItems: "center"}}><h3>Em produção</h3></div>
                </div>
                <div style={{backgroundColor: '#5ab44f', height: '100%', width: '30%',  display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
                    <div style={{backgroundColor: '#0000003f', width: '100%', height: "10%", display: 'flex', justifyContent: "center", alignItems: "center"}}><h3>Pronto para entrega</h3></div>
                </div>

            </div>
        </div>
    );
};

export default PedidoManager;
