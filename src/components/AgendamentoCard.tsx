import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Card, Chip } from 'react-native-paper';
import { AgendamentoComDetalhes, StatusAgendamento } from '../types';
import { COLORS } from '../constants/colors';
import { formatCurrency, formatDateBR } from '../utils/formatters';

interface AgendamentoCardProps {
  agendamento: AgendamentoComDetalhes;
  onPress: (id: string) => void;
  onStatusChange?: (id: string, newStatus: StatusAgendamento) => void;
}

export const AgendamentoCard: React.FC<AgendamentoCardProps> = ({
  agendamento,
  onPress,
  onStatusChange,
}) => {
  const getStatusColor = (status: StatusAgendamento) => {
    switch (status) {
      case 'agendado':
        return COLORS.statusAgendado;
      case 'concluido':
        return COLORS.statusConcluido;
      case 'cancelado':
        return COLORS.statusCancelado;
      default:
        return COLORS.textSecondary;
    }
  };

  const getStatusLabel = (status: StatusAgendamento) => {
    switch (status) {
      case 'agendado':
        return 'AGENDADO';
      case 'concluido':
        return 'CONCLUÍDO';
      case 'cancelado':
        return 'CANCELADO';
      default:
        return status.toUpperCase();
    }
  };

  const statusColor = getStatusColor(agendamento.status);

  return (
    <Card
      style={styles.card}
      elevation={2}
      onPress={() => onPress(agendamento.id)}
      accessibilityRole="button"
      accessibilityLabel={`Agendamento de ${agendamento.clienteNome}, status ${agendamento.status}`}
    >
      <Card.Content>
        <View style={styles.headerRow}>
          <View style={styles.clientInfo}>
            <Text style={styles.clientName}>{agendamento.clienteNome}</Text>
            <Text style={styles.clientPhone}>{agendamento.clienteTelefone}</Text>
          </View>
          <Chip
            style={[styles.chip, { backgroundColor: statusColor + '20', borderColor: statusColor }]}
            textStyle={{ color: statusColor, fontSize: 10, fontWeight: '700' }}
            compact
          >
            {getStatusLabel(agendamento.status)}
          </Chip>
        </View>

        <View style={styles.divider} />

        <View style={styles.detailsRow}>
          <View style={styles.detailColumn}>
            <Text style={styles.label}>SERVIÇO</Text>
            <Text style={styles.value}>{agendamento.servico?.nome || 'Serviço não informado'}</Text>
          </View>
          <View style={styles.detailColumnRight}>
            <Text style={styles.label}>VALOR</Text>
            <Text style={styles.priceValue}>
              {agendamento.servico ? formatCurrency(agendamento.servico.preco) : 'R$ 0,00'}
            </Text>
          </View>
        </View>

        <View style={styles.detailsRow}>
          <View style={styles.detailColumn}>
            <Text style={styles.label}>BARBEIRO</Text>
            <Text style={styles.valueSecondary}>{agendamento.profissional?.nome || 'Profissional não informado'}</Text>
          </View>
          <View style={styles.detailColumnRight}>
            <Text style={styles.label}>DATA & HORA</Text>
            <Text style={styles.valueSecondary}>
              {formatDateBR(agendamento.data)} às {agendamento.hora}
            </Text>
          </View>
        </View>

        {agendamento.status === 'agendado' && onStatusChange && (
          <View style={styles.quickActions}>
            <TouchableOpacity
              style={[styles.quickButton, styles.quickButtonConcluir]}
              onPress={(e) => {
                e.stopPropagation();
                onStatusChange(agendamento.id, 'concluido');
              }}
              accessibilityRole="button"
              accessibilityLabel="Marcar agendamento como concluído"
              activeOpacity={0.7}
            >
              <Text style={styles.quickButtonText}>Concluir</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.quickButton, styles.quickButtonCancelar]}
              onPress={(e) => {
                e.stopPropagation();
                onStatusChange(agendamento.id, 'cancelado');
              }}
              accessibilityRole="button"
              accessibilityLabel="Cancelar agendamento"
              activeOpacity={0.7}
            >
              <Text style={styles.quickButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        )}
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.cardBackground,
    marginBottom: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  clientInfo: {
    flex: 1,
    marginRight: 8,
  },
  clientName: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  clientPhone: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  chip: {
    borderWidth: 1,
    height: 26,
    justifyContent: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.cardBorder,
    marginVertical: 10,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailColumn: {
    flex: 1,
  },
  detailColumnRight: {
    alignItems: 'flex-end',
  },
  label: {
    fontSize: 10,
    fontWeight: '600',
    color: COLORS.textSecondary,
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  value: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
  },
  priceValue: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.primary,
  },
  valueSecondary: {
    fontSize: 12,
    color: COLORS.textPrimary,
  },
  quickActions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.cardBorder,
  },
  quickButton: {
    flex: 1,
    minHeight: 44, // WCAG 2.5.5 touch target size (44pt)
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  quickButtonConcluir: {
    backgroundColor: COLORS.statusConcluido + '30',
    borderWidth: 1,
    borderColor: COLORS.statusConcluido,
  },
  quickButtonCancelar: {
    backgroundColor: COLORS.statusCancelado + '30',
    borderWidth: 1,
    borderColor: COLORS.statusCancelado,
  },
  quickButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
});
