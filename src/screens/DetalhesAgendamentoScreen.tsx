import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { Button, Card, Chip, Dialog, Portal, TextInput } from 'react-native-paper';
import { StackScreenProps } from '@react-navigation/stack';
import { Header } from '../components/Header';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { agendamentoService } from '../services/agendamentoService';
import { AgendamentoComDetalhes, StatusAgendamento } from '../types';
import { COLORS } from '../constants/colors';
import { formatCurrency, formatDateBR } from '../utils/formatters';
import { validateDataHoraFutura } from '../utils/validations';
import { RootStackParamList } from '../routes/app.routes';

type DetalhesAgendamentoScreenProps = StackScreenProps<RootStackParamList, 'DetalhesAgendamento'>;

export const DetalhesAgendamentoScreen: React.FC<DetalhesAgendamentoScreenProps> = ({
  route,
  navigation,
}) => {
  const { id } = route.params;
  const [agendamento, setAgendamento] = useState<AgendamentoComDetalhes | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [updating, setUpdating] = useState<boolean>(false);
  const [deleteDialogVisible, setDeleteDialogVisible] = useState<boolean>(false);
  const [successDeleteModalVisible, setSuccessDeleteModalVisible] = useState<boolean>(false);

  // Reagendamento state
  const [novaData, setNovaData] = useState<string>('');
  const [novaHora, setNovaHora] = useState<string>('');
  const [modoEdicao, setModoEdicao] = useState<boolean>(false);

  const loadAgendamento = async () => {
    try {
      setLoading(true);
      const data = await agendamentoService.getAgendamentoById(id);
      setAgendamento(data);
      setNovaData(data.data);
      setNovaHora(data.hora);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar os detalhes do agendamento.');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAgendamento();
  }, [id]);

  const handleUpdateStatus = async (newStatus: StatusAgendamento) => {
    try {
      setUpdating(true);
      await agendamentoService.updateAgendamento(id, { status: newStatus });
      Alert.alert('Sucesso', `Status alterado para ${newStatus.toUpperCase()}`);
      loadAgendamento();
    } catch (error) {
      Alert.alert('Erro', 'Falha ao atualizar o status.');
    } finally {
      setUpdating(false);
    }
  };

  const handleSalvarEdicao = async () => {
    const error = validateDataHoraFutura(novaData, novaHora);
    if (error) {
      Alert.alert('Validação de Data/Hora', error);
      return;
    }
    try {
      setUpdating(true);
      await agendamentoService.updateAgendamento(id, {
        data: novaData,
        hora: novaHora,
      });
      Alert.alert('Sucesso', 'Horário alterado com sucesso!');
      setModoEdicao(false);
      loadAgendamento();
    } catch (error) {
      Alert.alert('Erro', 'Falha ao reagendar.');
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    try {
      setUpdating(true);
      await agendamentoService.deleteAgendamento(id);
      setDeleteDialogVisible(false);
      setSuccessDeleteModalVisible(true);
    } catch (error) {
      Alert.alert('Erro HTTP', 'Não foi possível excluir o agendamento.');
    } finally {
      setUpdating(false);
    }
  };

  const handleFinishDeleteSuccess = () => {
    setSuccessDeleteModalVisible(false);
    navigation.goBack();
  };

  if (loading || !agendamento) {
    return <LoadingSpinner message="Carregando detalhes do agendamento..." />;
  }

  const getStatusColor = (status: StatusAgendamento) => {
    switch (status) {
      case 'agendado':
        return COLORS.statusAgendado;
      case 'concluido':
        return COLORS.statusConcluido;
      case 'cancelado':
        return COLORS.statusCancelado;
    }
  };

  return (
    <View style={styles.container}>
      <Header
        title="DETALHES"
        subtitle={`Código: #${agendamento.id}`}
        showBackButton={true}
        onBackPress={() => navigation.goBack()}
      />

      <View style={styles.formWrapper}>
        {/* Card Principal de Resumo */}
        <Card style={styles.mainCard}>
          <Card.Content>
            <View style={styles.headerRow}>
              <View>
                <Text style={styles.clientLabel}>CLIENTE</Text>
                <Text style={styles.clientName}>{agendamento.clienteNome}</Text>
                <Text style={styles.clientPhone}>{agendamento.clienteTelefone}</Text>
              </View>
              <Chip
                style={[
                  styles.statusChip,
                  { backgroundColor: getStatusColor(agendamento.status) + '20' },
                ]}
                textStyle={{
                  color: getStatusColor(agendamento.status),
                  fontWeight: '800',
                  fontSize: 11,
                }}
              >
                {agendamento.status.toUpperCase()}
              </Chip>
            </View>

            <View style={styles.divider} />

            {/* Detalhes do Serviço */}
            <Text style={styles.sectionLabel}>SERVIÇO SELECIONADO</Text>
            <Text style={styles.servicoNome}>{agendamento.servico?.nome}</Text>
            <Text style={styles.servicoDesc}>{agendamento.servico?.descricao}</Text>
            <Text style={styles.servicoPreco}>
              Valor Total: {formatCurrency(agendamento.servico?.preco || 0)} ({agendamento.servico?.duracaoMinutos} min)
            </Text>

            <View style={styles.divider} />

            {/* Profissional */}
            <Text style={styles.sectionLabel}>PROFISSIONAL RESPONSÁVEL</Text>
            <Text style={styles.profNome}>{agendamento.profissional?.nome}</Text>
            <Text style={styles.profEspecialidade}>{agendamento.profissional?.especialidade}</Text>

            <View style={styles.divider} />

            {/* Data e Hora Atual ou Formulário de Edição */}
            <Text style={styles.sectionLabel}>DATA & HORÁRIO</Text>
            {!modoEdicao ? (
              <View style={styles.dateTimeContainer}>
                <Text style={styles.dateTimeText}>
                  {formatDateBR(agendamento.data)} às {agendamento.hora}
                </Text>
                {agendamento.status === 'agendado' && (
                  <TouchableOpacity
                    onPress={() => setModoEdicao(true)}
                    accessibilityRole="button"
                    accessibilityLabel="Alterar data e hora do agendamento"
                  >
                    <Text style={styles.reagendarLink}>[Reagendar Data/Hora]</Text>
                  </TouchableOpacity>
                )}
              </View>
            ) : (
              <View style={styles.editBox}>
                <TextInput
                  label="Nova Data (AAAA-MM-DD)"
                  mode="outlined"
                  value={novaData}
                  onChangeText={setNovaData}
                  keyboardType="numeric"
                  maxLength={10}
                  style={styles.input}
                  textColor={COLORS.textPrimary}
                  outlineColor={COLORS.cardBorder}
                  activeOutlineColor={COLORS.primary}
                />
                <TextInput
                  label="Novo Horário (HH:mm)"
                  mode="outlined"
                  value={novaHora}
                  onChangeText={setNovaHora}
                  keyboardType="numeric"
                  maxLength={5}
                  style={styles.input}
                  textColor={COLORS.textPrimary}
                  outlineColor={COLORS.cardBorder}
                  activeOutlineColor={COLORS.primary}
                />
                <View style={styles.editButtonsRow}>
                  <Button
                    mode="outlined"
                    onPress={() => setModoEdicao(false)}
                    textColor={COLORS.textSecondary}
                    style={{ flex: 1, minHeight: 44, justifyContent: 'center' }}
                  >
                    CANCELAR
                  </Button>
                  <Button
                    mode="contained"
                    onPress={handleSalvarEdicao}
                    loading={updating}
                    buttonColor={COLORS.primary}
                    textColor={COLORS.background}
                    style={{ flex: 1, minHeight: 44, justifyContent: 'center' }}
                  >
                    SALVAR
                  </Button>
                </View>
              </View>
            )}

            {agendamento.observacoes ? (
              <>
                <View style={styles.divider} />
                <Text style={styles.sectionLabel}>OBSERVAÇÕES</Text>
                <Text style={styles.obsText}>{agendamento.observacoes}</Text>
              </>
            ) : null}
          </Card.Content>
        </Card>

        {/* Ações de Alteração de Status (Update) */}
        {agendamento.status === 'agendado' && (
          <View style={styles.actionsContainer}>
            <Button
              mode="contained"
              onPress={() => handleUpdateStatus('concluido')}
              loading={updating}
              buttonColor={COLORS.statusConcluido}
              textColor={COLORS.white}
              style={styles.actionButton}
              accessibilityLabel="Marcar como concluído"
            >
              MARCAR COMO CONCLUÍDO
            </Button>
            <Button
              mode="outlined"
              onPress={() => handleUpdateStatus('cancelado')}
              loading={updating}
              textColor={COLORS.statusCancelado}
              style={[styles.actionButton, { borderColor: COLORS.statusCancelado }]}
              accessibilityLabel="Cancelar agendamento"
            >
              CANCELAR AGENDAMENTO
            </Button>
          </View>
        )}

        {/* Exclusão do Histórico (Delete) */}
        <Button
          mode="text"
          onPress={() => setDeleteDialogVisible(true)}
          textColor={COLORS.error}
          style={styles.deleteButton}
          accessibilityLabel="Excluir agendamento do histórico"
        >
          EXCLUIR DO HISTÓRICO
        </Button>
      </View>

      {/* Modal de Confirmação de Exclusão */}
      <Portal>
        <Dialog
          visible={deleteDialogVisible}
          onDismiss={() => setDeleteDialogVisible(false)}
          style={{ backgroundColor: COLORS.cardBackground }}
        >
          <Dialog.Title style={{ color: COLORS.primary, fontWeight: '800' }}>
            CONFIRMAR EXCLUSÃO
          </Dialog.Title>
          <Dialog.Content>
            <Text style={{ color: COLORS.textPrimary }}>
              Tem certeza que deseja remover este agendamento do banco de dados? Esta ação dispara uma requisição HTTP DELETE.
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDeleteDialogVisible(false)} textColor={COLORS.textSecondary}>
              NÃO, MANTER
            </Button>
            <Button onPress={handleDelete} textColor={COLORS.error} loading={updating}>
              SIM, EXCLUIR
            </Button>
          </Dialog.Actions>
        </Dialog>

        {/* Modal de Sucesso na Exclusão */}
        <Dialog
          visible={successDeleteModalVisible}
          onDismiss={handleFinishDeleteSuccess}
          style={{ backgroundColor: COLORS.cardBackground, borderWidth: 1, borderColor: COLORS.primary }}
        >
          <Dialog.Title style={{ color: COLORS.primary, fontWeight: '800', textAlign: 'center' }}>
            🎉 EXCLUÍDO COM SUCESSO!
          </Dialog.Title>
          <Dialog.Content>
            <Text style={{ color: COLORS.textPrimary, textAlign: 'center', fontSize: 14 }}>
              O agendamento #{id} foi removido com sucesso do banco de dados.
            </Text>
          </Dialog.Content>
          <Dialog.Actions style={{ justifyContent: 'center' }}>
            <Button
              mode="contained"
              onPress={handleFinishDeleteSuccess}
              buttonColor={COLORS.primary}
              textColor={COLORS.background}
              style={{ minWidth: 180, borderRadius: 8 }}
            >
              VOLTAR À TELA INICIAL
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: COLORS.background,
  },
  formWrapper: {
    width: '100%',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 60,
  },
  mainCard: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    marginBottom: 20,
    width: '100%',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  clientLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  clientName: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  clientPhone: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  statusChip: {
    borderRadius: 12,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.cardBorder,
    marginVertical: 12,
  },
  sectionLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.primary,
    letterSpacing: 1,
    marginBottom: 4,
  },
  servicoNome: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  servicoDesc: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  servicoPreco: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primary,
    marginTop: 6,
  },
  profNome: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  profEspecialidade: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  dateTimeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateTimeText: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  reagendarLink: {
    fontSize: 11,
    color: COLORS.primary,
    fontWeight: '700',
  },
  editBox: {
    marginTop: 8,
  },
  input: {
    backgroundColor: COLORS.background,
    marginBottom: 8,
  },
  editButtonsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  obsText: {
    fontSize: 12,
    color: COLORS.textPrimary,
    fontStyle: 'italic',
  },
  actionsContainer: {
    gap: 10,
    marginBottom: 16,
    width: '100%',
  },
  actionButton: {
    borderRadius: 8,
    paddingVertical: 4,
    minHeight: 48,
    justifyContent: 'center',
  },
  deleteButton: {
    marginTop: 8,
  },
});
