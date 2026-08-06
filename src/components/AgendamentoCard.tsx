import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Card } from 'react-native-paper';
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
  const getStatusStyle = (status: StatusAgendamento) => {
    switch (status) {
      case 'agendado':
        return {
          color: COLORS.statusAgendado,
          bg: 'rgba(245, 158, 11, 0.15)',
          border: 'rgba(245, 158, 11, 0.4)',
          label: 'AGENDADO',
        };
      case 'concluido':
        return {
          color: COLORS.statusConcluido,
          bg: 'rgba(16, 185, 129, 0.15)',
          border: 'rgba(16, 185, 129, 0.4)',
          label: 'CONCLUÍDO',
        };
      case 'cancelado':
        return {
          color: COLORS.statusCancelado,
          bg: 'rgba(239, 68, 68, 0.15)',
          border: 'rgba(239, 68, 68, 0.4)',
          label: 'CANCELADO',
        };
      default:
        return {
          color: COLORS.textSecondary,
          bg: 'rgba(148, 163, 184, 0.15)',
          border: 'rgba(148, 163, 184, 0.3)',
          label: String(status).toUpperCase(),
        };
    }
  };

  const statusStyle = getStatusStyle(agendamento.status);

  return (
    <TouchableOpacity
      activeOpacity={0.88}
      onPress={() => onPress(agendamento.id)}
      accessibilityRole="button"
      accessibilityLabel={`Agendamento de ${agendamento.clienteNome}, status ${agendamento.status}`}
      style={styles.touchableWrapper}
    >
      <Card style={styles.card}>
        {/* Top Metallic Gold Accent Line */}
        <View style={styles.metallicTopAccent} />

        <Card.Content style={styles.cardContent}>
          <View style={styles.headerRow}>
            <View style={styles.clientInfo}>
              <View style={styles.clientTitleRow}>
                <Text style={styles.idTag}>#{agendamento.id}</Text>
                <Text style={styles.clientName}>{agendamento.clienteNome}</Text>
              </View>
              <Text style={styles.clientPhone}>{agendamento.clienteTelefone}</Text>
            </View>

            <View
              style={[
                styles.statusBadge,
                {
                  backgroundColor: statusStyle.bg,
                  borderColor: statusStyle.border,
                },
              ]}
            >
              <Text style={[styles.statusBadgeText, { color: statusStyle.color }]}>
                {statusStyle.label}
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.detailsRow}>
            <View style={styles.detailColumn}>
              <Text style={styles.label}>SERVIÇO</Text>
              <Text style={styles.valueService}>
                {agendamento.servico?.nome || 'Serviço não informado'}
              </Text>
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
              <Text style={styles.valueSecondary}>
                {agendamento.profissional?.nome || 'Profissional não informado'}
              </Text>
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
                activeOpacity={0.75}
              >
                <Text style={[styles.quickButtonText, { color: COLORS.statusConcluido }]}>
                  ✓ CONCLUIR
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.quickButton, styles.quickButtonCancelar]}
                onPress={(e) => {
                  e.stopPropagation();
                  onStatusChange(agendamento.id, 'cancelado');
                }}
                accessibilityRole="button"
                accessibilityLabel="Cancelar agendamento"
                activeOpacity={0.75}
              >
                <Text style={[styles.quickButtonText, { color: COLORS.statusCancelado }]}>
                  ✕ CANCELAR
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  touchableWrapper: {
    marginBottom: 14,
    width: '100%',
  },
  card: {
    backgroundColor: 'rgba(18, 18, 24, 0.9)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    overflow: 'hidden',
  },
  metallicTopAccent: {
    height: 3,
    width: '100%',
    backgroundColor: COLORS.primary,
  },
  cardContent: {
    padding: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  clientInfo: {
    flex: 1,
    marginRight: 10,
  },
  clientTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  idTag: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.primary,
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
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    marginVertical: 12,
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
    fontWeight: '800',
    color: COLORS.textSecondary,
    letterSpacing: 1,
    marginBottom: 2,
  },
  valueService: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.primary,
  },
  priceValue: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.primary,
  },
  valueSecondary: {
    fontSize: 13,
    color: COLORS.textPrimary,
    fontWeight: '500',
  },
  quickActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.06)',
  },
  quickButton: {
    flex: 1,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
  },
  quickButtonConcluir: {
    backgroundColor: 'rgba(16, 185, 129, 0.14)',
    borderColor: 'rgba(16, 185, 129, 0.4)',
  },
  quickButtonCancelar: {
    backgroundColor: 'rgba(239, 68, 68, 0.14)',
    borderColor: 'rgba(239, 68, 68, 0.4)',
  },
  quickButtonText: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});
