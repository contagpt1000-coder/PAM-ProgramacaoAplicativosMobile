import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
  Platform,
} from 'react-native';
import { TextInput, Button, Card, Portal, Dialog } from 'react-native-paper';
import { StackScreenProps } from '@react-navigation/stack';
import { Header } from '../components/Header';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { agendamentoService } from '../services/agendamentoService';
import { Profissional, Servico } from '../types';
import { COLORS } from '../constants/colors';
import { formatCurrency, formatPhone } from '../utils/formatters';
import { validateAgendamentoForm } from '../utils/validations';
import { RootStackParamList } from '../routes/app.routes';

type NovoAgendamentoScreenProps = StackScreenProps<RootStackParamList, 'NovoAgendamento'>;

const HORARIOS_DISPONIVEIS = [
  '08:00', '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'
];

// Calcula a data inicial válida dinamicamente (hoje ou amanhã se for após o expediente)
const getDefaultDate = (): string => {
  const now = new Date();
  if (now.getHours() >= 18) {
    now.setDate(now.getDate() + 1);
  }
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

export const NovoAgendamentoScreen: React.FC<NovoAgendamentoScreenProps> = ({ navigation }) => {
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [profissionais, setProfissionais] = useState<Profissional[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);

  // Form State
  const [selectedServicoId, setSelectedServicoId] = useState<string>('');
  const [selectedProfissionalId, setSelectedProfissionalId] = useState<string>('');
  const [clienteNome, setClienteNome] = useState<string>('');
  const [clienteTelefone, setClienteTelefone] = useState<string>('');
  const [dataAgendamento, setDataAgendamento] = useState<string>(getDefaultDate());
  const [horaAgendamento, setHoraAgendamento] = useState<string>('09:00');
  const [observacoes, setObservacoes] = useState<string>('');

  // Feedback State
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successModalVisible, setSuccessModalVisible] = useState<boolean>(false);

  useEffect(() => {
    const loadAuxiliaryData = async () => {
      try {
        setLoading(true);
        const [servicosData, profissionaisData] = await Promise.all([
          agendamentoService.getServicos(),
          agendamentoService.getProfissionais(),
        ]);
        setServicos(servicosData);
        setProfissionais(profissionaisData);
      } catch (error) {
        setErrorMessage('Não foi possível carregar serviços e profissionais.');
      } finally {
        setLoading(false);
      }
    };
    loadAuxiliaryData();
  }, []);

  const handlePhoneChange = (text: string) => {
    setClienteTelefone(formatPhone(text));
    if (errorMessage) setErrorMessage(null);
  };

  const handleSubmit = async () => {
    setErrorMessage(null);

    const formData = {
      clienteNome,
      clienteTelefone,
      servicoId: selectedServicoId,
      profissionalId: selectedProfissionalId,
      data: dataAgendamento,
      hora: horaAgendamento,
    };

    const errors = validateAgendamentoForm(formData);
    if (errors.length > 0) {
      setErrorMessage(errors[0].message);
      if (Platform.OS === 'web' && typeof window !== 'undefined') {
        window.scrollTo({ top: 300, behavior: 'smooth' });
      }
      return;
    }

    try {
      setSubmitting(true);
      await agendamentoService.createAgendamento({
        ...formData,
        status: 'agendado',
        observacoes,
      });

      // Exibe modal de sucesso com feedback visual imediato
      setSuccessModalVisible(true);
    } catch (error: any) {
      console.error('[NovoAgendamento] Falha ao cadastrar:', error);
      setErrorMessage('Não foi possível salvar o agendamento no banco de dados.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSuccessClose = () => {
    setSuccessModalVisible(false);
    navigation.navigate('Home');
  };

  if (loading) {
    return <LoadingSpinner message="Carregando lista de serviços..." />;
  }

  return (
    <View style={styles.container}>
      <Header
        title="NOVO AGENDAMENTO"
        subtitle="Preencha os dados do cliente e horário"
        showBackButton={true}
        onBackPress={() => navigation.goBack()}
      />

      <View style={styles.formWrapper}>
        {/* Banner de Erro de Validação Visível */}
        {errorMessage && (
          <View style={styles.errorBanner}>
            <Text style={styles.errorBannerIcon}>⚠️</Text>
            <Text style={styles.errorBannerText}>{errorMessage}</Text>
          </View>
        )}

        {/* PASSO 1: Seleção de Serviço */}
        <Text style={styles.sectionTitle}>1. SELECIONE O SERVIÇO</Text>
        <View style={styles.servicosGrid}>
          {servicos.map((s) => {
            const isSelected = selectedServicoId === s.id;
            return (
              <TouchableOpacity
                key={s.id}
                style={styles.servicoCardWrapper}
                onPress={() => {
                  setSelectedServicoId(s.id);
                  if (errorMessage) setErrorMessage(null);
                }}
                activeOpacity={0.85}
                accessibilityRole="button"
                accessibilityLabel={`Serviço ${s.nome}, valor ${formatCurrency(s.preco)}`}
              >
                <Card style={[styles.servicoCard, isSelected && styles.selectedCard]}>
                  <View style={[styles.cardTopBar, isSelected && styles.cardTopBarSelected]} />
                  <Card.Content style={styles.cardContent}>
                    <View style={styles.cardTop}>
                      <Text style={styles.servicoNome} numberOfLines={2}>
                        {s.nome}
                      </Text>
                      <Text style={styles.servicoDesc} numberOfLines={2}>
                        {s.descricao}
                      </Text>
                    </View>
                    <View style={styles.servicoFooter}>
                      <Text style={styles.servicoPreco}>{formatCurrency(s.preco)}</Text>
                      <View style={styles.duracaoChip}>
                        <Text style={styles.duracaoText}>⏱ {s.duracaoMinutos} min</Text>
                      </View>
                    </View>
                  </Card.Content>
                </Card>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* PASSO 2: Seleção de Profissional */}
        <Text style={styles.sectionTitle}>2. SELECIONE O PROFISSIONAL</Text>
        <View style={styles.profissionaisGrid}>
          {profissionais.map((p) => {
            const isSelected = selectedProfissionalId === p.id;
            return (
              <TouchableOpacity
                key={p.id}
                style={[styles.profCard, isSelected && styles.selectedCard]}
                onPress={() => {
                  setSelectedProfissionalId(p.id);
                  if (errorMessage) setErrorMessage(null);
                }}
                activeOpacity={0.85}
                accessibilityRole="button"
                accessibilityLabel={`Profissional ${p.nome}`}
              >
                {p.avatarUrl ? (
                  <Image source={{ uri: p.avatarUrl }} style={styles.avatar} />
                ) : (
                  <View style={[styles.avatar, styles.avatarPlaceholder]}>
                    <Text style={styles.avatarLetter}>{p.nome.charAt(0)}</Text>
                  </View>
                )}
                <Text style={styles.profNome}>{p.nome}</Text>
                <Text style={styles.profEspecialidade}>{p.especialidade}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* PASSO 3: Dados do Cliente */}
        <Text style={styles.sectionTitle}>3. DADOS DO CLIENTE</Text>
        <TextInput
          label="Nome Completo do Cliente *"
          mode="outlined"
          value={clienteNome}
          onChangeText={(val) => {
            setClienteNome(val);
            if (errorMessage) setErrorMessage(null);
          }}
          textColor={COLORS.textPrimary}
          outlineColor={COLORS.cardBorder}
          activeOutlineColor={COLORS.primary}
          style={styles.input}
          maxLength={100}
        />

        <TextInput
          label="Telefone com DDD *"
          mode="outlined"
          keyboardType="phone-pad"
          value={clienteTelefone}
          onChangeText={handlePhoneChange}
          placeholder="(85) 99999-9999"
          textColor={COLORS.textPrimary}
          outlineColor={COLORS.cardBorder}
          activeOutlineColor={COLORS.primary}
          style={styles.input}
          maxLength={15}
        />

        {/* PASSO 4: Data e Hora */}
        <Text style={styles.sectionTitle}>4. DATA & HORÁRIO</Text>
        <TextInput
          label="Data do Agendamento (AAAA-MM-DD) *"
          mode="outlined"
          value={dataAgendamento}
          onChangeText={(val) => {
            setDataAgendamento(val);
            if (errorMessage) setErrorMessage(null);
          }}
          keyboardType="numeric"
          maxLength={10}
          textColor={COLORS.textPrimary}
          outlineColor={COLORS.cardBorder}
          activeOutlineColor={COLORS.primary}
          style={styles.input}
        />

        <Text style={styles.subTitleLabel}>Grade de Horários Disponíveis:</Text>
        <View style={styles.horariosGrid}>
          {HORARIOS_DISPONIVEIS.map((h) => {
            const isSelected = horaAgendamento === h;
            return (
              <TouchableOpacity
                key={h}
                style={[styles.horaChip, isSelected && styles.horaChipSelected]}
                onPress={() => {
                  setHoraAgendamento(h);
                  if (errorMessage) setErrorMessage(null);
                }}
                accessibilityRole="button"
                accessibilityLabel={`Horário ${h}`}
                activeOpacity={0.8}
              >
                <Text style={[styles.horaText, isSelected && styles.horaTextSelected]}>
                  {h}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* PASSO 5: Observações Opcionais */}
        <Text style={styles.sectionTitle}>5. OBSERVAÇÕES (OPCIONAL)</Text>
        <TextInput
          label="Notas adicionais"
          mode="outlined"
          multiline
          numberOfLines={3}
          value={observacoes}
          onChangeText={setObservacoes}
          textColor={COLORS.textPrimary}
          outlineColor={COLORS.cardBorder}
          activeOutlineColor={COLORS.primary}
          style={styles.input}
        />

        {/* Botão Único de Envio com Destaque Dourado */}
        <View style={styles.submitContainer}>
          <Button
            mode="contained"
            onPress={handleSubmit}
            loading={submitting}
            disabled={submitting}
            buttonColor={COLORS.primary}
            textColor={COLORS.background}
            style={styles.submitButton}
            contentStyle={{ height: 56, justifyContent: 'center' }}
            labelStyle={{ fontSize: 16, fontWeight: '900', letterSpacing: 1.5 }}
            accessibilityLabel="Confirmar e salvar agendamento"
          >
            CONFIRMAR AGENDAMENTO
          </Button>
        </View>
      </View>

      {/* Modal Visual de Sucesso */}
      <Portal>
        <Dialog
          visible={successModalVisible}
          onDismiss={handleSuccessClose}
          style={styles.successDialog}
        >
          <Dialog.Title style={styles.successDialogTitle}>
            ✂ AGENDAMENTO CONFIRMADO!
          </Dialog.Title>
          <Dialog.Content>
            <Text style={styles.successDialogMessage}>
              O agendamento de <Text style={{ color: COLORS.primary, fontWeight: '700' }}>{clienteNome}</Text> foi registrado com sucesso no banco de dados para o dia {dataAgendamento} às {horaAgendamento}.
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              mode="contained"
              onPress={handleSuccessClose}
              buttonColor={COLORS.primary}
              textColor={COLORS.background}
              labelStyle={{ fontWeight: '800' }}
            >
              VER AGENDAMENTOS
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
    backgroundColor: 'transparent',
  },
  formWrapper: {
    width: '100%',
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 80,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderWidth: 1,
    borderColor: '#ef4444',
    padding: 14,
    borderRadius: 12,
    marginTop: 10,
    marginBottom: 16,
    gap: 10,
  },
  errorBannerIcon: {
    fontSize: 18,
  },
  errorBannerText: {
    color: '#fca5a5',
    fontSize: 14,
    fontWeight: '700',
    flex: 1,
  },
  sectionTitle: {
    fontFamily: 'Cinzel, serif',
    fontSize: 13,
    fontWeight: '900',
    color: COLORS.primary,
    letterSpacing: 1.5,
    marginTop: 22,
    marginBottom: 12,
  },
  servicosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
    marginBottom: 8,
    width: '100%',
  },
  servicoCardWrapper: {
    flex: 1,
    minWidth: 220,
  },
  servicoCard: {
    height: 175,
    backgroundColor: COLORS.cardBackground,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    overflow: 'hidden',
  },
  cardTopBar: {
    height: 3,
    width: '100%',
    backgroundColor: 'transparent',
  },
  cardTopBarSelected: {
    backgroundColor: COLORS.primary,
  },
  selectedCard: {
    borderColor: COLORS.primary,
    borderWidth: 2,
    backgroundColor: COLORS.cardBackground,
  },
  cardContent: {
    padding: 16,
    height: '100%',
    justifyContent: 'space-between',
  },
  cardTop: {
    flex: 1,
  },
  servicoNome: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary,
    lineHeight: 20,
  },
  servicoDesc: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 6,
    lineHeight: 18,
    letterSpacing: 0.2,
  },
  servicoFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.06)',
    paddingTop: 10,
    marginTop: 8,
  },
  servicoPreco: {
    fontSize: 16,
    fontWeight: '900',
    color: COLORS.primary,
  },
  duracaoChip: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  duracaoText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  profissionaisGrid: {
    flexDirection: 'row',
    gap: 14,
    marginBottom: 8,
    width: '100%',
  },
  profCard: {
    flex: 1,
    backgroundColor: COLORS.cardBackground,
    padding: 18,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  avatar: {
    width: 58,
    height: 58,
    borderRadius: 29,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: COLORS.cardBorderBright,
  },
  avatarPlaceholder: {
    backgroundColor: COLORS.cardBorder,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarLetter: {
    color: COLORS.primary,
    fontSize: 22,
    fontWeight: '800',
  },
  profNome: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  profEspecialidade: {
    fontSize: 11,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 2,
  },
  input: {
    backgroundColor: COLORS.cardBackground,
    marginBottom: 12,
    width: '100%',
  },
  subTitleLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 8,
    fontWeight: '600',
  },
  horariosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 16,
    width: '100%',
  },
  horaChip: {
    backgroundColor: COLORS.cardBackground,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    minHeight: 44,
    justifyContent: 'center',
  },
  horaChipSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  horaText: {
    color: COLORS.textPrimary,
    fontSize: 13,
    fontWeight: '600',
  },
  horaTextSelected: {
    color: COLORS.background,
    fontWeight: '900',
  },
  submitContainer: {
    marginTop: 28,
    marginBottom: 40,
    width: '100%',
  },
  submitButton: {
    borderRadius: 12,
    elevation: 6,
    width: '100%',
  },
  successDialog: {
    backgroundColor: '#121218',
    borderWidth: 1,
    borderColor: COLORS.cardBorderBright,
    borderRadius: 16,
  },
  successDialogTitle: {
    fontFamily: 'Cinzel, serif',
    color: COLORS.primary,
    fontSize: 18,
    fontWeight: '800',
  },
  successDialogMessage: {
    color: COLORS.textPrimary,
    fontSize: 14,
    lineHeight: 22,
  },
});
