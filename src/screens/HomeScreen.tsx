import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { FAB, Searchbar } from 'react-native-paper';
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
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('todos');
  const [dateFilter, setDateFilter] = useState<string>('');
  const [isFilterModalOpen, setIsFilterModalOpen] = useState<boolean>(false);

  const fetchAgendamentos = async () => {
    try {
      setLoading(true);
      const data = await agendamentoService.getAgendamentos(statusFilter, dateFilter);
      setAgendamentos(data);
    } catch (error) {
      Alert.alert('Erro HTTP', 'Não foi possível carregar os agendamentos. Verifique se o json-server está rodando.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchAgendamentos();
    }, [statusFilter, dateFilter])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchAgendamentos();
  };

  const handleStatusChange = async (id: string, newStatus: StatusAgendamento) => {
    try {
      await agendamentoService.updateAgendamento(id, { status: newStatus });
      Alert.alert('Sucesso', `Status do agendamento alterado para ${newStatus.toUpperCase()}`);
      fetchAgendamentos();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível atualizar o status.');
    }
  };

  const filteredAgendamentos = agendamentos.filter((ag) => {
    const matchesSearch =
      ag.clienteNome.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ag.servico?.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ag.profissional?.nome.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
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

      {/* Métricas / Dashboard Resumo */}
      <View style={styles.metricsRow}>
        <View style={styles.metricCard}>
          <Text style={styles.metricNumber}>{totalCount}</Text>
          <Text style={styles.metricLabel}>TOTAL</Text>
        </View>
        <View style={styles.metricCard}>
          <Text style={[styles.metricNumber, { color: COLORS.statusAgendado }]}>
            {agendadosCount}
          </Text>
          <Text style={styles.metricLabel}>AGENDADOS</Text>
        </View>
        <View style={styles.metricCard}>
          <Text style={[styles.metricNumber, { color: COLORS.statusConcluido }]}>
            {concluidosCount}
          </Text>
          <Text style={styles.metricLabel}>CONCLUÍDOS</Text>
        </View>
      </View>

      {/* Busca e Filtros */}
      <View style={styles.searchRow}>
        <Searchbar
          placeholder="Buscar por cliente, serviço..."
          placeholderTextColor={COLORS.textSecondary}
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
          inputStyle={{ color: COLORS.textPrimary }}
          iconColor={COLORS.primary}
          accessibilityLabel="Campo de busca de agendamentos"
        />
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setIsFilterModalOpen(true)}
          accessibilityRole="button"
          accessibilityLabel="Abrir modal de filtros"
        >
          <Text style={styles.filterButtonText}>Filtros</Text>
        </TouchableOpacity>
      </View>

      {/* Lista Principal Otimizada */}
      <FlatList
        data={filteredAgendamentos}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <AgendamentoCard
            agendamento={item}
            onPress={(id) => navigation.navigate('DetalhesAgendamento', { id })}
            onStatusChange={handleStatusChange}
          />
        )}
        contentContainerStyle={styles.listContent}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={5}
        removeClippedSubviews={true}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.primary}
            colors={[COLORS.primary]}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>NENHUM AGENDAMENTO ENCONTRADO</Text>
            <Text style={styles.emptySubtitle}>
              Toque no botão "+" para criar um novo agendamento no sistema.
            </Text>
          </View>
        }
      />

      {/* FAB para criar novo agendamento */}
      <FAB
        icon="plus"
        label="NOVO AGENDAMENTO"
        style={styles.fab}
        color={COLORS.background}
        onPress={() => navigation.navigate('NovoAgendamento')}
        accessibilityLabel="Novo agendamento"
      />

      {/* Modal de Filtro */}
      <FilterModal
        visible={isFilterModalOpen}
        currentStatus={statusFilter}
        currentDate={dateFilter}
        onDismiss={() => setIsFilterModalOpen(false)}
        onApplyFilters={(status, date) => {
          setStatusFilter(status);
          setDateFilter(date);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  metricsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    gap: 8,
  },
  metricCard: {
    flex: 1,
    backgroundColor: COLORS.cardBackground,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  metricNumber: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  metricLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: COLORS.textSecondary,
    marginTop: 2,
    letterSpacing: 0.5,
  },
  searchRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginVertical: 8,
    gap: 8,
    alignItems: 'center',
  },
  searchBar: {
    flex: 1,
    backgroundColor: COLORS.cardBackground,
    borderRadius: 8,
    height: 48,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  filterButton: {
    backgroundColor: COLORS.cardBackground,
    paddingHorizontal: 14,
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  filterButtonText: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: '700',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 80,
  },
  emptyState: {
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
  },
  emptyTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.primary,
    letterSpacing: 1,
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.primary,
    borderRadius: 28,
  },
});
