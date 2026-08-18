import { api } from './api';
import { mockFallbackStore } from './mockFallback';
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
    try {
      const response = await api.get<Servico[]>('/servicos');
      return response.data;
    } catch (error) {
      console.info('[BarberFlow] Utilizando catálogo local de serviços (Modo Resiliente).');
      return await mockFallbackStore.getServicos();
    }
  },

  // GET /profissionais
  async getProfissionais(): Promise<Profissional[]> {
    try {
      const response = await api.get<Profissional[]>('/profissionais');
      return response.data;
    } catch (error) {
      console.info('[BarberFlow] Utilizando lista local de profissionais (Modo Resiliente).');
      return await mockFallbackStore.getProfissionais();
    }
  },

  // GET /agendamentos
  async getAgendamentos(statusFilter?: string, dataFilter?: string): Promise<AgendamentoComDetalhes[]> {
    let rawAgendamentos: Agendamento[] = [];
    let servicos: Servico[] = [];
    let profissionais: Profissional[] = [];

    try {
      let params: Record<string, string> = {};
      if (statusFilter && statusFilter !== 'todos') {
        params.status = statusFilter;
      }
      if (dataFilter) {
        params.data = dataFilter;
      }

      const [agendamentosRes, sList, pList] = await Promise.all([
        api.get<Agendamento[]>('/agendamentos', { params }),
        this.getServicos(),
        this.getProfissionais(),
      ]);
      rawAgendamentos = agendamentosRes.data;
      servicos = sList;
      profissionais = pList;
    } catch (error) {
      console.info('[BarberFlow] Servidor REST inacessível. Carregando dados locais persistentes.');
      const [agList, sList, pList] = await Promise.all([
        mockFallbackStore.getAgendamentos(statusFilter, dataFilter),
        mockFallbackStore.getServicos(),
        mockFallbackStore.getProfissionais(),
      ]);
      rawAgendamentos = agList;
      servicos = sList;
      profissionais = pList;
    }

    const servicosMap = new Map<string, Servico>(servicos.map((s) => [s.id, s]));
    const profissionaisMap = new Map<string, Profissional>(profissionais.map((p) => [p.id, p]));

    return rawAgendamentos.map((ag): AgendamentoComDetalhes => ({
      ...ag,
      servico: servicosMap.get(ag.servicoId),
      profissional: profissionaisMap.get(ag.profissionalId),
    }));
  },

  // GET /agendamentos/:id
  async getAgendamentoById(id: string): Promise<AgendamentoComDetalhes> {
    const [servicos, profissionais] = await Promise.all([
      this.getServicos(),
      this.getProfissionais(),
    ]);

    let ag: Agendamento | undefined;
    try {
      const response = await api.get<Agendamento>(`/agendamentos/${id}`);
      ag = response.data;
    } catch (error) {
      ag = await mockFallbackStore.getAgendamentoById(id);
    }

    if (!ag) {
      throw new Error(`Agendamento #${id} não localizado.`);
    }

    const servico = servicos.find((s) => s.id === ag?.servicoId);
    const profissional = profissionais.find((p) => p.id === ag?.profissionalId);

    return {
      ...ag,
      servico,
      profissional,
    };
  },

  // POST /agendamentos
  async createAgendamento(data: CriarAgendamentoDTO): Promise<Agendamento> {
    try {
      const response = await api.post<Agendamento>('/agendamentos', data);
      return response.data;
    } catch (error) {
      console.info('[BarberFlow] Salvando novo agendamento no armazenamento local resiliente.');
      return await mockFallbackStore.createAgendamento(data);
    }
  },

  // PATCH /agendamentos/:id
  async updateAgendamento(id: string, data: AtualizarAgendamentoDTO): Promise<Agendamento> {
    try {
      const response = await api.patch<Agendamento>(`/agendamentos/${id}`, data);
      return response.data;
    } catch (error) {
      console.info('[BarberFlow] Atualizando agendamento no armazenamento local resiliente.');
      return await mockFallbackStore.updateAgendamento(id, data);
    }
  },

  // DELETE /agendamentos/:id
  async deleteAgendamento(id: string): Promise<void> {
    try {
      await api.delete(`/agendamentos/${id}`);
    } catch (error) {
      console.info('[BarberFlow] Excluindo agendamento do armazenamento local resiliente.');
      await mockFallbackStore.deleteAgendamento(id);
    }
  },
};
