import { api } from './api';
import {
  Agendamento,
  AgendamentoComDetalhes,
  AtualizarAgendamentoDTO,
  CriarAgendamentoDTO,
  Profissional,
  Servico,
} from '../types';

export const agendamentoService = {
  // GET /servicos
  async getServicos(): Promise<Servico[]> {
    const response = await api.get<Servico[]>('/servicos');
    return response.data;
  },

  // GET /profissionais
  async getProfissionais(): Promise<Profissional[]> {
    const response = await api.get<Profissional[]>('/profissionais');
    return response.data;
  },

  // GET /agendamentos
  async getAgendamentos(statusFilter?: string, dataFilter?: string): Promise<AgendamentoComDetalhes[]> {
    let params: Record<string, string> = {};
    if (statusFilter && statusFilter !== 'todos') {
      params.status = statusFilter;
    }
    if (dataFilter) {
      params.data = dataFilter;
    }

    const [agendamentosRes, servicos, profissionais] = await Promise.all([
      api.get<Agendamento[]>('/agendamentos', { params }),
      this.getServicos(),
      this.getProfissionais(),
    ]);

    const servicosMap = new Map(servicos.map((s) => [s.id, s]));
    const profissionaisMap = new Map(profissionais.map((p) => [p.id, p]));

    return agendamentosRes.data.map((ag) => ({
      ...ag,
      servico: servicosMap.get(ag.servicoId),
      profissional: profissionaisMap.get(ag.profissionalId),
    }));
  },

  // GET /agendamentos/:id
  async getAgendamentoById(id: string): Promise<AgendamentoComDetalhes> {
    const [agendamentoRes, servicos, profissionais] = await Promise.all([
      api.get<Agendamento>(`/agendamentos/${id}`),
      this.getServicos(),
      this.getProfissionais(),
    ]);

    const ag = agendamentoRes.data;
    const servico = servicos.find((s) => s.id === ag.servicoId);
    const profissional = profissionais.find((p) => p.id === ag.profissionalId);

    return {
      ...ag,
      servico,
      profissional,
    };
  },

  // POST /agendamentos
  async createAgendamento(data: CriarAgendamentoDTO): Promise<Agendamento> {
    const response = await api.post<Agendamento>('/agendamentos', data);
    return response.data;
  },

  // PATCH /agendamentos/:id
  async updateAgendamento(id: string, data: AtualizarAgendamentoDTO): Promise<Agendamento> {
    const response = await api.patch<Agendamento>(`/agendamentos/${id}`, data);
    return response.data;
  },

  // DELETE /agendamentos/:id
  async deleteAgendamento(id: string): Promise<void> {
    await api.delete(`/agendamentos/${id}`);
  },
};
