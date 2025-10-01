import React, { useState } from 'react';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen/index.tsx';
import { ThemeProvider } from '../theme/useTheme';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('login'); // 'login' ou 'home'
  const [user, setUser] = useState(null);

  const handleLogin = (userData) => {
    setUser(userData);
    setCurrentScreen('home');
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentScreen('login');
  };

  return (
    <ThemeProvider>
      {currentScreen === 'login' ? (
        <LoginScreen onLogin={handleLogin} />
      ) : (
        <HomeScreen user={user} onLogout={handleLogout} />
      )}
    </ThemeProvider>
  );
}