import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
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

  return (
    <View
      style={[styles.container, { paddingTop: Math.max(insets.top + 8, 16) }]}
      accessibilityRole="header"
    >
      {showBackButton && onBackPress ? (
        <TouchableOpacity
          style={styles.backButton}
          onPress={onBackPress}
          accessibilityRole="button"
          accessibilityLabel="Voltar para a página anterior"
          activeOpacity={0.7}
        >
          <Text style={styles.backButtonText}>← VOLTAR</Text>
        </TouchableOpacity>
      ) : null}

      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>

      <View style={styles.badge}>
        <Text style={styles.badgeText}>PREMIUM</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.cardBackground,
    paddingHorizontal: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.cardBorder,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  backButton: {
    backgroundColor: COLORS.cardBorder,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.primary,
    minHeight: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.primary,
    letterSpacing: 1.5,
  },
  subtitle: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  badge: {
    backgroundColor: COLORS.cardBorder,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  badgeText: {
    color: COLORS.primary,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
  },
});
