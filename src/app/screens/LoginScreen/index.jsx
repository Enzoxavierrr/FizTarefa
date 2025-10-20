import React from 'react';
import { useTheme } from '../../../theme/useTheme';
import EncryptButton from '../../components/EncryptButton';

export default function LoginScreen({ onLogin }) {
  const { theme, isDark, toggleTheme } = useTheme();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      alert('Por favor, preencha todos os campos!');
      return;
    }

    setIsLoading(true);
    
    // Simular chamada de API (remova isso quando integrar com backend real)
    setTimeout(() => {
      console.log('Login attempt:', { email, password });
      
      // Simular login bem-sucedido
      const userData = {
        name: email.split('@')[0], // Usar parte do email como nome
        email: email,
        id: Math.random().toString(36).substr(2, 9)
      };
      
      setIsLoading(false);
      onLogin(userData); // Chamar função para navegar para a tela Home
    }, 1500); // Simular delay de rede
  };

  return (
    <div style={{ 
      background: 'linear-gradient(135deg, #1e293b 0%, #475569 50%, #6366f1 100%)',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      position: 'relative'
    }}>
      <button
        onClick={toggleTheme}
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          background: 'rgba(255, 255, 255, 0.2)',
          border: 'none',
          borderRadius: '50%',
          width: '50px',
          height: '50px',
          fontSize: '24px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backdropFilter: 'blur(10px)',
          transition: 'all 0.3s ease',
          zIndex: 20
        }}
        onMouseOver={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.3)'}
        onMouseOut={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.2)'}
        title={isDark ? 'Modo Claro' : 'Modo Escuro'}
      >
        {isDark ? '☀️' : '🌙'}
      </button>

      <form 
        onSubmit={handleSubmit}
        style={{
          backgroundColor: 'rgba(30, 41, 59, 0.95)',
          padding: '40px',
          borderRadius: '12px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
          width: '400px',
          maxWidth: '90vw',
          position: 'relative',
          zIndex: 2,
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}
      >
      
        <h1 style={{ 
          textAlign: 'center', 
          marginBottom: '30px',
          color: 'white', // Sempre branco para contraste
          fontSize: '28px',
          textShadow: '0 2px 4px rgba(0,0,0,0.5)'
        }}>
          🎯 FizTarefa
        </h1>
        
        <p style={{ 
          textAlign: 'center', 
          marginBottom: '30px',
          color: 'rgba(255, 255, 255, 0.8)', // Branco semi-transparente
          fontSize: '16px',
          textShadow: '0 1px 2px rgba(0,0,0,0.5)'
        }}>
          Entre para gerenciar suas tarefas
        </p>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '8px', 
            fontWeight: '600',
            color: 'white' // Sempre branco para contraste
          }}>
            Email
          </label>
          <input 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="seu@email.com"
            required
            style={{
              width: '100%',
              padding: '14px',
              border: '2px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '8px',
              fontSize: '16px',
              transition: 'border-color 0.3s',
              outline: 'none',
              backgroundColor: 'rgba(30, 41, 59, 0.8)',
              color: 'white'
            }}
            onFocus={(e) => e.target.style.borderColor = '#6366f1'}
            onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)'}
          />
        </div>
        
        <div style={{ marginBottom: '30px' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '8px', 
            fontWeight: '600',
            color: 'white'
          }}>
            Senha
          </label>
          <input 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            style={{
              width: '100%',
              padding: '14px',
              border: '2px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '8px',
              fontSize: '16px',
              transition: 'border-color 0.3s',
              outline: 'none',
              backgroundColor: 'rgba(30, 41, 59, 0.8)',
              color: 'white'
            }}
            onFocus={(e) => e.target.style.borderColor = '#6366f1'}
            onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)'}
          />
        </div>
        
        <div style={{ marginBottom: '20px' }}>
          <EncryptButton
            type="submit"
            disabled={isLoading}
            style={{
              backgroundColor: isLoading ? '#ccc' : '#6366f1',
              borderColor: isLoading ? '#ccc' : '#6366f1',
            }}
          >
            {isLoading ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  width: '16px',
                  height: '16px',
                  border: '2px solid #ffffff',
                  borderTop: '2px solid transparent',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }} />
                Entrando...
              </div>
            ) : (
              'Entrar'
            )}
          </EncryptButton>
        </div>
        
        <p style={{ 
          textAlign: 'center', 
          fontSize: '14px', 
          color: 'rgba(255, 255, 255, 0.7)'
        }}>
          Não tem uma conta?{' '}
          <a 
            href="#" 
            style={{ 
              color: '#6366f1', 
              textDecoration: 'none',
              fontWeight: '600'
            }}
            onClick={(e) => {
              e.preventDefault();
              alert('Funcionalidade de cadastro em desenvolvimento!');
            }}
          >
            Cadastre-se
          </a>
        </p>
      </form>
    </div>
  );
}