import React, { useEffect } from 'react';
import { Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { MD3DarkTheme, PaperProvider } from 'react-native-paper';
import { Routes } from './src/routes';
import { COLORS } from './src/constants/colors';

const theme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: COLORS.primary,
    background: COLORS.background,
    surface: COLORS.cardBackground,
    error: COLORS.error,
  },
};

export default function App() {
  useEffect(() => {
    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      const styleId = 'web-scroll-fix';
      let style = document.getElementById(styleId) as HTMLStyleElement;
      if (!style) {
        style = document.createElement('style');
        style.id = styleId;
        document.head.appendChild(style);
      }
      style.innerHTML = `
        html, body, #root, #root > div, [data-reactroot] {
          min-height: 100vh !important;
          height: auto !important;
          overflow-y: auto !important;
          overflow-x: hidden !important;
          margin: 0 !important;
          padding: 0 !important;
          background-color: ${COLORS.background} !important;
        }
        
        /* Custom Gold Scrollbar */
        ::-webkit-scrollbar {
          width: 12px !important;
          display: block !important;
        }
        ::-webkit-scrollbar-track {
          background: #121215 !important;
        }
        ::-webkit-scrollbar-thumb {
          background: #d97706 !important;
          border-radius: 6px !important;
          border: 2px solid #121215 !important;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #fbbf24 !important;
        }
      `;
    }
  }, []);

  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <StatusBar style="light" backgroundColor={COLORS.cardBackground} />
        <Routes />
      </PaperProvider>
    </SafeAreaProvider>
  );
}
