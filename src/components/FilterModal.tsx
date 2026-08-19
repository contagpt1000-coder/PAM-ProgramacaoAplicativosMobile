import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Modal, Portal, Button, Chip, TextInput } from 'react-native-paper';
import { COLORS } from '../constants/colors';

export interface FilterModalProps {
  visible: boolean;
  onClose?: () => void;
  onDismiss?: () => void;
  selectedStatus?: string;
  currentStatus?: string;
  selectedDate?: string;
  currentDate?: string;
  onSelectStatus?: (status: string) => void;
  onSelectDate?: (date: string) => void;
  onApplyFilters?: (status: string, date: string) => void;
}

export const FilterModal: React.FC<FilterModalProps> = ({
  visible,
  onClose,
  onDismiss,
  selectedStatus: propSelectedStatus,
  currentStatus = 'todos',
  selectedDate: propSelectedDate,
  currentDate = '',
  onSelectStatus,
  onSelectDate,
  onApplyFilters,
}) => {
  const initialStatus = propSelectedStatus ?? currentStatus;
  const initialDate = propSelectedDate ?? currentDate;

  const [localStatus, setLocalStatus] = useState<string>(initialStatus);
  const [localDate, setLocalDate] = useState<string>(initialDate);

  useEffect(() => {
    setLocalStatus(initialStatus);
    setLocalDate(initialDate);
  }, [initialStatus, initialDate]);

  const handleClose = () => {
    if (onClose) onClose();
    if (onDismiss) onDismiss();
  };

  const handleApply = () => {
    if (onSelectStatus) onSelectStatus(localStatus);
    if (onSelectDate) onSelectDate(localDate);
    if (onApplyFilters) onApplyFilters(localStatus, localDate);
    handleClose();
  };

  const handleReset = () => {
    setLocalStatus('todos');
    setLocalDate('');
    if (onSelectStatus) onSelectStatus('todos');
    if (onSelectDate) onSelectDate('');
    if (onApplyFilters) onApplyFilters('todos', '');
    handleClose();
  };

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={handleClose}
        contentContainerStyle={styles.container}
      >
        <Text style={styles.title} accessibilityRole="header">FILTRAR AGENDAMENTOS</Text>

        <Text style={styles.sectionLabel}>STATUS</Text>
        <View style={styles.chipRow}>
          {['todos', 'agendado', 'concluido', 'cancelado'].map((status) => {
            const isSelected = localStatus === status;
            return (
              <Chip
                key={status}
                selected={isSelected}
                onPress={() => setLocalStatus(status)}
                style={[
                  styles.chip,
                  isSelected && { backgroundColor: COLORS.primary },
                ]}
                textStyle={{
                  color: isSelected ? '#000' : COLORS.textPrimary,
                  fontSize: 12,
                  fontWeight: '700',
                }}
              >
                {status.toUpperCase()}
              </Chip>
            );
          })}
        </View>

        <Text style={styles.sectionLabel}>DATA (AAAA-MM-DD)</Text>
        <TextInput
          mode="outlined"
          placeholder="Ex: 2026-08-19"
          value={localDate}
          onChangeText={setLocalDate}
          style={styles.dateInput}
          outlineColor={COLORS.cardBorder}
          activeOutlineColor={COLORS.primary}
          textColor={COLORS.textPrimary}
          placeholderTextColor={COLORS.textSecondary}
          accessibilityLabel="Campo para filtrar por data no formato ano, mês e dia"
        />

        <View style={styles.buttonRow}>
          <Button
            mode="outlined"
            onPress={handleReset}
            style={styles.resetButton}
            textColor={COLORS.textSecondary}
            accessibilityLabel="Limpar todos os filtros aplicados"
          >
            LIMPAR
          </Button>
          <Button
            mode="contained"
            onPress={handleApply}
            style={styles.applyButton}
            buttonColor={COLORS.primary}
            textColor="#000"
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
    margin: 20,
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.primary,
    maxWidth: 500,
    alignSelf: 'center',
    width: '90%',
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.primary,
    marginBottom: 20,
    textAlign: 'center',
    letterSpacing: 1,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textSecondary,
    marginBottom: 10,
    letterSpacing: 1,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  chip: {
    backgroundColor: COLORS.cardBorder,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  dateInput: {
    backgroundColor: COLORS.cardBackground,
    marginBottom: 24,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  resetButton: {
    borderColor: COLORS.cardBorder,
  },
  applyButton: {
    fontWeight: '700',
  },
});
