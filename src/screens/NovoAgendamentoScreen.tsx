import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import { TextInput, Button, Card } from 'react-native-paper';
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
  const [dataAgendamento, setDataAgendamento] = useState<string>('2026-08-10');
  const [horaAgendamento, setHoraAgendamento] = useState<string>('');
  const [observacoes, setObservacoes] = useState<string>('');

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
        Alert.alert('Erro', 'Não foi possível carregar serviços e profissionais.');
      } finally {
        setLoading(false);
      }
    };
    loadAuxiliaryData();
  }, []);

  const handlePhoneChange = (text: string) => {
    setClienteTelefone(formatPhone(text));
  };

  const handleSubmit = async () => {
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
      Alert.alert('Validação de Dados', errors[0].message);
      return;
    }

    try {
      setSubmitting(true);
      await agendamentoService.createAgendamento({
        ...formData,
        status: 'agendado',
        observacoes,
      });

      Alert.alert('Sucesso', 'Agendamento cadastrado com sucesso!', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error) {
      Alert.alert('Erro HTTP', 'Não foi possível criar o agendamento.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Carregando lista de serviços..." />;
  }

  return (
    <View style={styles.container}>
      <Header title="NOVO AGENDAMENTO" subtitle="Preencha os dados do cliente e horário" />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* PASSO 1: Seleção de Serviço */}
        <Text style={styles.sectionTitle}>1. SELECIONE O SERVIÇO</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
          {servicos.map((s) => {
            const isSelected = selectedServicoId === s.id;
            return (
              <TouchableOpacity
                key={s.id}
                onPress={() => setSelectedServicoId(s.id)}
                activeOpacity={0.8}
                accessibilityRole="button"
                accessibilityLabel={`Serviço ${s.nome}, valor ${formatCurrency(s.preco)}`}
              >
                <Card style={[styles.servicoCard, isSelected && styles.selectedCard]}>
                  <Card.Content style={styles.cardContent}>
                    <Text style={styles.servicoNome}>{s.nome}</Text>
                    <Text style={styles.servicoDesc}>{s.descricao}</Text>
                    <View style={styles.servicoFooter}>
                      <Text style={styles.servicoPreco}>{formatCurrency(s.preco)}</Text>
                      <Text style={styles.servicoDuracao}>{s.duracaoMinutos} min</Text>
                    </View>
                  </Card.Content>
                </Card>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* PASSO 2: Seleção de Profissional */}
        <Text style={styles.sectionTitle}>2. SELECIONE O PROFISSIONAL</Text>
        <View style={styles.profissionaisGrid}>
          {profissionais.map((p) => {
            const isSelected = selectedProfissionalId === p.id;
            return (
              <TouchableOpacity
                key={p.id}
                style={[styles.profCard, isSelected && styles.selectedCard]}
                onPress={() => setSelectedProfissionalId(p.id)}
                activeOpacity={0.8}
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
          onChangeText={setClienteNome}
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
          onChangeText={setDataAgendamento}
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
                onPress={() => setHoraAgendamento(h)}
                accessibilityRole="button"
                accessibilityLabel={`Horário ${h}`}
              >
                <Text style={[styles.horaText, isSelected && styles.horaTextSelected]}>
                  {h}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Observações Opcionais */}
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

        {/* Botão de Envio */}
        <Button
          mode="contained"
          onPress={handleSubmit}
          loading={submitting}
          disabled={submitting}
          buttonColor={COLORS.primary}
          textColor={COLORS.background}
          style={styles.submitButton}
          contentStyle={{ paddingVertical: 8 }}
          accessibilityLabel="Salvar agendamento"
        >
          SALVAR AGENDAMENTO
        </Button>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.primary,
    letterSpacing: 1,
    marginTop: 16,
    marginBottom: 8,
  },
  horizontalScroll: {
    marginBottom: 12,
  },
  servicoCard: {
    width: 220,
    backgroundColor: COLORS.cardBackground,
    marginRight: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  selectedCard: {
    borderColor: COLORS.primary,
    borderWidth: 2,
    backgroundColor: COLORS.cardBackground,
  },
  cardContent: {
    padding: 12,
  },
  servicoNome: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  servicoDesc: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 4,
    height: 36,
  },
  servicoFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    alignItems: 'center',
  },
  servicoPreco: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.primary,
  },
  servicoDuracao: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  profissionaisGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  profCard: {
    flex: 1,
    backgroundColor: COLORS.cardBackground,
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginBottom: 8,
  },
  avatarPlaceholder: {
    backgroundColor: COLORS.cardBorder,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarLetter: {
    color: COLORS.primary,
    fontSize: 18,
    fontWeight: '700',
  },
  profNome: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  profEspecialidade: {
    fontSize: 10,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 2,
  },
  input: {
    backgroundColor: COLORS.cardBackground,
    marginBottom: 12,
  },
  subTitleLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  horariosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  horaChip: {
    backgroundColor: COLORS.cardBackground,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
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
    fontSize: 12,
    fontWeight: '600',
  },
  horaTextSelected: {
    color: COLORS.background,
    fontWeight: '800',
  },
  submitButton: {
    marginTop: 16,
    borderRadius: 8,
    minHeight: 48,
    justifyContent: 'center',
  },
});
