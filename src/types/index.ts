export type StatusAgendamento = 'agendado' | 'concluido' | 'cancelado';

export interface Categoria {
  id: string;
  nome: string;
  icone?: string;
}

export interface Cliente {
  id: string;
  nome: string;
  telefone: string;
  email?: string;
  avatarUrl?: string;
}

export interface Servico {
  id: string;
  categoriaId: string;
  categoria?: Categoria;
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
  clienteId: string;
  clienteNome?: string;
  clienteTelefone?: string;
  servicoId: string;
  profissionalId: string;
  data: string; // Formato AAAA-MM-DD
  hora: string; // Formato HH:mm
  status: StatusAgendamento;
  observacoes?: string;
}

export interface CriarAgendamentoDTO {
  clienteId?: string;
  clienteNome: string;
  clienteTelefone: string;
  servicoId: string;
  profissionalId: string;
  data: string;
  hora: string;
  status?: StatusAgendamento;
  observacoes?: string;
}

export type AtualizarAgendamentoDTO = Partial<Omit<Agendamento, 'id'>>;

export interface AgendamentoComDetalhes extends Agendamento {
  cliente?: Cliente;
  servico?: Servico;
  profissional?: Profissional;
}
