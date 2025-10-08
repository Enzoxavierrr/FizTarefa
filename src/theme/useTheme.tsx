import React, { useState, useEffect, createContext, useContext } from 'react'

interface Theme {
  colors: {
    primary: string
    secondary: string
    background: string
    text: string
  }
}

const lightTheme: Theme = {
  colors: {
    primary: '#001f90',
    secondary: '#90a8ff',
    background: '#FFFFFF',
    text: '#000000',
  },
}

const darkTheme: Theme = {
  colors: {
    primary: '#001f90',
    secondary: '#90a8ff',
    background: '#000000',
    text: '#FFFFFF',
  },
}

const ThemeContext = createContext<{
  theme: Theme
  isDark: boolean
  toggleTheme: () => void
} | undefined>(undefined)

// Hook para detectar preferência do sistema (web)
function useColorScheme(): 'light' | 'dark' {
  const [scheme, setScheme] = useState<'light' | 'dark'>('light')

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    setScheme(mediaQuery.matches ? 'dark' : 'light')

    const handler = (e: MediaQueryListEvent) => {
      setScheme(e.matches ? 'dark' : 'light')
    }

    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [])

  return scheme
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const osScheme = useColorScheme()
  const [isDark, setIsDark] = useState(osScheme === 'dark')

  useEffect(() => {
    setIsDark(osScheme === 'dark')
  }, [osScheme])

  const toggleTheme = () => {
    setIsDark(!isDark)
  }

  const theme = isDark ? darkTheme : lightTheme

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
