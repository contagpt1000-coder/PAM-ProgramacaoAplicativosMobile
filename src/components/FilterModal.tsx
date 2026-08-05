import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Modal, Portal, Button, Chip, TextInput } from 'react-native-paper';
import { COLORS } from '../constants/colors';

interface FilterModalProps {
  visible: boolean;
  currentStatus: string;
  currentDate: string;
  onDismiss: () => void;
  onApplyFilters: (status: string, date: string) => void;
}

export const FilterModal: React.FC<FilterModalProps> = ({
  visible,
  currentStatus,
  currentDate,
  onDismiss,
  onApplyFilters,
}) => {
  const [selectedStatus, setSelectedStatus] = useState<string>(currentStatus);
  const [selectedDate, setSelectedDate] = useState<string>(currentDate);

  const handleApply = () => {
    onApplyFilters(selectedStatus, selectedDate);
    onDismiss();
  };

  const handleReset = () => {
    setSelectedStatus('todos');
    setSelectedDate('');
    onApplyFilters('todos', '');
    onDismiss();
  };

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={styles.container}
      >
        <Text style={styles.title} accessibilityRole="header">FILTRAR AGENDAMENTOS</Text>

        <Text style={styles.sectionLabel}>STATUS</Text>
        <View style={styles.chipRow}>
          {['todos', 'agendado', 'concluido', 'cancelado'].map((status) => {
            const isSelected = selectedStatus === status;
            return (
              <Chip
                key={status}
                selected={isSelected}
                onPress={() => setSelectedStatus(status)}
                style={[
                  styles.chip,
                  isSelected && { backgroundColor: COLORS.primary },
                ]}
                textStyle={{
                  color: isSelected ? COLORS.background : COLORS.textPrimary,
                  fontWeight: '700',
                  fontSize: 12,
                }}
                accessibilityRole="button"
                accessibilityLabel={`Filtro status ${status}`}
              >
                {status.toUpperCase()}
              </Chip>
            );
          })}
        </View>

        <Text style={styles.sectionLabel}>FILTRAR POR DATA (AAAA-MM-DD)</Text>
        <TextInput
          mode="outlined"
          placeholder="Ex: 2026-08-10"
          placeholderTextColor={COLORS.textSecondary}
          value={selectedDate}
          onChangeText={setSelectedDate}
          keyboardType="numeric"
          maxLength={10}
          textColor={COLORS.textPrimary}
          outlineColor={COLORS.cardBorder}
          activeOutlineColor={COLORS.primary}
          style={styles.input}
          accessibilityLabel="Campo de filtro por data em formato ano mês dia"
        />

        <View style={styles.buttonRow}>
          <Button
            mode="outlined"
            onPress={handleReset}
            textColor={COLORS.textSecondary}
            style={styles.button}
            accessibilityLabel="Limpar todos os filtros"
          >
            LIMPAR
          </Button>
          <Button
            mode="contained"
            onPress={handleApply}
            buttonColor={COLORS.primary}
            textColor={COLORS.background}
            style={styles.button}
            accessibilityLabel="Aplicar filtros selecionados"
          >
            APLICAR
          </Button>
        </View>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.cardBackground,
    padding: 20,
    margin: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.primary,
    letterSpacing: 1.5,
    marginBottom: 16,
    textAlign: 'center',
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textSecondary,
    marginBottom: 8,
    marginTop: 8,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  chip: {
    backgroundColor: COLORS.cardBorder,
  },
  input: {
    backgroundColor: COLORS.background,
    marginBottom: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  button: {
    flex: 1,
    minHeight: 44,
    justifyContent: 'center',
    borderRadius: 8,
  },
});
