import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // ✅ 1. IMPORTA O LINK
import { useAuth } from '../contexts/AuthContext';
import styles from '../styles';
import { API_BASE_URL } from '../config';
import StyledButton from './StyledButton';
import { PizzaIcon } from './Icons';

const AdminLogin = () => {
    const { login } = useAuth();
    const [email, setEmail] = useState('admin@pizzaria.com');
    const [senha, setSenha] = useState('admin123');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            const r = await fetch(`${API_BASE_URL}/admin/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, senha }) });
            if (!r.ok) throw new Error('Credenciais inválidas.');
            const { token } = await r.json();
            login(token);
            // O redirecionamento agora é feito pelo AdmPage.jsx ao detetar a autenticação
        } catch (err) {
            setError(err.message || 'Erro ao fazer login.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{minHeight: '100vh', backgroundColor: '#F9FAFB', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '1rem'}}>
            <div style={{width: '100%', maxWidth: '400px'}}>
                <div style={{textAlign: 'center', marginBottom: '1.5rem'}}>
                    <PizzaIcon style={{height: '3rem', width: '3rem', color: '#EA580C', margin: '0 auto'}}/>
                    <h2 style={{marginTop: '0.5rem', fontSize: '1.875rem', fontWeight: 'bold'}}>Acesso Restrito</h2>
                    <p style={{marginTop: '0.5rem', color: '#4B5563'}}>Painel de Administração La Brasa</p>
                </div>
                <div style={styles.card}>
                    <form onSubmit={handleLogin} style={{padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
                        <div><label style={styles.label} htmlFor='email'>Email</label><input style={styles.input} id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required /></div>
                        <div><label style={styles.label} htmlFor='senha'>Senha</label><input style={styles.input} id="senha" type="password" value={senha} onChange={e => setSenha(e.target.value)} required /></div>
                        {error && <p style={{color: 'red', fontSize: '0.75rem', textAlign: 'center'}}>{error}</p>}
                        <StyledButton type="submit" disabled={isLoading} style={{width: '100%', height: '2.75rem'}}>{isLoading ? 'Entrando...' : 'Entrar'}</StyledButton>
                    </form>
                </div>
                <div style={{textAlign: 'center', marginTop: '1rem'}}>
                    {/* ✅ 2. SUBSTITUI O BOTÃO PELO LINK */}
                    <Link to="/" style={{
                        ...styles.button, 
                        ...styles.buttonSecondary, 
                        textDecoration: 'none'
                    }}>
                        Voltar ao Cardápio
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
