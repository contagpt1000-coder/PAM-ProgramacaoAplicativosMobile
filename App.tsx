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
        /* Native browser scrolling exactly like port 3000 */
        html, body {
          height: 100% !important;
          width: 100% !important;
          overflow-y: auto !important;
          overflow-x: hidden !important;
          margin: 0 !important;
          padding: 0 !important;
          background-color: ${COLORS.background} !important;
        }

        /* Target ONLY top-level React Navigation stack containers */
        #root,
        #root > div,
        #root > div > div {
          min-height: 100% !important;
          height: auto !important;
          width: 100% !important;
          position: relative !important;
          overflow: visible !important;
          background-color: ${COLORS.background} !important;
        }

        /* Standard native browser scrollbar like port 3000 */
        ::-webkit-scrollbar {
          width: 12px !important;
        }
        ::-webkit-scrollbar-track {
          background: #121215 !important;
        }
        ::-webkit-scrollbar-thumb {
          background: #3f3f46 !important;
          border-radius: 6px !important;
          border: 2px solid #121215 !important;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #71717a !important;
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
