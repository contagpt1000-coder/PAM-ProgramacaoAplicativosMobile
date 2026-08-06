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
      // 1. Inject Google Fonts ('Cinzel' & 'Plus Jakarta Sans')
      const fontLinkId = 'google-font-barberflow-premium';
      if (!document.getElementById(fontLinkId)) {
        const link = document.createElement('link');
        link.id = fontLinkId;
        link.rel = 'stylesheet';
        link.href = 'https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;800;900&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap';
        document.head.appendChild(link);
      }

      // 2. Inject Vector Icons Font-Face
      const iconStyleId = 'expo-vector-icons-fontface';
      if (!document.getElementById(iconStyleId)) {
        const iconStyle = document.createElement('style');
        iconStyle.id = iconStyleId;
        iconStyle.innerHTML = `
          @font-face {
            font-family: 'MaterialCommunityIcons';
            src: url('https://cdn.jsdelivr.net/npm/@expo/vector-icons@14.0.0/build/vendor/react-native-vector-icons/Fonts/MaterialCommunityIcons.ttf') format('truetype');
          }
          @font-face {
            font-family: 'Material Icons';
            src: url('https://cdn.jsdelivr.net/npm/@expo/vector-icons@14.0.0/build/vendor/react-native-vector-icons/Fonts/MaterialIcons.ttf') format('truetype');
          }
        `;
        document.head.appendChild(iconStyle);
      }

      // 3. Inject Rich Dark Gold Radial Gradient Background & Hover Animations CSS Engine
      const styleId = 'web-scroll-fix';
      let style = document.getElementById(styleId) as HTMLStyleElement;
      if (!style) {
        style = document.createElement('style');
        style.id = styleId;
        document.head.appendChild(style);
      }
      style.innerHTML = `
        :root {
          --bg-dark: #0a0a0d;
          --bg-card: rgba(18, 18, 24, 0.88);
          --border-gold: rgba(212, 175, 55, 0.28);
          --border-gold-bright: rgba(245, 158, 11, 0.65);
          --gold-primary: #f59e0b;
        }

        * {
          font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
          box-sizing: border-box !important;
        }

        /* 100% VISIBLE RICH DARK GOLD RADIAL GRADIENT BACKGROUND */
        html, body {
          height: 100% !important;
          width: 100% !important;
          overflow-y: auto !important;
          overflow-x: hidden !important;
          margin: 0 !important;
          padding: 0 !important;
          background-color: #0a0a0d !important;
          background-image: 
            radial-gradient(circle at 50% 0%, rgba(245, 158, 11, 0.22) 0%, transparent 65%),
            radial-gradient(circle at 100% 100%, rgba(212, 175, 55, 0.15) 0%, transparent 45%),
            radial-gradient(circle at 0% 50%, rgba(245, 158, 11, 0.12) 0%, transparent 50%) !important;
          background-attachment: fixed !important;
        }

        /* Force transparent containers so the body radial gradient is 100% visible */
        #root,
        #root > div,
        #root > div > div,
        div[class*="r-backgroundColor"] {
          background-color: transparent !important;
        }

        /* Re-apply dark glass background ONLY on cards and inputs */
        div[class*="r-borderRadius"] {
          background-color: rgba(18, 18, 24, 0.92) !important;
          backdrop-filter: blur(12px) !important;
        }

        /* Native Browser Scrollbar */
        ::-webkit-scrollbar {
          width: 12px !important;
        }
        ::-webkit-scrollbar-track {
          background: #0a0a0d !important;
        }
        ::-webkit-scrollbar-thumb {
          background: #d97706 !important;
          border-radius: 6px !important;
          border: 2px solid #0a0a0d !important;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #fbbf24 !important;
        }

        /* HOVER MICRO-ANIMATION & BRIGHT GOLD BORDER GLOW */
        div[role="button"],
        button,
        div[class*="r-borderRadius"] {
          transition: transform 0.28s cubic-bezier(0.4, 0, 0.2, 1), 
                      border-color 0.28s cubic-bezier(0.4, 0, 0.2, 1), 
                      box-shadow 0.28s cubic-bezier(0.4, 0, 0.2, 1), 
                      background-color 0.28s cubic-bezier(0.4, 0, 0.2, 1) !important;
        }

        div[role="button"]:hover,
        button:hover,
        div[class*="r-borderRadius"]:hover {
          transform: translateY(-4px) scale(1.008) !important;
          border-color: #f59e0b !important;
          box-shadow: 0 14px 32px rgba(245, 158, 11, 0.35), inset 0 0 15px rgba(251, 191, 36, 0.15) !important;
          background-color: #181824 !important;
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
