import { api } from './api';
import { mockFallbackStore } from './mockFallback';
import {
  Agendamento,
  AgendamentoComDetalhes,
  AtualizarAgendamentoDTO,
  CriarAgendamentoDTO,
  Profissional,
  Servico,
  Categoria,
  Cliente,
} from '../types';

export const agendamentoService = {
  // GET /categorias
  async getCategorias(): Promise<Categoria[]> {
    try {
      const response = await api.get<Categoria[]>('/categorias');
      return response.data;
    } catch (error) {
      return await mockFallbackStore.getCategorias();
    }
  },

  // GET /clientes
  async getClientes(): Promise<Cliente[]> {
    try {
      const response = await api.get<Cliente[]>('/clientes');
      return response.data;
    } catch (error) {
      return await mockFallbackStore.getClientes();
    }
  },

  // Helper para localizar ou cadastrar cliente automaticamente
  async findOrCreateCliente(nome: string, telefone: string): Promise<Cliente> {
    try {
      const clientes = await this.getClientes();
      const existing = clientes.find(
        (c) => c.nome.toLowerCase() === nome.trim().toLowerCase() || c.telefone === telefone.trim()
      );
      if (existing) return existing;

      // Gera ID sequencial numérico para clientes
      const numericIds = clientes.map((c) => parseInt(String(c.id), 10)).filter((n) => !isNaN(n) && n > 0);
      const nextClienteId = String((numericIds.length > 0 ? Math.max(...numericIds) : 0) + 1);

      const newClienteRes = await api.post<Cliente>('/clientes', {
        id: nextClienteId,
        nome: nome.trim(),
        telefone: telefone.trim(),
        email: `${nome.toLowerCase().replace(/\s+/g, '.')}@email.com`,
      });
      return newClienteRes.data;
    } catch (error) {
      return await mockFallbackStore.findOrCreateCliente(nome, telefone);
    }
  },

  // GET /servicos
  async getServicos(): Promise<Servico[]> {
    try {
      const [servicosRes, categorias] = await Promise.all([
        api.get<Servico[]>('/servicos'),
        this.getCategorias(),
      ]);
      const catMap = new Map(categorias.map((c) => [c.id, c]));
      return servicosRes.data.map((s) => ({
        ...s,
        categoria: catMap.get(s.categoriaId),
      }));
    } catch (error) {
      return await mockFallbackStore.getServicos();
    }
  },

  // GET /profissionais
  async getProfissionais(): Promise<Profissional[]> {
    try {
      const response = await api.get<Profissional[]>('/profissionais');
      return response.data;
    } catch (error) {
      return await mockFallbackStore.getProfissionais();
    }
  },

  // Calcula o próximo ID sequencial padronizado (#105, #106, #107...)
  async getNextAgendamentoId(): Promise<string> {
    try {
      const agList = await this.getAgendamentos();
      const numericIds = agList
        .map((a) => parseInt(String(a.id), 10))
        .filter((n) => !isNaN(n) && n >= 100);
      const max = numericIds.length > 0 ? Math.max(...numericIds) : 100;
      return String(max + 1);
    } catch {
      return String(Date.now()).slice(-4);
    }
  },

  // GET /agendamentos
  async getAgendamentos(statusFilter?: string, dataFilter?: string): Promise<AgendamentoComDetalhes[]> {
    let rawAgendamentos: Agendamento[] = [];
    let servicos: Servico[] = [];
    let profissionais: Profissional[] = [];
    let clientes: Cliente[] = [];

    try {
      let params: Record<string, string> = {};
      if (statusFilter && statusFilter !== 'todos') {
        params.status = statusFilter;
      }
      if (dataFilter) {
        params.data = dataFilter;
      }

      const [agendamentosRes, sList, pList, cList] = await Promise.all([
        api.get<Agendamento[]>('/agendamentos', { params }),
        this.getServicos(),
        this.getProfissionais(),
        this.getClientes(),
      ]);
      rawAgendamentos = agendamentosRes.data;
      servicos = sList;
      profissionais = pList;
      clientes = cList;
    } catch (error) {
      const [agList, sList, pList, cList] = await Promise.all([
        mockFallbackStore.getAgendamentos(statusFilter, dataFilter),
        mockFallbackStore.getServicos(),
        mockFallbackStore.getProfissionais(),
        mockFallbackStore.getClientes(),
      ]);
      rawAgendamentos = agList;
      servicos = sList;
      profissionais = pList;
      clientes = cList;
    }

    const servicosMap = new Map<string, Servico>(servicos.map((s) => [s.id, s]));
    const profissionaisMap = new Map<string, Profissional>(profissionais.map((p) => [p.id, p]));
    const clientesMap = new Map<string, Cliente>(clientes.map((c) => [c.id, c]));

    return rawAgendamentos.map((ag): AgendamentoComDetalhes => {
      const cliente = clientesMap.get(ag.clienteId);
      return {
        ...ag,
        clienteNome: cliente ? cliente.nome : ag.clienteNome || 'Cliente não identificado',
        clienteTelefone: cliente ? cliente.telefone : ag.clienteTelefone || '',
        cliente,
        servico: servicosMap.get(ag.servicoId),
        profissional: profissionaisMap.get(ag.profissionalId),
      };
    });
  },

  // GET /agendamentos/:id
  async getAgendamentoById(id: string): Promise<AgendamentoComDetalhes> {
    const [servicos, profissionais, clientes] = await Promise.all([
      this.getServicos(),
      this.getProfissionais(),
      this.getClientes(),
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
    const cliente = clientes.find((c) => c.id === ag?.clienteId);

    return {
      ...ag,
      clienteNome: cliente ? cliente.nome : ag.clienteNome,
      clienteTelefone: cliente ? cliente.telefone : ag.clienteTelefone,
      cliente,
      servico,
      profissional,
    };
  },

  // POST /agendamentos
  async createAgendamento(data: CriarAgendamentoDTO): Promise<Agendamento> {
    try {
      const [cliente, nextId] = await Promise.all([
        this.findOrCreateCliente(data.clienteNome, data.clienteTelefone),
        this.getNextAgendamentoId(),
      ]);

      const payload: Partial<Agendamento> = {
        id: nextId,
        clienteId: cliente.id,
        clienteNome: cliente.nome,
        clienteTelefone: cliente.telefone,
        servicoId: data.servicoId,
        profissionalId: data.profissionalId,
        data: data.data,
        hora: data.hora,
        status: data.status || 'agendado',
        observacoes: data.observacoes || '',
      };
      const response = await api.post<Agendamento>('/agendamentos', payload);
      return response.data;
    } catch (error) {
      return await mockFallbackStore.createAgendamento(data);
    }
  },

  // PATCH /agendamentos/:id
  async updateAgendamento(id: string, data: AtualizarAgendamentoDTO): Promise<Agendamento> {
    try {
      const response = await api.patch<Agendamento>(`/agendamentos/${id}`, data);
      return response.data;
    } catch (error) {
      return await mockFallbackStore.updateAgendamento(id, data);
    }
  },

  // DELETE /agendamentos/:id
  async deleteAgendamento(id: string): Promise<void> {
    try {
      await api.delete(`/agendamentos/${id}`);
    } catch (error) {
      await mockFallbackStore.deleteAgendamento(id);
    }
  },
};
