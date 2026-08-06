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

      {/* Métricas / Dashboard Resumo em Dark Gold Glassmorphism */}
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
        scrollEnabled={Platform.OS !== 'web'}
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

      {/* FAB Estilizado em Dourado Metálico Glow */}
      <TouchableOpacity
        style={styles.fabButton}
        onPress={() => navigation.navigate('NovoAgendamento')}
        accessibilityRole="button"
        accessibilityLabel="Novo agendamento"
        activeOpacity={0.85}
      >
        <Text style={styles.fabIcon}>＋</Text>
        <Text style={styles.fabText}>NOVO AGENDAMENTO</Text>
      </TouchableOpacity>

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
    width: '100%',
    minHeight: '100%',
    backgroundColor: 'transparent',
  },
  metricsRow: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 10,
    gap: 16,
    width: '100%',
  },
  metricCard: {
    flex: 1,
    backgroundColor: COLORS.cardBackground,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 16,
    alignItems: 'center',
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
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.textSecondary,
    letterSpacing: 1.2,
  },
  metricNumber: {
    fontSize: 26,
    fontWeight: '900',
    color: COLORS.textPrimary,
    marginTop: 4,
  },
  searchRow: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    marginVertical: 14,
    gap: 14,
    alignItems: 'center',
    width: '100%',
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardBackground,
    borderRadius: 12,
    height: 50,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    paddingHorizontal: 14,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    color: COLORS.textPrimary,
    fontSize: 14,
    height: '100%',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: COLORS.cardBackground,
    paddingHorizontal: 20,
    height: 50,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  filterIcon: {
    fontSize: 14,
  },
  filterButtonText: {
    color: COLORS.primary,
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  listContent: {
    paddingHorizontal: 24,
    paddingBottom: 110,
    width: '100%',
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
    backgroundColor: COLORS.cardBackground,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  emptyTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: COLORS.primary,
    letterSpacing: 1.2,
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  fabButton: {
    position: Platform.OS === 'web' ? ('fixed' as any) : 'absolute',
    right: 28,
    bottom: 28,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 22,
    paddingVertical: 14,
    borderRadius: 30,
    elevation: 8,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.45,
    shadowRadius: 16,
    zIndex: 9999,
  },
  fabIcon: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.background,
  },
  fabText: {
    color: COLORS.background,
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 1,
  },
});
