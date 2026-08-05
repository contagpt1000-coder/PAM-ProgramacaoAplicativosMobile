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
      // Load Google Font 'Outfit'
      const fontLinkId = 'google-font-outfit';
      if (!document.getElementById(fontLinkId)) {
        const link = document.createElement('link');
        link.id = fontLinkId;
        link.rel = 'stylesheet';
        link.href = 'https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&family=Space+Grotesk:wght@700&display=swap';
        document.head.appendChild(link);
      }

      // Inject Global Dark Gold Glassmorphism CSS
      const styleId = 'web-scroll-fix';
      let style = document.getElementById(styleId) as HTMLStyleElement;
      if (!style) {
        style = document.createElement('style');
        style.id = styleId;
        document.head.appendChild(style);
      }
      style.innerHTML = `
        * {
          font-family: 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
          box-sizing: border-box !important;
        }

        /* Native browser scrolling exactly like port 3000 */
        html, body {
          height: 100% !important;
          width: 100% !important;
          overflow-y: auto !important;
          overflow-x: hidden !important;
          margin: 0 !important;
          padding: 0 !important;
          background-color: #0c0c0e !important;
          background-image: radial-gradient(circle at 50% 0%, rgba(245, 158, 11, 0.08) 0%, rgba(12, 12, 14, 0.95) 70%) !important;
          background-attachment: fixed !important;
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
          background-color: transparent !important;
        }

        /* Standard native browser scrollbar */
        ::-webkit-scrollbar {
          width: 12px !important;
        }
        ::-webkit-scrollbar-track {
          background: #09090b !important;
        }
        ::-webkit-scrollbar-thumb {
          background: #d97706 !important;
          border-radius: 6px !important;
          border: 2px solid #09090b !important;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #fbbf24 !important;
        }

        /* Glassmorphism Cards & Micro-animations */
        div[class*="r-borderRadius"], 
        div[class*="r-backgroundColor"] {
          transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.25s cubic-bezier(0.4, 0, 0.2, 1), border-color 0.25s cubic-bezier(0.4, 0, 0.2, 1) !important;
        }

        /* Interactive Hover Glows on clickable cards */
        div[role="button"]:hover,
        button:hover {
          transform: translateY(-2px) !important;
          box-shadow: 0 10px 25px -5px rgba(245, 158, 11, 0.25), 0 8px 10px -6px rgba(245, 158, 11, 0.2) !important;
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
