import React from 'react';
import { useTheme } from '../../../theme/useTheme';

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
      backgroundColor: theme.colors.primary,
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
          zIndex: 10
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
          backgroundColor: theme.colors.background,
          padding: '40px',
          borderRadius: '12px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
          width: '100%',
          maxWidth: '400px',
          position: 'relative',
          zIndex: 2
        }}
      >
        <h1 style={{ 
          textAlign: 'center', 
          marginBottom: '30px',
          color: theme.colors.text,
          fontSize: '28px'
        }}>
          🎯 FizTarefa
        </h1>
        
        <p style={{ 
          textAlign: 'center', 
          marginBottom: '30px',
          color: isDark ? '#ccc' : '#666',
          fontSize: '16px'
        }}>
          Entre para gerenciar suas tarefas
        </p>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '8px', 
            fontWeight: '600',
            color: theme.colors.text
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
              border: `2px solid ${isDark ? '#444' : '#e1e5e9'}`,
              borderRadius: '8px',
              fontSize: '16px',
              transition: 'border-color 0.3s',
              outline: 'none',
              backgroundColor: theme.colors.background,
              color: theme.colors.text
            }}
            onFocus={(e) => e.target.style.borderColor = theme.colors.secondary}
            onBlur={(e) => e.target.style.borderColor = isDark ? '#444' : '#e1e5e9'}
          />
        </div>
        
        <div style={{ marginBottom: '30px' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '8px', 
            fontWeight: '600',
            color: theme.colors.text
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
              border: `2px solid ${isDark ? '#444' : '#e1e5e9'}`,
              borderRadius: '8px',
              fontSize: '16px',
              transition: 'border-color 0.3s',
              outline: 'none',
              backgroundColor: theme.colors.background,
              color: theme.colors.text
            }}
            onFocus={(e) => e.target.style.borderColor = theme.colors.secondary}
            onBlur={(e) => e.target.style.borderColor = isDark ? '#444' : '#e1e5e9'}
          />
        </div>
        
        <button 
          type="submit"
          disabled={isLoading}
          style={{
            width: '100%',
            padding: '16px',
            backgroundColor: isLoading ? '#ccc' : theme.colors.secondary,
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s ease',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
          onMouseOver={(e) => {
            if (!isLoading) {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 4px 12px rgba(43, 127, 255, 0.3)';
            }
          }}
          onMouseOut={(e) => {
            if (!isLoading) {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = 'none';
            }
          }}
        >
          {isLoading ? (
            <>
              <div style={{
                width: '16px',
                height: '16px',
                border: '2px solid #ffffff',
                borderTop: '2px solid transparent',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }} />
              Entrando...
            </>
          ) : (
            'Entrar'
          )}
        </button>
        
        <p style={{ 
          textAlign: 'center', 
          fontSize: '14px', 
          color: isDark ? '#ccc' : '#666'
        }}>
          Não tem uma conta?{' '}
          <a 
            href="#" 
            style={{ 
              color: theme.colors.secondary, 
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