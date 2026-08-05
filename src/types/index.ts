export type StatusAgendamento = 'agendado' | 'concluido' | 'cancelado';

export interface Servico {
  id: string;
  nome: string;
  descricao: string;
  preco: number;
  duracaoMinutos: number;
  imagemUrl?: string;
}

export interface Profissional {
  id: string;
  nome: string;
  especialidade: string;
  avatarUrl?: string;
}

export interface Agendamento {
  id: string;
  clienteNome: string;
  clienteTelefone: string;
  servicoId: string;
  profissionalId: string;
  data: string; // Formato YYYY-MM-DD
  hora: string; // Formato HH:mm
  status: StatusAgendamento;
  observacoes?: string;
}

export type CriarAgendamentoDTO = Omit<Agendamento, 'id'>;
export type AtualizarAgendamentoDTO = Partial<Omit<Agendamento, 'id'>>;

export interface AgendamentoComDetalhes extends Agendamento {
  servico?: Servico;
  profissional?: Profissional;
}
