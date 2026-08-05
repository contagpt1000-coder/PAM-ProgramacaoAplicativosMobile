export interface ValidationError {
  field: string;
  message: string;
}

// Conjunto de DDDs válidos no Brasil
const DDDS_VALIDOS = new Set([
  11, 12, 13, 14, 15, 16, 17, 18, 19,
  21, 22, 24, 27, 28,
  31, 32, 33, 34, 35, 37, 38,
  41, 42, 43, 44, 45, 46, 47, 48, 49,
  51, 53, 54, 55,
  61, 62, 63, 64, 65, 66, 67, 68, 69,
  71, 73, 74, 75, 77, 79,
  81, 82, 83, 84, 85, 86, 87, 88, 89,
  91, 92, 93, 94, 95, 96, 97, 98, 99
]);

export const validateNomeCliente = (nome?: string | null): string | null => {
  if (!nome || typeof nome !== 'string' || nome.trim().length === 0) {
    return 'O nome do cliente é obrigatório.';
  }
  // Sanitiza caracteres nulos e de controle
  const cleanNome = nome.replace(/[\0\x00-\x1F\x7F]/g, '').trim();

  if (cleanNome.length < 3) {
    return 'O nome do cliente deve ter pelo menos 3 caracteres.';
  }
  if (cleanNome.length > 100) {
    return 'O nome do cliente deve ter no máximo 100 caracteres.';
  }
  if (!/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/.test(cleanNome)) {
    return 'O nome do cliente deve conter apenas letras e espaços.';
  }
  return null;
};

export const validateTelefone = (telefone?: string | null): string | null => {
  if (!telefone || typeof telefone !== 'string' || telefone.trim().length === 0) {
    return 'O telefone de contato é obrigatório.';
  }
  const cleaned = telefone.replace(/\D/g, '');
  if (cleaned.length < 10 || cleaned.length > 11) {
    return 'Informe um telefone válido com DDD (ex: 85 99999-9999).';
  }
  // Impede sequências repetitivas (ex: 00000000000)
  if (/^(\d)\1+$/.test(cleaned)) {
    return 'Informe um número de telefone válido.';
  }
  const ddd = parseInt(cleaned.substring(0, 2), 10);
  if (!DDDS_VALIDOS.has(ddd)) {
    return 'DDD informado é inválido.';
  }
  return null;
};

export const validateDataHoraFutura = (
  dataISO?: string | null,
  horaStr?: string | null,
  horarioAbertura = '08:00',
  horarioFechamento = '18:00'
): string | null => {
  if (!dataISO || typeof dataISO !== 'string') return 'Selecione uma data para o agendamento.';
  if (!horaStr || typeof horaStr !== 'string') return 'Selecione um horário para o agendamento.';

  // Valida formato ISO AAAA-MM-DD
  const regexData = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
  if (!regexData.test(dataISO)) {
    return 'Formato de data inválido. Use AAAA-MM-DD.';
  }

  // Valida formato de hora HH:mm
  const regexHora = /^([01]\d|2[0-3]):([0-5]\d)$/;
  if (!regexHora.test(horaStr)) {
    return 'Formato de hora inválido. Use HH:mm.';
  }

  const [ano, mes, dia] = dataISO.split('-').map(Number);
  const [horas, minutos] = horaStr.split(':').map(Number);

  // Previne o rollover de data do JavaScript (ex: 31/02 vira 03/03)
  const dataAgendamento = new Date(ano, mes - 1, dia, horas, minutos);
  if (
    dataAgendamento.getFullYear() !== ano ||
    dataAgendamento.getMonth() !== mes - 1 ||
    dataAgendamento.getDate() !== dia
  ) {
    return 'A data informada não existe no calendário.';
  }

  const agora = new Date();
  if (dataAgendamento < agora) {
    return 'Não é possível realizar agendamentos para datas ou horários passados.';
  }

  // Validação de Expediente Comercial
  const [hAbertura, mAbertura] = horarioAbertura.split(':').map(Number);
  const [hFechamento, mFechamento] = horarioFechamento.split(':').map(Number);
  const minAgendamento = horas * 60 + minutos;
  const minInicio = hAbertura * 60 + mAbertura;
  const minFim = hFechamento * 60 + mFechamento;

  if (minAgendamento < minInicio || minAgendamento > minFim) {
    return `Horário fora do expediente comercial (${horarioAbertura} às ${horarioFechamento}).`;
  }

  return null;
};

export const validateAgendamentoForm = (formData: {
  clienteNome?: string;
  clienteTelefone?: string;
  servicoId?: string;
  profissionalId?: string;
  data?: string;
  hora?: string;
}): ValidationError[] => {
  const errors: ValidationError[] = [];
  if (!formData) return [{ field: 'form', message: 'Dados do formulário não fornecidos.' }];

  const nomeErr = validateNomeCliente(formData.clienteNome);
  if (nomeErr) errors.push({ field: 'clienteNome', message: nomeErr });

  const telErr = validateTelefone(formData.clienteTelefone);
  if (telErr) errors.push({ field: 'clienteTelefone', message: telErr });

  if (!formData.servicoId || !formData.servicoId.trim()) {
    errors.push({ field: 'servicoId', message: 'Selecione um serviço.' });
  }

  if (!formData.profissionalId || !formData.profissionalId.trim()) {
    errors.push({ field: 'profissionalId', message: 'Selecione um profissional.' });
  }

  const dataHoraErr = validateDataHoraFutura(formData.data, formData.hora);
  if (dataHoraErr) {
    errors.push({ field: 'dataHora', message: dataHoraErr });
  }

  return errors;
};
