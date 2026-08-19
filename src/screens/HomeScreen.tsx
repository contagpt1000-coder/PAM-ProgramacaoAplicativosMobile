import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  TextInput,
  Alert,
  Platform,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import { Header } from '../components/Header';
import { AgendamentoCard } from '../components/AgendamentoCard';
import { FilterModal } from '../components/FilterModal';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { agendamentoService } from '../services/agendamentoService';
import { AgendamentoComDetalhes, StatusAgendamento } from '../types';
import { COLORS } from '../constants/colors';
import { RootStackParamList } from '../routes/app.routes';

type HomeScreenProps = StackScreenProps<RootStackParamList, 'Home'>;

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const [agendamentos, setAgendamentos] = useState<AgendamentoComDetalhes[]>([]);
  const [clientesCount, setClientesCount] = useState<number>(0);
  const [servicosCount, setServicosCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('todos');
  const [dateFilter, setDateFilter] = useState<string>('');
  const [isFilterModalOpen, setIsFilterModalOpen] = useState<boolean>(false);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [agData, clData, svData] = await Promise.all([
        agendamentoService.getAgendamentos(statusFilter, dateFilter),
        agendamentoService.getClientes(),
        agendamentoService.getServicos(),
      ]);
      setAgendamentos(agData);
      setClientesCount(clData.length);
      setServicosCount(svData.length);
    } catch (error) {
      Alert.alert('Erro HTTP', 'Não foi possível carregar os agendamentos. Verifique se o json-server está rodando.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchDashboardData();
    }, [statusFilter, dateFilter])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchDashboardData();
  };

  const handleStatusChange = async (id: string, newStatus: StatusAgendamento) => {
    try {
      await agendamentoService.updateAgendamento(id, { status: newStatus });
      Alert.alert('Sucesso', `Status do agendamento alterado para ${newStatus.toUpperCase()}`);
      fetchDashboardData();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível atualizar o status.');
    }
  };

  const filteredAgendamentos = agendamentos.filter((ag) => {
    const nome = ag.cliente?.nome || ag.clienteNome || '';
    const serv = ag.servico?.nome || '';
    const prof = ag.profissional?.nome || '';
    const query = searchQuery.toLowerCase();

    return (
      nome.toLowerCase().includes(query) ||
      serv.toLowerCase().includes(query) ||
      prof.toLowerCase().includes(query)
    );
  });

  const totalCount = agendamentos.length;
  const agendadosCount = agendamentos.filter((a) => a.status === 'agendado').length;
  const concluidosCount = agendamentos.filter((a) => a.status === 'concluido').length;

  if (loading && !refreshing) {
    return <LoadingSpinner message="Buscando agendamentos no servidor..." />;
  }

  return (
    <View style={styles.container}>
      <Header />

      {/* 5 Cards de Métricas / Dashboard Resumo em Dark Gold Glassmorphism */}
      <View style={styles.metricsRow}>
        <View style={styles.metricCard}>
          <View style={styles.metricTopAccent} />
          <Text style={styles.metricLabel}>TOTAL</Text>
          <Text style={styles.metricNumber}>{totalCount}</Text>
        </View>

        <View style={styles.metricCard}>
          <View style={[styles.metricTopAccent, { backgroundColor: COLORS.statusAgendado }]} />
          <Text style={styles.metricLabel}>AGENDADOS</Text>
          <Text style={[styles.metricNumber, { color: COLORS.statusAgendado }]}>
            {agendadosCount}
          </Text>
        </View>

        <View style={styles.metricCard}>
          <View style={[styles.metricTopAccent, { backgroundColor: COLORS.statusConcluido }]} />
          <Text style={styles.metricLabel}>CONCLUÍDOS</Text>
          <Text style={[styles.metricNumber, { color: COLORS.statusConcluido }]}>
            {concluidosCount}
          </Text>
        </View>

        <View style={styles.metricCard}>
          <View style={[styles.metricTopAccent, { backgroundColor: '#38bdf8' }]} />
          <Text style={styles.metricLabel}>CLIENTES</Text>
          <Text style={[styles.metricNumber, { color: '#38bdf8' }]}>
            {clientesCount}
          </Text>
        </View>

        <View style={styles.metricCard}>
          <View style={[styles.metricTopAccent, { backgroundColor: '#a855f7' }]} />
          <Text style={styles.metricLabel}>SERVIÇOS</Text>
          <Text style={[styles.metricNumber, { color: '#c084fc' }]}>
            {servicosCount}
          </Text>
        </View>
      </View>

      {/* Busca e Filtros com Ícones Limpos */}
      <View style={styles.searchRow}>
        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            placeholder="Buscar por cliente, serviço ou barbeiro..."
            placeholderTextColor={COLORS.textSecondary}
            onChangeText={setSearchQuery}
            value={searchQuery}
            style={styles.searchInput}
            accessibilityLabel="Campo de busca de agendamentos"
          />
        </View>

        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setIsFilterModalOpen(true)}
          accessibilityRole="button"
          accessibilityLabel="Abrir modal de filtros"
          activeOpacity={0.8}
        >
          <Text style={styles.filterIcon}>🎛️</Text>
          <Text style={styles.filterButtonText}>Filtros</Text>
        </TouchableOpacity>
      </View>

      {/* Lista Principal de Agendamentos */}
      <View style={styles.listContainer}>
        {filteredAgendamentos.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📅</Text>
            <Text style={styles.emptyText}>Nenhum agendamento encontrado.</Text>
            <Text style={styles.emptySubText}>
              Clique em "+ NOVO AGENDAMENTO" para cadastrar o primeiro cliente.
            </Text>
          </View>
        ) : (
          filteredAgendamentos.map((item) => (
            <AgendamentoCard
              key={item.id}
              agendamento={item}
              onPress={(id) => navigation.navigate('DetalhesAgendamento', { id })}
              onStatusChange={handleStatusChange}
            />
          ))
        )}
      </View>

      {/* Botão Flutuante (FAB) Dourado Reluzente */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('NovoAgendamento')}
        activeOpacity={0.88}
        accessibilityRole="button"
        accessibilityLabel="Novo agendamento"
      >
        <Text style={styles.fabIcon}>+</Text>
        <Text style={styles.fabLabel}>NOVO AGENDAMENTO</Text>
      </TouchableOpacity>

      <FilterModal
        visible={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        selectedStatus={statusFilter}
        onSelectStatus={setStatusFilter}
        selectedDate={dateFilter}
        onSelectDate={setDateFilter}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    position: 'relative',
    backgroundColor: 'transparent',
    paddingBottom: 100,
  },
  metricsRow: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 14,
    gap: 12,
    flexWrap: 'wrap',
  },
  metricCard: {
    flex: 1,
    minWidth: 140,
    backgroundColor: 'rgba(18, 18, 24, 0.9)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    position: 'relative',
    overflow: 'hidden',
  },
  metricTopAccent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: COLORS.primary,
  },
  metricLabel: {
    fontFamily: 'Cinzel, serif',
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.textSecondary,
    letterSpacing: 1.2,
  },
  metricNumber: {
    fontSize: 24,
    fontWeight: '900',
    color: COLORS.textPrimary,
    marginTop: 6,
  },
  searchRow: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    marginBottom: 16,
    gap: 12,
    alignItems: 'center',
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(18, 18, 24, 0.9)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    paddingHorizontal: 14,
    height: 48,
  },
  searchIcon: {
    fontSize: 15,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    color: COLORS.textPrimary,
    fontSize: 13,
    height: '100%',
    padding: 0,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(18, 18, 24, 0.9)',
    paddingHorizontal: 16,
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  filterIcon: {
    fontSize: 15,
  },
  filterButtonText: {
    color: COLORS.textPrimary,
    fontWeight: '700',
    fontSize: 13,
  },
  listContainer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  emptyContainer: {
    paddingVertical: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  emptySubText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 6,
    textAlign: 'center',
  },
  fab: {
    position: Platform.OS === 'web' ? ('fixed' as any) : 'absolute',
    bottom: 24,
    right: 24,
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 22,
    borderRadius: 30,
    elevation: 8,
    zIndex: 999,
  },
  fabIcon: {
    fontSize: 20,
    color: '#0a0a0d',
    fontWeight: '900',
  },
  fabLabel: {
    color: '#0a0a0d',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 1,
  },
});
