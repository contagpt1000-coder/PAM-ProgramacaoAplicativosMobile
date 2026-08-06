import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '../constants/colors';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  title = 'BARBERFLOW',
  subtitle = 'Barbearia & Estética Masculina',
  showBackButton = false,
  onBackPress,
}) => {
  const insets = useSafeAreaInsets();
  const paddingTop = Platform.OS === 'web' ? 20 : Math.max(insets.top + 8, 20);

  return (
    <View
      style={[styles.container, { paddingTop }]}
      accessibilityRole="header"
    >
      <View style={styles.leftSection}>
        {showBackButton && onBackPress ? (
          <TouchableOpacity
            style={styles.backButton}
            onPress={onBackPress}
            accessibilityRole="button"
            accessibilityLabel="Voltar para a página anterior"
            activeOpacity={0.7}
          >
            <Text style={styles.backButtonIcon}>←</Text>
            <Text style={styles.backButtonText}>VOLTAR</Text>
          </TouchableOpacity>
        ) : null}

        <View style={styles.brandIconContainer}>
          <Text style={styles.brandIconSymbol}>✂</Text>
        </View>

        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>{title}</Text>
          <Text style={styles.subtitleText}>{subtitle}</Text>
        </View>
      </View>

      <View style={styles.statusBadge}>
        <View style={styles.statusDot} />
        <Text style={styles.statusBadgeText}>PREMIUM</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(18, 18, 24, 0.95)',
    paddingHorizontal: 24,
    paddingBottom: 18,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.cardBorder,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
    width: '100%',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    flex: 1,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.cardBorderBright,
  },
  backButtonIcon: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '800',
  },
  backButtonText: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  brandIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6,
  },
  brandIconSymbol: {
    fontSize: 22,
    color: COLORS.background,
    fontWeight: '900',
  },
  titleContainer: {
    justifyContent: 'center',
  },
  titleText: {
    fontFamily: 'Cinzel, serif',
    fontSize: 22,
    fontWeight: '900',
    color: COLORS.primary,
    letterSpacing: 1.5,
  },
  subtitleText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
    fontWeight: '500',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(18, 18, 24, 0.8)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: COLORS.cardBorderBright,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.statusConcluido,
  },
  statusBadgeText: {
    color: COLORS.primaryLight,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
  },
});
